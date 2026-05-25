import re
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
REVIEWS_DIR = BASE / 'reviews'
BACKUP_DIR = BASE / 'reviews_backup'

category_map = {
    'AI Writing': 'AI Yazma',
    'AI Image': 'AI Görsel',
    'AI Video': 'AI Video',
    'AI Coding': 'AI Kodlama',
    'Home': 'Ana Sayfa'
}

js_desc_re = re.compile(r'("description"\s*:\s*")(.*?)(")', re.DOTALL)
js_name_re = re.compile(r'"@type"\s*:\s*"SoftwareApplication"[\s\S]*?"name"\s*:\s*"([^"]+)"')
breadcrumb_re = re.compile(r'"itemListElement"\s*:\s*\[([\s\S]*?)\]', re.DOTALL)
meta_desc_re = re.compile(r'<meta\s+name="description"\s+content="([^"]+)"', re.IGNORECASE)

def infer_tool_type_from_breadcrumb(breadcrumb_block):
    if 'writing' in breadcrumb_block.lower() or 'AI Writing' in breadcrumb_block or 'AI Yazma' in breadcrumb_block:
        return 'yazma ve içerik oluşturma'
    if 'image' in breadcrumb_block.lower() or 'AI Image' in breadcrumb_block or 'AI Görsel' in breadcrumb_block:
        return 'görsel oluşturma'
    if 'video' in breadcrumb_block.lower() or 'AI Video' in breadcrumb_block or 'AI Video' in breadcrumb_block:
        return 'video oluşturma ve düzenleme'
    if 'coding' in breadcrumb_block.lower() or 'AI Coding' in breadcrumb_block or 'AI Kodlama' in breadcrumb_block:
        return 'kod yazma ve geliştirme'
    return 'AI aracı'


def short_blurb_for_type(tool_type):
    if 'yazma' in tool_type:
        return 'İçerik oluşturma, düzenleme ve pazarlama iş akışlarını hızlandıran güçlü bir araç.'
    if 'görsel' in tool_type:
        return 'Yüksek kaliteli görsel üretimi ve düzenleme için kullanılan bir platform.'
    if 'video' in tool_type:
        return 'Kısa ve uzun videolar için üretim ve düzenleme çözümleri sunan bir araç.'
    if 'kod' in tool_type:
        return 'Kod tamamlama, hata ayıklama ve geliştirici üretkenliğini artıran bir asistan.'
    return 'Genel amaçlı, yapay zeka destekli bir araç.'


def english_blurb_for_type(tool_type):
    if 'yazma' in tool_type:
        return 'A powerful tool that speeds up content creation, editing, and marketing workflows.'
    if 'görsel' in tool_type:
        return 'A platform for high-quality image generation and editing.'
    if 'video' in tool_type:
        return 'A tool offering production and editing solutions for short and long-form videos.'
    if 'kod' in tool_type:
        return 'An assistant that improves developer productivity with code completion and debugging.'
    return 'A general-purpose AI tool.'


files = list(BACKUP_DIR.glob('*.html'))
print(f'Found {len(files)} backup files in', BACKUP_DIR)

