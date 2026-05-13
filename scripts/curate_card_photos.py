"""
Phase 5.8 — curated hero-photo fetch (v2: extended for full-coverage).

Re-runs the per-card Wikipedia pageimages lookup with hand-picked
"concrete object / scene" titles, rejecting any lead image that is a
painting, drawing, illustration, SVG, PDF preview, map, cartoon,
chart, graph, infographic, screenshot, or historical engraving.
Returns a uniform set of MODERN COLOR PHOTOGRAPHS suitable for a
premium consumer-app aesthetic.

v2 changes over the initial Phase-5.8 polish run:
  - 6 straggler entries (bf-clg, bf-memorize, bf-devotional,
    finance-savgoals, finance-taxed, health-weight) now have NEW
    candidate lists that route around the prior duplicate-or-diagram
    failures.
  - 42 new sk-<key> entries — one per Life-Skills category in
    skills.js SK_CATS. Titles chosen to land on the actual Wikipedia
    article whose lead image is a colour photo (not the diagram or
    infographic for that concept).
  - URL-level dedup: once a resolved URL is consumed by a card, no
    other card may reuse it (prevents piggy-bank-twice / calculator-
    twice problem).
  - Tighter BAD_TOKENS: 'form_', '_form.', 'graph_', '_chart.',
    'pie_chart', 'bar_chart', 'flowchart', 'screenshot_'.

Filtering rules applied to each candidate's lead image URL:
  - reject if URL contains '.svg' (vector diagram)
  - reject if URL contains '.pdf' (Form-1040 style preview)
  - reject if URL contains '.webp' (Wikimedia thumbs of webp are unreliable)
  - reject if content-type is not image/jpeg or image/png
  - reject if filename contains keywords that signal painting / drawing
    / engraving / map / chart / graph / form / screenshot / cartoon
  - reject if the URL has already been consumed by an earlier card
"""

import json
import re
import time
import urllib.parse
import urllib.request

UA = "YourLifeCC/1.0 (Phase 5.8 v2 curated-photo helper; jasonvega1974@gmail.com)"
API = "https://en.wikipedia.org/w/api.php"

# Filename tokens that almost always mean "painting / drawing / map /
# engraving / SVG / PDF / cartoon / chart / form / screenshot" — reject
# any lead image whose URL (case-insensitive) contains one of these.
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
    # Known first-pass duds
    "millais", "daumier", "sisyphus", "michelangelo",
    "boyhood_of_raleigh", "comme_sisyphe", "adam_na_restauratie",
    "form_1040", "1622", "1850",
    "abby_the_pup", "knuckles_",
    "marino_sanudo",
    "bmi_chart",
    "cooking_contest",
    # Round-2 rejects (paintings, illustrations, charts, sensitive context)
    "locatelli",
    "lakhovsky",
    "housekeeping_1908",
    "manzanar",
    "psi_mental",
    "recyclingsymbol",
]

