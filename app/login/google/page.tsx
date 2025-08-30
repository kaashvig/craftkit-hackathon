import GoogleOAuthButton from "@/components/auth/google-oauth-button"

export default function GoogleLoginPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col items-stretch gap-6 p-6">
      <h1 className="text-pretty text-2xl font-semibold">Sign in with Google</h1>
      <p className="text-sm opacity-80">
        Use your Google account to sign in. We’ll redirect you to Google and bring you back here when finished.
      </p>
      <GoogleOAuthButton />
      <p className="text-sm opacity-70">
        Prefer email and password?{" "}
        <a className="underline" href="/login">
          Go to standard login
        </a>
      </p>
    </main>
  )
}