for bfp in files:
    name = bfp.name
    main_fp = REVIEWS_DIR / name
    if not main_fp.exists():
        print(f'Main file missing, skipping {name}')
        continue
    btext = bfp.read_text(encoding='utf-8')
    m_meta = meta_desc_re.search(btext)
    english_meta = m_meta.group(1) if m_meta else None
    m_js = js_desc_re.search(btext)
    english_jsonld = m_js.group(2) if m_js else None
    english_source = english_meta or english_jsonld
    # fallback to a generic english blurb if none found
    m_name = js_name_re.search(btext)
    tool_name = m_name.group(1) if m_name else bfp.stem.replace('-', ' ').title()
    m_bcb = breadcrumb_re.search(btext)
    breadcrumb_block = m_bcb.group(1) if m_bcb else ''
    tool_type = infer_tool_type_from_breadcrumb(breadcrumb_block)

    if not english_source:
        english_source = f"{tool_name} Review 2026 - " + english_blurb_for_type(tool_type)

    # Build refined Turkish and English texts
    short_turk = short_blurb_for_type(tool_type)
    turkish_full = f"{tool_name} — {short_turk} Artıları, eksileri, fiyatlandırma ve özellikleriyle kapsamlı inceleme."
    english_full = english_source.strip()

    # Read main file and apply updates
    mtext = main_fp.read_text(encoding='utf-8')
    new_text = mtext

    # Update JSON-LD description (replace first occurrence)
    def repl_jsonld(match):
        return match.group(1) + turkish_full.replace('"', '\\"') + match.group(3)
    new_text, jsonld_count = js_desc_re.subn(repl_jsonld, new_text, count=1)

    # Update meta/og/twitter descriptions to Turkish
    new_text, mcount1 = re.subn(r'(<meta\s+name="description"\s+content=")([^"]+)("\s*/?>)', r"\1" + turkish_full + r"\3", new_text, count=1, flags=re.IGNORECASE)
    new_text, mcount2 = re.subn(r'(<meta\s+property="og:description"\s+content=")([^"]+)("\s*/?>)', r"\1" + turkish_full + r"\3", new_text, count=1, flags=re.IGNORECASE)
    new_text, mcount3 = re.subn(r'(<meta\s+name="twitter:description"\s+content=")([^"]+)("\s*/?>)', r"\1" + turkish_full + r"\3", new_text, count=1, flags=re.IGNORECASE)

    # Ensure English meta copies exist or update them
    # remove existing :en metas if any
    new_text = re.sub(r'<meta\s+name="description:en"\s+content="[^"]*"\s*/?>', '', new_text)
    new_text = re.sub(r'<meta\s+property="og:description:en"\s+content="[^"]*"\s*/?>', '', new_text)
    new_text = re.sub(r'<meta\s+name="twitter:description:en"\s+content="[^"]*"\s*/?>', '', new_text)

    # Insert english metas near canonical link or end of head
    insert_point = None
    m_canonical = re.search(r'<link\s+rel="canonical"[^>]*>', new_text)
    if m_canonical:
        insert_point = m_canonical.end()
    else:
        m_head_end = re.search(r'</head>', new_text, flags=re.IGNORECASE)
        insert_point = m_head_end.start() if m_head_end else None

    en_meta_block = (
        f"\n  <!-- English descriptions preserved for language toggle -->\n"
        f"  <meta name=\"description:en\" content=\"{english_full}\">\n"
        f"  <meta property=\"og:description:en\" content=\"{english_full}\">\n"
        f"  <meta name=\"twitter:description:en\" content=\"{english_full}\">\n"
        f"  <!-- EN_JSON_LD: {english_full} -->\n"
    )

    if insert_point:
        new_text = new_text[:insert_point] + en_meta_block + new_text[insert_point:]
    else:
        new_text = en_meta_block + new_text

    # Breadcrumb names: replace Home and category names, and 'X Review' -> 'X İncelemesi'
    for en, tr in category_map.items():
        new_text = new_text.replace(f'"name": "{en}"', f'"name": "{tr}"')
    # replace any literal breadcrumb text in HTML
    new_text = new_text.replace('>Home<', '>Ana Sayfa<')
    new_text = new_text.replace('>ChatGPT Review<', '>ChatGPT İncelemesi<')
    new_text = re.sub(r'"name"\s*:\s*"([^"]+?)\sReview"', lambda m: '"name": "' + m.group(1) + ' İncelemesi"', new_text)

    # Remove existing review-comments blocks
    new_text, removed = re.subn(r'<div class="review-comments">[\s\S]*?<\/div>\s*', '', new_text, count=10)

    # Write back
    if new_text != mtext:
        main_fp.write_text(new_text, encoding='utf-8')
        print(f'Patched {name}: jsonld={jsonld_count}, metas_updated={mcount1+mcount2+mcount3}, en_metas_inserted, comments_removed={removed}')
    else:
        print(f'No change for {name}')

print('Done')
