-- Tables
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null,
  created_at timestamp with time zone default now(),
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  content jsonb not null,
  generated_code text,
  created_at timestamp with time zone default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_roles (
  user_id uuid not null,
  project_id uuid not null references projects(id) on delete cascade,
  role text not null check (role in ('owner','editor','viewer')),
  primary key (user_id, project_id)
);

-- Ensure pgcrypto available for gen_random_uuid (safe if already enabled)
create extension if not exists "pgcrypto";

-- Add FK to auth.users for owner_id (safe if already present)
do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints tc
    where tc.table_name = 'projects'
      and tc.constraint_type = 'FOREIGN KEY'
      and tc.constraint_name = 'projects_owner_id_fkey'
  ) then
    alter table projects
      add constraint projects_owner_id_fkey
      foreign key (owner_id) references auth.users(id) on delete cascade;
  end if;
end$$;

-- Indexes for performance
create index if not exists idx_projects_owner_id on projects(owner_id);
create index if not exists idx_projects_public on projects(is_public);
create index if not exists idx_versions_project_created_at on project_versions(project_id, created_at desc);

-- Updated_at triggers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on projects;
create trigger trg_projects_updated_at
before update on projects
for each row
execute function public.set_updated_at();

drop trigger if exists trg_versions_updated_at on project_versions;
create trigger trg_versions_updated_at
before update on project_versions
for each row
execute function public.set_updated_at();

-- Auto-add owner as project owner in user_roles on project create
create or replace function public.add_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into user_roles (user_id, project_id, role)
  values (new.owner_id::uuid, new.id, 'owner')
  on conflict (user_id, project_id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_projects_add_owner on projects;
create trigger trg_projects_add_owner
after insert on projects
for each row
execute function public.add_owner_membership();

-- RLS
alter table projects enable row level security;
alter table project_versions enable row level security;
alter table user_roles enable row level security;

-- Policies: projects
drop policy if exists "project_owner_read_write" on projects;
create policy "project_owner_read_write" on projects
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Projects: allow public SELECT when is_public = true
drop policy if exists "projects_public_read" on projects;
create policy "projects_public_read" on projects
  for select to public
  using (is_public = true);

-- Policies: project_versions (owner/editor can read/write)
drop policy if exists "versions_by_project_members" on project_versions;
create policy "versions_by_project_members" on project_versions
  for all to authenticated
  using (
    exists (
      select 1 from projects p
      left join user_roles ur on ur.project_id = p.id and ur.user_id = auth.uid()
      where p.id = project_versions.project_id and (p.owner_id = auth.uid() or ur.role in ('owner','editor'))
    )
  )
  with check (
    exists (
      select 1 from projects p
      left join user_roles ur on ur.project_id = p.id and ur.user_id = auth.uid()
      where p.id = project_versions.project_id and (p.owner_id = auth.uid() or ur.role in ('owner','editor'))
    )
  );

-- Project versions: allow public SELECT when parent project is public
drop policy if exists "versions_public_read" on project_versions;
create policy "versions_public_read" on project_versions
  for select to public
  using (
    exists (
      select 1
      from projects p
      where p.id = project_versions.project_id
        and p.is_public = true
    )
  );

-- Policies: user_roles (owners can manage)
drop policy if exists "roles_visible_to_members" on user_roles;
create policy "roles_visible_to_members" on user_roles
  for select to authenticated
  using (
    exists (select 1 from projects p where p.id = user_roles.project_id and (p.owner_id = auth.uid() or user_roles.user_id = auth.uid()))
  );

drop policy if exists "roles_manage_by_owner" on user_roles;
create policy "roles_manage_by_owner" on user_roles
  for all to authenticated
  using (
    exists (select 1 from projects p where p.id = user_roles.project_id and p.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from projects p where p.id = user_roles.project_id and p.owner_id = auth.uid())
  );
