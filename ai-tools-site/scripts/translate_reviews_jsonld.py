import re
from pathlib import Path

REVIEWS_DIR = Path(__file__).resolve().parents[1] / 'reviews'

category_map = {
    'AI Writing': 'AI Yazma',
    'AI Image': 'AI Görsel',
    'AI Video': 'AI Video',
    'AI Coding': 'AI Kodlama',
    'Home': 'Ana Sayfa'
}

js_desc_re = re.compile(r'("description"\s*:\s*")(.*?)(")', re.DOTALL)
name_home_re = re.compile(r'("name"\s*:\s*")(?P<name>Home|AI Writing|AI Image|AI Video|AI Coding)(")')
name_review_re = re.compile(r'("name"\s*:\s*")(?P<tool>[^\"]+?)\sReview(")')
breadcrumb_category_re = re.compile(r'"itemListElement"\s*:\s*\[([\s\S]*?)\]', re.DOTALL)

def infer_tool_type_from_breadcrumb(breadcrumb_block):
    # look for known category names (in Turkish after previous step)
    if 'AI Yazma' in breadcrumb_block:
        return 'yazma ve içerik oluşturma'
    if 'AI Görsel' in breadcrumb_block:
        return 'görsel oluşturma'
    if 'AI Video' in breadcrumb_block:
        return 'video oluşturma ve düzenleme'
    if 'AI Kodlama' in breadcrumb_block:
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

files = list(REVIEWS_DIR.glob('*.html'))
print(f'Found {len(files)} files in', REVIEWS_DIR)

for fp in files:
    text = fp.read_text(encoding='utf-8')
    # Extract meta description
    m = re.search(r'<meta\s+name="description"\s+content="([^"]+)"', text)
    meta_desc = m.group(1) if m else None
    new_text = text
    # try to infer a better Turkish description using breadcrumb/category
    m_bcb = breadcrumb_category_re.search(text)
    breadcrumb_block = m_bcb.group(1) if m_bcb else ''
    tool_type = infer_tool_type_from_breadcrumb(breadcrumb_block)
    # find tool name from JSON-LD name field
    m_name = re.search(r'"@type"\s*:\s*"SoftwareApplication"[\s\S]*?"name"\s*:\s*"([^"]+)"', text)
    tool_name = m_name.group(1) if m_name else fp.stem.replace('-', ' ').title()
    turkish_description = f"{tool_name} İncelemesi 2026 - {tool_type} için yapay zeka aracı. Artıları, eksileri, fiyatlandırması ve özellikleriyle kapsamlı değerlendirme."
    # Replace JSON-LD description occurrences with crafted Turkish description
    def replace_desc(match):
        return match.group(1) + turkish_description.replace('"', '\\"') + match.group(3)
    new_text, jsonld_count = js_desc_re.subn(replace_desc, new_text)
    # Replace meta description, og:description and twitter:description
    new_text, meta_count = re.subn(r'(<meta\s+name="description"\s+content=")([^"]+)("\s*/?>)', r"\1" + turkish_description + r"\3", new_text)
    new_text, og_count = re.subn(r'(<meta\s+property="og:description"\s+content=")([^"]+)("\s*/?>)', r"\1" + turkish_description + r"\3", new_text)
    new_text, tw_count = re.subn(r'(<meta\s+name="twitter:description"\s+content=")([^"]+)("\s*/?>)', r"\1" + turkish_description + r"\3", new_text)
    # Replace breadcrumb/category names
    def repl_name(m):
        old = m.group('name')
        return m.group(0).replace(old, category_map.get(old, old))
    new_text, name_count = name_home_re.subn(repl_name, new_text)
    # Replace any 'X Review' breadcrumb names with 'X İncelemesi'
    def repl_review(m):
        tool = m.group('tool')
        return m.group(1) + tool + ' İncelemesi' + m.group(3)
    new_text, review_count = name_review_re.subn(repl_review, new_text)

    # Remove duplicate comment form block if present
    new_text, comments_removed = re.subn(r'<div class="review-comments">[\s\S]*?<\/div>\s*', '', new_text, count=1)

    # Construct refined Turkish and English short descriptions
    short_turk = short_blurb_for_type(tool_type)
    turkish_full = f"{tool_name} — {short_turk} Artıları, eksileri, fiyatlandırma ve özellikleriyle kapsamlı inceleme."
    short_eng = english_blurb_for_type(tool_type)
    english_full = f"{tool_name} Review 2026 - {short_eng} Read our in-depth review with pros, cons, pricing, and features."

    # Update meta/og/twitter to refined Turkish
    new_text, m1 = re.subn(r'(<meta\s+name="description"\s+content=")([^"]+)("\s*/?>)', r"\1" + turkish_full + r"\3", new_text)
    new_text, m2 = re.subn(r'(<meta\s+property="og:description"\s+content=")([^"]+)("\s*/?>)', r"\1" + turkish_full + r"\3", new_text)
    new_text, m3 = re.subn(r'(<meta\s+name="twitter:description"\s+content=")([^"]+)("\s*/?>)', r"\1" + turkish_full + r"\3", new_text)

    # Add English meta tags (preserve English for language toggle)
    if 'description:en' not in new_text:
        insert_after = re.search(r'(</script>\s*<link rel="alternate"[^>]+>)', new_text)
        insert_pos = insert_after.end() if insert_after else None
        en_meta = f'\n  <!-- English descriptions preserved for language toggle -->\n  <meta name="description:en" content="{english_full}">\n  <meta property="og:description:en" content="{english_full}">\n  <meta name="twitter:description:en" content="{english_full}">\n  <!-- EN_JSON_LD: {english_full} -->\n'
        if insert_pos:
            new_text = new_text[:insert_pos] + en_meta + new_text[insert_pos:]
        else:
            new_text = en_meta + new_text

    if new_text != text:
        fp.write_text(new_text, encoding='utf-8')
        print(f'Updated {fp.name}: jsonld_desc_replacements={jsonld_count}, meta_replacements={meta_count+og_count+tw_count}, name_replacements={name_count}, review_replacements={review_count}')
    else:
        print(f'No changes for {fp.name}')
