"""
Phase 5.8 — inject verified Wikimedia hero photos into the 29 topic
cards across Bible & Faith Home, School, Finance, and Health.

For each card the script:
  1. Locates the card in app/index.html by its unique onclick handler.
  2. Pulls the existing gradient out of the original .topic-card-hero
     inline style (kept as a backdrop under the image so partial loads
     never show a blank rectangle).
  3. Replaces the old hero div (and the Faith-Home-only .topic-card-icon
     div) with a new .topic-card-hero-wrap holding:
       - an <img class="topic-card-hero" loading="lazy" src=...>
         when a verified URL exists, or no <img> when None (fallback)
       - a small .topic-card-badge with the topic emoji (only when a
         photo is present; the spec says fallback gradient = no emoji)

Re-runnable; idempotent. The new markup is detected and skipped if it
has already been applied.
"""

import re
import sys

# Verified URLs (from fetch_card_photos.py + fetch_card_photos_retry.py)
CARD_PHOTOS = {
    "bf-stories":         "https://upload.wikimedia.org/wikipedia/commons/3/3f/The_Wise_Men.jpg",
    "bf-clg":             None,
    "bf-flashcards":      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Flash_cards_for_language_learning.jpg/1280px-Flash_cards_for_language_learning.jpg",
    "bf-worship":         "https://upload.wikimedia.org/wikipedia/commons/4/49/RH_Worship_Team.jpg",
    "bf-biblehub":        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg/1280px-Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg",
    "bf-prayer":          "https://upload.wikimedia.org/wikipedia/commons/4/4b/John_William_Waterhouse_-_The_Missal.JPG",
    "bf-academy":         "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Church_and_Cloisters%2C_St_Stephen%27s_House_LV_2025.jpg/1280px-Church_and_Cloisters%2C_St_Stephen%27s_House_LV_2025.jpg",
    "bf-biblelands":      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/%D7%94%D7%9E%D7%A6%D7%95%D7%93%D7%94_%D7%91%D7%9C%D7%99%D7%9C%D7%94.jpg/1280px-%D7%94%D7%9E%D7%A6%D7%95%D7%93%D7%94_%D7%91%D7%9C%D7%99%D7%9C%D7%94.jpg",
    "bf-timeline":        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Edward_Weller%2C_The_Kingdoms_of_Judah_and_Israel_%28FL36012236_3897579%29_%28cropped%29.jpg/1280px-Edward_Weller%2C_The_Kingdoms_of_Judah_and_Israel_%28FL36012236_3897579%29_%28cropped%29.jpg",
    "bf-memorize":        None,
    "bf-journey":         "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Hiking_to_the_Ice_Lakes._San_Juan_National_Forest%2C_Colorado.jpg/1280px-Hiking_to_the_Ice_Lakes._San_Juan_National_Forest%2C_Colorado.jpg",
    "bf-devotional":      None,
    "school-classes":     "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Elementary_classroom_in_Alaska.jpg/1280px-Elementary_classroom_in_Alaska.jpg",
    "school-assignments": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Homework_-_vector_maths.jpg/1280px-Homework_-_vector_maths.jpg",
    "school-gpa":         "https://upload.wikimedia.org/wikipedia/commons/2/26/Line_of_young_people_at_a_commencement_ceremony.jpg",
    "school-study":       "https://upload.wikimedia.org/wikipedia/commons/3/34/Il_pomodoro.jpg",
    "school-prep":        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Four_Tulane_University_Students_Studying_January_2008.jpg/1280px-Four_Tulane_University_Students_Studying_January_2008.jpg",
    "finance-overview":   "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/USDnotesNew.png/1280px-USDnotesNew.png",
    "finance-bills":      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/US-BEP-Receipt_for_currency_%2823_July_1915%29.jpg/1280px-US-BEP-Receipt_for_currency_%2823_July_1915%29.jpg",
    "finance-tx":         "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Contactless_Payment_Card_opened_to_show_RF_antenna.jpg/1280px-Contactless_Payment_Card_opened_to_show_RF_antenna.jpg",
    "finance-savings":    "https://upload.wikimedia.org/wikipedia/commons/e/e2/Sparschwein_Haspa02.jpg",
    "finance-savgoals":   None,
    "finance-budget":     "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Casio_calculator_JS-20WK_in_201901_002.jpg/1280px-Casio_calculator_JS-20WK_in_201901_002.jpg",
    "finance-taxed":      None,
    "health-weight":      None,
    "health-food":        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Marketvegetables.jpg/1280px-Marketvegetables.jpg",
    "health-learn":       "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1280px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    "health-growth":      "https://upload.wikimedia.org/wikipedia/commons/0/03/Tape_Measure_25%27_Klein_Tools.jpg",
    "health-habits":      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Cycling_in_Amsterdam_%28893%29.jpg/1280px-Cycling_in_Amsterdam_%28893%29.jpg",
}

