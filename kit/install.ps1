# install.ps1 - install the CLAUDE.md Starter Kit on Windows
# Run from the unzipped kit directory: powershell -ExecutionPolicy Bypass -File install.ps1

$ErrorActionPreference = "Stop"

$kitRoot = $PSScriptRoot
$homeClaude = Join-Path $env:USERPROFILE ".claude"

Write-Host ""
Write-Host "  CLAUDE.md Starter Kit installer" -ForegroundColor Cyan
Write-Host "  --------------------------------"
Write-Host ""

# Step 1: Install home/ -> ~/.claude/
Write-Host "[1/2] Installing global files to $homeClaude\" -ForegroundColor Yellow

if (Test-Path "$homeClaude\CLAUDE.md") {
    $stamp  = Get-Date -Format "yyyyMMdd-HHmmss"
    $backup = "$homeClaude\CLAUDE.md.bak.$stamp"
    Copy-Item "$homeClaude\CLAUDE.md" $backup
    Write-Host "      Backed up existing CLAUDE.md -> $backup" -ForegroundColor Gray
}

New-Item -ItemType Directory -Path $homeClaude -Force | Out-Null
Copy-Item -Path "$kitRoot\home\*" -Destination $homeClaude -Recurse -Force
Write-Host "      Installed: CLAUDE.md, templates\, commands\, agents\, hooks\" -ForegroundColor Green

# Step 2: Project files - explain
Write-Host ""
Write-Host "[2/2] Project files (NOT auto-installed)" -ForegroundColor Yellow
Write-Host "      The 'project\' directory is a template for new repos."
Write-Host "      To use in a project:"
Write-Host ""
Write-Host "         Copy-Item -Path $kitRoot\project\* -Destination C:\path\to\your\repo -Recurse" -ForegroundColor Gray
Write-Host ""

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "Next steps:"
Write-Host "  1. Edit $homeClaude\CLAUDE.md - replace placeholders with your details"
Write-Host "  2. Open Claude Code in any project to confirm the global config loads"
Write-Host "  3. (Optional) Copy project\ contents into your active repos"
Write-Host ""
Write-Host "Read the article: https://fkxx.substack.com/p/claude-md-is-not-a-config-file"
