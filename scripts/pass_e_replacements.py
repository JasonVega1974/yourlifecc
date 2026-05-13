"""
Pass E — replacement pull for two cards whose initial pageimages
lookup returned a 1914 recruiting poster / historical letter rather
than a modern color photo.

Uses prop=images on a list of likely-to-have-modern-photos articles,
then filters with the project's BAD_TOKENS + the new round-3 rejects.
"""

import json
import time
import urllib.parse
import urllib.request

UA = "YourLifeCC/1.0 (Pass E replacements; jasonvega1974@gmail.com)"
API = "https://en.wikipedia.org/w/api.php"

BAD_TOKENS = [
    ".svg", ".pdf", ".webp",
    "painting", "drawing", "engraving", "etching", "lithograph",
    "fresco", "icon_", "icon-", "illumination",
    "manuscript", "map_of", "_map_", "_map.",
    "cartoon", "comic_",
    "diagram", "chart_", "_chart.", "infographic",
    "graph_", "_graph.", "pie_chart", "bar_chart", "flowchart",
    "form_", "_form.", "_form_",
    "screenshot_", "logo_", "_logo.",
    "_symbol.", "_symbol_", "symbol.png", "symbolgreen",
    "_revenues", "revenues.",
    "millais", "daumier", "sisyphus", "michelangelo",
    "locatelli", "lakhovsky", "housekeeping_1908", "manzanar",
    "psi_mental", "recyclingsymbol",
    "christ_taking", "apostles", "polio_", "ocd_",
    "shiva_", "ramachandra_",
    # Round-3 rejects for Pass E
    "leete", "kitchener", "nachdruck", "_poster", "poster_",
    "1914", "1882", "1933", "1899", "1908",
    "southmayd", "_letter_", "letter_1",
    "_1900_", "_1910_", "_1920_", "_1930_",
]

STRAGGLERS = [
    ("rsm-tracker", [
        "Career fair",
        "Employment agency",
        "Recruitment",
        "Job hunting",
        "Human resources",
        "Want ad",
    ]),
    ("rsm-builder", [
        "Résumé",
        "Curriculum vitae",
        "Cover letter",
        "Personal branding",
        "Application for employment",
        "Job application",
    ]),
]


def fetch_article_images(title):
    params = {
        "action": "query",
        "titles": title,
        "prop": "images",
        "imlimit": "max",
        "format": "json",
        "redirects": 1,
    }
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.load(resp)
    out = []
    for _, page in data.get("query", {}).get("pages", {}).items():
        for img in page.get("images", []) or []:
            t = img.get("title")
            if t and t.startswith("File:"):
                out.append(t)
    return out


def imageinfo(file_title):
    params = {
        "action": "query",
        "titles": file_title,
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
        "format": "json",
    }
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.load(resp)
    for _, page in data.get("query", {}).get("pages", {}).items():
        for info in page.get("imageinfo", []) or []:
            return info.get("url"), info.get("mime", ""), info.get("width", 0), info.get("height", 0)
    return None, "", 0, 0


def head_check(url):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            return resp.status, resp.headers.get("content-type", "")
    except Exception as e:
        return 0, str(e)


def looks_bad(s):
    low = s.lower()
    for tok in BAD_TOKENS:
        if tok in low:
            return tok
    return None


def resolve(card_id, articles, seen):
    for article in articles:
        print(f"  -- scan: {article!r}", flush=True)
        time.sleep(0.9)
        try:
            files = fetch_article_images(article)
        except Exception as e:
            print(f"     err: {e}", flush=True)
            continue
        for file_title in files:
            if looks_bad(file_title):
                continue
            time.sleep(0.5)
            try:
                url, mime, w, h = imageinfo(file_title)
            except Exception:
                continue
            if not url:
                continue
            if mime and not (mime.startswith("image/jpeg") or mime.startswith("image/png")):
                continue
            if looks_bad(url):
                continue
            if url in seen:
                continue
            if w and h and (w < 500 or h < 400):
                continue
            time.sleep(0.4)
            status, ctype = head_check(url)
            if status != 200:
                continue
            if not (ctype.startswith("image/jpeg") or ctype.startswith("image/png")):
                continue
            return url, file_title, article
    return None, None, None


def main():
    seen = set()
    for card_id, articles in STRAGGLERS:
        print(f"\n[{card_id}]", flush=True)
        url, fname, art = resolve(card_id, articles, seen)
        if url:
            print(f"  OK -> {fname} (from {art!r})\n     {url}", flush=True)
            seen.add(url)
        else:
            print("  XX no clean photo found", flush=True)


if __name__ == "__main__":
    main()
