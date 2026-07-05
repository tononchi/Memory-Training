#!/usr/bin/env python3
"""各アプリの index.html と参照する css/js を 1 つの自己完結 HTML にまとめる。

使い方:  python3 tools/build-standalone.py
出力:
  - app.standalone.html            … 小学生むけ（よむよむスピードトレーニング）
  - secondary/app.standalone.html  … 中高生むけ（速読・読解トレーニング）

外部参照（<link rel=stylesheet href=...> / <script src=...>）をすべてインライン化する。
claude.ai の Artifact 等に貼れる単一ファイルを生成する。
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def build(src_rel, out_rel):
    src_dir = os.path.dirname(os.path.join(ROOT, src_rel))

    def read(rel_to_src):
        with open(os.path.join(src_dir, rel_to_src), encoding="utf-8") as f:
            return f.read()

    with open(os.path.join(ROOT, src_rel), encoding="utf-8") as f:
        html = f.read()

    html = re.sub(
        r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>',
        lambda m: f"<style>\n{read(m.group(1))}\n  </style>",
        html,
    )

    def inline_js(m):
        src = m.group(1)
        if src.startswith("http"):
            return m.group(0)
        return f"<script>\n{read(src)}\n  </script>"

    html = re.sub(r'<script\s+src="([^"]+)"></script>', inline_js, html)

    # 単一ファイルでは docs/ などへの相対リンクが切れるためテキスト化
    html = html.replace(
        '<a href="docs/speed-reading-research.md">docs/speed-reading-research.md</a>',
        "docs/speed-reading-research.md（リポジトリ参照）",
    )
    html = re.sub(
        r'<a href="\.\./docs/[^"]+">([^<]+)</a>', r"\1（リポジトリ参照）", html
    )
    html = re.sub(
        r'<p><a href="\.\./index\.html">[^<]+</a></p>', "", html
    )

    leftover = re.findall(r'(?:href="[^"#]+\.(?:css|md)"|src="[^"]+\.js")', html)
    if leftover:
        raise SystemExit(f"{src_rel}: 未インラインの外部参照が残っています: {leftover}")

    out = os.path.join(ROOT, out_rel)
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"built {out_rel}  ({len(html.encode('utf-8'))} bytes)")


def main():
    build("index.html", "app.standalone.html")
    build("secondary/index.html", "secondary/app.standalone.html")


if __name__ == "__main__":
    main()
