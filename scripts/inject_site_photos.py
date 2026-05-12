"""Phase 5.6 — inject the 32 verified hero-photo URLs into
biblical-sites.js. Each entry's `heroPhoto: null` is replaced with the
verified upload.wikimedia.org URL. The data file is rewritten in place."""

import re
import sys

PHOTOS = {
    "jerusalem":         "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/%D7%94%D7%9E%D7%A6%D7%95%D7%93%D7%94_%D7%91%D7%9C%D7%99%D7%9C%D7%94.jpg/1280px-%D7%94%D7%9E%D7%A6%D7%95%D7%93%D7%94_%D7%91%D7%9C%D7%99%D7%9C%D7%94.jpg",
    "temple-mount":      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Jerusalem-2013%282%29-Aerial-Temple_Mount-%28south_exposure%29.jpg/1280px-Jerusalem-2013%282%29-Aerial-Temple_Mount-%28south_exposure%29.jpg",
    "garden-tomb":       "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Church_of_the_Holy_Sepulchre_by_Gerd_Eichmann_%28cropped%29.jpg/1280px-Church_of_the_Holy_Sepulchre_by_Gerd_Eichmann_%28cropped%29.jpg",
    "mount-of-olives":   "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/2013-Aerial-Mount_of_Olives.jpg/1280px-2013-Aerial-Mount_of_Olives.jpg",
    "gethsemane":        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Jerusalem_Gethsemane_tango7174.jpg/1280px-Jerusalem_Gethsemane_tango7174.jpg",
    "pool-of-bethesda":  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Jerusalem_Bethesda_BW_1.JPG/1280px-Jerusalem_Bethesda_BW_1.JPG",
    "pool-of-siloam":    "https://upload.wikimedia.org/wikipedia/commons/4/4c/Pool_of_Siloam_and_Lower_%28Old%29_Pool_in_the_Ordnance_Survey_of_Jerusalem.png",
    "bethlehem":         "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Church_of_the_Nativity_%287703592746%29.jpg/1280px-Church_of_the_Nativity_%287703592746%29.jpg",
    "nazareth":          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Nazareth_Panorama_Dafna_Tal_IMOT_%2814532097313%29.jpg/1280px-Nazareth_Panorama_Dafna_Tal_IMOT_%2814532097313%29.jpg",
    "capernaum":         "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Sites_of_Christianity_in_the_Galillee_-_Ruins_of_the_ancient_Great_Synagogue_at_Capernaum_%28or_Kfar_Nahum%29_on_the_shore_of_the_Lake_of_Galilee%2C_Northern_Israel.jpg/1280px-thumbnail.jpg",
    "sea-of-galilee":    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Kinneret_cropped.jpg/1280px-Kinneret_cropped.jpg",
    "jordan-river":      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/20100923_mer_morte13.JPG/1280px-20100923_mer_morte13.JPG",
    "caesarea-philippi": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Banias_Spring_Cliff_Pan%27s_Cave.JPG/1280px-Banias_Spring_Cliff_Pan%27s_Cave.JPG",
    "mt-sinai":          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Mount_Sinai_from_the_southwest.jpg/1280px-Mount_Sinai_from_the_southwest.jpg",
    "jericho":           "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Tell_es-sultan.jpg/1280px-Tell_es-sultan.jpg",
    "bethel":            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Bethel_MET_DP116361.jpg/1280px-Bethel_MET_DP116361.jpg",
    "hebron":            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/BTS_Hebron_Tour_280215_24.jpg/1280px-BTS_Hebron_Tour_280215_24.jpg",
    "shechem":           "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Tell_Balata.jpg/1280px-Tell_Balata.jpg",
    "shiloh":            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Ancient_Shiloh_IMG_2924.JPG/1280px-Ancient_Shiloh_IMG_2924.JPG",
    "mt-carmel":         "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Caiobadner_-_mount_carmel.JPG/1280px-Caiobadner_-_mount_carmel.JPG",
    "megiddo":           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/TEL_MEGIDO_AERIAL_C.JPG/1280px-TEL_MEGIDO_AERIAL_C.JPG",
    "tel-dan":           "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Tel_Dan_Canaanite_Gate_1.jpg/1280px-Tel_Dan_Canaanite_Gate_1.jpg",
    "babylon":           "https://upload.wikimedia.org/wikipedia/commons/e/e6/Ishtar_Gate.jpg",
    "qumran":            "https://upload.wikimedia.org/wikipedia/commons/c/c1/Kumeran4.jpg",
    "masada":            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Israel-2013-Aerial_21-Masada.jpg/1280px-Israel-2013-Aerial_21-Masada.jpg",
    "damascus":          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Damascus_from_qasioun_mountain.jpg/1280px-Damascus_from_qasioun_mountain.jpg",
    "antioch":           "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Antioch_on_the_Orontes_en.svg/1280px-Antioch_on_the_Orontes_en.svg.png",
    "ephesus":           "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ephesus_Celsus_Library_Fa%C3%A7ade.jpg/1280px-Ephesus_Celsus_Library_Fa%C3%A7ade.jpg",
    "corinth":           "https://upload.wikimedia.org/wikipedia/commons/4/41/Ravel_1008.2.jpg",
    "athens":            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Monastiraki_Square_and_Acropolis_in_Athens_%2844149181684%29.jpg/1280px-Monastiraki_Square_and_Acropolis_in_Athens_%2844149181684%29.jpg",
    "rome":              "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg/1280px-Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg",
    "patmos":            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Chora-of-Patmos.JPG/1280px-Chora-of-Patmos.JPG",
}

path = "app/js/data/biblical-sites.js"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

replaced = 0
missing = []
for site_id, url in PHOTOS.items():
    # Match the heroPhoto: null line that follows this site's id:
    # block. The DOTALL flag lets `.` cross newlines.
    pattern = re.compile(
        r"(id:\s*'" + re.escape(site_id) + r"',.*?heroPhoto:\s*)null",
        re.DOTALL,
    )
    new_text, n = pattern.subn(r"\1'" + url + "'", text)
    if n == 1:
        text = new_text
        replaced += 1
    elif n == 0:
        missing.append(site_id)
    else:
        print(f"  WARNING: {site_id} matched {n} times", file=sys.stderr)

with open(path, "w", encoding="utf-8", newline="\n") as f:
    f.write(text)

print(f"Replaced {replaced}/{len(PHOTOS)} heroPhoto fields")
if missing:
    print(f"Missing: {missing}")
