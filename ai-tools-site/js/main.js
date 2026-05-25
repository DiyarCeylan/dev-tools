'use strict';

// Re-apply dark mode on bfcache restore (DOMContentLoaded doesn't fire)
window.addEventListener('pageshow', function(e) {
  if (e.persisted) {
    var t = (location.search.match(/[?&]theme=([^&]*)/)||[])[1];
    if (!t) { try { var n = window.name.match(/theme=(\w+)/); if (n) t = n[1]; } catch(ex) {} }
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else if (t === 'light') document.documentElement.removeAttribute('data-theme');
  }
});

document.addEventListener('DOMContentLoaded', function() {

  // PWA Manifest
  var manifestLink = document.createElement('link');
  manifestLink.rel = 'manifest';
  manifestLink.href = '/manifest.json';
  document.head.appendChild(manifestLink);

  // Theme Color Meta
  var themeMeta = document.createElement('meta');
  themeMeta.name = 'theme-color';
  themeMeta.content = '#0F172A';
  document.head.appendChild(themeMeta);

  // RSS Feed Link
  var rssLink = document.createElement('link');
  rssLink.rel = 'alternate';
  rssLink.type = 'application/rss+xml';
  rssLink.title = 'AI Tools Directory - Blog';
  rssLink.href = '/feed.xml';
  document.head.appendChild(rssLink);

  // Mobile Navigation Toggle
  var mobileToggle = document.querySelector('.mobile-toggle');
  var nav = document.querySelector('.nav');

  if (mobileToggle && nav) {
    mobileToggle.setAttribute('aria-controls', 'nav');
    nav.id = 'nav';

    function updateToggle() {
      var isActive = nav.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      mobileToggle.innerHTML = isActive
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    }

    mobileToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      updateToggle();
    });

    mobileToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        nav.classList.toggle('active');
        updateToggle();
      }
    });

    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
        nav.classList.remove('active');
        updateToggle();
      }
    });
  }

  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Scroll to Top Button
  (function() {
    var btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.setAttribute('aria-label', 'Scroll to top');

    var arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('class', 'scroll-top-arrow');
    arrowSvg.setAttribute('width', '18');
    arrowSvg.setAttribute('height', '18');
    arrowSvg.setAttribute('viewBox', '0 0 24 24');
    arrowSvg.setAttribute('fill', 'none');
    arrowSvg.setAttribute('stroke', 'currentColor');
    arrowSvg.setAttribute('stroke-width', '2.5');
    arrowSvg.setAttribute('stroke-linecap', 'round');
    var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', '18 15 12 9 6 15');
    arrowSvg.appendChild(polyline);
    btn.appendChild(arrowSvg);

    var ringSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ringSvg.setAttribute('class', 'scroll-top-ring');
    ringSvg.setAttribute('width', '44');
    ringSvg.setAttribute('height', '44');
    ringSvg.setAttribute('viewBox', '0 0 44 44');
    var fillCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fillCircle.setAttribute('class', 'scroll-top-ring-fill');
    fillCircle.setAttribute('cx', '22'); fillCircle.setAttribute('cy', '22');
    fillCircle.setAttribute('r', '18'); fillCircle.setAttribute('fill', 'none');
    fillCircle.setAttribute('stroke', 'var(--accent)'); fillCircle.setAttribute('stroke-width', '2');
    fillCircle.setAttribute('stroke-linecap', 'round');
    fillCircle.setAttribute('stroke-dasharray', '113.1');
    fillCircle.setAttribute('stroke-dashoffset', '113.1');
    var transform = document.createAttribute('transform');
    transform.value = 'rotate(-90 22 22)';
    fillCircle.setAttributeNode(transform);
    ringSvg.appendChild(fillCircle);
    btn.appendChild(ringSvg);

    document.body.appendChild(btn);

    var scrollTimeout;
    var ringCircumference = 113.1;

    window.addEventListener('scroll', function() {
      cancelAnimationFrame(scrollTimeout);
      scrollTimeout = requestAnimationFrame(function() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        btn.classList.toggle('visible', scrollTop > 300);
        if (docHeight > 0) {
          var progress = scrollTop / docHeight;
          fillCircle.style.strokeDashoffset = ringCircumference * (1 - progress);
        }
      });
    });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // mobile-toggle aria-controls
  (function() {
    var toggle = document.querySelector('.mobile-toggle');
    var nav = document.querySelector('.nav');
    if (toggle && nav) {
      var navId = nav.id || (nav.id = 'nav-' + Date.now());
      toggle.setAttribute('aria-controls', navId);
    }
  })();

  // Dynamic BreadcrumbList JSON-LD (only if not already present in HTML)
  (function() {
    if (document.querySelector('script[type="application/ld+json"]') &&
        document.querySelector('script[type="application/ld+json"]').textContent.indexOf('BreadcrumbList') > -1) return;
    var path = window.location.pathname;
    var parts = path.replace(/\/$/,'').split('/').filter(Boolean);
    var itemListElement = [];
    itemListElement.push({
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://aitoolsdirectory.com/'
    });
    var acc = '';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].replace(/\.html$/, '').replace(/-/g, ' ');
      var name = p.charAt(0).toUpperCase() + p.slice(1);
      acc += '/' + parts[i];
      itemListElement.push({
        '@type': 'ListItem',
        'position': i + 2,
        'name': name,
        'item': 'https://aitoolsdirectory.com' + acc
      });
    }
    if (itemListElement.length > 1) {
      var script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': itemListElement
      });
      document.head.appendChild(script);
    }
  })();

  // Dynamic SoftwareApplication + Review JSON-LD (for review pages missing inline schema)
  (function() {
    if (window.location.pathname.indexOf('/reviews/') === -1) return;
    if (document.querySelector('script[type="application/ld+json"]') &&
        document.querySelector('script[type="application/ld+json"]').textContent.indexOf('SoftwareApplication') > -1) return;
    var name = document.title.replace(/\s*Review.*$| - AI Tools Directory.*$| \|.*$/gi, '').trim();
    var ratingEl = document.querySelector('.review-header .rating-value, .hero-rating .rating-value');
    var rating = ratingEl ? ratingEl.textContent.trim() : '4.5';
    var descEl = document.querySelector('meta[name="description"]');
    var desc = descEl ? descEl.getAttribute('content') : name + ' review and detailed analysis.';
    var slug = window.location.pathname.split('/').pop().replace('.html', '');
    var priceEl = document.querySelector('.pricing-card .price, .pricing-highlight .amount');
    var price = priceEl ? priceEl.textContent.trim().replace(/[^0-9.]/g, '') : '';
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    var schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': name,
      'description': desc,
      'url': 'https://aitoolsdirectory.com' + window.location.pathname,
      'applicationCategory': 'WebApplication',
      'operatingSystem': 'Web',
      'review': {
        '@type': 'Review',
        'reviewRating': { '@type': 'Rating', 'ratingValue': rating, 'bestRating': '5' },
        'author': { '@type': 'Organization', 'name': 'AI Tools Directory' },
        'datePublished': '2026-01-01'
      }
    };
    if (price) {
      schema.offers = { '@type': 'Offer', 'price': price, 'priceCurrency': 'USD', 'availability': 'https://schema.org/OnlineOnly' };
    }
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  })();

  // Web Share API
  (function() {
    var isReview = window.location.pathname.indexOf('/reviews/') > -1;
    var isBlog = window.location.pathname.indexOf('/blog/') > -1;
    if (!isReview && !isBlog) return;

    var shareBtn = document.createElement('button');
    shareBtn.className = 'share-web-btn';
    shareBtn.setAttribute('aria-label', 'Share this page');
    shareBtn.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>' +
      '<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>' +
      '</svg>';
    var header = document.querySelector('.review-header, .blog-post-header, .page-header');
    if (header) {
      header.appendChild(shareBtn);
    }

    shareBtn.addEventListener('click', function() {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: window.location.href
        }).catch(function() {});
      } else {
        navigator.clipboard.writeText(window.location.href).then(function() {
          shareBtn.classList.add('copied');
          setTimeout(function() { shareBtn.classList.remove('copied'); }, 2000);
        });
      }
    });
  })();

  // All Tools Database
  window.allTools = [
    {name:'ChatGPT',slug:'chatgpt',cat:'Writing',rating:4.7,badge:'Freemium',desc:'OpenAI\'nin sohbet AI asistanı. Yazma, beyin fırtınası, düzenleme ve içerik üretiminde başarılı.'},
    {name:'Jasper AI',slug:'jasper-ai',cat:'Writing',rating:4.8,badge:'Paid',desc:'Gelişmiş AI yazma asistanı. Güçlü şablonlar ve marka sesi özelleştirme ile kaliteli içerik oluşturun.'},
    {name:'Copy.ai',slug:'copy-ai',cat:'Writing',rating:4.5,badge:'Freemium',desc:'AI destekli metin yazma platformu. Saniyeler içinde pazarlama metni ve blog içeriği üretir.'},
    {name:'Grammarly',slug:'grammarly',cat:'Writing',rating:4.8,badge:'Freemium',desc:'Dil bilgisi, yazım, ton ve netlik kontrolü yapan AI destekli yazma asistanı.'},
    {name:'Writesonic',slug:'writesonic',cat:'Writing',rating:4.6,badge:'Freemium',desc:'SEO odaklı pazarlama metni, blog yazısı ve reklam içeriği üreten AI yazma asistanı.'},
    {name:'Rytr',slug:'rytr',cat:'Writing',rating:4.4,badge:'Freemium',desc:'Uygun fiyatlı AI yazma asistanı. 40+ şablon ve 30+ dil ile hızlı içerik oluşturma.'},
    {name:'Midjourney',slug:'midjourney',cat:'Image',rating:4.9,badge:'Paid',desc:'Metin komutlarından çarpıcı ve sanatsal görseller oluşturan AI görsel üretim aracı.'},
    {name:'DALL-E 3',slug:'dalle-3',cat:'Image',rating:4.6,badge:'Paid',desc:'OpenAI\'nin en yeni görsel oluşturma modeli. Doğal dilden detaylı görseller üretir.'},
    {name:'Stable Diffusion',slug:'stable-diffusion',cat:'Image',rating:4.4,badge:'Free',desc:'Yerel donanımda çalışan açık kaynak AI görsel oluşturma modeli.'},
    {name:'Canva AI',slug:'canva-ai',cat:'Image',rating:4.6,badge:'Freemium',desc:'Magic Write, arka plan kaldırma ve AI görsel oluşturma özellikli AI tasarım platformu.'},
    {name:'Adobe Firefly',slug:'adobe-firefly',cat:'Image',rating:4.5,badge:'Freemium',desc:'Adobe\'nin metinden görsele ve Creative Cloud entegrasyonlu AI görsel aracı.'},
    {name:'Leonardo AI',slug:'leonardo-ai',cat:'Image',rating:4.5,badge:'Freemium',desc:'Birden çok ince ayarlı model ve gerçek zamanlı düzenleme sunan AI görsel platformu.'},
    {name:'GitHub Copilot',slug:'github-copilot',cat:'Coding',rating:4.8,badge:'Paid',desc:'Kod yazarken otomatik tamamlama önerileri sunan AI eş programcı.'},
    {name:'Cursor',slug:'cursor',cat:'Coding',rating:4.7,badge:'Freemium',desc:'AI iş akışlarıyla kod yazma, düzenleme ve anlamayı hızlandıran AI doğal kod editörü.'},
    {name:'Codeium',slug:'codeium',cat:'Coding',rating:4.5,badge:'Free',desc:'70+ programlama dilini destekleyen ücretsiz AI kod tamamlama aracı.'},
    {name:'Replit',slug:'replit',cat:'Coding',rating:4.4,badge:'Freemium',desc:'Ghostwriter AI ile kod yazma, hata ayıklama ve dağıtım için tarayıcı tabanlı IDE.'},
    {name:'Amazon Q Developer',slug:'amazon-q',cat:'Coding',rating:4.3,badge:'Free',desc:'Amazon\'un gerçek zamanlı kod önerileri ve AWS entegrasyonlu ücretsiz AI kod asistanı.'},
    {name:'Tabnine',slug:'tabnine',cat:'Coding',rating:4.3,badge:'Freemium',desc:'Yerelde çalışan, gizlilik odaklı AI kod tamamlama aracı. Çoklu IDE desteği.'},
    {name:'Descript',slug:'descript',cat:'Video',rating:4.7,badge:'Freemium',desc:'AI transkripsiyon ve metin tabanlı düzenleme ile hepsi bir arada video/ses platformu.'},
    {name:'Runway ML',slug:'runway-ml',cat:'Video',rating:4.5,badge:'Freemium',desc:'Makine öğrenimi ile video oluşturma, düzenleme ve efektler için yaratıcı AI platformu.'},
    {name:'Synthesia',slug:'synthesia',cat:'Video',rating:4.4,badge:'Paid',desc:'AI avatarlarıyla metinden profesyonel videolar oluşturan AI video platformu.'},
    {name:'Pictory',slug:'pictory',cat:'Video',rating:4.4,badge:'Paid',desc:'Senaryoları ve makaleleri kısa videolara dönüştüren AI video platformu.'},
    {name:'InVideo',slug:'invideo',cat:'Video',rating:4.5,badge:'Freemium',desc:'5000+ şablon ve metinden videoya özellikleriyle AI destekli video platformu.'},
    {name:'Kapwing',slug:'kapwing',cat:'Video',rating:4.3,badge:'Freemium',desc:'AI altyazı, transkripsiyon ve yeniden kullanım özellikli işbirlikçi video editörü.'},
    {name:'Surfer SEO',slug:'surfer-seo',cat:'SEO',rating:4.7,badge:'Paid',desc:'Veri odaklı SEO ve yüksek sıralamalar için AI destekli içerik optimizasyon platformu.'},
    {name:'Frase.io',slug:'frase-io',cat:'SEO',rating:4.3,badge:'Paid',desc:'Kullanıcı sorularını yanıtlayan AI içerik araştırma ve optimizasyon platformu.'},
    {name:'MarketMuse',slug:'marketmuse',cat:'SEO',rating:4.5,badge:'Paid',desc:'ML ile içerik otoritesini analiz eden ve optimize eden AI içerik strateji platformu.'},
    {name:'Semrush',slug:'semrush',cat:'SEO',rating:4.7,badge:'Paid',desc:'Anahtar kelime araştırması, rakip analizi ve içerik optimizasyonu için SEO araç seti.'},
    {name:'Ahrefs',slug:'ahrefs',cat:'SEO',rating:4.8,badge:'Paid',desc:'Backlink analizi, anahtar kelime araştırması ve rakip takibi için lider SEO araç seti.'},
    {name:'Moz',slug:'moz',cat:'SEO',rating:4.4,badge:'Paid',desc:'Anahtar kelime araştırması, link kurma ve site denetimi araçları sunan SEO yazılım paketi.'},
    {name:'HubSpot',slug:'hubspot',cat:'Marketing',rating:4.6,badge:'Freemium',desc:'E-posta, müşteri adayı ve analitik için AI destekli lider CRM ve pazarlama platformu.'},
    {name:'ConvertKit',slug:'convertkit',cat:'Marketing',rating:4.5,badge:'Freemium',desc:'İçerik üreticileri için AI otomasyon özellikli e-posta pazarlama platformu.'},
    {name:'GetResponse',slug:'getresponse',cat:'Marketing',rating:4.4,badge:'Freemium',desc:'AI e-posta kampanyaları, açılış sayfaları ve webinarlar sunan pazarlama platformu.'},
    {name:'Mailchimp',slug:'mailchimp',cat:'Marketing',rating:4.3,badge:'Freemium',desc:'E-posta kampanyaları, otomasyon ve AI içerik araçlarıyla hepsi bir arada pazarlama platformu.'},
    {name:'ActiveCampaign',slug:'activecampaign',cat:'Marketing',rating:4.6,badge:'Paid',desc:'Tahminli gönderim ve CRM ile gelişmiş e-posta pazarlama ve otomasyon platformu.'},
    {name:'Brevo',slug:'brevo',cat:'Marketing',rating:4.4,badge:'Freemium',desc:'E-posta, SMS ve sohbet ile uygun fiyatlı hepsi bir arada CRM ve pazarlama platformu.'},
    {name:'ElevenLabs',slug:'elevenlabs',cat:'Voice',rating:4.8,badge:'Freemium',desc:'Ultra gerçekçi metinden konuşmaya ve ses klonlama için gelişmiş AI ses sentezi.'},
    {name:'Murf',slug:'murf',cat:'Voice',rating:4.3,badge:'Freemium',desc:'20+ dilde 120+ doğal sesle seslendirme yapan AI ses üretici.'},
    {name:'Play.ht',slug:'play-ht',cat:'Voice',rating:4.2,badge:'Freemium',desc:'Metinden gerçekçi seslendirmeler üreten metinden konuşmaya platformu.'},
    {name:'Resemble AI',slug:'resemble-ai',cat:'Voice',rating:4.3,badge:'Paid',desc:'Duygusal konuşma sentezi ile AI ses klonlama ve metinden konuşmaya platformu.'},
    {name:'WellSaid Labs',slug:'wellsaid',cat:'Voice',rating:4.4,badge:'Paid',desc:'İçerik oluşturma için stüdyo kalitesinde sesler sunan profesyonel AI seslendirme platformu.'},
    {name:'Speechify',slug:'speechify',cat:'Voice',rating:4.5,badge:'Freemium',desc:'Doğal sesler ve OCR ile her metni dinlemek için AI metinden konuşmaya uygulaması.'},
    {name:'Notion AI',slug:'notion-ai',cat:'Productivity',rating:4.5,badge:'Freemium',desc:'Yazma, beyin fırtınası, özetleme ve organize etme için AI destekli çalışma alanı.'},
    {name:'Motion',slug:'motion',cat:'Productivity',rating:4.3,badge:'Paid',desc:'Gününüzü otomatik planlayan AI takvim ve proje yönetimi uygulaması.'},
    {name:'Mem',slug:'mem',cat:'Productivity',rating:4.1,badge:'Freemium',desc:'Notlarınızı ve fikirlerinizi otomatik düzenleyen AI bilgi yönetim aracı.'},
    {name:'Otter.ai',slug:'otter-ai',cat:'Productivity',rating:4.5,badge:'Freemium',desc:'Toplantıları kaydeden, yazıya döken ve özetleyen AI toplantı asistanı.'},
    {name:'Fireflies.ai',slug:'fireflies-ai',cat:'Productivity',rating:4.4,badge:'Paid',desc:'50+ uygulama üzerinden aramaları kaydeden ve analiz eden AI toplantı asistanı.'},
    {name:'Krisp',slug:'krisp',cat:'Productivity',rating:4.3,badge:'Freemium',desc:'Gerçek zamanlı arka plan gürültü temizleme ve AI toplantı asistanı.'},
    {name:'Suno',slug:'suno',cat:'Music',rating:4.4,badge:'Freemium',desc:'Metin komutlarından sözleriyle özgün şarkılar üreten AI müzik oluşturma platformu.'},
    {name:'Udio',slug:'udio',cat:'Music',rating:4.3,badge:'Freemium',desc:'Metin açıklamalarından yüksek kaliteli ses üreten AI müzik üretici.'},
    {name:'Soundraw',slug:'soundraw',cat:'Music',rating:4.2,badge:'Paid',desc:'İçerik üreticileri için özelleştirilebilir telifsiz müzik üreten AI müzik üretici.'},
    {name:'AIVA',slug:'aiva',cat:'Music',rating:4.3,badge:'Freemium',desc:'Yaratıcılar ve yapımcılar için özgün müzik besteleyen AI müzik asistanı.'},
    {name:'Beatoven.ai',slug:'beatoven',cat:'Music',rating:4.2,badge:'Paid',desc:'Ruh hali kontrolü ile telifsiz arka plan müziği üreten AI müzik platformu.'},
    {name:'Boomy',slug:'boomy',cat:'Music',rating:4.0,badge:'Freemium',desc:'Özgün şarkılar üreten ve yayın platformlarına gönderen AI müzik platformu.'}
  ];

  // Search Functionality with Dropdown
  var searchInput = document.querySelector('.search-bar input');
  let searchTimeout;
  var searchResultsContainer = null;
  var searchDropdownEl = null;
  var currentSearchResults = [];
  var highlightIdx = -1;

  if (searchInput) {
    var featuredSection = document.getElementById('featured-tools');

    // Create dropdown
    searchDropdownEl = document.createElement('div');
    searchDropdownEl.className = 'search-dropdown';
    var searchBar = searchInput.closest('.search-bar');
    if (searchBar) { searchBar.appendChild(searchDropdownEl); }

    function renderSearchDropdown(query) {
      if (query.length === 0) {
        searchDropdownEl.classList.remove('active');
        if (searchResultsContainer) {
          searchResultsContainer.remove();
          searchResultsContainer = null;
        }
        if (featuredSection) featuredSection.style.display = '';
        return;
      }

      currentSearchResults = allTools.filter(function(tool) {
        return tool.name.toLowerCase().includes(query) ||
               tool.cat.toLowerCase().includes(query) ||
               tool.desc.toLowerCase().includes(query);
      });

      if (currentSearchResults.length === 0) {
        searchDropdownEl.innerHTML = '<div class="search-dropdown-empty">No tools found for "<strong>' + query.replace(/</g,'&lt;') + '</strong>"</div>';
        searchDropdownEl.classList.add('active');
        return;
      }

      var display = currentSearchResults.slice(0, 8);
      var html = '';
      for (var i = 0; i < display.length; i++) {
        var t = display[i];
        var fullStars = Math.floor(t.rating);
        var stars = '';
        for (var s = 0; s < fullStars; s++) stars += '★';
        for (var s = fullStars; s < 5; s++) stars += '☆';

        html += '<div class="search-dropdown-item" data-idx="' + i + '" data-slug="' + t.slug + '">';
        html += '<div class="item-logo">' + t.name.charAt(0) + '</div>';
        html += '<div class="item-info"><div class="item-name">' + t.name.replace(/</g,'&lt;') + '</div>';
        html += '<div class="item-cat">AI ' + t.cat + '</div></div>';
        html += '<div class="item-rating">' + stars + ' ' + t.rating + '</div></div>';
      }

      if (currentSearchResults.length > 8) {
        html += '<div class="search-dropdown-item" data-show-all="true" style="justify-content:center;color:var(--accent);font-weight:600;font-size:0.875rem;padding:14px 16px;border-bottom:none;">Show all ' + currentSearchResults.length + ' results →</div>';
      }

      searchDropdownEl.innerHTML = html;
      searchDropdownEl.classList.add('active');
      highlightIdx = -1;

      // Click handlers for dropdown items
      searchDropdownEl.querySelectorAll('.search-dropdown-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          var slug = this.getAttribute('data-slug');
          if (slug) { window.location.href = 'reviews/' + slug + '.html'; return; }
          if (this.getAttribute('data-show-all')) {
            showFullSearchResults(currentSearchResults);
            searchDropdownEl.classList.remove('active');
          }
        });
      });

      if (typeof gtag !== 'undefined') {
        gtag('event', 'search', { event_category: 'Search', event_label: query, value: currentSearchResults.length });
      }
    }

    function showFullSearchResults(results) {
      if (!searchResultsContainer) {
        searchResultsContainer = document.createElement('div');
        searchResultsContainer.className = 'search-results';
        searchResultsContainer.style.cssText = 'margin-top:24px;';
        if (featuredSection) {
          featuredSection.parentNode.insertBefore(searchResultsContainer, featuredSection);
          featuredSection.style.display = 'none';
        }
      }

      var html = '<div class="section-header"><h2>Search Results (' + results.length + ')</h2></div><div class="tools-grid">';
      for (var i = 0; i < results.length; i++) {
        var t = results[i];
        var stars = '';
        var fullStars = Math.floor(t.rating);
        for (var s = 0; s < fullStars; s++) stars += '&#9733;';
        for (var s = fullStars; s < 5; s++) stars += '&#9734;';
        var badgeClass = 'badge-' + t.badge.toLowerCase();

        html += '<div class="tool-card">';
        html += '<div class="tool-card-header"><div class="tool-logo">' + t.name.charAt(0) + '</div><div class="tool-info">';
        html += '<h3><a href="reviews/' + t.slug + '.html">' + t.name.replace(/</g,'&lt;') + '</a></h3>';
        html += '<span class="tool-badge ' + badgeClass + '">' + t.badge + '</span></div></div>';
        html += '<p class="tool-description">' + t.desc.replace(/</g,'&lt;') + '</p>';
        html += '<div class="tool-meta"><div class="tool-rating"><span>' + stars + '</span><span>' + t.rating + '</span></div>';
        html += '<span class="tool-category">AI ' + t.cat + '</span></div>';
        html += '<div class="tool-footer"><a href="reviews/' + t.slug + '.html" class="btn btn-secondary btn-sm">Read Review</a>';
        html += '<a href="/go/' + t.slug + '" target="_blank" rel="sponsored noopener noreferrer" class="btn btn-primary btn-sm">Try Free</a></div></div>';
      }
      html += '</div>';
      searchResultsContainer.innerHTML = html;

      if (typeof gtag !== 'undefined') {
        gtag('event', 'search_show_all', { event_category: 'Search', event_label: searchInput.value.toLowerCase().trim(), value: results.length });
      }
    }

    // Input handler
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      var query = searchInput.value.toLowerCase().trim();
      if (window.__store) { window.__store.searchQuery = query; }
      searchTimeout = setTimeout(function() {
        renderSearchDropdown(query);
      }, 150);
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
      var items = searchDropdownEl.querySelectorAll('.search-dropdown-item:not([data-show-all])');
      if (!searchDropdownEl.classList.contains('active')) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightIdx = Math.min(highlightIdx + 1, items.length - 1);
        items.forEach(function(el, i) {
          el.classList.toggle('highlighted', i === highlightIdx);
          if (i === highlightIdx) el.scrollIntoView({ block: 'nearest' });
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightIdx = Math.max(highlightIdx - 1, -1);
        items.forEach(function(el, i) {
          el.classList.toggle('highlighted', i === highlightIdx);
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightIdx >= 0 && items[highlightIdx]) {
          var slug = items[highlightIdx].getAttribute('data-slug');
          if (slug) window.location.href = 'reviews/' + slug + '.html';
        } else if (currentSearchResults.length > 0) {
          showFullSearchResults(currentSearchResults);
          searchDropdownEl.classList.remove('active');
        }
      } else if (e.key === 'Escape') {
        searchDropdownEl.classList.remove('active');
        searchInput.blur();
        highlightIdx = -1;
      }
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      var searchBar = searchInput.closest('.search-bar');
      if (searchDropdownEl && (!searchBar || !searchBar.contains(e.target))) {
        searchDropdownEl.classList.remove('active');
        highlightIdx = -1;
      }
    });
  }

  // Store subscription for search
  if (window.__store) {
    window.__store.subscribe('searchQuery', function(val) {
      if (searchInput && searchInput.value.toLowerCase().trim() !== val) {
        searchInput.value = val;
        renderSearchDropdown(val);
      }
    });
  }

  // Online/offline state
  window.addEventListener('online', function() { if (window.__store) { window.__store.isOffline = false; } });
  window.addEventListener('offline', function() { if (window.__store) { window.__store.isOffline = true; } });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        var headerOffset = 80;
        var elementPosition = targetElement.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // Intersection Observer for scroll animations
  var observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.tool-card, .category-card, .blog-card').forEach(function(el) {
    // Assign staggered entrance variants
    if (el.classList.contains('tool-card')) {
      var variants = ['', 'animate-fade-left', 'animate-fade-right', 'animate-scale'];
      var idx = Math.floor(Math.random() * variants.length);
      if (idx > 0) el.classList.add(variants[idx]);
    }
    observer.observe(el);
  });

  // Toast Notification System
  function showToast(message, type) {
    var toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:var(--radius,10px);font-size:0.9375rem;font-weight:600;z-index:10000;opacity:0;transition:opacity 0.3s;pointer-events:none;';
    toast.style.background = type === 'error' ? '#EF4444' : '#10B981';
    toast.style.color = '#fff';
    document.body.appendChild(toast);
    requestAnimationFrame(function() { toast.style.opacity = '1'; });
    setTimeout(function() {
      toast.style.opacity = '0';
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  }

  // Newsletter Form
  var newsletterForm = document.querySelector('.newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!navigator.onLine) {
        showToast('You appear to be offline. Please check your connection.', 'error');
        return;
      }
      var input = this.querySelector('input[type="email"]');
      var email = input.value;
      var btn = this.querySelector('button');
      var originalText = btn.textContent;

      btn.textContent = 'Subscribing...';
      btn.disabled = true;

      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        input.value = '';
        btn.textContent = 'Subscribed!';
        btn.style.background = '#10B981';
        showToast('Successfully subscribed!', 'success');
        if (typeof gtag !== 'undefined') {
          gtag('event', 'sign_up', { event_category: 'Newsletter', event_label: 'subscriber' });
        }
        setTimeout(function() {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      } else {
        input.style.borderColor = '#EF4444';
        input.focus();
        btn.textContent = originalText;
        btn.disabled = false;
        showToast('Please enter a valid email address.', 'error');
        setTimeout(function() {
          input.style.borderColor = '';
        }, 2000);
      }
    });
  }

  // Dark Mode Toggle
  function readTheme() {
    var t = (location.search.match(/[?&]theme=([^&]*)/)||[])[1];
    if (!t) { try { var n = window.name.match(/theme=(\w+)/); if (n) t = n[1]; } catch(e) {} }
    if (!t) { try { t = localStorage.getItem('theme'); } catch(e) {} }
    return t;
  }
  function writeTheme(val) {
    try { localStorage.setItem('theme', val); } catch(e) {}
    window.name = 'theme=' + val;
    try {
      var url = new URL(window.location.href);
      if (val === 'dark') { url.searchParams.set('theme', 'dark'); }
      else { url.searchParams.delete('theme'); }
      window.history.replaceState({}, '', url);
    } catch(ex) {}
  }

  var savedTheme = readTheme();
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  if (window.__store) { window.__store.theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }

  var meta = document.createElement('meta');
  meta.name = 'color-scheme';
  meta.content = 'light dark';
  document.head.appendChild(meta);

  var darkModeBtn = document.createElement('button');
  darkModeBtn.className = 'dark-mode-toggle';
  darkModeBtn.setAttribute('aria-label', 'Toggle dark mode');
  darkModeBtn.setAttribute('aria-live', 'polite');
  darkModeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  var mobileToggleBtn = document.querySelector('.mobile-toggle');
  if (mobileToggleBtn && mobileToggleBtn.parentNode) {
    mobileToggleBtn.parentNode.insertBefore(darkModeBtn, mobileToggleBtn);
  } else if (nav) {
    nav.insertBefore(darkModeBtn, nav.firstChild);
  }

  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    darkModeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  }

  function toggleDarkMode() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      darkModeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      darkModeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    }
    writeTheme(isDark ? 'light' : 'dark');
    if (window.__store) { window.__store.theme = isDark ? 'light' : 'dark'; }
  }

  if (window.__store) {
    window.__store.subscribe('theme', function(val) {
      if (val === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
      } else {
        document.documentElement.removeAttribute('data-theme');
        darkModeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      }
      writeTheme(val);
    });
  }

  darkModeBtn.addEventListener('click', toggleDarkMode);
  darkModeBtn.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDarkMode();
    }
  });

  // Intercept internal link clicks to persist theme via URL
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('https') || href.startsWith('mailto:') || href.startsWith('javascript:') || href.startsWith('tel:') || href.startsWith('#')) return;
    if (link.getAttribute('target') === '_blank') return;
    var theme = document.documentElement.getAttribute('data-theme');
    var hasTheme = href.indexOf('theme=') > -1;
    if (theme === 'dark' && !hasTheme) {
      e.preventDefault();
      var hashIdx = href.indexOf('#');
      var path = hashIdx > -1 ? href.substring(0, hashIdx) : href;
      var hash = hashIdx > -1 ? href.substring(hashIdx) : '';
      var sep = path.indexOf('?') > -1 ? '&' : '?';
      window.location.href = path + sep + 'theme=dark' + hash;
    } else if (theme !== 'dark' && hasTheme) {
      e.preventDefault();
      window.location.href = href.replace(/[?&]theme=[^&]*/g, '').replace(/\?$/,'');
    }
  });

  // Affiliate Links - client-side redirect (works on GitHub Pages, file://, and Netlify)
  var affiliateLinks = {
    'jasper-ai': 'https://jasper.ai?ref=YOUR_ID',
    'copy-ai': 'https://copy.ai?ref=YOUR_ID',
    'surfer-seo': 'https://surferseo.com?ref=YOUR_ID',
    'midjourney': 'https://midjourney.com?ref=YOUR_ID',
    'grammarly': 'https://grammarly.com?ref=YOUR_ID',
    'getresponse': 'https://getresponse.com?ref=YOUR_ID',
    'chatgpt': 'https://chatgpt.com?ref=aitoolsdir',
    'canva-ai': 'https://canva.com?ref=aitoolsdir',
    'elevenlabs': 'https://elevenlabs.io?ref=aitoolsdir',
    'notion-ai': 'https://notion.so?ref=aitoolsdir',
    'suno': 'https://suno.com?ref=aitoolsdir',
    'murf': 'https://murf.ai?ref=aitoolsdir',
    'play-ht': 'https://play.ht?ref=aitoolsdir',
    'motion': 'https://usemotion.com?ref=aitoolsdir',
    'mem': 'https://mem.ai?ref=aitoolsdir',
    'udio': 'https://udio.com?ref=aitoolsdir',
    'soundraw': 'https://soundraw.io?ref=aitoolsdir',
    'synthesia': 'https://synthesia.io?ref=aitoolsdir',
    'stable-diffusion': 'https://stability.ai?ref=aitoolsdir',
    'runway-ml': 'https://runwayml.com?ref=aitoolsdir',
    'marketmuse': 'https://marketmuse.com?ref=aitoolsdir',
    'hubspot': 'https://hubspot.com?ref=aitoolsdir',
    'github-copilot': 'https://github.com/features/copilot?ref=aitoolsdir',
    'frase-io': 'https://frase.io?ref=aitoolsdir',
    'descript': 'https://descript.com?ref=aitoolsdir',
    'dall-e-3': 'https://openai.com/dall-e-3?ref=aitoolsdir',
    'cursor': 'https://cursor.sh?ref=aitoolsdir',
    'convertkit': 'https://convertkit.com?ref=aitoolsdir',
    'codeium': 'https://codeium.com?ref=aitoolsdir',
    'writesonic': 'https://writesonic.com?ref=aitoolsdir',
    'rytr': 'https://rytr.me?ref=aitoolsdir',
    'wordtune': 'https://wordtune.com?ref=aitoolsdir',
    'quillbot': 'https://quillbot.com?ref=aitoolsdir',
    'anyword': 'https://anyword.com?ref=aitoolsdir',
    'simplified': 'https://simplified.com?ref=aitoolsdir',
    'adobe-firefly': 'https://firefly.adobe.com?ref=aitoolsdir',
    'leonardo-ai': 'https://leonardo.ai?ref=aitoolsdir',
    'replit': 'https://replit.com?ref=aitoolsdir',
    'amazon-q': 'https://aws.amazon.com/q?ref=aitoolsdir',
    'tabnine': 'https://tabnine.com?ref=aitoolsdir',
    'pictory': 'https://pictory.ai?ref=aitoolsdir',
    'invideo': 'https://invideo.io?ref=aitoolsdir',
    'kapwing': 'https://kapwing.com?ref=aitoolsdir',
    'semrush': 'https://semrush.com?ref=aitoolsdir',
    'ahrefs': 'https://ahrefs.com?ref=aitoolsdir',
    'moz': 'https://moz.com?ref=aitoolsdir',
    'mailchimp': 'https://mailchimp.com?ref=aitoolsdir',
    'activecampaign': 'https://activecampaign.com?ref=aitoolsdir',
    'brevo': 'https://brevo.com?ref=aitoolsdir',
    'resemble-ai': 'https://resemble.ai?ref=aitoolsdir',
    'wellsaid': 'https://wellsaid.com?ref=aitoolsdir',
    'speechify': 'https://speechify.com?ref=aitoolsdir',
    'otter-ai': 'https://otter.ai?ref=aitoolsdir',
    'fireflies-ai': 'https://fireflies.ai?ref=aitoolsdir',
    'krisp': 'https://krisp.ai?ref=aitoolsdir',
    'aiva': 'https://aiva.ai?ref=aitoolsdir',
    'beatoven': 'https://beatoven.ai?ref=aitoolsdir',
    'boomy': 'https://boomy.com?ref=aitoolsdir'
  };
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href^="/go/"]');
    if (!link) return;
    e.preventDefault();
    var slug = link.getAttribute('href').replace('/go/', '');
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
        event_category: 'Affiliate Link',
        event_label: slug,
        transport_type: 'beacon'
      });
    }
    var url = affiliateLinks[slug];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  });

  // Active Navigation Link
  var currentFileName = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    var hrefFile = href.split('#')[0].split('/').pop();
    if (hrefFile === currentFileName) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ============================================
  // PHASE 1: Premium Animations & UX Enhancements
  // ============================================

  // Check for reduced motion
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero Text Reveal - split h1 into word spans (safe with reduced motion: CSS starts .word at opacity:1)
  var heroH1 = document.querySelector('.hero h1');
  if (heroH1 && !heroH1.querySelector('.word')) {
    var text = heroH1.textContent;
    var words = text.split(' ');
    heroH1.innerHTML = words.map(function(w) {
      return '<span class="word">' + w + '</span>';
    }).join(' ');
  }

  if (!prefersReducedMotion) {

    // 2. Sticky Header Shrink
    var siteHeader = document.querySelector('.header');
    if (siteHeader) {
      var headerScrollRaf;
      window.addEventListener('scroll', function() {
        cancelAnimationFrame(headerScrollRaf);
        headerScrollRaf = requestAnimationFrame(function() {
          siteHeader.classList.toggle('scrolled', window.scrollY > 50);
        });
      });
    }

    // 3D Tilt handled in three-effects.js (enhanced version with depth layers)

    // 5. Button Ripple Effect
    document.querySelectorAll('.btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        var rect = this.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        ripple.addEventListener('animationend', function() { ripple.remove(); });
      });
    });

    // 6. Magnetic Button Effect on CTA
    var ctaBtn = document.querySelector('.hero-buttons .btn-primary');
    if (ctaBtn && !isTouchDevice) {
      ctaBtn.classList.add('btn-magnetic');
      ctaBtn.addEventListener('mousemove', function(e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
      });
      ctaBtn.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    }

    // 7. Stat Counter Animation
    var statNumbers = document.querySelectorAll('.hero-stat .number');
    if (statNumbers.length > 0) {
      var statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            statObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      statNumbers.forEach(function(el) { statObserver.observe(el); });
    }

  } // end !prefersReducedMotion

  // ============================================
  // PHASE 2 — Filters, Dark Mode Animation
  // ============================================

  // 1. Dark Mode Toggle Animation
  var darkToggle = document.querySelector('.dark-mode-toggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', function() {
      this.classList.remove('rotating');
      void this.offsetWidth;
      this.classList.add('rotating');
      setTimeout(function() {
        this.classList.remove('rotating');
      }.bind(this), 500);
    });
  }

  // OS-Level Dark Mode Sync
  (function() {
    var darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
    function hasUserThemePref() {
      try { return localStorage.getItem('theme') !== null; } catch(e) { return false; }
    }
    function handleSystemThemeChange(e) {
      if (hasUserThemePref()) return;
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
    try { darkMedia.addEventListener('change', handleSystemThemeChange); } catch(e) {}
  })();

  // 2. Category Page Filter & Sort Engine
  var isCategoryPage = document.querySelector('.page-header h1') &&
    window.location.pathname.indexOf('/categories/') > -1;

  if (isCategoryPage) {
    var catGrid = document.querySelector('.featured .tools-grid');
    var catHeader = document.querySelector('.page-header');

    if (catGrid && catHeader) {
      // Extract tool data from existing cards
      var catTools = [];
      var catCards = catGrid.querySelectorAll('.tool-card');
      catCards.forEach(function(card, idx) {
        var nameEl = card.querySelector('h2 a, h3 a');
        var badgeEl = card.querySelector('.tool-badge');
        var ratingEl = card.querySelector('.tool-rating span:last-child');
        var catEl = card.querySelector('.tool-category');
        var descEl = card.querySelector('.tool-description');

        catTools.push({
          el: card,
          name: nameEl ? nameEl.textContent : '',
          badge: badgeEl ? badgeEl.textContent : '',
          rating: ratingEl ? parseFloat(ratingEl.textContent) || 0 : 0,
          category: catEl ? catEl.textContent : ''
        });
      });

      // Insert filter bar
      var filterBar = document.createElement('div');
      filterBar.className = 'filter-bar';
      filterBar.innerHTML =
        '<div class="filter-group">' +
          '<label>Price</label>' +
          '<div class="filter-btn-group" data-filter="badge">' +
            '<button class="filter-btn active" data-value="all">All</button>' +
            '<button class="filter-btn" data-value="Free">Free</button>' +
            '<button class="filter-btn" data-value="Freemium">Freemium</button>' +
            '<button class="filter-btn" data-value="Paid">Paid</button>' +
          '</div>' +
        '</div>' +
        '<div class="filter-group">' +
          '<label>Rating</label>' +
          '<select class="filter-select" data-filter="rating">' +
            '<option value="all">All Ratings</option>' +
            '<option value="4.5">4.5 ★ & above</option>' +
            '<option value="4">4.0 ★ & above</option>' +
            '<option value="3.5">3.5 ★ & above</option>' +
          '</select>' +
        '</div>' +
        '<div class="filter-group">' +
          '<label>Sort</label>' +
          '<select class="filter-select" data-filter="sort">' +
            '<option value="rating-desc">Rating: High → Low</option>' +
            '<option value="rating-asc">Rating: Low → High</option>' +
            '<option value="name-asc">Name: A → Z</option>' +
            '<option value="name-desc">Name: Z → A</option>' +
          '</select>' +
        '</div>' +
        '<span class="filter-count" id="filter-count">' + catTools.length + ' tools</span>';

      catGrid.parentNode.insertBefore(filterBar, catGrid);

      // Active filter badges container
      var badgeContainer = document.createElement('div');
      badgeContainer.className = 'filter-active-badges';
      badgeContainer.id = 'filter-active-badges';
      catGrid.parentNode.insertBefore(badgeContainer, catGrid);

      var currentFilters = { badge: 'all', rating: 'all', sort: 'rating-desc' };

      function updateFilters() {
        var filtered = catTools.filter(function(t) {
          if (currentFilters.badge !== 'all' && t.badge !== currentFilters.badge) return false;
          if (currentFilters.rating !== 'all' && t.rating < parseFloat(currentFilters.rating)) return false;
          return true;
        });

        // Sort
        var sorted = filtered.slice();
        switch (currentFilters.sort) {
          case 'rating-desc': sorted.sort(function(a,b) { return b.rating - a.rating; }); break;
          case 'rating-asc': sorted.sort(function(a,b) { return a.rating - b.rating; }); break;
          case 'name-asc': sorted.sort(function(a,b) { return a.name.localeCompare(b.name); }); break;
          case 'name-desc': sorted.sort(function(a,b) { return b.name.localeCompare(a.name); }); break;
        }

        // Reorder DOM
        catCards.forEach(function(c) { c.style.display = 'none'; });
        sorted.forEach(function(t) { t.el.style.display = ''; });

        // Update count
        var countEl = document.getElementById('filter-count');
        if (countEl) countEl.textContent = sorted.length + ' tool' + (sorted.length !== 1 ? 's' : '');

        // Update badges
        var bc = document.getElementById('filter-active-badges');
        if (bc) {
          bc.innerHTML = '';
          if (currentFilters.badge !== 'all') {
            var b = document.createElement('span');
            b.className = 'filter-badge';
            b.innerHTML = currentFilters.badge + ' <span class="badge-close">&times;</span>';
            b.addEventListener('click', function() {
              currentFilters.badge = 'all';
              document.querySelectorAll('.filter-btn-group[data-filter="badge"] .filter-btn').forEach(function(btn) {
                btn.classList.toggle('active', btn.getAttribute('data-value') === 'all');
              });
              updateFilters();
            });
            bc.appendChild(b);
          }
          if (currentFilters.rating !== 'all') {
            var r = document.createElement('span');
            r.className = 'filter-badge';
            r.innerHTML = currentFilters.rating + '+ ★ <span class="badge-close">&times;</span>';
            r.addEventListener('click', function() {
              currentFilters.rating = 'all';
              var sel = document.querySelector('.filter-select[data-filter="rating"]');
              if (sel) sel.value = 'all';
              updateFilters();
            });
            bc.appendChild(r);
          }
        }
      }

      // Filter button clicks
      filterBar.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var group = this.closest('.filter-btn-group');
          group.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
          this.classList.add('active');
          currentFilters.badge = this.getAttribute('data-value');
          updateFilters();
        });
      });

      // Filter select changes
      filterBar.querySelectorAll('.filter-select').forEach(function(sel) {
        sel.addEventListener('change', function() {
          var filter = this.getAttribute('data-filter');
          currentFilters[filter] = this.value;
          updateFilters();
        });
      });
    }
  }

  // 4. Key Takeaways Box
  var isReviewPage = window.location.pathname.indexOf('/reviews/') > -1;
  if (isReviewPage) {
    var overviewH2 = document.querySelector('.review-content h2');
    if (overviewH2) {
      var overviewPara = overviewH2.nextElementSibling;
      if (overviewPara && overviewPara.tagName === 'P') {
        var text = overviewPara.textContent.replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc|approx|dept|est|govt|inc|ltd|co|corp)\./gi, '$1<ABBR>').replace(/([.!?])\s*(?=[A-Z"'\(])/g, '$1|').replace(/<ABBR>/g, '.');
        var sentences = text.split('|').filter(function(s) { return s.trim().length > 20; }).slice(0, 3);
        if (sentences.length > 0) {
          var takeawaysBox = document.createElement('div');
          takeawaysBox.className = 'key-takeaways';
          var html = '<h4>Key Takeaways</h4><ul>';
          sentences.forEach(function(s) {
            html += '<li>' + s.trim().replace(/\.$/, '') + '</li>';
          });
          html += '</ul>';
          takeawaysBox.innerHTML = html;
          overviewPara.parentNode.insertBefore(takeawaysBox, overviewPara.nextElementSibling);
        }
      }
    }
  }

  // 7. Skeleton Loading for Search
  function showSkeleton(count) {
    var container = document.querySelector('.search-results');
    if (!container) return;
    var skeletonCount = Math.min(count || 6, 12);
    var html = '<div class="tools-grid">';
    for (var i = 0; i < skeletonCount; i++) {
      html += '<div class="skeleton-card">' +
        '<div class="skeleton-header">' +
          '<div class="skeleton skeleton-logo"></div>' +
          '<div class="skeleton-lines">' +
            '<div class="skeleton skeleton-line"></div>' +
            '<div class="skeleton skeleton-line" style="width:40%"></div>' +
          '</div>' +
        '</div>' +
        '<div class="skeleton skeleton-desc"></div>' +
        '<div class="skeleton-meta">' +
          '<div class="skeleton skeleton-meta-line"></div>' +
          '<div class="skeleton skeleton-meta-line" style="width:80px"></div>' +
        '</div>' +
        '<div class="skeleton-footer">' +
          '<div class="skeleton skeleton-btn"></div>' +
          '<div class="skeleton skeleton-btn"></div>' +
        '</div>' +
      '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
  }

  // 8. Pricing Chart Enhancement (on review pages)
  var pricingSection = document.querySelector('#pricing');
  if (pricingSection) {
    var pricingList = pricingSection.nextElementSibling;
    if (pricingList && pricingList.tagName === 'UL') {
      var items = pricingList.querySelectorAll('li');
      if (items.length > 0) {
        var chartHtml = '<div class="pricing-chart">';
        items.forEach(function(li, idx) {
          var text = li.textContent;
          var parts = text.split(':');
          var name = parts[0] ? parts[0].trim() : 'Plan';
          var details = parts[1] ? parts[1].trim() : text;
          var priceMatch = text.match(/\$?(\d+)\/month/);
          var price = priceMatch ? '$' + priceMatch[1] : '';
          var isRec = idx === 1;
          chartHtml += '<div class="pricing-tier' + (isRec ? ' recommended' : '') + '">';
          chartHtml += '<div class="tier-name">' + name + '</div>';
          chartHtml += '<div class="tier-price">' + (price || 'Custom') + '</div>';
          if (price) chartHtml += '<div class="tier-period">per month</div>';
          else chartHtml += '<div class="tier-period">contact for pricing</div>';
          chartHtml += '<div class="tier-desc" style="font-size:0.875rem;color:var(--text-tertiary);margin-bottom:16px;">' + details + '</div>';
          if (isRec) chartHtml += '<div class="tier-cta"><a href="#" class="btn btn-primary btn-sm" style="pointer-events:none;">Recommended</a></div>';
          chartHtml += '</div>';
        });
        chartHtml += '</div>';
        pricingList.insertAdjacentHTML('afterend', chartHtml);
        pricingList.style.display = 'none';
      }
    }
  }

  // ============================================
  // PHASE 4: Premium Features
  // ============================================

  // 1. Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(reg) {
        reg.addEventListener('updatefound', function() {
          var installing = reg.installing;
          installing.addEventListener('statechange', function() {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              showToast('Site updated! Refresh for new content.', 'success');
            }
          });
        });
      }).catch(function() {});
    });
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      showToast('A new version is available! Please refresh.', 'success');
    });
  }

  // 2. Exit-Intent Popup
  (function() {
    var shown = false;
    var cookie = (function() {
      try { return document.cookie.match(/exit_popup_shown=(\d+)/); } catch(e) { return null; }
    })();
    var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';
    try { var shownPerm = localStorage.getItem('exitPopupShown'); } catch(e) {}
    if (cookie || dnt || shownPerm) return;

    document.addEventListener('mouseleave', function(e) {
      if (shown || e.clientY > 0) return;
      shown = true;
      showExitPopup();
    });

    function showExitPopup() {
      var overlay = document.createElement('div');
      overlay.className = 'exit-popup';
      overlay.innerHTML =
        '<div class="exit-popup-content">' +
          '<button class="exit-close" aria-label="Close">&times;</button>' +
          '<h2 style="font-size:1.5rem;">Wait! Before you go...</h2>' +
          '<p>Get exclusive AI tool deals in your inbox</p>' +
          '<form class="newsletter-form" style="max-width:100%;">' +
            '<input type="email" placeholder="Enter your email" required style="flex:1;padding:12px 16px;font-size:0.9375rem;font-family:var(--font-sans);border:1.5px solid var(--border);border-radius:var(--radius);background:var(--surface);outline:none;color:var(--text-primary);">' +
            '<button type="submit" class="btn btn-primary">Subscribe</button>' +
          '</form>' +
          '<p style="font-size:0.75rem;color:var(--text-tertiary);margin-top:16px;margin-bottom:0;">No spam, unsubscribe anytime</p>' +
        '</div>';
      document.body.appendChild(overlay);
      requestAnimationFrame(function() { overlay.classList.add('active'); });

      try { localStorage.setItem('exitPopupShown', '1'); } catch(e) {}
      try { document.cookie = 'exit_popup_shown=1; max-age=2592000; path=/'; } catch(e) {}

      function close() {
        overlay.classList.remove('active');
        setTimeout(function() { overlay.remove(); }, 400);
      }

      overlay.querySelector('.exit-close').addEventListener('click', close);
      overlay.addEventListener('click', function(e) { if (e.target === overlay) close(); });
      document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
      });

      var exitForm = overlay.querySelector('form');
      if (exitForm) {
        exitForm.addEventListener('submit', function(e) {
          e.preventDefault();
          var input = this.querySelector('input');
          if (input && input.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            if (typeof showToast === 'function') showToast('Thanks! You\'re subscribed.', 'success');
            close();
          } else if (input) {
            input.style.borderColor = '#EF4444';
            setTimeout(function() { input.style.borderColor = ''; }, 2000);
          }
        });
      }
    }
  })();

  // 3. Sticky CTA Bar on Review Pages
  if (isReviewPage) {
    var reviewH1 = document.querySelector('.review-header h1');
    var siteFooter = document.querySelector('.footer');
    var revHeader = document.querySelector('.review-header');

    if (reviewH1 && siteFooter) {
      var toolName = reviewH1.textContent.replace(/\s*Review\s*\d{4}\s*$/i, '').trim();
      var starsEl = document.querySelector('.review-header .rating .stars');
      var starsHtml = starsEl ? starsEl.innerHTML : '★★★★★';
      var scoreEl = document.querySelector('.review-header .rating .score');
      var scoreTxt = scoreEl ? scoreEl.textContent : '';

      var slug = (function() {
        var p = window.location.pathname.split('/');
        return p[p.length - 1].replace('.html', '');
      })();

      var ctaBar = document.createElement('div');
      ctaBar.className = 'sticky-cta-bar';
      ctaBar.innerHTML =
        '<div class="container">' +
          '<div class="cta-left">' +
            '<span class="cta-tool-name">' + toolName + '</span>' +
            '<span class="cta-rating">' + starsHtml + ' ' + scoreTxt + '</span>' +
          '</div>' +
          '<a href="/go/' + slug + '" target="_blank" rel="sponsored noopener noreferrer" class="btn btn-primary btn-sm">Try Free</a>' +
        '</div>';
      document.body.appendChild(ctaBar);

      var ctaShown = false;
      window.addEventListener('scroll', function() {
        cancelAnimationFrame(window._ctaRaf);
        window._ctaRaf = requestAnimationFrame(function() {
          var hBottom = revHeader ? revHeader.getBoundingClientRect().bottom : 0;
          var fTop = siteFooter.getBoundingClientRect().top;
          if (hBottom < 0 && fTop > window.innerHeight) {
            if (!ctaShown) { ctaShown = true; ctaBar.classList.add('visible'); }
          } else {
            if (ctaShown) { ctaShown = false; ctaBar.classList.remove('visible'); }
          }
        });
      });
    }

    // 4. Social Share Buttons
    var rhInfo = document.querySelector('.review-header-info');
    if (rhInfo) {
      var shareDiv = document.createElement('div');
      shareDiv.className = 'share-buttons';
      var pageUrl = encodeURIComponent(window.location.href);
      var pageTitle = encodeURIComponent(document.title);

      shareDiv.innerHTML =
        '<button class="share-btn share-btn-twitter" data-share="twitter" aria-label="Share on Twitter">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
          'Twitter' +
        '</button>' +
        '<button class="share-btn share-btn-linkedin" data-share="linkedin" aria-label="Share on LinkedIn">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' +
          'LinkedIn' +
        '</button>' +
        '<button class="share-btn share-btn-reddit" data-share="reddit" aria-label="Share on Reddit">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.633 4.674 1.592a1.94 1.94 0 0 1 1.172-.392 1.956 1.956 0 0 1 1.958 1.958 1.956 1.956 0 0 1-1.958 1.958c-.497 0-.946-.194-1.294-.506-1.628 1.306-3.955 2.088-6.58 2.088-2.633 0-4.964-.786-6.588-2.098a1.93 1.93 0 0 1-1.22.425 1.956 1.956 0 0 1-1.958-1.958 1.956 1.956 0 0 1 1.958-1.958c.46 0 .877.166 1.207.43 1.19-.96 2.84-1.523 4.658-1.594l.95-4.396a.468.468 0 0 1 .547-.37l3.521.738a1.246 1.246 0 0 1 1.172-.78zm-8.224 6.782a.935.935 0 0 0-.937.937.935.935 0 0 0 .937.937.935.935 0 0 0 .937-.937.935.935 0 0 0-.937-.937zm5.33 0a.935.935 0 0 0-.937.937.935.935 0 0 0 .937.937.935.935 0 0 0 .937-.937.935.935 0 0 0-.937-.937zm-2.68 2.946c1.178 0 2.16.224 2.774.672.184.135.2.406.02.555-.232.192-.646.117-.92-.045-.474-.28-1.43-.532-2.614-.532-1.164 0-2.15.265-2.638.54-.26.147-.656.18-.86-.046-.24-.266-.144-.568.072-.772.572-.502 1.58-.756 2.63-.756v-.574l-1.424.22a.292.292 0 0 1-.334-.352l.14-.554a.292.292 0 0 1 .354-.216l1.564.294a.292.292 0 0 1 .21.284v1.464z"/></svg>' +
          'Reddit' +
        '</button>' +
        '<button class="share-btn share-btn-email" data-share="email" aria-label="Share via Email">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
          'Email' +
        '</button>';

      rhInfo.parentNode.insertBefore(shareDiv, rhInfo.nextSibling);

      shareDiv.addEventListener('click', function(e) {
        var btn = e.target.closest('.share-btn');
        if (!btn) return;
        var type = btn.getAttribute('data-share');
        var url = window.location.href;
        var title = document.title;
        switch (type) {
          case 'twitter': window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url), '_blank', 'width=600,height=400'); break;
          case 'linkedin': window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title), '_blank', 'width=600,height=400'); break;
          case 'reddit': window.open('https://reddit.com/submit?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title), '_blank', 'width=600,height=400'); break;
          case 'email': window.location.href = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent('Check this out: ' + url); break;
        }
      });
    }

    // 5. Copy Link Button
    var shareContainer = document.querySelector('.share-buttons');
    if (shareContainer) {
      var copyBtn = document.createElement('button');
      copyBtn.className = 'share-btn share-btn-copy';
      copyBtn.setAttribute('aria-label', 'Copy link');
      copyBtn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' +
        ' Copy Link';
      shareContainer.appendChild(copyBtn);

      copyBtn.addEventListener('click', function() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(window.location.href).then(function() {
            copyBtn.innerHTML = 'Copied!';
            setTimeout(function() {
              copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Copy Link';
            }, 2000);
          }, function() { showToast('Could not copy link', 'error'); });
        } else { showToast('Copy not supported', 'error'); }
      });
    }

  }

  // ============================================
  // Streak, Quiz, Community
  // ============================================

  // 4. Reading Streak System
  (function() {
    var streak;
    try { streak = JSON.parse(localStorage.getItem('readingStreak') || '{"count":0,"lastDate":"","badges":[]}'); } catch(e) { streak = {count:0,lastDate:'',badges:[]}; }
    var today = new Date().toDateString();
    if (streak.lastDate !== today) {
      var yesterday = new Date(Date.now() - 86400000).toDateString();
      if (streak.lastDate === yesterday) {
        streak.count++;
      } else {
        streak.count = 1;
      }
      streak.lastDate = today;
      localStorage.setItem('readingStreak', JSON.stringify(streak));
    }

    // Show streak badge on homepage
    var heroStats = document.querySelector('.hero-stats');
    if (heroStats && streak.count > 1) {
      var badge = document.createElement('span');
      badge.className = 'streak-badge';
      var fireCount = Math.min(streak.count, 30);
      badge.innerHTML = '<span class="streak-fire">🔥</span> ' + streak.count + '-day streak';
      var statEl = heroStats.querySelector('.hero-stat:last-child .label');
      if (statEl) statEl.appendChild(badge);
    }
  })();

  // 5. Community Review Upvote System
  document.querySelectorAll('.review-content').forEach(function(section) {
    var helpfulDiv = document.createElement('div');
    helpfulDiv.className = 'helpful-section';
    var reviewKey = window.location.pathname.split('/').pop().replace('.html', '');
    var votes;
    try { votes = JSON.parse(localStorage.getItem('reviewVotes_' + reviewKey) || '{"yes":0,"no":0,"voted":null}'); } catch(e) { votes = {yes:0,no:0,voted:null}; }

    helpfulDiv.innerHTML =
      '<p>Was this review helpful?</p>' +
      '<div class="helpful-buttons">' +
        '<button class="helpful-btn" data-vote="yes">👍 <span class="count">' + votes.yes + '</span></button>' +
        '<button class="helpful-btn" data-vote="no">👎 <span class="count">' + votes.no + '</span></button>' +
      '</div>' +
      '<span class="helpful-thanks">👍 Thank you for your feedback!</span>';

    var contentContainer = section.querySelector('.container');
    if (contentContainer) {
      contentContainer.appendChild(helpfulDiv);
    } else {
      section.appendChild(helpfulDiv);
    }

    if (votes.voted) {
      helpfulDiv.classList.add('voted');
      helpfulDiv.querySelectorAll('.helpful-btn').forEach(function(btn) {
        if (btn.getAttribute('data-vote') === votes.voted) btn.classList.add('voted');
        btn.style.pointerEvents = 'none';
      });
    }

    helpfulDiv.querySelectorAll('.helpful-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var vote = this.getAttribute('data-vote');
        if (votes.voted) return;
        votes.voted = vote;
        votes[vote]++;
        localStorage.setItem('reviewVotes_' + reviewKey, JSON.stringify(votes));
        this.querySelector('.count').textContent = votes[vote];
        this.classList.add('voted');
        helpfulDiv.classList.add('voted');
        helpfulDiv.querySelectorAll('.helpful-btn').forEach(function(b) {
          b.style.pointerEvents = 'none';
        });
      });
    });
  });

  // ============================================
  // User Review System (Submit + Aggregate + List)
  // ============================================
  (function() {
    if (window.location.pathname.indexOf('/reviews/') === -1) return;

    var slug = window.location.pathname.split('/').pop().replace('.html', '');
    var STORAGE_KEY = 'userReviews_' + slug;
    var VOTE_KEY = 'reviewThumbs_' + slug;

    // Get expert rating from page
    var ratingEl = document.querySelector('.review-header .rating .score');
    var expertRating = ratingEl ? parseFloat(ratingEl.textContent.trim().split('/')[0].trim()) || 0 : 0;

    function loadReviews() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch(e) { return []; }
    }

    function saveReviews(reviews) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    }

    function loadThumbs() {
      try { return JSON.parse(localStorage.getItem(VOTE_KEY)) || {}; } catch(e) { return {}; }
    }

    function saveThumbs(thumbs) {
      localStorage.setItem(VOTE_KEY, JSON.stringify(thumbs));
    }

    var reviews = loadReviews();
    var thumbs = loadThumbs();

    // --- Render aggregate rating ---
    function renderAggregate() {
      var userCount = reviews.length;
      var combined = expertRating;
      if (userCount > 0) {
        var userAvg = reviews.reduce(function(s, r) { return s + r.rating; }, 0) / userCount;
        combined = (expertRating + userAvg) / 2;
      }
      combined = Math.round(combined * 10) / 10;

      var fullStars = Math.floor(combined);
      var partial = combined - fullStars;
      var starHtml = '';
      for (var i = 0; i < 5; i++) {
        if (i < fullStars) starHtml += '★';
        else if (i === fullStars && partial >= 0.3) starHtml += '★';
        else starHtml += '☆';
      }

      var expertStars = '';
      var ef = Math.floor(expertRating);
      for (var i = 0; i < 5; i++) expertStars += i < ef ? '★' : '☆';

      var html = '<div class="aggregate-rating">';
      html += '<div class="aggregate-row">';
      html += '<div class="aggregate-score">';
      html += '<span class="aggregate-number">' + combined + '</span>';
      html += '<div class="aggregate-stars-row">' + starHtml + '</div>';
      html += '<span class="aggregate-label">Combined Rating</span>';
      html += '</div>';
      html += '<div class="aggregate-breakdown">';
      html += '<div class="breakdown-item">';
      html += '<span class="breakdown-badge expert-badge">Expert Review</span>';
      html += expertStars + ' <strong>' + expertRating + '</strong>';
      html += '</div>';
      html += '<div class="breakdown-item">';
      html += '<span class="breakdown-label">User Reviews</span>';
      html += '<strong>' + userCount + '</strong> review' + (userCount !== 1 ? 's' : '');
      html += '</div>';
      html += '</div>';
      html += '</div>';
      html += '</div>';
      return html;
    }

    // --- Render review form ---
    function renderForm() {
      var html = '<div class="review-form-section">';
      html += '<h3 class="section-title">Write a Review</h3>';
      html += '<form class="review-form" id="review-form-' + slug + '">';
      html += '<div class="star-rating-group">';
      html += '<label>Your Rating <span class="required-star">*</span></label>';
      html += '<div class="star-rating" id="star-rating-' + slug + '">';
      for (var i = 1; i <= 5; i++) {
        html += '<button type="button" class="star-btn" data-value="' + i + '" aria-label="Rate ' + i + ' star' + (i > 1 ? 's' : '') + '">';
        html += '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">';
        html += '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>';
        html += '</svg></button>';
      }
      html += '</div>';
      html += '<div class="rating-text" id="rating-text-' + slug + '">Click a star to rate</div>';
      html += '</div>';
      html += '<div class="form-row">';
      html += '<div class="form-group">';
      html += '<label for="review-name-' + slug + '">Name <span class="optional">(optional)</span></label>';
      html += '<input type="text" id="review-name-' + slug + '" class="review-input" placeholder="Your name" maxlength="50">';
      html += '</div>';
      html += '<div class="form-group">';
      html += '<label for="review-title-' + slug + '">Title <span class="optional">(optional)</span></label>';
      html += '<input type="text" id="review-title-' + slug + '" class="review-input" placeholder="Summary of your review" maxlength="100">';
      html += '</div>';
      html += '</div>';
      html += '<div class="form-group">';
      html += '<label for="review-text-' + slug + '">Review <span class="required-star">*</span></label>';
      html += '<textarea id="review-text-' + slug + '" class="review-textarea" placeholder="Share your experience with this tool... What do you like or dislike?" maxlength="500" required></textarea>';
      html += '<div class="char-counter"><span id="char-count-' + slug + '">0</span>/500</div>';
      html += '</div>';
      html += '<button type="submit" class="btn btn-primary review-submit-btn">Submit Review</button>';
      html += '</form>';
      html += '</div>';
      return html;
    }

    // --- Render review list ---
    function renderReviewsList() {
      if (reviews.length === 0) {
        return '<div class="review-list"><h3 class="section-title">User Reviews</h3><div class="no-reviews"><p>No user reviews yet. Be the first to share your experience!</p></div></div>';
      }

      var html = '<div class="review-list">';
      html += '<h3 class="section-title">User Reviews (' + reviews.length + ')</h3>';

      var sorted = reviews.slice().sort(function(a, b) { return new Date(b.date) - new Date(a.date); });

      sorted.forEach(function(review) {
        var rid = review._id;
        var thumbData = thumbs[rid] || { up: false, down: false };

        var fullStars = Math.floor(review.rating);
        var sHtml = '';
        for (var i = 0; i < 5; i++) sHtml += i < fullStars ? '★' : '☆';

        var date = new Date(review.date);
        var dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        var initial = (review.name || 'A').charAt(0).toUpperCase();

        html += '<div class="review-card" data-review-id="' + rid + '">';
        html += '<div class="review-card-header">';
        html += '<div class="review-avatar">' + initial + '</div>';
        html += '<div class="review-meta">';
        html += '<span class="review-author">' + (review.name || 'Anonymous').replace(/</g, '&lt;') + '</span>';
        html += '<span class="review-date">' + dateStr + '</span>';
        html += '</div>';
        html += '<div class="review-card-stars">' + sHtml + '</div>';
        html += '</div>';
        if (review.title) {
          html += '<div class="review-card-title">' + review.title.replace(/</g, '&lt;') + '</div>';
        }
        html += '<div class="review-card-text">' + review.text.replace(/</g, '&lt;') + '</div>';
        html += '<div class="review-card-footer">';
        html += '<div class="review-helpful">';
        html += '<span class="helpful-label">Was this helpful?</span>';
        html += '<button type="button" class="thumb-btn thumb-up' + (thumbData.up ? ' voted' : '') + '" data-review-id="' + rid + '" data-vote="up" aria-label="Mark as helpful">';
        html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="' + (thumbData.up ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';
        html += '</button>';
        html += '<button type="button" class="thumb-btn thumb-down' + (thumbData.down ? ' voted' : '') + '" data-review-id="' + rid + '" data-vote="down" aria-label="Mark as not helpful">';
        html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="' + (thumbData.down ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>';
        html += '</button>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
      });

      html += '</div>';
      return html;
    }

    // --- Build main section ---
    var section = document.createElement('div');
    section.className = 'user-reviews-section';
    section.style.cssText = 'grid-column: 1 / -1; margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--border-light);';

    var container = document.querySelector('.review-content .container');
    if (!container) return;

    section.innerHTML = renderAggregate() + renderForm() + '<div id="user-reviews-container-' + slug + '">' + renderReviewsList() + '</div>';
    container.appendChild(section);

    // --- Star rating interaction ---
    (function() {
      var starBtns = section.querySelectorAll('.star-btn');
      var selectedRating = 0;

      function clearStars() {
        starBtns.forEach(function(sb) {
          var svg = sb.querySelector('svg');
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'var(--text-tertiary)');
        });
      }

      function setStars(val) {
        starBtns.forEach(function(sb) {
          var svg = sb.querySelector('svg');
          var v = parseInt(sb.getAttribute('data-value'));
          if (v <= val) {
            svg.setAttribute('fill', '#F59E0B');
            svg.setAttribute('stroke', '#F59E0B');
          } else {
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'var(--text-tertiary)');
          }
        });
      }

      starBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          selectedRating = parseInt(this.getAttribute('data-value'));
          setStars(selectedRating);
          var rt = section.querySelector('.rating-text');
          var labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
          if (rt) rt.textContent = labels[selectedRating] || 'Click a star to rate';
        });

        btn.addEventListener('mouseenter', function() {
          if (selectedRating === 0) {
            setStars(parseInt(this.getAttribute('data-value')));
          }
        });

        btn.addEventListener('mouseleave', function() {
          if (selectedRating === 0) clearStars();
          else setStars(selectedRating);
        });
      });

      // --- Character counter ---
      var textarea = section.querySelector('.review-textarea');
      var charCount = section.querySelector('[id^="char-count-"]');
      if (textarea && charCount) {
        textarea.addEventListener('input', function() {
          charCount.textContent = this.value.length;
        });
      }

      // --- Form submission ---
      var form = section.querySelector('.review-form');
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();

          if (selectedRating === 0) {
            showToast('Please select a star rating.', 'error');
            return;
          }

          var text = textarea.value.trim();
          if (!text) {
            showToast('Please write your review.', 'error');
            return;
          }

          var nameInput = section.querySelector('[id^="review-name-"]');
          var titleInput = section.querySelector('[id^="review-title-"]');

          var review = {
            _id: Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 6),
            name: nameInput.value.trim() || 'Anonymous',
            title: titleInput.value.trim() || '',
            text: text,
            rating: selectedRating,
            date: new Date().toISOString(),
            slug: slug
          };

          reviews.push(review);
          saveReviews(reviews);

          // Reset
          form.reset();
          selectedRating = 0;
          clearStars();
          charCount.textContent = '0';
          var rt = section.querySelector('.rating-text');
          if (rt) rt.textContent = 'Click a star to rate';

          // Re-render
          var aggEl = section.querySelector('.aggregate-rating');
          var listEl = section.querySelector('[id^="user-reviews-container-"]');
          if (aggEl) aggEl.outerHTML = renderAggregate();
          if (listEl) listEl.innerHTML = renderReviewsList();
          attachThumbHandlers();

          showToast('Thank you! Your review has been submitted.', 'success');
        });
      }
    })();

    // --- Thumbs up/down handlers ---
    function attachThumbHandlers() {
      section.querySelectorAll('.thumb-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var rid = this.getAttribute('data-review-id');
          var vote = this.getAttribute('data-vote');

          if (!thumbs[rid]) thumbs[rid] = { up: false, down: false };

          if (thumbs[rid][vote]) {
            thumbs[rid][vote] = false;
          } else {
            thumbs[rid].up = false;
            thumbs[rid].down = false;
            thumbs[rid][vote] = true;
          }

          saveThumbs(thumbs);

          var card = this.closest('.review-card');
          if (card) {
            card.querySelectorAll('.thumb-btn').forEach(function(tb) {
              tb.classList.remove('voted');
              tb.querySelector('svg').setAttribute('fill', 'none');
            });
            if (thumbs[rid].up) {
              card.querySelector('.thumb-up').classList.add('voted');
              card.querySelector('.thumb-up svg').setAttribute('fill', 'currentColor');
            }
            if (thumbs[rid].down) {
              card.querySelector('.thumb-down').classList.add('voted');
              card.querySelector('.thumb-down svg').setAttribute('fill', 'currentColor');
            }
          }
        });
      });
    }

    attachThumbHandlers();
  })();

  // 6. Tool Quiz System
  var quizData = [
    {
      q: 'What do you want to create?',
      options: [
        { text: 'Blog posts & articles', tags: ['Writing', 'SEO'] },
        { text: 'Images & artwork', tags: ['Image'] },
        { text: 'Code & software', tags: ['Coding'] },
        { text: 'Marketing copy & ads', tags: ['Writing', 'Marketing'] },
        { text: 'Video & audio', tags: ['Video', 'Voice'] }
      ]
    },
    {
      q: 'What is your monthly budget?',
      options: [
        { text: 'Free (open source)', tags: [] },
        { text: 'Under $20/month', tags: [] },
        { text: '$20-$50/month', tags: [] },
        { text: 'Over $50/month', tags: [] }
      ]
    },
    {
      q: 'How experienced are you?',
      options: [
        { text: 'Complete beginner', tags: ['Writing'] },
        { text: 'Some experience', tags: [] },
        { text: 'Professional/Expert', tags: ['Coding'] }
      ]
    }
  ];

  function buildQuizModal() {
    var overlay = document.createElement('div');
    overlay.className = 'quiz-overlay';
    overlay.id = 'quiz-overlay';
    overlay.innerHTML =
      '<div class="quiz-modal">' +
        '<button class="quiz-close" id="quiz-close">&times;</button>' +
        '<div class="quiz-progress" id="quiz-progress"></div>' +
        '<div id="quiz-body"></div>' +
      '</div>';
    document.body.appendChild(overlay);

    var currentQ = 0;
    var answers = [];

    function renderQuestion() {
      if (currentQ >= quizData.length) { renderResult(); return; }
      var q = quizData[currentQ];
      var progressHtml = '';
      for (var i = 0; i < quizData.length; i++) {
        var cls = i < currentQ ? 'done' : i === currentQ ? 'active' : '';
        progressHtml += '<div class="step ' + cls + '"></div>';
      }
      document.getElementById('quiz-progress').innerHTML = progressHtml;

      var body = document.getElementById('quiz-body');
      body.innerHTML =
        '<div class="quiz-question">' +
          '<h3>' + q.q + '</h3>' +
          '<div class="quiz-options">' +
            q.options.map(function(opt, idx) {
              return '<button class="quiz-option" data-idx="' + idx + '">' + opt.text + '</button>';
            }).join('') +
          '</div>' +
        '</div>';

      body.querySelectorAll('.quiz-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
          body.querySelectorAll('.quiz-option').forEach(function(b) { b.classList.remove('selected'); });
          this.classList.add('selected');
          answers[currentQ] = parseInt(this.getAttribute('data-idx'));
          setTimeout(function() { currentQ++; renderQuestion(); }, 400);
        });
      });
    }

    function renderResult() {
      // Find matching tools
      var allCategories = [];
      answers.forEach(function(ansIdx, qIdx) {
        if (quizData[qIdx] && quizData[qIdx].options[ansIdx]) {
          allCategories = allCategories.concat(quizData[qIdx].options[ansIdx].tags);
        }
      });
      var targetCat = allCategories.length > 0 ? allCategories[0] : 'Writing';
      var matches = typeof allTools !== 'undefined' ? allTools.filter(function(t) { return t.cat === targetCat; }).slice(0, 3) : [];

      var progressHtml = '';
      for (var i = 0; i < quizData.length; i++) { progressHtml += '<div class="step done"></div>'; }
      document.getElementById('quiz-progress').innerHTML = progressHtml;

      var body = document.getElementById('quiz-body');
      var html = '<div class="quiz-result">' +
        '<div class="result-icon">🎯</div>' +
        '<h3>We recommend ' + targetCat + ' tools!</h3>' +
        '<p>Based on your answers, here are the best AI tools for you:</p>';

      if (matches.length > 0) {
        html += '<div style="text-align:left;">';
        matches.forEach(function(t) {
          html += '<div style="padding:10px 0;border-bottom:1px solid var(--border-light);display:flex;align-items:center;gap:12px;">' +
            '<div style="width:32px;height:32px;border-radius:8px;background:var(--accent-gradient);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.75rem;flex-shrink:0;">' + t.name.charAt(0) + '</div>' +
            '<div><div style="font-weight:600;font-size:0.9375rem;">' + t.name + '</div><div style="font-size:0.8125rem;color:var(--text-tertiary)">' + t.desc.substring(0, 80) + '...</div></div>' +
            '<a href="reviews/' + t.slug + '.html" style="margin-left:auto;flex-shrink:0;padding:6px 14px;font-size:0.8125rem;font-weight:600;border-radius:8px;background:var(--accent);color:#fff;text-decoration:none;">View</a>' +
          '</div>';
        });
        html += '</div>';
      }
      html +=
        '<button class="btn btn-secondary" id="quiz-restart" style="margin-top:20px;">Take again</button>' +
        '</div>';
      body.innerHTML = html;

      document.getElementById('quiz-restart').addEventListener('click', function() {
        currentQ = 0; answers = []; renderQuestion();
      });
    }

    document.getElementById('quiz-close').addEventListener('click', function() {
      document.getElementById('quiz-overlay').classList.remove('active');
    });
    overlay.addEventListener('click', function(e) {
      if (e.target === this) this.classList.remove('active');
    });

    return overlay;
  }

  var quizOverlay = buildQuizModal();

  // Add quiz trigger on homepage
  var heroSection = document.querySelector('.hero');
  if (heroSection) {
    var quizBtn = document.createElement('button');
    quizBtn.className = 'quiz-start-btn';
    quizBtn.innerHTML = '🎯 Find Your Tool';
    quizBtn.setAttribute('aria-label', 'Take the tool recommendation quiz');
    var heroBtns = document.querySelector('.hero-buttons');
    if (heroBtns) {
      quizBtn.addEventListener('click', function() {
        document.getElementById('quiz-overlay').classList.add('active');
      });
      heroBtns.appendChild(quizBtn);
    }
  }

  // ============================================
  // PHASE 3 EXTRA — Badges, Recommendations, i18n, Quiz Page
  // ============================================

  // ============================================
  // Badge System (Gamification)
  // ============================================
  (function() {
    var BADGE_DATA = [
      { id: 'first-review', name: 'First Review Read', desc: 'Read your first AI tool review', icon: '📖', check: function(stats) { return stats.reviewsRead >= 1; } },
      { id: 'five-reviews', name: 'Review Explorer', desc: 'Read 5 AI tool reviews', icon: '📚', check: function(stats) { return stats.reviewsRead >= 5; } },
      { id: 'first-comparison', name: 'Comparison Shopper', desc: 'Viewed your first comparison', icon: '⚖️', check: function(stats) { return stats.comparisonsViewed >= 1; } },
    ];

    var badgeStats;
    var unlockedBadges;
    try { badgeStats = JSON.parse(localStorage.getItem('badgeStats') || '{"reviewsRead":0,"comparisonsViewed":0}'); } catch(e) { badgeStats = {reviewsRead:0,comparisonsViewed:0}; }
    try { unlockedBadges = JSON.parse(localStorage.getItem('unlockedBadges') || '[]'); } catch(e) { unlockedBadges = []; }
    var newlyUnlocked = [];

    // Track review views
    if (window.location.pathname.indexOf('/reviews/') > -1) {
      badgeStats.reviewsRead++;
    }
    // Track comparison views
    if (window.location.pathname.indexOf('/comparisons/') > -1) {
      badgeStats.comparisonsViewed++;
    }
    function saveBadgeStats() {
      localStorage.setItem('badgeStats', JSON.stringify(badgeStats));
    }
    saveBadgeStats();

    // Check badges
    BADGE_DATA.forEach(function(badge) {
      if (unlockedBadges.indexOf(badge.id) === -1 && badge.check(badgeStats)) {
        unlockedBadges.push(badge.id);
        newlyUnlocked.push(badge);
      }
    });
    localStorage.setItem('unlockedBadges', JSON.stringify(unlockedBadges));

    // Show badge notification toast for newly unlocked badges
    newlyUnlocked.forEach(function(badge) {
      var toast = document.createElement('div');
      toast.className = 'badge-toast';
      toast.innerHTML =
        '<div class="badge-toast-icon">' + badge.icon + '</div>' +
        '<div class="badge-toast-content">' +
          '<h4>🏆 Badge Unlocked!</h4>' +
          '<p><strong>' + badge.name + '</strong> — ' + badge.desc + '</p>' +
        '</div>';
      document.body.appendChild(toast);
      requestAnimationFrame(function() {
        toast.classList.add('show');
      });
      setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() { toast.remove(); }, 500);
      }, 4000);
    });
  })();

  // ============================================
  // AI Recommendation Engine
  // ============================================
  (function() {
    // allTools is defined at the top of main.js
    // Track tool card hovers/clicks
    function trackToolInteraction(slug) {
      if (!slug) return;
      var viewed;
      try { viewed = JSON.parse(localStorage.getItem('viewedTools') || '[]'); } catch(e) { viewed = []; }
      viewed = viewed.filter(function(v) { return v !== slug; });
      viewed.unshift(slug);
      if (viewed.length > 20) viewed = viewed.slice(0, 20);
      localStorage.setItem('viewedTools', JSON.stringify(viewed));
    }

    // Track hovers on tool cards
    document.querySelectorAll('.tool-card').forEach(function(card) {
      var link = card.querySelector('h2 a, h3 a');
      if (!link) return;
      var href = link.getAttribute('href');
      var slug = href ? href.replace(/^.*\/(.*)\.html$/, '$1') : '';
      card.addEventListener('mouseenter', function() { trackToolInteraction(slug); });
      link.addEventListener('click', function() { trackToolInteraction(slug); });
    });

    // Show recommendations on review pages
    if (isReviewPage && typeof allTools !== 'undefined') {
      var currentSlug = window.location.pathname.split('/').pop().replace('.html', '');
      var viewed;
      try { viewed = JSON.parse(localStorage.getItem('viewedTools') || '[]'); } catch(e) { viewed = []; }

      // Find current tool's category
      var currentTool = null;
      for (var i = 0; i < allTools.length; i++) {
        if (allTools[i].slug === currentSlug) { currentTool = allTools[i]; break; }
      }
      if (!currentTool) { currentTool = { cat: '', rating: 0 }; }

      var cat = currentTool.cat;
      var rating = currentTool.rating;

      // Find recommendations: same category, similar rating, exclude current
      var candidates = allTools.filter(function(t) {
        return t.cat === cat && t.slug !== currentSlug && Math.abs(t.rating - rating) <= 0.5;
      });

      // Sort by rating descending and also by viewed (prefer not-yet-viewed)
      candidates.sort(function(a, b) {
        var aViewed = viewed.indexOf(a.slug) > -1 ? 0 : 1;
        var bViewed = viewed.indexOf(b.slug) > -1 ? 0 : 1;
        if (aViewed !== bViewed) return bViewed - aViewed;
        return b.rating - a.rating;
      });

      var recs = candidates.slice(0, 3);
      if (recs.length === 0) {
        // Fallback: recommend top-rated from same category
        candidates = allTools.filter(function(t) {
          return t.cat === cat && t.slug !== currentSlug;
        });
        candidates.sort(function(a, b) { return b.rating - a.rating; });
        recs = candidates.slice(0, 3);
      }
      if (recs.length === 0) {
        // Fallback: recommend top tools overall
        recs = allTools.filter(function(t) { return t.slug !== currentSlug; }).slice(0, 3);
      }

      // Find verdict section or the container to append after
      var verdictSection = document.querySelector('#verdict');
      var container = document.querySelector('.review-content .container');
      if (verdictSection && container) {
        var html = '<div class="recommendations"><h3 data-i18n="recommendations.title">You Might Also Like</h3><div class="tools-grid">';
        recs.forEach(function(t) {
          var stars = '';
          var fullS = Math.floor(t.rating);
          for (var s = 0; s < fullS; s++) stars += '&#9733;';
          for (var s = fullS; s < 5; s++) stars += '&#9734;';
          var badgeClass = 'badge-' + (t.badge || '').toLowerCase();
          html += '<div class="tool-card">' +
            '<div class="tool-card-header"><div class="tool-logo">' + t.name.charAt(0) + '</div>' +
            '<div class="tool-info"><h3><a href="../reviews/' + t.slug + '.html">' + t.name + '</a></h3>' +
            '<span class="tool-badge ' + badgeClass + '">' + (t.badge || '') + '</span></div></div>' +
            '<p class="tool-description">' + t.desc.substring(0, 100) + '...</p>' +
            '<div class="tool-meta"><div class="tool-rating"><span>' + stars + '</span><span>' + t.rating + '</span></div>' +
            '<span class="tool-category">AI ' + t.cat + '</span></div>' +
            '<div class="tool-footer"><a href="../reviews/' + t.slug + '.html" class="btn btn-secondary btn-sm">Read Review</a>' +
            '<a href="/go/' + t.slug + '" target="_blank" rel="sponsored noopener noreferrer" class="btn btn-primary btn-sm">Try Free</a></div></div>';
        });
        html += '</div></div>';
        container.insertAdjacentHTML('beforeend', html);
      }
    }

    // Populate #related-tools fallback if empty
    if (isReviewPage) {
      var relatedToolsEl = document.getElementById('related-tools');
      if (relatedToolsEl && !relatedToolsEl.querySelector('.related-card')) {
        var relatedData = typeof allTools !== 'undefined' ? allTools : window.allTools || [];
        var currentSlug = window.location.pathname.split('/').pop().replace('.html', '');
        var currentCat = '';
        for (var ri = 0; ri < relatedData.length; ri++) {
          if (relatedData[ri].slug === currentSlug) { currentCat = relatedData[ri].cat; break; }
        }
        var related = relatedData.filter(function(t) {
          return t.slug !== currentSlug && (!currentCat || t.cat === currentCat);
        }).sort(function(a, b) { return b.rating - a.rating; }).slice(0, 3);
        if (related.length > 0) {
          var html = '<div class="related-grid">';
          related.forEach(function(t) {
            var stars = '';
            for (var s = 0; s < Math.floor(t.rating); s++) stars += '★';
            for (var s = Math.floor(t.rating); s < 5; s++) stars += '☆';
            html += '<a href="../reviews/' + t.slug + '.html" class="related-card">' +
              '<div class="related-name">' + t.name + '</div>' +
              '<div class="related-cat">AI ' + t.cat + '</div>' +
              '<div class="related-rating">' + stars + ' ' + t.rating + '</div>' +
            '</a>';
          });
          html += '</div>';
          relatedToolsEl.innerHTML = html;
        }
      }
    }

    // Expose for review page data attributes
    var rh1 = document.querySelector('.review-header-info h1');
    if (rh1 && isReviewPage) {
      var toolName = rh1.textContent.replace(' Review 2026', '').replace(' Review', '').trim();
      for (var j = 0; j < allTools.length; j++) {
        if (allTools[j].name === toolName || allTools[j].slug === currentSlug) {
          document.querySelector('.review-header') && document.querySelector('.review-header').setAttribute('data-tool-categories', allTools[j].cat);
          document.querySelector('.review-header') && document.querySelector('.review-header').setAttribute('data-tool-rating', allTools[j].rating);
          break;
        }
      }
    }
  })();

  // ============================================
  // i18n Integration
  // ============================================
  (function() {
    if (typeof i18n === 'undefined') return;

    // Add language switcher to footer
    var footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom) {
      var switcher = document.createElement('div');
      switcher.className = 'lang-switcher';
      switcher.innerHTML =
        '<button data-lang="en" data-i18n-aria="lang.en" aria-label="Switch to English">EN</button>' +
        '<span style="color:var(--text-tertiary);font-size:0.75rem;">|</span>' +
        '<button data-lang="tr" data-i18n-aria="lang.tr" aria-label="Türkçe\'ye geç">TR</button>';
      footerBottom.appendChild(switcher);

      switcher.querySelectorAll('button').forEach(function(btn) {
        btn.addEventListener('click', function() {
          i18n.setLanguage(this.getAttribute('data-lang'));
        });
      });
    }

    // Add data-i18n attributes dynamically
    // Nav items
    var navLinks = document.querySelectorAll('.nav a');
    var navKeys = ['nav.home', 'nav.categories', 'nav.top-tools', 'nav.blog', 'nav.about'];
    navLinks.forEach(function(a, idx) {
      var href = a.getAttribute('href');
      if (href === 'index.html' || href === '../index.html' || href === '/') a.setAttribute('data-i18n', navKeys[0]);
      else if (href && href.indexOf('#categories') > -1) a.setAttribute('data-i18n', navKeys[1]);
      else if (href && href.indexOf('#featured-tools') > -1) a.setAttribute('data-i18n', navKeys[2]);
      else if (href && href.indexOf('blog') > -1) a.setAttribute('data-i18n', navKeys[3]);
      else if (href && href.indexOf('about') > -1) a.setAttribute('data-i18n', navKeys[4]);
    });

    // Footer
    var footerDesc = document.querySelector('.footer-about p');
    if (footerDesc) footerDesc.setAttribute('data-i18n', 'footer.description');
    var footerCopy = document.querySelector('.footer-bottom p:first-child');
    if (footerCopy) footerCopy.setAttribute('data-i18n', 'footer.copyright');
    var footerDisc = document.querySelector('.footer-bottom p:nth-child(2)');
    if (footerDisc) footerDisc.setAttribute('data-i18n', 'footer.disclosure');

    // Search placeholder
    var searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.setAttribute('data-i18n', 'search.placeholder');

    // Hero
    var heroH1 = document.querySelector('.hero h1');
    if (heroH1 && !heroH1.querySelector('.word')) heroH1.setAttribute('data-i18n', 'hero.title');
    var heroP = document.querySelector('.hero p');
    if (heroP) heroP.setAttribute('data-i18n', 'hero.subtitle');
    var heroBtn1 = document.querySelector('.hero-buttons .btn-primary, .hero-buttons a:first-child');
    var heroBtn2 = document.querySelector('.hero-buttons .btn-secondary, .hero-buttons a:last-child');
    if (heroBtn1) heroBtn1.setAttribute('data-i18n', 'hero.cta1');
    if (heroBtn2) heroBtn2.setAttribute('data-i18n', 'hero.cta2');

    // Re-apply translations
    i18n.applyTranslations();
  })();

  // ============================================
  // Quiz Standalone Page Support
  // ============================================
  (function() {
    var isQuizPage = window.location.pathname.indexOf('quiz.html') > -1;
    if (!isQuizPage) return;

    var quizQuestions = [
      {
        q: 'What do you want to create?',
        options: [
          { text: 'Blog posts, articles & content', tags: ['Writing', 'SEO'] },
          { text: 'Images, artwork & designs', tags: ['Image'] },
          { text: 'Code, software & apps', tags: ['Coding'] },
          { text: 'Marketing copy & ads', tags: ['Writing', 'Marketing'] },
          { text: 'Video, audio & voiceovers', tags: ['Video', 'Voice', 'Music'] }
        ]
      },
      {
        q: 'What is your experience level?',
        options: [
          { text: 'Complete beginner — I\'m new to AI tools', tags: ['Writing'] },
          { text: 'Intermediate — I use some AI already', tags: [] },
          { text: 'Expert — I build or deeply use AI systems', tags: ['Coding'] }
        ]
      },
      {
        q: 'What is your budget?',
        options: [
          { text: 'Free — I want tools at no cost', tags: [] },
          { text: 'Budget — Under $20/month', tags: [] },
          { text: 'Standard — $20–$50/month', tags: [] },
          { text: 'Premium — Over $50/month', tags: [] }
        ]
      },
      {
        q: 'How do you prefer to work?',
        options: [
          { text: 'I want a simple, intuitive interface', tags: ['Writing', 'Image'] },
          { text: 'I want powerful features with a learning curve', tags: ['Coding', 'Video'] },
          { text: 'I want collaboration and team features', tags: ['Marketing', 'Productivity'] }
        ]
      },
      {
        q: 'What platform do you use most?',
        options: [
          { text: 'Web browser (desktop/laptop)', tags: [] },
          { text: 'Mobile (phone/tablet)', tags: ['Productivity'] },
          { text: 'Desktop app integration', tags: ['Coding'] }
        ]
      }
    ];

    var quizBody = document.querySelector('.quiz-container');
    if (!quizBody) return;

    var currentQ = 0;
    var answers = [];

    function renderQuestion() {
      if (currentQ >= quizQuestions.length) { renderResult(); return; }
      var q = quizQuestions[currentQ];

      var progressHtml = '<div class="quiz-progress">';
      for (var i = 0; i < quizQuestions.length; i++) {
        var cls = i < currentQ ? 'done' : i === currentQ ? 'active' : '';
        progressHtml += '<div class="step ' + cls + '"></div>';
      }
      progressHtml += '</div>';

      var html = progressHtml;
      html += '<div class="quiz-question" data-q="' + currentQ + '">';
      html += '<h3>' + q.q + '</h3>';
      html += '<div class="quiz-options">';
      q.options.forEach(function(opt, idx) {
        html += '<button class="quiz-option" data-idx="' + idx + '">' + opt.text + '</button>';
      });
      html += '</div></div>';

      quizBody.innerHTML = html;

      quizBody.querySelectorAll('.quiz-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
          quizBody.querySelectorAll('.quiz-option').forEach(function(b) { b.classList.remove('selected'); });
          this.classList.add('selected');
          answers[currentQ] = parseInt(this.getAttribute('data-idx'));
          setTimeout(function() { currentQ++; renderQuestion(); }, 400);
        });
      });
    }

    function renderResult() {
      var allCategories = [];
      answers.forEach(function(ansIdx, qIdx) {
        if (quizQuestions[qIdx] && quizQuestions[qIdx].options[ansIdx]) {
          allCategories = allCategories.concat(quizQuestions[qIdx].options[ansIdx].tags);
        }
      });

      // Score categories
      var catScores = {};
      allCategories.forEach(function(c) {
        catScores[c] = (catScores[c] || 0) + 1;
      });
      var sortedCats = Object.keys(catScores).sort(function(a, b) { return (catScores[b] || 0) - (catScores[a] || 0); });
      var targetCat = sortedCats.length > 0 ? sortedCats[0] : 'Writing';

      var matches = typeof allTools !== 'undefined' ? allTools.filter(function(t) { return t.cat === targetCat; }).sort(function(a, b) { return b.rating - a.rating; }).slice(0, 3) : [];

      var progressHtml = '<div class="quiz-progress">';
      for (var i = 0; i < quizQuestions.length; i++) { progressHtml += '<div class="step done"></div>'; }
      progressHtml += '</div>';

      var html = progressHtml;
      html += '<div class="quiz-result">';
      html += '<div class="result-icon">🎯</div>';
      html += '<h2>Your Recommended Tools</h2>';
      html += '<p>Based on your answers, we recommend exploring <strong>AI ' + targetCat + '</strong> tools:</p>';

      if (matches.length > 0) {
        html += '<div class="result-tools">';
        matches.forEach(function(t) {
          var stars = '';
          for (var s = 0; s < Math.floor(t.rating); s++) stars += '★';
          for (var s = Math.floor(t.rating); s < 5; s++) stars += '☆';
          html += '<a href="reviews/' + t.slug + '.html" class="result-tool-item">' +
            '<div class="rt-logo">' + t.name.charAt(0) + '</div>' +
            '<div class="rt-info">' +
              '<div class="rt-name">' + t.name + '</div>' +
              '<div class="rt-desc">' + t.desc.substring(0, 60) + '...</div>' +
            '</div>' +
            '<div class="rt-rating">' + stars + ' ' + t.rating + '</div>' +
          '</a>';
        });
        html += '</div>';
      }

      html += '<button class="btn btn-secondary restart-btn" id="quiz-restart">Take Again</button>';
      html += '</div>';
      quizBody.innerHTML = html;

      document.getElementById('quiz-restart').addEventListener('click', function() {
        currentQ = 0;
        answers = [];
        renderQuestion();
      });
    }

    // Start quiz
    quizBody.innerHTML =
      '<div class="quiz-header">' +
        '<h1>Find Your Perfect AI Tool</h1>' +
        '<p>Answer 5 quick questions and we\'ll recommend the best tools for your needs.</p>' +
        '<button class="quiz-start-btn" id="quiz-start-btn">🎯 Start Quiz</button>' +
      '</div>';
    document.getElementById('quiz-start-btn').addEventListener('click', function() {
      var quizHeader = this.closest('.quiz-header');
      if (quizHeader) { quizHeader.style.display = 'none'; }
      renderQuestion();
    });
  })();

  // ============================================


  // ============================================
  // Task 3: Jump to Verdict Link
  // ============================================
  (function() {
    if (window.location.pathname.indexOf('/reviews/') === -1) return;

    var verdictHeading = null;
    var headings = document.querySelectorAll('.review-content h2, .review-content h3');
    for (var i = 0; i < headings.length; i++) {
      var text = headings[i].textContent.toLowerCase();
      if (text.indexOf('verdict') > -1 || text.indexOf('conclusion') > -1) {
        verdictHeading = headings[i];
        break;
      }
    }
    if (!verdictHeading) return;

    var verdictId = verdictHeading.id || 'verdict';
    verdictHeading.id = verdictId;

    var verdictLink = document.createElement('a');
    verdictLink.className = 'jump-to-verdict';
    verdictLink.setAttribute('href', '#' + verdictId);
    verdictLink.setAttribute('aria-label', 'Skip to verdict');
    verdictLink.innerHTML = 'Skip to verdict <span class="arrow">→</span>';

    var contentContainer = document.querySelector('.review-content .container');
    if (contentContainer) {
      contentContainer.insertBefore(verdictLink, contentContainer.firstChild);
    }

    verdictLink.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.getElementById(verdictId);
      if (target) {
        var headerOffset = 100;
        var elPos = target.getBoundingClientRect().top;
        var offsetPos = elPos + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPos, behavior: 'smooth' });
      }
    });
  })();

  // ============================================
  // Tier 2 & 3: Progressive Newsletter System
  // ============================================
  (function() {
    var banner = document.getElementById('newsletter-banner');
    var popover = document.getElementById('newsletter-popover');
    var bannerShown = false;
    var popoverShownThisSession = false;

    function isSubscribed() {
      return !!localStorage.getItem('newsletterSubscribed');
    }

    function wasBannerDismissed() {
      var val = localStorage.getItem('newsletterBannerDismissed');
      if (!val) return false;
      var ts = parseInt(val, 10);
      if (isNaN(ts)) return true;
      return (Date.now() - ts) < 7 * 24 * 60 * 60 * 1000;
    }

    function handleScroll() {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? window.scrollY / docHeight : 0;

      // Tier 2: Banner at 40%
      if (!bannerShown && pct > 0.4 && banner) {
        if (!isSubscribed() && !wasBannerDismissed()) {
          banner.classList.add('visible');
          bannerShown = true;
        }
      }

      // Tier 3: Popover at 60%
      if (!popoverShownThisSession && pct > 0.6 && popover) {
        if (!isSubscribed() && !sessionStorage.getItem('newsletterPopoverShown')) {
          try {
            if (!popover.matches(':popover-open')) {
              popover.showPopover();
              sessionStorage.setItem('newsletterPopoverShown', 'true');
              popoverShownThisSession = true;
            }
          } catch(e) {}
        }
      }
    }

    // Banner close button
    if (banner) {
      var closeBtn = banner.querySelector('.banner-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          banner.classList.remove('visible');
          try { localStorage.setItem('newsletterBannerDismissed', Date.now().toString()); } catch(e) {}
        });
      }

      // Banner form submit
      var bannerForm = banner.querySelector('.banner-form');
      if (bannerForm) {
        bannerForm.addEventListener('submit', function(e) {
          e.preventDefault();
          banner.classList.remove('visible');
          try { localStorage.setItem('newsletterSubscribed', 'true'); } catch(e) {}
          if (typeof showToast === 'function') showToast('Successfully subscribed!', 'success');
        });
      }
    }

    // Scroll listener with rAF throttling
    if (banner || popover) {
      var ticking = false;
      window.addEventListener('scroll', function() {
        if (!ticking) {
          requestAnimationFrame(function() {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      });
      // Check once on load in case already past threshold
      handleScroll();
    }
  })();

  // ============================================
});


