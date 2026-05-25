/* ============================================
   i18n Translation System
   ============================================ */
var i18n = (function() {

  var translations = {
    en: {
      'nav.home': 'Home',
      'nav.categories': 'Categories',
      'nav.top-tools': 'Top Tools',
      'nav.blog': 'Blog',
      'nav.about': 'About',
      'nav.badges': 'Badges',
      'nav.quiz': 'Quiz',
      'nav.subscribe': 'Subscribe',
      'nav.comparisons': 'Comparisons',
      'nav.contact': 'Contact',
      'nav.privacy': 'Privacy Policy',
      'nav.terms': 'Terms of Service',
      'nav.affiliate': 'Affiliate Disclosure',
      'hero.title': 'Find the Best AI Tools for Your Business',
      'hero.subtitle': 'We research, review, and compare the top AI tools so you can make informed decisions and maximize your productivity.',
      'hero.cta1': 'Explore Top Tools',
      'hero.cta2': 'Read Our Blog',
      'search.placeholder': 'Search AI tools (e.g., writing, image generation, coding...)',
      'footer.description': 'Helping you discover the right AI tools through honest, independent reviews.',
      'footer.categories': 'Categories',
      'footer.resources': 'Resources',
      'footer.legal': 'Legal',
      'footer.copyright': '© 2026 AI Tools Directory. All rights reserved.',
      'footer.disclosure': 'Affiliate Disclosure: We may earn commissions from links on this site.',
      'btn.read-review': 'Read Review',
      'btn.try-free': 'Try Free',
      'section.featured': 'Top AI Tools in 2026',
      'section.featured-desc': 'Hand-picked and thoroughly assessed by our team',
      'section.categories': 'Browse by Category',
      'section.categories-desc': 'Find the perfect AI tool for your specific workflow',
      'section.trust': 'Why Trust Our Reviews?',
      'section.trust-desc': 'We don\'t just list tools — we evaluate them thoroughly',
      'section.newsletter': 'Stay Updated on AI Tools',
      'section.newsletter-desc': 'Get the latest AI tool recommendations delivered to your inbox.',
      'badge.new': 'New!',
      'quiz.title': 'Find Your Perfect AI Tool',
      'quiz.desc': 'Answer a few questions and we\'ll recommend the best tools for you.',
      'quiz.start': 'Start Quiz',
      'quiz.restart': 'Take Again',
      'quiz.result': 'Your Recommended Tools',
      'lang.en': 'EN',
      'lang.tr': 'TR',
      'recommendations.title': 'You Might Also Like',

      'skip-link': 'Skip to main content',

      'cat.writing': 'AI Writing',
      'cat.image': 'AI Image',
      'cat.coding': 'AI Coding',
      'cat.video': 'AI Video',
      'cat.seo': 'AI SEO',
      'cat.marketing': 'AI Marketing',
      'cat.voice': 'AI Voice',
      'cat.productivity': 'AI Productivity',
      'cat.music': 'AI Music',
      'cat.count': '6 tools',

      'footer.disclaimer-title': 'Satış Ortaklığı Bildirimi:',
      'footer.disclaimer-text': 'Sitemizdeki bağlantılar üzerinden satın alma yaparsanız komisyon kazanabiliriz.',

      'categories.writing': 'AI Writing',
      'categories.image': 'AI Image',
      'categories.coding': 'AI Coding',
      'categories.video': 'AI Video',
      'categories.seo': 'AI SEO',
      'categories.marketing': 'AI Marketing',
      'categories.voice': 'AI Voice',
      'categories.productivity': 'AI Productivity',
      'categories.music': 'AI Music',

      'trust.hands-on-title': 'Hands-On Testing',
      'trust.hands-on-desc': 'Every tool thoroughly researched before review',
      'trust.unbiased-title': 'Unbiased Reviews',
      'trust.unbiased-desc': 'Honest pros and cons with no paid positive reviews',
      'trust.updates-title': 'Regular Updates',
      'trust.updates-desc': 'All reviews updated regularly to reflect the latest features',
      'trust.team-title': 'Independent Team',
      'trust.team-desc': 'Independent reviewers and technology enthusiasts',

    },
    tr: {
      'nav.home': 'Ana Sayfa',
      'nav.categories': 'Kategoriler',
      'nav.top-tools': 'En İyi Araçlar',
      'nav.blog': 'Blog',
      'nav.about': 'Hakkında',
      'nav.badges': 'Rozetler',
      'nav.quiz': 'Test',
      'nav.subscribe': 'Abone Ol',
      'nav.comparisons': 'Karşılaştırmalar',
      'nav.contact': 'İletişim',
      'nav.privacy': 'Gizlilik Politikası',
      'nav.terms': 'Kullanım Şartları',
      'nav.affiliate': 'Satış Ortaklığı Bildirimi',
      'hero.title': 'İşletmeniz İçin En İyi AI Araçlarını Bulun',
      'hero.subtitle': 'En iyi AI araçlarını araştırıyor, inceliyor ve karşılaştırıyoruz, böylece bilinçli kararlar alabilir ve üretkenliğinizi en üst düzeye çıkarabilirsiniz.',
      'hero.cta1': 'En İyi Araçları Keşfedin',
      'hero.cta2': 'Blogumuzu Okuyun',
      'search.placeholder': 'AI araçlarını arayın (ör. yazma, görsel oluşturma, kodlama...)',
      'footer.description': 'Dürüst, bağımsız incelemelerle doğru AI araçlarını keşfetmenize yardımcı oluyoruz.',
      'footer.categories': 'Kategoriler',
      'footer.resources': 'Kaynaklar',
      'footer.legal': 'Yasal',
      'footer.copyright': '© 2026 AI Tools Directory. Tüm hakları saklıdır.',
      'footer.disclosure': 'Satış Ortaklığı Bildirimi: Bu sitedeki bağlantılardan komisyon kazanabiliriz.',
      'btn.read-review': 'İncelemeyi Oku',
      'btn.try-free': 'Ücretsiz Dene',
      'section.featured': '2026\'nın En İyi AI Araçları',
      'section.featured-desc': 'Ekibimiz tarafından özenle seçilmiş ve değerlendirilmiştir',
      'section.categories': 'Kategorilere Göz Atın',
      'section.categories-desc': 'İş akışınıza uygun mükemmel AI aracını bulun',
      'section.trust': 'İncelemelerimize Neden Güvenmelisiniz?',
      'section.trust-desc': 'Araçları sadece listelemiyoruz — onları kapsamlı şekilde değerlendiriyoruz',
      'section.newsletter': 'AI Araçlarından Haberdar Olun',
      'section.newsletter-desc': 'En yeni AI araç önerileri gelen kutunuza gelsin.',
      'badge.new': 'Yeni!',
      'quiz.title': 'Mükemmel AI Aracınızı Bulun',
      'quiz.desc': 'Birkaç soruyu yanıtlayın, size en uygun araçları önerelim.',
      'quiz.start': 'Testi Başlat',
      'quiz.restart': 'Tekrar Dene',
      'quiz.result': 'Önerilen Araçlarınız',
      'lang.en': 'EN',
      'lang.tr': 'TR',
      'recommendations.title': 'Bunları da Beğenebilirsiniz',

      'skip-link': 'Ana içeriğe geç',

      'cat.writing': 'AI Yazma',
      'cat.image': 'AI Görsel',
      'cat.coding': 'AI Kodlama',
      'cat.video': 'AI Video',
      'cat.seo': 'AI SEO',
      'cat.marketing': 'AI Pazarlama',
      'cat.voice': 'AI Ses',
      'cat.productivity': 'AI Üretkenlik',
      'cat.music': 'AI Müzik',
      'categories.writing': 'AI Yazma',
      'categories.image': 'AI Görsel',
      'categories.coding': 'AI Kodlama',
      'categories.video': 'AI Video',
      'categories.seo': 'AI SEO',
      'categories.marketing': 'AI Pazarlama',
      'categories.voice': 'AI Ses',
      'categories.productivity': 'AI Üretkenlik',
      'categories.music': 'AI Müzik',
      'cat.count': '6 araç',

      'trust.hands-on-title': 'Kapsamlı İnceleme',
      'trust.hands-on-desc': 'Her aracı yayınlamadan önce detaylı araştırma ve test sürecinden geçiriyoruz',
      'trust.unbiased-title': 'Tarafsız Değerlendirme',
      'trust.unbiased-desc': 'Artıları ve eksileri dürüstçe sunuyoruz, olumlu yorumlar için ücret alınmaz',
      'trust.updates-title': 'Düzenli Güncelleme',
      'trust.updates-desc': 'Tüm incelemeler en son özellikleri yansıtacak şekilde düzenli olarak güncellenir',
      'trust.team-title': 'Bağımsız Ekip',
      'trust.team-desc': 'Bağımsız değerlendiriciler ve teknoloji meraklılarından oluşan bir ekip',
      'badges.first-review': 'First Review Read',
      'badges.first-review-desc': 'Read your first AI tool review',
      'badges.five-reviews': 'Review Explorer',
      'badges.five-reviews-desc': 'Read 5 AI tool reviews',
      'badges.first-comparison': 'Comparison Shopper',
      'badges.first-comparison-desc': 'Viewed your first comparison'
    }
  };

  var lang = 'tr';

  function detectLanguage() {
    try {
      var stored = localStorage.getItem('i18n_lang');
      if (stored === 'en' || stored === 'tr') return stored;
    } catch(e) {}
    var browserLang = (navigator.language || '').substring(0, 2);
    return (browserLang === 'tr') ? 'tr' : 'en';
  }

  function setLanguage(code) {
    if (!translations[code]) return;
    lang = code;
    try { localStorage.setItem('i18n_lang', code); } catch(e) {}
    applyTranslations();
    if (window.__store) window.__store.lang = code;
  }

  function getLanguage() {
    return lang;
  }

  function t(key) {
    return translations[lang] && translations[lang][key] !== undefined
      ? translations[lang][key]
      : (translations['en'][key] || key);
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var translated = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', translated);
      } else {
        el.textContent = translated;
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });

    document.documentElement.lang = lang;

    var switcher = document.querySelector('.lang-switcher');
    if (switcher) {
      switcher.querySelectorAll('button').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });
    }
  }

  // Initialize
  lang = detectLanguage();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      applyTranslations();
      initLangSwitcher();
    });
  } else {
    applyTranslations();
    initLangSwitcher();
  }

  function initLangSwitcher() {
    document.querySelector('.lang-switcher')?.addEventListener('click', function(e) {
      var btn = e.target.closest('button[data-lang]');
      if (btn) setLanguage(btn.getAttribute('data-lang'));
    });
  }

  // Listen for store language changes
  if (window.__store) {
    window.__store.subscribe('lang', function(val) {
      if (val !== lang) setLanguage(val);
    });
  }

  return {
    t: t,
    setLanguage: setLanguage,
    getLanguage: getLanguage,
    applyTranslations: applyTranslations,
    translations: translations
  };
})();