# (unique-onclick-substring, card-id, badge-emoji, title-for-alt)
CARDS = [
    ("bfTab('stories')",                       "bf-stories",         "📖", "Story Mode"),
    ("showSection('s-christian-living')",      "bf-clg",             "📚", "Christian Life Guide"),
    ("showSection('s-flashcards')",            "bf-flashcards",      "📇", "Bible Flashcards"),
    ("showSection('s-worship')",               "bf-worship",         "🎵", "Worship Playlist"),
    ("bfTab('bible')",                         "bf-biblehub",        "🕊️", "Bible Hub"),
    ("bfTab('prayer')",                        "bf-prayer",          "🙏", "Prayer"),
    ("bfTab('academy')",                       "bf-academy",         "🎓", "Academy"),
    ("bfTab('bibleworld')",                    "bf-biblelands",      "🗺️", "Bible Lands"),
    ("bfTab('timeline')",                      "bf-timeline",        "🕰️", "Timeline"),
    ("bfTab('memorize')",                      "bf-memorize",        "✨", "Memorize"),
    ("bfTab('journey')",                       "bf-journey",         "🌟", "Journey"),
    ("bfTab('devotional')",                    "bf-devotional",      "🕊️", "Devotional"),
    ("tgOpenTopic('s-school','classes')",      "school-classes",     "📖", "My Classes"),
    ("tgOpenTopic('s-school','assignments')",  "school-assignments", "📝", "Assignments"),
    ("tgOpenTopic('s-school','gpa')",          "school-gpa",         "🎓", "GPA"),
    ("tgOpenTopic('s-school','study')",        "school-study",       "⏱", "Study Timer"),
    ("tgOpenTopic('s-school','prep')",         "school-prep",        "🎯", "Study Prep"),
    ("tgOpenTopic('s-finance','overview')",    "finance-overview",   "📊", "Overview"),
    ("tgOpenTopic('s-finance','bills')",       "finance-bills",      "🧾", "Bills"),
    ("tgOpenTopic('s-finance','tx')",          "finance-tx",         "💳", "Transactions"),
    ("tgOpenTopic('s-finance','savings')",     "finance-savings",    "💚", "Goal Savings"),
    ("tgOpenTopic('s-finance','savgoals')",    "finance-savgoals",   "🎯", "Sav. Goals"),
    ("tgOpenTopic('s-finance','budget')",      "finance-budget",     "📋", "Budget"),
    ("tgOpenTopic('s-finance','taxed')",       "finance-taxed",      "🧾", "Tax Ed"),
    ("tgOpenTopic('s-health','weight')",       "health-weight",      "⚖️", "Weight"),
    ("tgOpenTopic('s-health','food')",         "health-food",        "🍽", "Nutrition"),
    ("tgOpenTopic('s-health','nutEd')",        "health-learn",       "📚", "Learn"),
    ("tgOpenTopic('s-health','growth')",       "health-growth",      "📏", "Growth"),
    ("tgOpenTopic('s-health','habits')",       "health-habits",      "✅", "Habits"),
]

# Match the card block: <div class="topic-card ..." onclick="...">...</div>
# Each card runs through the title div and closing div. Non-greedy so it
# stops at the FIRST </div> that closes the card (last of 4-5 children).
# Faith-Home cards have 4 children (.topic-card-hero / .topic-card-icon /
# .topic-card-title / .topic-card-desc), others have 3.

HERO_DIV_RE = re.compile(
    r'<div class="topic-card-hero"\s+style="(?P<style>[^"]+)"[^>]*>(?P<emoji>[^<]*?)</div>'
)
ICON_DIV_RE = re.compile(
    r'\s*<div class="topic-card-icon">[^<]*?</div>'
)


def _extract_gradient(style):
    """Pull just the background:linear-gradient(...) piece for fallback."""
    m = re.search(r'background:\s*linear-gradient\([^)]*\)', style)
    return m.group(0) if m else "background:linear-gradient(135deg,rgba(56,189,248,.18),rgba(167,139,250,.12))"


def _build_replacement(card_id, badge_emoji, alt, original_style):
    """Build the new hero wrap markup. Per the user's "uniform & realistic,
    less emojis" polish pass, NO emoji badge is added even when a photo
    is present — the alt text + title carry the identity."""
    grad = _extract_gradient(original_style)
    url = CARD_PHOTOS.get(card_id)
    if url:
        return (
            f'<div class="topic-card-hero-wrap" style="{grad};">'
            f'<img class="topic-card-hero" loading="lazy" src="{url}" alt="{alt}">'
            f'</div>'
        )
    return (
        f'<div class="topic-card-hero-wrap topic-card-hero-fallback" style="{grad};"></div>'
    )


def replace_card(text, onclick_match, card_id, badge_emoji, alt):
    """Locate the card by its unique onclick and rewrite the hero block."""
    # Find the start of the card
    pat = re.compile(
        r'<div class="topic-card[^"]*"[^>]*onclick="' + re.escape(onclick_match) + r'"[^>]*>',
    )
    m = pat.search(text)
    if not m:
        print(f"  XX {card_id:22s} card not found (onclick={onclick_match!r})")
        return text, False
    card_start = m.start()
    # Hero div is the first child — find it within the next 800 chars max
    snippet_end = min(len(text), card_start + 1200)
    snippet = text[card_start:snippet_end]
    h = HERO_DIV_RE.search(snippet)
    if not h:
        # Already converted? Check for hero-wrap
        if "topic-card-hero-wrap" in snippet:
            print(f"  -- {card_id:22s} already converted")
            return text, False
        print(f"  XX {card_id:22s} hero div not found inside card")
        return text, False
    hero_start = card_start + h.start()
    hero_end   = card_start + h.end()
    # Faith-Home cards also have a .topic-card-icon div directly after
    icon = ICON_DIV_RE.match(text, hero_end)
    if icon:
        hero_end = icon.end()
    replacement = _build_replacement(card_id, badge_emoji, alt, h.group('style'))
    new_text = text[:hero_start] + replacement + text[hero_end:]
    print(f"  OK {card_id:22s} {'(photo)' if CARD_PHOTOS.get(card_id) else '(fallback)'}")
    return new_text, True


def main():
    path = "app/index.html"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    changed = 0
    for onclick_match, card_id, emoji, alt in CARDS:
        text, ok = replace_card(text, onclick_match, card_id, emoji, alt)
        if ok:
            changed += 1
    if changed == 0:
        print("\nNo cards changed.")
        return
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print(f"\n{changed}/{len(CARDS)} cards updated.")


if __name__ == "__main__":
    main()
