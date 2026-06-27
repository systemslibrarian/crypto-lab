#!/usr/bin/env python3
"""Re-apply the Crypto Lab shared header to every lab's index.html.

Removes any previously-injected block (old or new markers) and inserts the
current shared-header.html immediately after <body>. Local edits only — no
commit/push. Idempotent: safe to run repeatedly.
"""
import os, re, glob, sys, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # ...\repos
SNIPPET_PATH = os.path.join(ROOT, "crypto-lab", "shared-header.html")

with open(SNIPPET_PATH, encoding="utf-8") as fh:
    SNIPPET = fh.read().rstrip("\n")

BODY_RE = re.compile(r"<body[^>]*>", re.I)
END_RE = re.compile(r"/CRYPTO LAB shared global header -->|END crypto-lab shared header -->")

def find_index(repo_dir):
    root_idx = os.path.join(repo_dir, "index.html")
    if os.path.isfile(root_idx):
        return root_idx
    for p in glob.glob(os.path.join(repo_dir, "**", "index.html"), recursive=True):
        if "node_modules" in p or os.sep + "dist" + os.sep in p:
            continue
        return p
    return None

def process(path, repo):
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    body = BODY_RE.search(text)
    if not body:
        return "no <body>"
    head, tail = text[:body.end()], text[body.end():]
    # strip an existing injected block sitting right after <body>
    m = END_RE.search(tail)
    if m and "cl-topbar" in tail[:m.end()]:
        tail = tail[m.end():]
    tail = tail.lstrip("\n")
    block = SNIPPET.replace("__REPO__", repo)
    new = head + "\n" + block + "\n" + tail
    if new == text:
        return "unchanged"
    with open(path, "w", encoding="utf-8", newline="") as fh:
        fh.write(new)
    prettify(path)
    return "updated"


def prettify(path):
    """Run the repo's own Prettier on the rewritten file, if present.

    The injected block is not pre-formatted, so a raw write leaves index.html
    failing `prettier --check`, which fails the lint gate in the Pages deploy
    workflow and silently blocks the new header from ever shipping. Formatting
    here keeps the deploy gate green. No-op for repos without Prettier.
    """
    repo_dir = os.path.dirname(path)
    while repo_dir and repo_dir != ROOT:
        binname = "prettier.cmd" if os.name == "nt" else "prettier"
        prettier = os.path.join(repo_dir, "node_modules", ".bin", binname)
        if os.path.isfile(prettier):
            try:
                subprocess.run([prettier, "--write", path], cwd=repo_dir,
                               check=True, capture_output=True)
            except Exception as exc:
                print(f"  (prettier skipped for {os.path.basename(path)}: {exc})")
            return
        parent = os.path.dirname(repo_dir)
        if parent == repo_dir:
            break
        repo_dir = parent

def main():
    targets = sys.argv[1:] or sorted(glob.glob(os.path.join(ROOT, "crypto-lab-*")))
    n = {"updated": 0, "unchanged": 0, "skipped": 0}
    for repo_dir in targets:
        if not os.path.isdir(repo_dir):
            continue
        repo = os.path.basename(repo_dir.rstrip(os.sep))
        idx = find_index(repo_dir)
        if not idx:
            print(f"SKIP no index.html : {repo}")
            n["skipped"] += 1
            continue
        res = process(idx, repo)
        print(f"{res.upper():9s} : {repo}  ({os.path.relpath(idx, ROOT)})")
        n[res] = n.get(res, 0) + 1
    print("-" * 40)
    print(" ".join(f"{k}={v}" for k, v in n.items()))

if __name__ == "__main__":
    main()
