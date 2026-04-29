# build-kit.ps1 — Windows-native build of claudemd-kit.zip
# Equivalent to scripts/build-kit.sh but uses PowerShell's Compress-Archive.

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
$KitSrc   = Join-Path $RepoRoot "kit"
$DistDir  = Join-Path $RepoRoot "dist"
$OutFile  = Join-Path $DistDir "claudemd-kit.zip"
$Staging  = Join-Path $DistDir "staging"

Write-Host "-> Cleaning previous build..."
if (Test-Path $Staging) { Remove-Item $Staging -Recurse -Force }
if (Test-Path $OutFile) { Remove-Item $OutFile -Force }
New-Item -ItemType Directory -Path "$Staging\claudemd-kit" -Force | Out-Null

Write-Host "-> Staging files..."
Copy-Item -Path "$KitSrc\*" -Destination "$Staging\claudemd-kit\" -Recurse

# Strip Google Drive desktop.ini sync files
Get-ChildItem -Path "$Staging\claudemd-kit" -Recurse -Filter "desktop.ini" -Force | Remove-Item -Force

Write-Host "-> Creating zip..."
Compress-Archive -Path "$Staging\claudemd-kit" -DestinationPath $OutFile -Force

Write-Host "-> Cleaning staging..."
Remove-Item $Staging -Recurse -Force

$Size  = (Get-Item $OutFile).Length
$SizeKB = [math]::Round($Size / 1KB, 1)
$Count = (Get-ChildItem -Path "$KitSrc" -Recurse -File | Where-Object { $_.Name -ne "desktop.ini" }).Count

Write-Host ""
Write-Host "Built: $OutFile"
Write-Host "  Size:  $SizeKB KB"
Write-Host "  Files: $Count"
