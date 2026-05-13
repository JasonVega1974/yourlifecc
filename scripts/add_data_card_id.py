"""
One-shot annotator — adds data-card-id="…" to every .topic-card-hero
<img> inside the 39 static cards in app/index.html, so the admin
override loader (loadCardPhotoOverrides() in app/js/ui.js) can find
each img by ID and swap its src.

For each card, locates its <div class="topic-card …" onclick="…"> by
its unique onclick handler, finds the first <img class="topic-card-hero
…"> in the next ~1200 chars, and inserts `data-card-id="<id>"` if not
already present. Idempotent. Skills cards (42) are JS-rendered — they
get their data-card-id from the buildSkillsGrid() template, not from
this script.
"""

import re

# Map from unique onclick handler substring → card_id (matches the
# admin photo manager's CARD_INVENTORY).
CARDS = [
    # Bible & Faith home (12)
    ("bfTab('stories')",                       "bf-stories"),
    ("showSection('s-christian-living')",      "bf-clg"),
    ("showSection('s-flashcards')",            "bf-flashcards"),
    ("showSection('s-worship')",               "bf-worship"),
    ("bfTab('bible')",                         "bf-biblehub"),
    ("bfTab('prayer')",                        "bf-prayer"),
    ("bfTab('academy')",                       "bf-academy"),
    ("bfTab('bibleworld')",                    "bf-biblelands"),
    ("bfTab('timeline')",                      "bf-timeline"),
    ("bfTab('memorize')",                      "bf-memorize"),
    ("bfTab('journey')",                       "bf-journey"),
    ("bfTab('devotional')",                    "bf-devotional"),
    # School (5)
    ("tgOpenTopic('s-school','classes')",      "school-classes"),
    ("tgOpenTopic('s-school','assignments')",  "school-assignments"),
    ("tgOpenTopic('s-school','gpa')",          "school-gpa"),
    ("tgOpenTopic('s-school','study')",        "school-study"),
    ("tgOpenTopic('s-school','prep')",         "school-prep"),
    # Finance (7)
    ("tgOpenTopic('s-finance','overview')",    "finance-overview"),
    ("tgOpenTopic('s-finance','bills')",       "finance-bills"),
    ("tgOpenTopic('s-finance','tx')",          "finance-tx"),
    ("tgOpenTopic('s-finance','savings')",     "finance-savings"),
    ("tgOpenTopic('s-finance','savgoals')",    "finance-savgoals"),
    ("tgOpenTopic('s-finance','budget')",      "finance-budget"),
    ("tgOpenTopic('s-finance','taxed')",       "finance-taxed"),
    # Health (5)
    ("tgOpenTopic('s-health','weight')",       "health-weight"),
    ("tgOpenTopic('s-health','food')",         "health-food"),
    ("tgOpenTopic('s-health','nutEd')",        "health-learn"),
    ("tgOpenTopic('s-health','growth')",       "health-growth"),
    ("tgOpenTopic('s-health','habits')",       "health-habits"),
    # Pass E — Driving (4)
    ("tgOpenTopic('s-driving','drLicense')",    "drv-license"),
    ("tgOpenTopic('s-driving','drSafety')",     "drv-safety"),
    ("tgOpenTopic('s-driving','drMaintenance')","drv-maintenance"),
    ("tgOpenTopic('s-driving','drCosts')",      "drv-costs"),
    # Pass E — Sports (2)
    ("tgOpenTopic('s-sports','explore')",      "spt-explore"),
    ("tgOpenTopic('s-sports','mine')",         "spt-mine"),
    # Pass E — Resume (4)
    ("tgOpenTopic('s-resume','resume')",       "rsm-builder"),
    ("tgOpenTopic('s-resume','tracker')",      "rsm-tracker"),
    ("tgOpenTopic('s-resume','prep')",         "rsm-prep"),
    ("tgOpenTopic('s-resume','practice')",     "rsm-practice"),
]

IMG_RE = re.compile(
    r'<img class="topic-card-hero"(?P<attrs>[^>]*)>'
)


def annotate(text, onclick_match, card_id):
    pat = re.compile(
        r'<div class="topic-card[^"]*"[^>]*onclick="' + re.escape(onclick_match) + r'"[^>]*>',
    )
    m = pat.search(text)
    if not m:
        print(f"  XX {card_id:22s} card not found")
        return text, False
    card_start = m.start()
    snippet_end = min(len(text), card_start + 1400)
    snippet = text[card_start:snippet_end]
    img = IMG_RE.search(snippet)
    if not img:
        print(f"  -- {card_id:22s} no hero img (fallback or already missing)")
        return text, False
    attrs = img.group('attrs')
    if 'data-card-id=' in attrs:
        print(f"  -- {card_id:22s} already annotated")
        return text, False
    # Insert data-card-id right after the class attribute
    new_attrs = ' data-card-id="' + card_id + '"' + attrs
    img_start = card_start + img.start()
    img_end   = card_start + img.end()
    replacement = '<img class="topic-card-hero"' + new_attrs + '>'
    new_text = text[:img_start] + replacement + text[img_end:]
    print(f"  OK {card_id:22s} annotated")
    return new_text, True


def main():
    path = "app/index.html"
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    changed = 0
    for onclick, card_id in CARDS:
        text, ok = annotate(text, onclick, card_id)
        if ok:
            changed += 1
    if changed:
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(text)
    print(f"\n{changed}/{len(CARDS)} cards annotated.")


if __name__ == "__main__":
    main()
