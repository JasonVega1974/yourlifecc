"""
Final pass — Commons file-search for the 2 stragglers that the
prop=images enumeration picked badly (Socrates statue for Mental Health,
2bishopsReformation for Christian Life Guide).

Uses commons.wikimedia.org list=search with srnamespace=6 (File:) and a
search string built from the card's semantic theme. Scores results
to prefer modern, contemporary, non-historical files.
"""

import json
import time
import urllib.parse
import urllib.request

UA = "YourLifeCC/1.0 (Phase 5.8 straggler picker v2; jasonvega1974@gmail.com)"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
EN_API = "https://en.wikipedia.org/w/api.php"

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
    "boyhood_of_raleigh", "comme_sisyphe", "adam_na_restauratie",
    "form_1040", "1622", "1850",
    "abby_the_pup", "knuckles_", "marino_sanudo",
    "bmi_chart", "cooking_contest",
    "locatelli", "lakhovsky", "housekeeping_1908", "manzanar",
    "psi_mental", "recyclingsymbol",
    "christ_taking", "apostles", "polio_", "ocd_",
    "shiva_", "ramachandra_",
    "socrates", "2bishops", "reformation",
    "_statue.", "_bust.", "_relief.", "stamp_",
    "1880", "1890", "1900", "1910",
]

# Cards needing replacement, with curated Commons file-search queries.
QUERIES = [
    ("sk-mental",  "meditation woman sitting calm",
                    "person meditating outdoor",
                    "mindful breathing"),
    ("bf-clg",     "Bible study group adults",
                    "small group church meeting",
                    "Christian family praying together"),
]


def search_files(query):
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "srnamespace": "6",
        "srlimit": "20",
        "format": "json",
    }
    url = COMMONS_API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.load(resp)
    out = []
    for hit in data.get("query", {}).get("search", []):
        t = hit.get("title")
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
    url = COMMONS_API + "?" + urllib.parse.urlencode(params)
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


def resolve(card_id, queries, seen):
    for q in queries:
        print(f"  -- search: {q!r}", flush=True)
        time.sleep(1.0)
        try:
            files = search_files(q)
        except Exception as e:
            print(f"     api-error: {e}", flush=True)
            continue
        for file_title in files:
            if looks_bad(file_title):
                continue
            time.sleep(0.6)
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
            # Prefer real-world photographs by minimum dimensions
            if w and h and (w < 500 or h < 400):
                continue
            time.sleep(0.5)
            status, ctype = head_check(url)
            if status != 200:
                continue
            if not (ctype.startswith("image/jpeg") or ctype.startswith("image/png")):
                continue
            return url, file_title, q
    return None, None, None


def main():
    seen = set()
    for entry in QUERIES:
        card_id, *queries = entry
        print(f"\n[{card_id}]", flush=True)
        url, fname, q = resolve(card_id, queries, seen)
        if url:
            print(f"  OK -> {fname} (from query: {q!r})", flush=True)
            print(f"     {url}", flush=True)
            seen.add(url)
        else:
            print("  XX no clean photo across all queries", flush=True)


if __name__ == "__main__":
    main()
