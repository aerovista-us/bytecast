#!/usr/bin/env python3
"""Deploy the ByteCast repo to the remote host and run smoke checks."""

from __future__ import annotations

import argparse
import os
import shlex
import shutil
import subprocess
import sys
import tarfile
import tempfile
from datetime import UTC, datetime
from pathlib import Path


DEFAULT_REMOTE_HOST = "glyph@100.115.9.61"
DEFAULT_REMOTE_ROOT = "/srv/Collab/mini.shops/bytecast"
DEFAULT_BASE_URL = "http://127.0.0.1:18080"
SKIP_DIRS = {
    ".git",
    "node_modules",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    ".venv",
    "venv",
    "playwright-report",
    "test-results",
    "coverage",
    "tmp",
}
SKIP_FILE_NAMES = {
    ".env",
    ".DS_Store",
}
SKIP_SUFFIXES = {
    ".pyc",
    ".pyo",
    ".log",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Deploy ByteCast and run smoke checks in one command.")
    parser.add_argument("--host", default=DEFAULT_REMOTE_HOST, help=f"SSH host. Default: {DEFAULT_REMOTE_HOST}")
    parser.add_argument("--remote-root", default=DEFAULT_REMOTE_ROOT, help=f"Remote repo path. Default: {DEFAULT_REMOTE_ROOT}")
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL, help=f"Live site base URL. Default: {DEFAULT_BASE_URL}")
    parser.add_argument("--skip-local-validate", action="store_true", help="Skip the local learning-environment validator.")
    parser.add_argument("--skip-remote-node-check", action="store_true", help="Skip `node --check tests/navigation.spec.js` on the remote host.")
    return parser.parse_args()


def require_command(name: str) -> None:
    if shutil.which(name):
        return
    raise SystemExit(f"Required command not found on PATH: {name}")


def format_command(cmd: list[str]) -> str:
    return " ".join(shlex.quote(part) for part in cmd)


def run(cmd: list[str], cwd: Path | None = None) -> None:
    print(f"$ {format_command(cmd)}", flush=True)
    subprocess.run(cmd, cwd=str(cwd) if cwd else None, check=True)


def should_skip(rel_path: Path) -> bool:
    parts = rel_path.parts
    if any(part in SKIP_DIRS for part in parts[:-1]):
        return True
    name = rel_path.name
    if name in SKIP_FILE_NAMES or name.startswith(".env."):
        return True
    if rel_path.suffix.lower() in SKIP_SUFFIXES or name.endswith("~"):
        return True
    return False


def iter_repo_files(repo_root: Path) -> list[Path]:
    files: list[Path] = []
    for current_root, dir_names, file_names in os.walk(repo_root):
        current_path = Path(current_root)
        dir_names[:] = [name for name in dir_names if name not in SKIP_DIRS]
        for file_name in file_names:
            full_path = current_path / file_name
            rel_path = full_path.relative_to(repo_root)
            if should_skip(rel_path):
                continue
            files.append(full_path)
    return sorted(files)


def build_archive(repo_root: Path) -> tuple[Path, int]:
    temp_dir = Path(tempfile.mkdtemp(prefix="bytecast_deploy_"))
    archive_path = temp_dir / f"bytecast-deploy-{datetime.now(UTC).strftime('%Y%m%d-%H%M%S')}.tar.gz"
    files = iter_repo_files(repo_root)
    with tarfile.open(archive_path, "w:gz") as archive:
        for file_path in files:
            archive.add(file_path, arcname=file_path.relative_to(repo_root).as_posix(), recursive=False)
    print(f"Packed {len(files)} files into {archive_path} ({archive_path.stat().st_size} bytes).", flush=True)
    return archive_path, len(files)


def run_remote(host: str, command: str) -> None:
    run(["ssh", host, command])


def deploy_archive(host: str, remote_root: str, archive_path: Path) -> None:
    remote_archive = f"/tmp/{archive_path.name}"
    run(["scp", str(archive_path), f"{host}:{remote_archive}"])
    remote_command = " && ".join(
        [
            f"mkdir -p {shlex.quote(remote_root)}",
            f"tar -xzf {shlex.quote(remote_archive)} -C {shlex.quote(remote_root)}",
            f"rm -f {shlex.quote(remote_archive)}",
        ]
    )
    run_remote(host, remote_command)


def main() -> int:
    args = parse_args()
    repo_root = Path(__file__).resolve().parents[1]

    require_command("ssh")
    require_command("scp")

    if not args.skip_local_validate:
        run([sys.executable, str(repo_root / "scripts" / "validate_learning_env.py")], cwd=repo_root)

    archive_path, _file_count = build_archive(repo_root)
    try:
        deploy_archive(args.host, args.remote_root, archive_path)

        remote_validator = (
            f"cd {shlex.quote(args.remote_root)} && "
            f"python3 scripts/validate_learning_env.py --base-url {shlex.quote(args.base_url)}"
        )
        run_remote(args.host, remote_validator)

        if not args.skip_remote_node_check:
            remote_node_check = f"cd {shlex.quote(args.remote_root)} && node --check tests/navigation.spec.js"
            run_remote(args.host, remote_node_check)
    finally:
        archive_path.unlink(missing_ok=True)
        archive_path.parent.rmdir()

    print("Deploy and smoke check completed successfully.", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
