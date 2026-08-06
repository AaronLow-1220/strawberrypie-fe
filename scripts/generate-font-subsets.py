#!/usr/bin/env python3
"""Build complete Strawberry Pie font subsets from shipped and public API text."""

from __future__ import annotations

import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
SOURCE_SUFFIXES = {".css", ".html", ".js", ".json", ".jsx", ".xml"}
FONT_SOURCES = {
    "Thin": ROOT / "public/font/ChenYuluoyan-Thin.ttf",
    "B": ROOT / "public/font/GenSenRounded-B.woff2",
    "R": ROOT / "public/font/GenSenRounded-R.woff2",
}
OUTPUT_DIR = ROOT / "public/font/subset"
CSS_OUTPUT = ROOT / "src/font-subsets.generated.css"
PRELOAD_START = "<!-- font-subset-preloads:start -->"
PRELOAD_END = "<!-- font-subset-preloads:end -->"


def read_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip("'\"")
    return values


def collect_strings(value: object) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, list):
        return [text for item in value for text in collect_strings(item)]
    if isinstance(value, dict):
        return [text for item in value.values() for text in collect_strings(item)]
    return []


def public_api_text() -> str:
    api_base = read_env(ROOT / ".env").get("VITE_API_BASE_URL")
    if not api_base:
        raise RuntimeError("VITE_API_BASE_URL is required to collect the public site text")
    # These are exactly the public datasets rendered by the site. Results include
    # their expanded character, so character copy is covered without reading secrets.
    requests = [
        ("/fe/group/search", {"pageSize": 1000}),
        ("/fe/psychometric-question/search", {"pageSize": 1000, "expand": "options"}),
        ("/fe/psychometric-result/search", {"pageSize": 1000, "expand": "character"}),
    ]
    texts: list[str] = []
    for route, payload in requests:
        body = json.dumps(payload).encode("utf-8")
        request = Request(
            f"{api_base.rstrip('/')}{route}", body,
            {
                "Content-Type": "application/json",
                "Origin": "https://strawberrypie.maxlin.tw",
                "User-Agent": "StrawberryPie-font-subset-builder/1.0",
            },
            method="POST",
        )
        with urlopen(request, timeout=30) as response:
            texts.extend(collect_strings(json.load(response)))
    return "\n".join(texts)


def source_text() -> str:
    paths = [ROOT / "index.html", ROOT / "src", ROOT / "public/robots.txt", ROOT / "public/sitemap.xml"]
    contents: list[str] = []
    for path in paths:
        if path.is_file():
            contents.append(path.read_text(encoding="utf-8", errors="ignore"))
        elif path.is_dir():
            for candidate in path.rglob("*"):
                if candidate.is_file() and candidate.suffix in SOURCE_SUFFIXES:
                    contents.append(candidate.read_text(encoding="utf-8", errors="ignore"))
    return "\n".join(contents)


def make_subset(source: Path, family: str, text_file: Path) -> tuple[str, int]:
    temporary_output = OUTPUT_DIR / f".{family}.woff2"
    subprocess.run([
        "pyftsubset", str(source), f"--text-file={text_file}", "--flavor=woff2",
        f"--output-file={temporary_output}", "--layout-features=*", "--name-IDs=*",
        "--name-legacy", "--glyph-names", "--symbol-cmap", "--legacy-cmap",
        "--notdef-glyph", "--notdef-outline", "--recommended-glyphs",
    ], check=True)
    digest = hashlib.sha256(temporary_output.read_bytes()).hexdigest()[:12]
    filename = f"{family}.{digest}.woff2"
    output = OUTPUT_DIR / filename
    temporary_output.replace(output)
    return filename, output.stat().st_size


def write_preloads(outputs: dict[str, tuple[str, int]]) -> None:
    index_path = ROOT / "index.html"
    index = index_path.read_text(encoding="utf-8")
    links = "\n".join(
        f'    <link rel="preload" href="/font/subset/{filename}" as="font" type="font/woff2" crossorigin />'
        for filename, _ in outputs.values()
    )
    block = f"{PRELOAD_START}\n{links}\n    {PRELOAD_END}"
    pattern = re.compile(f"{re.escape(PRELOAD_START)}.*?{re.escape(PRELOAD_END)}", re.DOTALL)
    if pattern.search(index):
        index = pattern.sub(block, index)
    else:
        index = index.replace("  </head>", f"    {block}\n  </head>")
    index_path.write_text(index, encoding="utf-8")


def main() -> None:
    if shutil.which("pyftsubset") is None:
        raise RuntimeError("pyftsubset is required; install FontTools first (for example: pipx install fonttools)")
    for source in FONT_SOURCES.values():
        if not source.is_file():
            raise FileNotFoundError(source)

    # ASCII, punctuation and whitespace protect form controls and text generated at runtime.
    text = source_text() + public_api_text() + "\n" + "".join(chr(code) for code in range(0x20, 0x7F))
    characters = "".join(sorted(set(text)))
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for old_font in OUTPUT_DIR.glob("*.woff2"):
        old_font.unlink()

    with tempfile.NamedTemporaryFile("w", encoding="utf-8", suffix=".txt", delete=False) as handle:
        handle.write(characters)
        text_file = Path(handle.name)
    try:
        outputs = {family: make_subset(source, family, text_file) for family, source in FONT_SOURCES.items()}
    finally:
        text_file.unlink(missing_ok=True)

    CSS_OUTPUT.write_text("\n".join([
        "/* Generated by scripts/generate-font-subsets.py; do not edit manually. */",
        *[
            "\n".join([
                "@font-face {",
                f'  font-family: "{family}";',
                f'  src: url("/font/subset/{filename}") format("woff2");',
                f"  font-weight: {'100' if family == 'Thin' else ('700' if family == 'B' else '400')};",
                "  font-style: normal;",
                "  font-display: swap;",
                "}",
            ])
            for family, (filename, _size) in outputs.items()
        ],
        "",
    ]), encoding="utf-8")
    write_preloads(outputs)
    size_report = ", ".join(f"{family}: {size / 1024:.1f} KiB" for family, (_, size) in outputs.items())
    print(f"Generated {len(characters)} glyph candidates; {size_report}")


if __name__ == "__main__":
    try:
        main()
    except (OSError, RuntimeError, subprocess.CalledProcessError) as error:
        print(f"Font subset generation failed: {error}", file=sys.stderr)
        sys.exit(1)
