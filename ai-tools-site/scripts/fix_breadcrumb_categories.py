from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
REVIEWS = BASE / 'reviews'

mapping = {
    'AI Marketing': 'AI Pazarlama',
    'AI Music': 'AI Müzik',
    'AI Productivity': 'AI Üretkenlik',
    'AI Voice': 'AI Ses',
    'AI SEO': 'AI SEO',
    'AI Writing': 'AI Yazma',
    'AI Image': 'AI Görsel',
    'AI Video': 'AI Video',
    'AI Coding': 'AI Kodlama',
}

files = list(REVIEWS.glob('*.html'))
for fp in files:
    text = fp.read_text(encoding='utf-8')
    new = text
    for en, tr in mapping.items():
        new = new.replace(f'"name": "{en}"', f'"name": "{tr}"')
        new = new.replace(f'>{en}<', f'>{tr}<')
    if new != text:
        fp.write_text(new, encoding='utf-8')
        print('Updated', fp.name)
print('Done')
