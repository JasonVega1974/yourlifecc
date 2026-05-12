"""
Phase 5.8 — curated hero-photo fetch.

Re-runs the per-card Wikipedia pageimages lookup with hand-picked
"concrete object / scene" titles, rejecting any lead image that is a
painting, drawing, illustration, SVG, PDF preview, map, cartoon, or
historical engraving. Returns a uniform set of MODERN COLOR PHOTOGRAPHS
suitable for a premium consumer app aesthetic.

Filtering rules applied to each candidate's lead image URL:
  - reject if URL contains '.svg' (vector diagram)
  - reject if URL contains '.pdf' (Form-1040 style preview)
  - reject if URL contains '.webp' (Wikimedia thumbs of webp are unreliable)
  - reject if content-type is not image/jpeg or image/png
  - reject if filename contains keywords that signal painting/drawing/engraving/cartoon/map
  - reject if the lead image is on a known "do-not-use" list (cards we
    explicitly know returned bad first-pass results)
"""

import json
import re
import time
import urllib.parse
import urllib.request

UA = "YourLifeCC/1.0 (Phase 5.8 curated-photo helper; jasonvega1974@gmail.com)"
API = "https://en.wikipedia.org/w/api.php"

# Filename tokens that almost always mean "painting / drawing / map /
# engraving / SVG / PDF / cartoon" — reject any lead image whose URL
# (case-insensitive) contains one of these.
BAD_TOKENS = [
    ".svg", ".pdf",
    "painting", "drawing", "engraving", "etching", "lithograph",
    "fresco", "icon_", "icon-", "illumination",
    "manuscript", "map_of", "_map_", "_map.",
    "cartoon", "comic_",
    "diagram", "chart_", "infographic",
    "millais", "daumier", "sisyphus", "michelangelo",
    "boyhood_of_raleigh", "comme_sisyphe", "adam_na_restauratie",
    "form_1040", "1622", "1850",
    "abby_the_pup", "knuckles_",
    "marino_sanudo",
]

# Per-card ordered candidate lists. Each title is a Wikipedia article
# whose lead image we expect to be a modern colour photograph.
CARDS = [
    # ─── Bible & Faith Home ────────────────────────────────────────
    ("bf-stories", [
        "Children's Bible",
        "Sunday school",
        "Bible storybook",
        "Picture book",
        "Storytime",
    ]),
    ("bf-clg", [
        "Christian counseling",
        "Christian family",
        "Small group (church)",
        "Bible study (Christianity)",
        "Christianity",
    ]),
    ("bf-flashcards", [
        "Flashcard",
        "Index card",
        "Spaced repetition",
    ]),
    ("bf-worship", [
        "Contemporary worship music",
        "Praise and worship",
        "Worship band",
        "Christian rock",
        "Hillsong Worship",
    ]),
    ("bf-biblehub", [
        "Bible",
        "Biblical canon",
        "Open Bible",
        "Study Bible",
        "New International Version",
    ]),
    ("bf-prayer", [
        "Christian prayer",
        "Prayer",
        "Praying hands",
        "Intercession",
    ]),
    ("bf-academy", [
        "Bible college",
        "Theological seminary",
        "Lecture hall",
        "Seminary",
        "University",
    ]),
    ("bf-biblelands", [
        "Jerusalem",
        "Western Wall",
        "Old City (Jerusalem)",
        "Sea of Galilee",
        "Mount of Olives",
    ]),
    ("bf-timeline", [
        "History of ancient Israel and Judah",
        "Dead Sea Scrolls",
        "Qumran",
        "Masada",
        "Archaeology of Israel",
    ]),
    ("bf-memorize", [
        "Studying",
        "Study skills",
        "Note-taking",
        "Reading",
        "Concentration",
    ]),
    ("bf-journey", [
        "Hiking",
        "Pilgrimage",
        "Camino de Santiago",
        "Long-distance trail",
        "Backpacking (hiking)",
    ]),
    ("bf-devotional", [
        "Quiet time",
        "Daily devotional",
        "Lectio Divina",
        "Christian meditation",
        "Morning",
    ]),
    # ─── School ─────────────────────────────────────────────────────
    ("school-classes", [
        "Classroom",
        "Lecture",
        "High school",
        "Secondary school",
    ]),
    ("school-assignments", [
        "Homework",
        "Notebook",
        "Pen",
        "Loose leaf",
    ]),
    ("school-gpa", [
        "Graduation",
        "Academic dress",
        "Mortarboard",
        "Diploma",
        "Commencement",
    ]),
    ("school-study", [
        "Pomodoro Technique",
        "Kitchen timer",
        "Study skills",
        "Time management",
    ]),
    ("school-prep", [
        "SAT",
        "Test preparation",
        "Examination",
        "Standardized test",
        "Multiple choice",
    ]),
    # ─── Finance ────────────────────────────────────────────────────
    ("finance-overview", [
        "Banknote",
        "United States dollar",
        "Coin",
        "Cash",
        "Money",
    ]),
    ("finance-bills", [
        "Receipt",
        "Invoice",
        "Cash register",
        "Point of sale",
    ]),
    ("finance-tx", [
        "Contactless payment",
        "Credit card",
        "Debit card",
        "Payment card",
        "Mobile payment",
    ]),
    ("finance-savings", [
        "Piggy bank",
        "Coin jar",
        "Money box",
        "Saving",
    ]),
    ("finance-savgoals", [
        "Piggy bank",
        "Money box",
        "Coin jar",
    ]),
    ("finance-budget", [
        "Spreadsheet",
        "Calculator",
        "Personal budget",
        "Bookkeeping",
        "Accounting",
    ]),
    ("finance-taxed", [
        "Calculator",
        "Tax preparation in the United States",
        "Accountant",
        "Bookkeeping",
        "Tax return",
    ]),
    # ─── Health ─────────────────────────────────────────────────────
    ("health-weight", [
        "Weighing scale",
        "Bathroom scale",
        "Body mass index",
        "Digital scale",
    ]),
    ("health-food", [
        "Vegetable",
        "Salad",
        "Healthy diet",
        "Mediterranean diet",
        "Whole food",
    ]),
    ("health-learn", [
        "Healthy diet",
        "Nutrition",
        "MyPlate",
        "Dietary Guidelines for Americans",
        "Food group",
    ]),
    ("health-growth", [
        "Tape measure",
        "Stadiometer",
        "Anthropometry",
        "Measuring tape",
        "Growth chart",
    ]),
    ("health-habits", [
        "Physical exercise",
        "Jogging",
        "Running",
        "Yoga",
        "Morning routine",
    ]),
]


