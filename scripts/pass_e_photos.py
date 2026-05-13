"""
Pass E — Wikipedia hero photos for Driving / Sports / Resume cards.

Uses the same fetch_image + HEAD-check + BAD_TOKENS approach as
curate_card_photos.py, but scoped to the 10 new cards this pass
introduces. Re-runnable. Outputs the dict ready to paste into the
new section's <div class="topic-card-grid"> markup.
"""

import json
import time
import urllib.parse
import urllib.request

UA = "YourLifeCC/1.0 (Pass E photo resolver; jasonvega1974@gmail.com)"
API = "https://en.wikipedia.org/w/api.php"

# Re-use the master BAD_TOKENS list. Keep in sync with curate_card_photos.py
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
]

# Already-claimed URLs from curated_card_photos.py — never re-issue these.
ALREADY_USED = set([
    # Subset that we know might collide; if dedup misses one, we'll see it in output.
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Convertible_Mercedes_Car_Driving_On_A_Highway.jpg/1280px-Convertible_Mercedes_Car_Driving_On_A_Highway.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Casio_calculator_JS-20WK_in_201901_002.jpg/1280px-Casio_calculator_JS-20WK_in_201901_002.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Insurance_contract.jpg/1280px-Insurance_contract.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/WalletMpegMan.jpg/1280px-WalletMpegMan.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Abbey_Road_zebra_crossing%2C_24-11-2015.jpg/1280px-Abbey_Road_zebra_crossing%2C_24-11-2015.jpg",
])

CARDS = [
    # ─── Driving ────────────────────────────────────────────────────
    ("drv-license", [
        "Driver's license",
        "Driver's license in the United States",
        "Identity document",
        "California Driver License",
    ]),
    ("drv-safety", [
        "Seat belt",
        "Defensive driving",
        "Road traffic safety",
        "Three-point seatbelt",
    ]),
    ("drv-maintenance", [
        "Auto mechanic",
        "Automobile repair shop",
        "Mechanic",
        "Tire",
        "Engine",
    ]),
    ("drv-costs", [
        "Fuel dispenser",
        "Gasoline",
        "Vehicle insurance",
        "Filling station",
    ]),
    # ─── Sports ─────────────────────────────────────────────────────
    ("spt-explore", [
        "Stadium",
        "Sport",
        "Athletics (track and field)",
        "American football",
    ]),
    ("spt-mine", [
        "Trophy",
        "Medal",
        "Locker room",
        "Sports equipment",
    ]),
    # ─── Resume / Jobs ──────────────────────────────────────────────
    ("rsm-builder", [
        "Résumé",
        "Curriculum vitae",
        "Cover letter",
        "Application for employment",
    ]),
    ("rsm-tracker", [
        "Job hunting",
        "Employment website",
        "Help wanted",
        "Recruitment",
    ]),
    ("rsm-prep", [
        "Job interview",
        "Employment interview",
        "Behavioural interview",
    ]),
    ("rsm-practice", [
        "Mirror",
        "Rehearsal",
        "Practice (learning method)",
        "Acting",
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
    except Exception as e:
        return 0, str(e)


def looks_bad(url):
    low = url.lower()
    for tok in BAD_TOKENS:
        if tok in low:
            return tok
    return None


def resolve(card_id, candidates, seen):
    tried = []
    for title in candidates:
        time.sleep(1.2)
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
        if url in seen or url in ALREADY_USED:
            tried.append(f"{title}: dedup")
            continue
        time.sleep(1.0)
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
    seen = set()
    results = {}
    for card_id, candidates in CARDS:
        print(f"\n[{card_id}]", flush=True)
        url, title, tried = resolve(card_id, candidates, seen)
        for line in tried:
            print(f"  .. {line}", flush=True)
        if url:
            print(f"  OK -> {title!r}\n     {url}", flush=True)
            results[card_id] = (url, title)
            seen.add(url)
        else:
            print("  XX no candidate passed", flush=True)
            results[card_id] = (None, None)

    print("\n\n# === RESULT ===\n")
    for card_id, (url, title) in results.items():
        if url:
            print(f"    {card_id!r}: {url!r},  # via {title!r}")
        else:
            print(f"    {card_id!r}: None,  # no clean photo found")


if __name__ == "__main__":
    main()
