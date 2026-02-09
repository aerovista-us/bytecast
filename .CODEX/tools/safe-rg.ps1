param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Query,

  [Parameter(Position = 1)]
  [string]$Root = (Get-Location).Path,

  [string[]]$Glob = @(),

  [switch]$FixedString,
  [switch]$AllowDriveRoot,
  [switch]$NoIgnoreFile
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$resolvedRoot = (Resolve-Path -Path $Root).Path

if (-not $AllowDriveRoot) {
  if ($resolvedRoot -match '^[A-Z]:\\$') {
    throw "Refusing to search drive root ($resolvedRoot). Pass -AllowDriveRoot if you really intend this."
  }
}

$rg = Get-Command rg -ErrorAction SilentlyContinue
if ($null -eq $rg) {
  throw 'ripgrep (rg) not found in PATH. Install rg or run a scoped Select-String search manually.'
}

$ignoreFile = $null
if (-not $NoIgnoreFile) {
  $candidate = Join-Path $PSScriptRoot '..\rg.ignore'
  try {
    $ignoreFile = (Resolve-Path -Path $candidate).Path
  } catch {
    $ignoreFile = $null
  }
}

$argsList = @()
if ($FixedString) { $argsList += '-F' }
if ($ignoreFile) { $argsList += @('--ignore-file', $ignoreFile) }
foreach ($g in $Glob) { $argsList += @('--glob', $g) }

Write-Host ("Search: rg {0} in {1}" -f $Query, $resolvedRoot)
if ($ignoreFile) { Write-Host ("Ignore: {0}" -f $ignoreFile) }

& $rg.Source @argsList $Query $resolvedRoot
