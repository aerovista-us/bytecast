#!/usr/bin/env python3
"""Validate the learner-facing ByteCast environment."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


REMOTE_ROOT = "/srv/Collab/mini.shops/bytecast"
WINDOWS_BYTECAST_PATH = re.compile(r"[A-Za-z]:[\\\\/](?:[^\\r\\n\"'<>]+[\\\\/])*bytecast(?:[\\\\/][^\\r\\n\"'<>]+)?")
LOCAL_HREF = re.compile(r'href=["\']([^"\']+)["\']')
TRACKED_EXTENSIONS = {".html", ".js", ".json", ".py", ".css"}
LIVE_CORE_ROUTES = (
    "index.html",
    "seed_bytecast.html",
    "episodes/index.html",
    "episodes/training_hub/index.html",
    "episodes/training_hub/glossary/index.html",
    "data/journey_steps.json",
)
SUPPORTED_JOURNEY_IDS = {
    "p1_golden_path",
    "seeding_v1",
    "division_aerovista_v1",
    "session_updates_2026_02_09",
    "apparel_onboarding_v1",
    "lumina_revenue_v1",
}


class GuardrailValidator:
    def __init__(self, repo_root: Path, base_url: str | None = None, timeout_seconds: float = 8.0) -> None:
        self.repo_root = repo_root
        self.base_url = base_url.rstrip("/") if base_url else None
        self.timeout_seconds = timeout_seconds
        self.failures: list[tuple[str, str]] = []
        self.passes: list[tuple[str, str]] = []

    def check(self, condition: bool, scope: str, success_message: str, failure_message: str) -> None:
        if condition:
            self.passes.append((scope, success_message))
        else:
            self.failures.append((scope, failure_message))

    def read_text(self, relative_path: str) -> str:
        return (self.repo_root / relative_path).read_text(encoding="utf-8")

    def read_json(self, relative_path: str) -> dict:
        return json.loads(self.read_text(relative_path))

    def resolve_from_file(self, file_path: Path, href: str) -> Path | None:
        href = href.split("#", 1)[0].split("?", 1)[0].strip()
        if not href or href.startswith(("http://", "https://", "mailto:", "tel:", "javascript:")):
            return None
        return (file_path.parent / href).resolve()

    def repo_relative(self, path: Path) -> str:
        return path.resolve().relative_to(self.repo_root.resolve()).as_posix()

    def check_central_journey_config(self) -> None:
        playlist_text = self.read_text("seed_bytecast.html")
        hub_text = self.read_text("episodes/training_hub/app.js")

        self.check(
            'const JOURNEY_URL = "./data/journey_steps.json";' in playlist_text,
            "journey-config",
            "Playlist points at the central journey file.",
            "seed_bytecast.html no longer points at ./data/journey_steps.json.",
        )
        self.check(
            re.search(r"loadJourneyConfig\(\s*JOURNEY_URL\s*,\s*null\s*\)", playlist_text) is not None,
            "journey-config",
            "Playlist loads journey data through ByteCastLoop.",
            "seed_bytecast.html is missing Loop.loadJourneyConfig(JOURNEY_URL, null).",
        )
        self.check(
            "Retired local journey fallback" not in playlist_text and "GOLDEN_FALLBACK_CONFIG" not in playlist_text,
            "journey-config",
            "Playlist has no inline fallback journey block.",
            "seed_bytecast.html still contains fallback journey logic or retired fallback text.",
        )

        self.check(
            'const JOURNEY_PATH = "../../data/journey_steps.json";' in hub_text,
            "journey-config",
            "Training Hub points at the central journey file.",
            "episodes/training_hub/app.js no longer points at ../../data/journey_steps.json.",
        )
        self.check(
            "fetch(JOURNEY_PATH)" in hub_text,
            "journey-config",
            "Training Hub fetches journey data from the shared file.",
            "episodes/training_hub/app.js is missing fetch(JOURNEY_PATH).",
        )
        self.check(
            "journeyConfig = journeyConfig || {" not in hub_text and "Retired local journey fallback" not in hub_text,
            "journey-config",
            "Training Hub has no inline fallback journey block.",
            "episodes/training_hub/app.js still contains fallback journey logic or retired fallback text.",
        )

    def check_training_hub_links(self) -> None:
        relative_path = "episodes/training_hub/index.html"
        file_path = self.repo_root / relative_path
        text = self.read_text(relative_path)
        hrefs = LOCAL_HREF.findall(text)

        required_hrefs = {
            "../../index.html",
            "../../seed_bytecast.html",
            "../../docs/index.html",
            "../seed_builder_studio/index.html",
            "./glossary/index.html",
            "../welcome_to_bytecast/index.html",
            "../aerovista_7_division_overview/index.html",
        }
        forbidden_hrefs = {"../index.html", "../seed_bytecast.html", "../docs/index.html"}

        for href in sorted(required_hrefs):
            self.check(
                href in hrefs,
                "training-hub-links",
                f"Training Hub includes {href}.",
                f"Training Hub is missing expected link {href}.",
            )

        for href in sorted(forbidden_hrefs):
            self.check(
                href not in hrefs,
                "training-hub-links",
                f"Training Hub no longer uses broken legacy link {href}.",
                f"Training Hub still contains broken legacy link {href}.",
            )

        checked_targets = 0
        for href in hrefs:
            target = self.resolve_from_file(file_path, href)
            if target is None:
                continue
            checked_targets += 1
            target_label = self.repo_relative(target) if target.exists() else str(target)
            self.check(
                target.exists(),
                "training-hub-links",
                f"Resolved Training Hub link {href} -> {target_label}.",
                f"Training Hub link {href} resolves to missing path {target}.",
            )

        self.check(
            checked_targets > 0,
            "training-hub-links",
            "Training Hub local links were resolved successfully.",
            "No local Training Hub links were discovered for validation.",
        )

    def check_module_manifest(self) -> None:
        hub_page_path = self.repo_root / "episodes/training_hub/index.html"
        manifest = self.read_json("episodes/training_hub/data/modules.json")
        modules = manifest.get("modules", [])
        self.check(
            isinstance(modules, list) and len(modules) > 0,
            "modules-manifest",
            f"Module manifest contains {len(modules)} modules.",
            "Training Hub module manifest is empty or invalid.",
        )

        seen_ids: set[str] = set()
        for module in modules:
            module_id = str(module.get("id", "")).strip()
            module_path = str(module.get("path", "")).strip()
            self.check(
                bool(module_id) and module_id not in seen_ids,
                "modules-manifest",
                f"Module id {module_id} is unique.",
                f"Duplicate or missing module id found: {module_id or '<blank>'}.",
            )
            if module_id:
                seen_ids.add(module_id)
            target = self.resolve_from_file(hub_page_path, module_path)
            target_label = self.repo_relative(target) if target is not None and target.exists() else module_path
            self.check(
                target is not None and target.exists(),
                "modules-manifest",
                f"Module {module_id} path resolves to {target_label}.",
                f"Module {module_id} points to a missing path: {module_path}.",
            )

    def check_journey_steps(self) -> set[str]:
        config = self.read_json("data/journey_steps.json")
        journeys = config.get("journeys", [])
        self.check(
            config.get("schema") == "bytecast-journey-steps-v1",
            "journey-steps",
            "Journey config schema is correct.",
            "data/journey_steps.json does not declare bytecast-journey-steps-v1.",
        )
        self.check(
            isinstance(journeys, list) and len(journeys) > 0,
            "journey-steps",
            f"Journey config contains {len(journeys)} journeys.",
            "Journey config is empty or invalid.",
        )

        discovered_journey_ids = {str(journey.get("id", "")).strip() for journey in journeys}
        for journey_id in sorted(SUPPORTED_JOURNEY_IDS):
            self.check(
                journey_id in discovered_journey_ids,
                "journey-steps",
                f"Supported journey {journey_id} is present.",
                f"Supported journey {journey_id} is missing from data/journey_steps.json.",
            )

        default_count = sum(1 for journey in journeys if journey.get("isDefault"))
        self.check(
            default_count == 1,
            "journey-steps",
            "Journey config has exactly one default journey.",
            f"Journey config should have exactly one default journey, found {default_count}.",
        )

        seen_journey_ids: set[str] = set()
        route_targets: set[str] = set()

        for journey in journeys:
            journey_id = str(journey.get("id", "")).strip()
            self.check(
                bool(journey_id) and journey_id not in seen_journey_ids,
                "journey-steps",
                f"Journey id {journey_id} is unique.",
                f"Duplicate or missing journey id found: {journey_id or '<blank>'}.",
            )
            if journey_id:
                seen_journey_ids.add(journey_id)
            if journey_id not in SUPPORTED_JOURNEY_IDS:
                continue

            steps = journey.get("steps", [])
            badges = journey.get("badges", [])
            local_step_ids: set[str] = set()
            badge_ids: set[str] = set()
            progress_ids: set[str] = set()

            for badge in badges:
                badge_id = str(badge.get("id", "")).strip()
                self.check(
                    bool(badge_id) and badge_id not in badge_ids,
                    "journey-steps",
                    f"Badge id {badge_id} is unique within {journey_id}.",
                    f"Duplicate or missing badge id in journey {journey_id}: {badge_id or '<blank>'}.",
                )
                if badge_id:
                    badge_ids.add(badge_id)

            for step in steps:
                step_id = str(step.get("id", "")).strip()
                href = str(step.get("href", "")).strip()

                self.check(
                    bool(step_id) and step_id not in local_step_ids,
                    "journey-steps",
                    f"Journey step id {step_id} is unique within {journey_id}.",
                    f"Duplicate or missing journey step id in {journey_id}: {step_id or '<blank>'}.",
                )
                if step_id:
                    local_step_ids.add(step_id)

                complete_when = step.get("complete_when") or {}
                if complete_when.get("type") == "steps_all":
                    progress_ids.update(str(item).strip() for item in complete_when.get("ids", []) if str(item).strip())

                target = (self.repo_root / href).resolve() if href else None
                target_label = self.repo_relative(target) if target is not None and target.exists() else href
                self.check(
                    target is not None and target.exists(),
                    "journey-steps",
                    f"Journey step {step_id} points to {target_label}.",
                    f"Journey step {step_id} points to a missing path: {href}.",
                )
                if target is not None and target.exists():
                    route_targets.add(self.repo_relative(target))

            for step in steps:
                step_id = str(step.get("id", "")).strip()
                for dependency in step.get("depends_on", []):
                    self.check(
                        dependency in local_step_ids,
                        "journey-steps",
                        f"Step {step_id} dependency {dependency} exists.",
                        f"Step {step_id} depends on unknown step {dependency}.",
                    )
                for unlock in step.get("unlock_requires", []):
                    unlock_step = unlock.get("stepId")
                    self.check(
                        unlock_step in local_step_ids or unlock_step in progress_ids,
                        "journey-steps",
                        f"Step {step_id} unlock dependency {unlock_step} exists in {journey_id}.",
                        f"Step {step_id} unlock requirement references unknown step {unlock_step}.",
                    )
                if complete_when.get("type") == "badge_has":
                    badge_id = complete_when.get("badge_id")
                    self.check(
                        badge_id in badge_ids,
                        "journey-steps",
                        f"Step {step_id} badge target {badge_id} exists.",
                        f"Step {step_id} references unknown badge {badge_id}.",
                    )
                if complete_when.get("type") == "step_done":
                    complete_id = complete_when.get("id")
                    self.check(
                        complete_id in local_step_ids,
                        "journey-steps",
                        f"Step {step_id} complete_when id {complete_id} exists.",
                        f"Step {step_id} complete_when references unknown step {complete_id}.",
                    )

            for badge in badges:
                badge_id = str(badge.get("id", "")).strip()
                for required_step in badge.get("requires", []):
                    self.check(
                        required_step in local_step_ids,
                        "journey-steps",
                        f"Badge {badge_id} requirement {required_step} exists.",
                        f"Badge {badge_id} references unknown required step {required_step}.",
                    )

        return route_targets

    def check_episodes_redirect_shell(self) -> None:
        text = self.read_text("episodes/index.html")
        self.check(
            "<title>ByteCast Episodes</title>" in text and "url=../seed_bytecast.html" in text,
            "episodes-shell",
            "Episodes landing page redirects to the Playlist.",
            "episodes/index.html no longer looks like the redirect shell.",
        )
        self.check(
            "Current Truth Basics" not in text,
            "episodes-shell",
            "Episodes landing page is not masquerading as EP-004.",
            "episodes/index.html still contains Current Truth Basics content.",
        )

    def check_seed_orchard_route_alignment(self) -> None:
        app_text = self.read_text("episodes/seed_builder_studio/seed_orchard_ui/app.js")
        self.check(
            'href: "episodes/seed_builder_studio/seed_orchard_ui/index.html"' in app_text,
            "seed-orchard",
            "Seed Orchard app points its journey links at the episodes route.",
            "Seed Orchard app is missing the episodes/seed_builder_studio/seed_orchard_ui route.",
        )
        self.check(
            'href: "seed_builder_studio/seed_orchard_ui/index.html"' not in app_text,
            "seed-orchard",
            "Seed Orchard app no longer points at the retired top-level route.",
            "Seed Orchard app still points at the retired top-level seed_orchard_ui route.",
        )
        self.check(
            'tool: "episodes/seed_builder_studio/seed_orchard_ui"' in app_text,
            "seed-orchard",
            "Seed Orchard artifact metadata matches the current route.",
            "Seed Orchard artifact metadata still uses the retired tool route.",
        )

    def iter_scanned_files(self) -> list[Path]:
        files: list[Path] = []
        tracked_roots = [
            self.repo_root / "scripts",
            self.repo_root / "assets" / "shared",
            self.repo_root / "episodes",
            self.repo_root / "training_missions",
            self.repo_root / "seed_builder_studio",
            self.repo_root / "build_lumina_lane.py",
            self.repo_root / "seed_bytecast.html",
            self.repo_root / "index.html",
        ]
        for root in tracked_roots:
            if root.is_file():
                files.append(root)
                continue
            if not root.exists():
                continue
            for path in root.rglob("*"):
                if path.is_dir():
                    continue
                if "node_modules" in path.parts or ".git" in path.parts or "__pycache__" in path.parts:
                    continue
                if path.suffix.lower() in TRACKED_EXTENSIONS:
                    files.append(path)
        return files

    def check_windows_path_leaks(self) -> None:
        leak_count = 0
        for path in self.iter_scanned_files():
            text = path.read_text(encoding="utf-8", errors="ignore")
            match = WINDOWS_BYTECAST_PATH.search(text)
            if match:
                leak_count += 1
                self.failures.append(
                    (
                        "windows-paths",
                        f"Windows-only ByteCast path leak in {self.repo_relative(path)}: {match.group(0)}",
                    )
                )
        self.check(
            leak_count == 0,
            "windows-paths",
            "No Windows-only ByteCast absolute paths were found in shipped learner files.",
            f"Found {leak_count} Windows-only ByteCast absolute path leaks.",
        )

    def collect_sot_dirs(self, route_targets: set[str]) -> set[Path]:
        sot_dirs: set[Path] = {self.repo_root / "episodes", self.repo_root / "episodes" / "training_hub"}

        manifest = self.read_json("episodes/training_hub/data/modules.json")
        hub_page_path = self.repo_root / "episodes/training_hub/index.html"
        for module in manifest.get("modules", []):
            module_path = self.resolve_from_file(hub_page_path, str(module.get("path", "")).strip())
            if module_path is not None and module_path.exists():
                candidate = module_path.parent if module_path.is_file() else module_path
                if candidate != self.repo_root:
                    sot_dirs.add(candidate)

        for route in route_targets:
            target = (self.repo_root / route).resolve()
            if target.exists():
                candidate = target.parent if target.is_file() else target
                if candidate != self.repo_root:
                    sot_dirs.add(candidate)

        return sot_dirs

    def check_sot_deploy_paths(self, route_targets: set[str]) -> None:
        checked = 0
        for directory in sorted(self.collect_sot_dirs(route_targets)):
            sot_path = directory / "SOT.json"
            if not sot_path.exists():
                continue
            data = json.loads(sot_path.read_text(encoding="utf-8"))
            actual = (
                data.get("technical_profile", {})
                .get("deployment", {})
                .get("deploy_path", "")
            )
            expected = f"{REMOTE_ROOT}/{directory.resolve().relative_to(self.repo_root.resolve()).as_posix()}"
            checked += 1
            self.check(
                actual == expected,
                "sot-paths",
                f"{self.repo_relative(sot_path)} deploy_path matches {expected}.",
                f"{self.repo_relative(sot_path)} deploy_path mismatch: expected {expected}, found {actual or '<blank>'}.",
            )

        self.check(
            checked > 0,
            "sot-paths",
            f"Validated deploy_path on {checked} learning-environment SOT files.",
            "No SOT.json files were available for deploy_path validation.",
        )

    def check_live_routes(self, route_targets: set[str]) -> None:
        if not self.base_url:
            return

        routes = set(LIVE_CORE_ROUTES)
        routes.update(route_targets)

        manifest = self.read_json("episodes/training_hub/data/modules.json")
        hub_page_path = self.repo_root / "episodes/training_hub/index.html"
        for module in manifest.get("modules", []):
            target = self.resolve_from_file(hub_page_path, str(module.get("path", "")).strip())
            if target is not None and target.exists():
                routes.add(self.repo_relative(target))

        for route in sorted(routes):
            url = f"{self.base_url}/{route}"
            request = Request(url, headers={"User-Agent": "bytecast-guardrails/1.0"})
            try:
                with urlopen(request, timeout=self.timeout_seconds) as response:
                    status = getattr(response, "status", 200)
                self.check(
                    status == 200,
                    "live-routes",
                    f"{url} returned 200.",
                    f"{url} returned unexpected status {status}.",
                )
            except HTTPError as error:
                self.failures.append(("live-routes", f"{url} returned HTTP {error.code}."))
            except URLError as error:
                self.failures.append(("live-routes", f"{url} could not be reached: {error.reason}."))

    def run(self) -> int:
        route_targets = self.check_journey_steps()
        self.check_central_journey_config()
        self.check_training_hub_links()
        self.check_module_manifest()
        self.check_episodes_redirect_shell()
        self.check_seed_orchard_route_alignment()
        self.check_windows_path_leaks()
        self.check_sot_deploy_paths(route_targets)
        self.check_live_routes(route_targets)

        for scope, message in self.passes:
            print(f"[PASS] {scope}: {message}")
        for scope, message in self.failures:
            print(f"[FAIL] {scope}: {message}")

        print(f"\nSummary: {len(self.passes)} passed, {len(self.failures)} failed.")
        return 0 if not self.failures else 1


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate ByteCast learning environment guardrails.")
    parser.add_argument(
        "--base-url",
        help="Optional live site base URL for HTTP 200 checks, for example http://127.0.0.1:18080",
    )
    parser.add_argument(
        "--timeout-seconds",
        type=float,
        default=8.0,
        help="HTTP timeout used for live route checks when --base-url is set.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo_root = Path(__file__).resolve().parents[1]
    validator = GuardrailValidator(repo_root=repo_root, base_url=args.base_url, timeout_seconds=args.timeout_seconds)
    return validator.run()


if __name__ == "__main__":
    sys.exit(main())
