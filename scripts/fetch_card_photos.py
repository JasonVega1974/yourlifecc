"""
Phase 5.8 hero-photo fetch.

Resolves a Wikipedia pageimages lead photo for every card across
Bible & Faith Home (12), School (5), Finance (7), and Health (5) and
HEAD-checks each URL against upload.wikimedia.org. Same approach used
for Bible Lands in Phase 5.6.

Each card has a primary article title plus 1-2 fallbacks. The script
walks the list, takes the first URL it can verify, and emits a Python
dict suitable for pasting into inject_card_photos.py.
"""

import json
import time
import urllib.parse
import urllib.request

UA = "YourLifeCC/1.0 (Phase 5.8 card-photo helper; jasonvega1974@gmail.com)"
API = "https://en.wikipedia.org/w/api.php"

# Each entry: (card_id, [candidate_titles])
CARDS = [
    # ── Bible & Faith Home ──
    ("bf-stories",     ["Bible illustration", "Storytelling", "Children's Bible"]),
    ("bf-clg",         ["Christian devotional literature", "Bible study (Christianity)"]),
    ("bf-flashcards",  ["Flashcard", "Spaced repetition"]),
    ("bf-worship",     ["Contemporary worship music", "Hymn", "Worship"]),
    ("bf-biblehub",    ["Bible", "Old Testament"]),
    ("bf-prayer",      ["Prayer", "Christian prayer"]),
    ("bf-academy",     ["Bible college", "Theological seminary", "Sunday school"]),
    ("bf-biblelands",  ["Holy Land", "Land of Israel"]),
    ("bf-timeline",    ["Biblical chronology", "Timeline of biblical events"]),
    ("bf-memorize",    ["Memorization", "Bible memorization"]),
    ("bf-journey",     ["Pilgrimage", "Christian pilgrimage"]),
    ("bf-devotional",  ["Daily devotional", "Devotion (Christianity)"]),
    # ── School ──
    ("school-classes",     ["Classroom", "Lecture", "High school"]),
    ("school-assignments", ["Homework", "Assignment (education)"]),
    ("school-gpa",         ["Grading in education", "Academic grading in the United States"]),
    ("school-study",       ["Pomodoro Technique", "Study skills"]),
    ("school-prep",        ["Test preparation", "Standardized test"]),
    # ── Finance ──
    ("finance-overview", ["Personal finance", "Money management"]),
    ("finance-bills",    ["Invoice", "Bill (payment)"]),
    ("finance-tx",       ["Financial transaction", "Cash register"]),
    ("finance-savings",  ["Saving", "Wealth"]),
    ("finance-savgoals", ["Piggy bank"]),
    ("finance-budget",   ["Budget", "Personal budget"]),
    ("finance-taxed",    ["Tax", "Income tax in the United States"]),
    # ── Health ──
    ("health-weight",  ["Weighing scale", "Body weight"]),
    ("health-food",    ["Vegetable", "Healthy diet"]),
    ("health-learn",   ["Nutrition", "Food pyramid (nutrition)"]),
    ("health-growth",  ["Human height", "Growth chart"]),
    ("health-habits",  ["Habit", "Routine activity theory"]),
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
    with urllib.request.urlopen(req, timeout=20) as resp:
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
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status, resp.headers.get("content-type", "")
    except Exception as e:
        return 0, str(e)


def resolve(card_id, candidates):
    for title in candidates:
        try:
            url = fetch_image(title)
        except Exception as e:
            print(f"  .. api-error on {title!r}: {e}", flush=True)
            continue
        if not url:
            print(f"  .. no lead image on {title!r}", flush=True)
            continue
        time.sleep(0.8)  # be polite — avoids the 429
        status, ctype = head_check(url)
        if status == 200 and ctype.startswith("image/"):
            print(f"  OK {card_id:22s} via {title!r}", flush=True)
            return url, title
        print(f"  .. HEAD {status} on {title!r}", flush=True)
    return None, None


def main():
    results = {}
    failures = []
    for card_id, candidates in CARDS:
        url, title = resolve(card_id, candidates)
        if url:
            results[card_id] = url
        else:
            failures.append(card_id)
            print(f"  XX {card_id:22s} ALL CANDIDATES FAILED", flush=True)

    print("\n\n# === PASTE INTO inject_card_photos.py ===\n")
    print("CARD_PHOTOS = {")
    for card_id, _ in CARDS:
        if card_id in results:
            print(f"  {card_id!r}: {results[card_id]!r},")
        else:
            print(f"  {card_id!r}: None,")
    print("}\n")
    print(f"# {len(results)}/{len(CARDS)} verified")
    if failures:
        print("# Failures: " + ", ".join(failures))


if __name__ == "__main__":
    main()
