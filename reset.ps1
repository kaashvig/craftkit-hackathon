Write-Host "🔄 Cleaning Next.js project..." -ForegroundColor Cyan

# Remove build and dependency folders
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ Deleted .next folder"
}
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules
    Write-Host "✅ Deleted node_modules folder"
}
if (Test-Path package-lock.json) {
    Remove-Item -Force package-lock.json
    Write-Host "✅ Deleted package-lock.json"
}

Write-Host "📦 Reinstalling dependencies..."
npm install

Write-Host "🚀 Starting Next.js dev server..."
npm run dev
