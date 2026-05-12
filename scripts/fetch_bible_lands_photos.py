"""
One-shot helper for Phase 5.6.

Hits the English-Wikipedia `pageimages` API for each of the 30 biblical
sites, asks for a thumbnail (~1000px wide) that is hosted on
upload.wikimedia.org, then HEAD-checks the URL so we only write verified
photos into biblical-sites.js. Prints a Python dict that the
maintainer can paste into the data file.

Notes:
- Wikipedia's pageimages API returns a CC-licensed lead image curated by
  editors. The thumbnail URLs are direct upload.wikimedia.org CDN paths,
  which is what the user asked for.
- Article titles below were chosen to disambiguate biblical sites from
  modern same-name places where needed (e.g. "Mount Sinai" not "Mount
  Sinai, NY"; "Tel Megiddo" not the modern town).
"""

import json
import sys
import urllib.request
import urllib.parse

SITES = [
    ("jerusalem",        "Jerusalem"),
    ("temple-mount",     "Temple Mount"),
    ("garden-tomb",      "Church of the Holy Sepulchre"),
    ("mount-of-olives",  "Mount of Olives"),
    ("gethsemane",       "Gethsemane"),
    ("pool-of-bethesda", "Pool of Bethesda"),
    ("pool-of-siloam",   "Pool of Siloam"),
    ("bethlehem",        "Bethlehem"),
    ("nazareth",         "Nazareth"),
    ("capernaum",        "Capernaum"),
    ("sea-of-galilee",   "Sea of Galilee"),
    ("jordan-river",     "Jordan River"),
    ("caesarea-philippi","Caesarea Philippi"),
    ("mt-sinai",         "Mount Sinai"),
    ("jericho",          "Jericho"),
    ("bethel",           "Bethel"),
    ("hebron",           "Hebron"),
    ("shechem",          "Shechem"),
    ("shiloh",           "Shiloh (biblical city)"),
    ("mt-carmel",        "Mount Carmel"),
    ("megiddo",          "Tel Megiddo"),
    ("tel-dan",          "Tel Dan"),
    ("babylon",          "Babylon"),
    ("qumran",           "Qumran"),
    ("masada",           "Masada"),
    ("damascus",         "Damascus"),
    ("antioch",          "Antioch"),
    ("ephesus",          "Ephesus"),
    ("corinth",          "Ancient Corinth"),
    ("athens",           "Athens"),
    ("rome",             "Rome"),
    ("patmos",           "Patmos"),
]

UA = "YourLifeCC/1.0 (Phase 5.6 site-photo helper; jasonvega1974@gmail.com)"
API = "https://en.wikipedia.org/w/api.php"


def fetch_image(title):
    params = {
        "action": "query",
        "titles": title,
        "prop": "pageimages",
        "pithumbsize": 1200,
        "piprop": "thumbnail|name",
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
            return thumb["source"], thumb.get("width"), thumb.get("height")
    return None, None, None


def head_check(url):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status, resp.headers.get("content-type", "")
    except Exception as e:
        return 0, str(e)


def main():
    results = {}
    failures = []
    for site_id, title in SITES:
        try:
            url, w, h = fetch_image(title)
        except Exception as e:
            failures.append((site_id, title, "api-error: " + str(e)))
            print(f"  XX{site_id:18s} api-error: {e}", flush=True)
            continue
        if not url:
            failures.append((site_id, title, "no-pageimage"))
            print(f"  XX{site_id:18s} (no lead image on '{title}')", flush=True)
            continue
        status, ctype = head_check(url)
        if status == 200 and ctype.startswith("image/"):
            results[site_id] = url
            print(f"  OK{site_id:18s} {w}x{h}  {url}", flush=True)
        else:
            failures.append((site_id, title, f"head:{status} ctype:{ctype}"))
            print(f"  XX{site_id:18s} HEAD failed ({status} {ctype}) {url}", flush=True)

    print("\n\n# === PASTE INTO biblical-sites.js ===\n")
    print("const SITE_PHOTOS = {")
    for site_id in [s for s, _ in SITES]:
        if site_id in results:
            print(f"  {site_id!r}: {results[site_id]!r},")
        else:
            print(f"  {site_id!r}: null,")
    print("};\n")
    print(f"# {len(results)}/{len(SITES)} verified")
    if failures:
        print("\n# Failures:")
        for sid, title, reason in failures:
            print(f"#   {sid:18s} ({title!r}): {reason}")


if __name__ == "__main__":
    main()
