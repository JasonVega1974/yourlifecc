"""
Phase 5.8 v2 — straggler-photo picker.

For cards whose Wikipedia article LEAD image is a painting / diagram /
symbol / wrong-context, this script enumerates ALL images on a list of
"likely-to-have-a-clean-modern-photo" Wikipedia articles via the
`prop=images` API, filters with the same BAD_TOKENS list used by the
main curate script, HEAD-checks for image/jpeg|image/png, and returns
the first URL that passes per card.

Re-runnable. Prints a STRAGGLER_PHOTOS dict you can splice into
scripts/curated_card_photos.py.
"""

import json
import re
import time
import urllib.parse
import urllib.request

UA = "YourLifeCC/1.0 (Phase 5.8 v2 straggler picker; jasonvega1974@gmail.com)"
API = "https://en.wikipedia.org/w/api.php"

# Re-use the master BAD_TOKENS list. Keep in sync with curate_card_photos.py
BAD_TOKENS = [
    ".svg", ".pdf",
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
    "abby_the_pup", "knuckles_",
    "marino_sanudo",
    "bmi_chart", "cooking_contest",
    "locatelli", "lakhovsky",
    "housekeeping_1908", "manzanar",
    "psi_mental", "recyclingsymbol",
    "christ_taking", "apostles",
    "polio_", "ocd_",
    "shiva_", "ramachandra_",
]

# Cards still needing a clean photo, with a list of source Wikipedia
# articles to enumerate images from (NOT just the lead image).
STRAGGLERS = [
    ("health-weight", [
        "Weighing scale",
        "Bathroom",
        "Body fat percentage",
        "Body composition",
        "Obesity",
    ]),
    ("bf-clg", [
        "Christianity",
        "Bible study (Christianity)",
        "Discipleship",
        "Christian family",
        "Sermon",
        "Bible",
    ]),
    ("sk-mental", [
        "Mindfulness",
        "Psychotherapy",
        "Therapy",
        "Cognitive behavioral therapy",
        "Anxiety",
    ]),
    ("sk-adulting", [
        "Personal hygiene",
        "Housework",
        "Cleaning",
        "Household chore",
        "Adult",
    ]),
    ("sk-stress", [
        "Yoga",
        "Meditation",
        "Mindfulness",
        "Relaxation technique",
    ]),
]


def fetch_images(title):
    """List ALL file titles on a Wikipedia article."""
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
    pages = data.get("query", {}).get("pages", {})
    out = []
    for _, page in pages.items():
        for img in page.get("images", []) or []:
            t = img.get("title")
            if t and t.startswith("File:"):
                out.append(t)
    return out


def imageinfo(file_title):
    """Resolve a File:title to its direct upload URL + dimensions."""
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
    pages = data.get("query", {}).get("pages", {})
    for _, page in pages.items():
        for info in page.get("imageinfo", []) or []:
            return info.get("url"), info.get("mime", "")
    return None, ""


def head_check(url):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            return resp.status, resp.headers.get("content-type", "")
    except Exception as e:
        return 0, str(e)


def looks_bad(url):
    low = url.lower()
    for tok in BAD_TOKENS:
        if tok in low:
            return tok
    return None


def resolve(card_id, articles, seen):
    """Walk each article's image list; return (url, file, article) for first match."""
    for article in articles:
        print(f"  -- scanning '{article}' …", flush=True)
        time.sleep(1.0)
        try:
            files = fetch_images(article)
        except Exception as e:
            print(f"     api-error: {e}", flush=True)
            continue
        for file_title in files:
            # Skip obvious non-photos by filename
            bad = looks_bad(file_title)
            if bad:
                continue
            time.sleep(0.8)
            try:
                url, mime = imageinfo(file_title)
            except Exception:
                continue
            if not url:
                continue
            if mime and not (mime.startswith("image/jpeg") or mime.startswith("image/png")):
                continue
            bad = looks_bad(url)
            if bad:
                continue
            if url in seen:
                continue
            time.sleep(0.8)
            status, ctype = head_check(url)
            if status != 200:
                continue
            if not (ctype.startswith("image/jpeg") or ctype.startswith("image/png")):
                continue
            return url, file_title, article
    return None, None, None


def main():
    seen = set()
    out = {}
    for card_id, articles in STRAGGLERS:
        print(f"\n[{card_id}]", flush=True)
        url, fname, src = resolve(card_id, articles, seen)
        if url:
            print(f"  OK -> {fname} (from '{src}')", flush=True)
            print(f"     {url}", flush=True)
            out[card_id] = (url, fname, src)
            seen.add(url)
        else:
            print("  XX no clean photo found across all articles", flush=True)
            out[card_id] = (None, None, None)

    print("\n\n# === RESULT — splice into curated_card_photos.py ===\n")
    for card_id, (url, fname, src) in out.items():
        if url:
            print(f"    {card_id!r}: {url!r},  # via '{src}' / {fname}")
        else:
            print(f"    {card_id!r}: None,  # no clean photo found")


if __name__ == "__main__":
    main()
