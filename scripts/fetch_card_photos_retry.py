"""Retry the 4 failures + the 2 weak matches with better article titles."""

import json
import time
import urllib.parse
import urllib.request

UA = "YourLifeCC/1.0 (Phase 5.8 retry; jasonvega1974@gmail.com)"
API = "https://en.wikipedia.org/w/api.php"

# Better candidates for the cards that failed or had weak leads
CARDS = [
    ("bf-clg",         ["Christianity", "Devotional song", "Bible study (Christianity)"]),
    ("bf-memorize",    ["Memory technique", "Mnemonic", "Recitation"]),
    ("school-gpa",     ["Diploma", "Report card", "Graduation"]),
    ("finance-bills",  ["Banknote", "Receipt", "Bill of sale"]),
    # Better matches than current
    ("finance-overview", ["Money", "Coin", "United States dollar"]),
    ("health-learn",     ["Food group", "Healthy diet", "Dietary fiber"]),
]


def fetch(title):
    p = {"action":"query","titles":title,"prop":"pageimages","pithumbsize":1200,"piprop":"thumbnail","format":"json","redirects":1}
    url = API + "?" + urllib.parse.urlencode(p)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.load(r)
    for _, page in data.get("query", {}).get("pages", {}).items():
        t = page.get("thumbnail")
        if t and t.get("source"): return t["source"]
    return None


def head(url):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status, r.headers.get("content-type", "")
    except Exception as e:
        return 0, str(e)


for cid, candidates in CARDS:
    found = False
    for title in candidates:
        time.sleep(2.0)
        try:
            u = fetch(title)
        except Exception as e:
            print(f"  .. {cid} api-error on {title!r}: {e}", flush=True)
            continue
        if not u:
            print(f"  .. {cid} no lead on {title!r}", flush=True)
            continue
        time.sleep(2.0)
        s, c = head(u)
        if s == 200 and c.startswith("image/"):
            print(f"  OK {cid:18s} -> {title!r}: {u}", flush=True)
            found = True
            break
        else:
            print(f"  .. {cid} HEAD {s} on {title!r}", flush=True)
    if not found:
        print(f"  XX {cid:18s} ALL FAILED", flush=True)
