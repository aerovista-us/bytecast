Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$current = (Get-Location).Path
Write-Host ("PWD: {0}" -f $current)

if ($current -like 'X:\*') {
  Write-Host 'Drive: X: (NXDrive share -> /srv/NXDrive on NXCore)'
} elseif ($current -like 'Z:\*') {
  Write-Host 'Drive: Z: (AeroDrive share -> /srv/AeroDrive on NXCore)'
} elseif ($current -match '^[A-Z]:\\') {
  Write-Host ("Drive: {0} (local or other mount)" -f $current.Substring(0, 2))
} else {
  Write-Host 'Drive: (non-Windows path)'
}

$git = Get-Command git -ErrorAction SilentlyContinue
if ($null -ne $git) {
  try {
    $isRepo = & $git.Source rev-parse --is-inside-work-tree 2>$null
    if ($isRepo -eq 'true') {
      $root = & $git.Source rev-parse --show-toplevel 2>$null
      if ($root) {
        Write-Host ("Git: repo root = {0}" -f $root)
        if ($current.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
          $rel = $current.Substring($root.Length).TrimStart('\')
          Write-Host ("Git: relative = {0}" -f ($rel -ne '' ? $rel : '.'))
        }
      }
    } else {
      Write-Host 'Git: (not in a work tree)'
    }
  } catch {
    Write-Host 'Git: (error detecting repo)'
  }
}

Write-Host 'Tip: prefer scoped search: X:\.CODEX\tools\safe-rg.ps1 -Query "term" -Root .\some\folder'

