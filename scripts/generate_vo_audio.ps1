# Generate EP-003 / EP-004 narration MP3s (Edge TTS). Run from anywhere.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
Write-Host "ByteCast root: $root"
pip install -r scripts/requirements-vo.txt
python scripts/vo_md_to_mp3.py @args
