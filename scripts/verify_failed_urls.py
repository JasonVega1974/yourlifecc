"""Re-verify the 9 URLs that hit HTTP 429 with a polite delay between
HEAD checks. The URLs themselves came back from Wikipedia's pageimages
API in the first run, so we know they exist; this just confirms with
a clean 200."""

import time
import urllib.request

UA = "YourLifeCC/1.0 (Phase 5.6 retry; jasonvega1974@gmail.com)"

URLS = {
    "shechem":  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Tell_Balata.jpg/1280px-Tell_Balata.jpg",
    "shiloh":   "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Ancient_Shiloh_IMG_2924.JPG/1280px-Ancient_Shiloh_IMG_2924.JPG",
    "megiddo":  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/TEL_MEGIDO_AERIAL_C.JPG/1280px-TEL_MEGIDO_AERIAL_C.JPG",
    "tel-dan":  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tel_Dan_Canaanite_Gate_1.jpg/1280px-Tel_Dan_Canaanite_Gate_1.jpg",
    "babylon":  "https://upload.wikimedia.org/wikipedia/commons/e/e6/Ishtar_Gate.jpg",
    "masada":   "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Israel-2013-Aerial_21-Masada.jpg/1280px-Israel-2013-Aerial_21-Masada.jpg",
    "damascus": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Damascus_from_qasioun_mountain.jpg/1280px-Damascus_from_qasioun_mountain.jpg",
    "athens":   "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Monastiraki_Square_and_Acropolis_in_Athens_%2844149181684%29.jpg/1280px-Monastiraki_Square_and_Acropolis_in_Athens_%2844149181684%29.jpg",
    "patmos":   "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Chora-of-Patmos.JPG/1280px-Chora-of-Patmos.JPG",
}


def head(url):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.status, resp.headers.get("content-type", "")


verified = {}
for site_id, url in URLS.items():
    time.sleep(3.0)  # be polite — avoids the 429
    try:
        status, ctype = head(url)
        ok = (status == 200 and ctype.startswith("image/"))
        marker = "OK" if ok else "XX"
        print(f"  {marker} {site_id:12s} {status} {ctype}  {url}", flush=True)
        if ok:
            verified[site_id] = url
    except Exception as e:
        print(f"  XX {site_id:12s} ERR {e}", flush=True)

print(f"\n{len(verified)}/{len(URLS)} verified on retry")
for sid, url in verified.items():
    print(f"  {sid!r}: {url!r},")