def fetch_image(title):
    params = {
        "action": "query",
        "titles": title,
        "prop": "pageimages",
        "pithumbsize": 1200,
        "piprop": "thumbnail",
        "format": "json",
        "redirects": 1,
    }
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.load(resp)
    pages = data.get("query", {}).get("pages", {})
    for _, page in pages.items():
        thumb = page.get("thumbnail")
        if thumb and thumb.get("source"):
            return thumb["source"]
    return None


def head_check(url):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            return resp.status, resp.headers.get("content-type", "")
    except urllib.error.HTTPError as e:
        return e.code, str(e)
    except Exception as e:
        return 0, str(e)


def looks_bad(url):
    """Heuristic — reject lead images that aren't modern photos."""
    low = url.lower()
    for tok in BAD_TOKENS:
        if tok in low:
            return tok
    return None


def resolve(card_id, candidates):
    """Walk candidates; return (url, title, note) for the first that passes."""
    tried = []
    for title in candidates:
        time.sleep(1.4)
        try:
            url = fetch_image(title)
        except Exception as e:
            tried.append(f"{title}: api-error {e}")
            continue
        if not url:
            tried.append(f"{title}: no lead image")
            continue
        bad = looks_bad(url)
        if bad:
            tried.append(f"{title}: filename token {bad!r}")
            continue
        time.sleep(1.4)
        status, ctype = head_check(url)
        if status != 200:
            tried.append(f"{title}: HEAD {status}")
            continue
        if not (ctype.startswith("image/jpeg") or ctype.startswith("image/png")):
            tried.append(f"{title}: content-type {ctype}")
            continue
        return url, title, tried
    return None, None, tried


def main():
    results = {}
    notes  = {}
    for card_id, candidates in CARDS:
        print(f"\n[{card_id}]", flush=True)
        url, title, tried = resolve(card_id, candidates)
        for line in tried:
            print(f"  .. {line}", flush=True)
        if url:
            print(f"  OK -> {title!r}", flush=True)
            print(f"     {url}", flush=True)
            results[card_id] = url
            notes[card_id]   = title
        else:
            print("  XX no candidate passed; will use gradient fallback", flush=True)
            results[card_id] = None
            notes[card_id]   = None

    # Emit the dict
    out_path = "scripts/curated_card_photos.py"
    with open(out_path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write('"""Auto-generated by scripts/curate_card_photos.py — Phase 5.8 curated."""\n\n')
        fh.write("CARD_PHOTOS = {\n")
        for card_id, _ in CARDS:
            u = results.get(card_id)
            n = notes.get(card_id)
            tag = f"  # via {n!r}" if n else "  # no clean modern photo found"
            if u:
                fh.write(f"    {card_id!r}: {u!r},{tag}\n")
            else:
                fh.write(f"    {card_id!r}: None,{tag}\n")
        fh.write("}\n")

    print("\n\n# === RESULT ===\n")
    print("CARD_PHOTOS = {")
    for card_id, _ in CARDS:
        u = results.get(card_id)
        n = notes.get(card_id)
        tag = f"  # via {n!r}" if n else "  # no clean modern photo"
        if u:
            print(f"    {card_id!r}: {u!r},{tag}")
        else:
            print(f"    {card_id!r}: None,{tag}")
    print("}")
    ok = sum(1 for v in results.values() if v)
    print(f"\n# {ok}/{len(CARDS)} verified modern photos")


if __name__ == "__main__":
    main()