# Per-card ordered candidate lists. Each title is a Wikipedia article
# whose lead image we expect to be a modern colour photograph.
CARDS = [
    # ─── Bible & Faith Home (6 stragglers + 9 already-resolved) ─────
    ("bf-stories", [
        "Children's Bible",
        "Sunday school",
        "Bible storybook",
        "Picture book",
        "Storytime",
    ]),
    ("bf-clg", [
        "Sunday school",
        "Bible study (Christianity)",
        "Christian family",
        "Small group (church)",
        "Christian counseling",
        "Discipleship",
        "Church service",
        "Family Bible",
        "Christian wedding",
        "Sermon",
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
        "Memorization",
        "Recitation",
        "Memory (psychology)",
        "Note-taking",
        "Bookmark",
    ]),
    ("bf-journey", [
        "Hiking",
        "Pilgrimage",
        "Camino de Santiago",
        "Long-distance trail",
        "Backpacking (hiking)",
    ]),
    ("bf-devotional", [
        "Daily devotional",
        "Lectio Divina",
        "Christian meditation",
        "Coffee",
        "Sunrise",
        "Open book",
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
        "Goal setting",
        "Financial planning",
        "Vision board",
        "Mason jar",
        "Bullet journal",
    ]),
    ("finance-budget", [
        "Spreadsheet",
        "Calculator",
        "Personal budget",
        "Bookkeeping",
        "Accounting",
    ]),
    ("finance-taxed", [
        "Internal Revenue Service",
        "Tax return",
        "Tax preparation in the United States",
        "Income tax",
        "Accountant",
    ]),

    # ─── Health ─────────────────────────────────────────────────────
    ("health-weight", [
        "Bathroom scale",
        "Weighing scale",
        "Digital scale",
        "Spring scale",
        "Body composition",
        "Bioelectrical impedance analysis",
        "Body weight",
        "Personal scales",
        "Smart scale",
        "Withings",
        "Body fat percentage",
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

    # ─── Life Skills (42 SK_CATS, sk-<key>) ─────────────────────────
    ("sk-taxes", [
        "Internal Revenue Service",
        "Tax preparation in the United States",
        "Tax return",
        "Taxation in the United States",
        "Accountant",
        "Tax Day",
        "H&R Block",
        "TurboTax",
        "Bookkeeping",
    ]),
    ("sk-car", [
        "Driving",
        "Car",
        "Driver's license",
        "Automobile",
        "Steering wheel",
    ]),
    ("sk-health", [
        "Stethoscope",
        "Physician",
        "Hospital",
        "Medical examination",
        "Health care",
    ]),
    ("sk-dental", [
        "Toothbrush",
        "Dentistry",
        "Dental hygienist",
        "Dental floss",
        "Tooth",
    ]),
    ("sk-cooking", [
        "Cooking",
        "Chef",
        "Kitchen",
        "Restaurant",
        "Recipe",
    ]),
    ("sk-home", [
        "Apartment",
        "House",
        "Lease",
        "Renting",
        "Real estate",
    ]),
    ("sk-career", [
        "Office",
        "Workplace",
        "Business",
        "Open-plan office",
        "Career",
    ]),
    ("sk-credit", [
        "Credit card",
        "Debit card",
        "Bank",
        "Bank vault",
        "ATM",
    ]),
    ("sk-relationships", [
        "Friendship",
        "Couple",
        "Conversation",
        "Wedding",
        "Hug",
        "Handshake",
        "Holding hands",
        "High five",
    ]),
    ("sk-faith", [
        "Church (building)",
        "Christian worship",
        "Cross (Christianity)",
        "Bible",
        "Christianity",
    ]),
    ("sk-mental", [
        "Mental health",
        "Mindfulness",
        "Psychotherapy",
        "Therapy",
        "Meditation",
        "Counseling psychology",
        "Cognitive behavioral therapy",
        "Anxiety",
    ]),
    ("sk-civic", [
        "Voting",
        "Polling place",
        "Ballot box",
        "Voter registration",
        "United States Capitol",
    ]),
    ("sk-emergency", [
        "Ambulance",
        "Paramedic",
        "Fire engine",
        "Emergency department",
        "Emergency medical services",
    ]),
    ("sk-digital", [
        "Smartphone",
        "Laptop",
        "Personal computer",
        "Tablet computer",
        "Mobile phone",
    ]),
    ("sk-family", [
        "Family",
        "Parent",
        "Nuclear family",
        "Extended family",
        "Father",
    ]),
    ("sk-college", [
        "University",
        "College",
        "Campus",
        "Lecture hall",
        "Dormitory",
    ]),
    ("sk-legal", [
        "Lawyer",
        "Courthouse",
        "Gavel",
        "Court",
        "Trial",
    ]),
    ("sk-adulting", [
        "Apartment",
        "Moving (relocation)",
        "Adult",
        "Cooking",
        "Housework",
        "Chore",
        "Personal hygiene",
        "Independent living",
        "Self-care",
        "Domestic worker",
    ]),
    ("sk-communication", [
        "Conversation",
        "Public speaking",
        "Listening",
        "Body language",
        "Interpersonal communication",
        "Telephone call",
        "Sign language",
        "Letter (message)",
        "Mailbox",
        "Whisper",
    ]),
    ("sk-diy", [
        "Toolbox",
        "Hand tool",
        "Hammer",
        "Workshop",
        "Drill (tool)",
    ]),
    ("sk-shopping", [
        "Supermarket",
        "Shopping cart",
        "Grocery store",
        "Shopping",
        "Retail",
    ]),
    ("sk-writing", [
        "Fountain pen",
        "Notebook",
        "Writing",
        "Calligraphy",
        "Handwriting",
    ]),
    ("sk-laundry", [
        "Washing machine",
        "Laundry",
        "Laundry room",
        "Clothes line",
        "Tumble dryer",
    ]),
    ("sk-cleaning", [
        "Vacuum cleaner",
        "Mop",
        "Housekeeping",
        "Broom",
        "Cleaning",
    ]),
    ("sk-timemanage", [
        "Wall clock",
        "Wristwatch",
        "Calendar",
        "Pocket watch",
        "Alarm clock",
    ]),
    ("sk-organize", [
        "Filing cabinet",
        "Bullet journal",
        "To-do list",
        "Paperwork",
        "Binder (stationery)",
    ]),
    ("sk-safety", [
        "Pedestrian crossing",
        "Stop sign",
        "Safety helmet",
        "Traffic light",
        "High-visibility clothing",
    ]),
    ("sk-investing", [
        "New York Stock Exchange",
        "Wall Street",
        "Stock market",
        "Stock exchange",
        "Trading floor",
    ]),
    ("sk-insurance", [
        "Insurance policy",
        "Insurance",
        "Health insurance",
        "Insurance agent",
    ]),
    ("sk-travel", [
        "Suitcase",
        "Airport",
        "Passport",
        "Airline",
        "Air travel",
    ]),
    ("sk-nutrition", [
        "MyPlate",
        "Mediterranean diet",
        "Meal preparation",
        "Healthy diet",
        "Whole food",
    ]),
    ("sk-fitness", [
        "Gym",
        "Dumbbell",
        "Weight training",
        "Treadmill",
        "Physical fitness",
    ]),
    ("sk-sleep", [
        "Bed",
        "Bedroom",
        "Sleep",
        "Pillow",
        "Mattress",
    ]),
    ("sk-critical", [
        "Library",
        "Reading",
        "Books",
        "Reading (process)",
        "Bookcase",
    ]),
    ("sk-budgeting", [
        "Wallet",
        "Personal budget",
        "Money management",
        "Coin purse",
        "Banknote",
    ]),
    ("sk-environment", [
        "Recycling",
        "Forest",
        "Solar panel",
        "Wind turbine",
        "Compost",
        "Recycling bin",
        "Earth Day",
        "Environmentalism",
        "Reforestation",
    ]),
    ("sk-firstaid", [
        "First aid kit",
        "Bandage",
        "Adhesive bandage",
        "Cardiopulmonary resuscitation",
        "First aid",
    ]),
    ("sk-speaking", [
        "Microphone",
        "Podium",
        "Public speaking",
        "Lectern",
        "TED (conference)",
    ]),
    ("sk-stress", [
        "Yoga",
        "Meditation",
        "Mindfulness",
        "Relaxation technique",
        "Sauna",
    ]),
    ("sk-socialmedia", [
        "Selfie",
        "Smartphone",
        "Instagram",
        "Social media",
        "Mobile phone",
    ]),
    ("sk-onlinesafety", [
        "Padlock",
        "Computer security",
        "Password",
        "Two-factor authentication",
        "Encryption",
    ]),
    ("sk-entrepreneur", [
        "Small business",
        "Startup company",
        "Entrepreneurship",
        "Storefront",
        "Coworking space",
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


def resolve(card_id, candidates, seen_urls):
    """Walk candidates; return (url, title, tried) for the first that passes.
    URLs already consumed by an earlier card are skipped (dedup)."""
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
        if url in seen_urls:
            tried.append(f"{title}: dedup (URL already used by an earlier card)")
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
    seen_urls = set()
    for card_id, candidates in CARDS:
        print(f"\n[{card_id}]", flush=True)
        url, title, tried = resolve(card_id, candidates, seen_urls)
        for line in tried:
            print(f"  .. {line}", flush=True)
        if url:
            print(f"  OK -> {title!r}", flush=True)
            print(f"     {url}", flush=True)
            results[card_id] = url
            notes[card_id]   = title
            seen_urls.add(url)
        else:
            print("  XX no candidate passed; will use gradient fallback", flush=True)
            results[card_id] = None
            notes[card_id]   = None

    # Emit the dict
    out_path = "scripts/curated_card_photos.py"
    with open(out_path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write('"""Auto-generated by scripts/curate_card_photos.py — Phase 5.8 v2 curated."""\n\n')
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
