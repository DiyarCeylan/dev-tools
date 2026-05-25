(function() {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tools = window.allTools || [];

  // ==========================================
  // PHASE 3A: Smart Tool Search (instant filter)
  // ==========================================
  function initSmartSearch() {
    var searchInput = document.getElementById('search-input') ||
      document.querySelector('.search-box input, [role="searchbox"] input, input[type="search"]');
    if (!searchInput) return;

    var resultsContainer = document.createElement('div');
    resultsContainer.className = 'smart-search-results';
    searchInput.parentNode.appendChild(resultsContainer);

    var debounceTimer;

    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      var q = this.value.trim().toLowerCase();

      if (q.length < 1) {
        resultsContainer.classList.remove('active');
        return;
      }

      debounceTimer = setTimeout(function() {
        var matches = tools.filter(function(t) {
          return t.name.toLowerCase().includes(q) ||
            t.cat.toLowerCase().includes(q) ||
            t.desc.toLowerCase().includes(q);
        }).slice(0, 8);

        if (!matches.length) {
          resultsContainer.innerHTML = '<div class="smart-search-empty">No tools found</div>';
        } else {
          var html = '<div class="smart-search-header">AI Tools</div>';
          matches.forEach(function(t) {
            var stars = '';
            for (var s = 0; s < Math.floor(t.rating); s++) stars += '★';
            html += '<a href="reviews/' + t.slug + '.html" class="smart-search-item">' +
              '<div class="smart-search-name">' + t.name + '</div>' +
              '<div class="smart-search-meta">' +
                '<span class="smart-search-cat">' + t.cat + '</span>' +
                '<span class="smart-search-rating">' + stars + ' ' + t.rating + '</span>' +
              '</div>' +
            '</a>';
          });
          resultsContainer.innerHTML = html;
        }
        resultsContainer.classList.add('active');
      }, 200);
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.search-box, [role="searchbox"]')) {
        resultsContainer.classList.remove('active');
      }
    });
  }

  // ==========================================
  // PHASE 3B: Related Tools Recommendations
  // ==========================================
  function initRelatedTools() {
    var container = document.getElementById('related-tools');
    if (!container || !tools.length) return;

    // Determine current tool slug from URL
    var currentSlug = window.location.pathname.match(/reviews\/(\w[\w-]*)\.html/);
    if (!currentSlug) return;
    currentSlug = currentSlug[1];

    var currentTool = tools.find(function(t) { return t.slug === currentSlug; });
    if (!currentTool) return;

    // Find tools in same category, excluding current
    var related = tools.filter(function(t) {
      return t.slug !== currentSlug && t.cat === currentTool.cat;
    }).sort(function(a, b) { return b.rating - a.rating; }).slice(0, 4);

    if (!related.length) {
      // Fallback: highest rated tools
      related = tools.filter(function(t) { return t.slug !== currentSlug; })
        .sort(function(a, b) { return b.rating - a.rating; }).slice(0, 4);
    }

    var html = '<div class="related-grid">';
    related.forEach(function(t) {
      html += '<a href="reviews/' + t.slug + '.html" class="related-card">' +
        '<div class="related-name">' + t.name + '</div>' +
        '<div class="related-cat">AI ' + t.cat + '</div>' +
        '<div class="related-rating">' + '★'.repeat(Math.floor(t.rating)) + ' ' + t.rating + '</div>' +
      '</a>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  // ==========================================
  // PHASE 3C: Reading Time Estimator
  // ==========================================
  function initReadingTime() {
    var isReview = window.location.pathname.indexOf('/reviews/') > -1;
    var isBlogPost = window.location.pathname.indexOf('/blog/') > -1 && window.location.pathname.split('/').pop() !== 'blog.html';
    if (!isReview && !isBlogPost) return;

    var contentEl = isReview ? document.querySelector('.review-content .container') : document.querySelector('.content-page .container');
    if (!contentEl) return;

    var text = contentEl.textContent || '';
    var wordCount = text.trim().split(/\s+/).filter(function(w) { return w.length > 0; }).length;
    var imageCount = contentEl.querySelectorAll('img').length;
    var wpm = 238;
    var minutes = wordCount / wpm;
    var seconds = minutes * 60 + imageCount * 10;
    var totalMinutes = Math.ceil(seconds / 60);

    if (totalMinutes < 1) totalMinutes = 1;

    var badge = document.createElement('span');
    badge.className = 'reading-time';
    badge.setAttribute('aria-label', totalMinutes + ' minute read');
    badge.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' +
      '</svg>' +
      totalMinutes + ' min read';

    var target = contentEl.querySelector('h2, h3');
    if (target) {
      target.parentNode.insertBefore(badge, target);
    } else {
      contentEl.insertBefore(badge, contentEl.firstChild);
    }
  }

  // ==========================================
  // PHASE 4A: Image Reveal on Scroll
  // ==========================================
  function initImageReveal() {
    if (prefersReduced) return;

    var images = document.querySelectorAll('.review-content img, .blog-post img, article img');
    if (!images.length) return;

    images.forEach(function(img) {
      if (img.closest('.tool-logo, .category-icon, .hero-stats')) return;
      img.classList.add('reveal-image');
      img.loading = 'lazy';

      if (isElementInViewport(img, 200)) {
        img.classList.add('revealed');
      }
    });

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          document.querySelectorAll('.reveal-image:not(.revealed)').forEach(function(img) {
            if (isElementInViewport(img, 200)) {
              img.classList.add('revealed');
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ==========================================
  // PHASE 4B: Subtle Noise Texture Overlay
  // ==========================================
  function initNoiseTexture() {
    if (prefersReduced) return;

    var canvas = document.createElement('canvas');
    canvas.className = 'noise-texture';
    canvas.width = 128;
    canvas.height = 128;

    var ctx = canvas.getContext('2d');
    var imgData = ctx.createImageData(128, 128);
    var data = imgData.data;

    for (var i = 0; i < data.length; i += 4) {
      var val = Math.random() * 40;
      data[i] = val;
      data[i+1] = val;
      data[i+2] = val;
      data[i+3] = 12;
    }
    ctx.putImageData(imgData, 0, 0);

    document.body.appendChild(canvas);
  }

  // ==========================================
  // PHASE 4C: Parallax Images on Scroll
  // ==========================================
  function initParallaxImages() {
    if (prefersReduced) return;

    var targets = document.querySelectorAll('[data-parallax], .parallax-image, .hero-image img, .review-header img');
    if (!targets.length) return;

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          targets.forEach(function(el) {
            var rect = el.getBoundingClientRect();
            var center = rect.top + rect.height / 2;
            var viewportMid = window.innerHeight / 2;
            var offset = (center - viewportMid) * 0.05;

            el.style.transform = 'translateY(' + offset + 'px)';
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ==========================================
  // PHASE 5B: Keyboard Shortcuts (Shift+?)
  // ==========================================
  function initKeyboardShortcuts() {
    var shortcuts = [
      { key: 'k', mod: '⌘', label: 'Command Palette' },
      { key: 'd', mod: '⌘', label: 'Toggle Dark Mode' },
      { key: '↑', mod: '', label: 'Scroll to Top' },
      { key: '?', mod: '⇧', label: 'Show Shortcuts' }
    ];

    document.addEventListener('keydown', function(e) {
      // Shift+? to show shortcuts
      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        showShortcutsPanel(shortcuts);
      }
      // Cmd+K already handled by cmd palette
      // Cmd+D for dark mode
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        var toggleBtn = document.querySelector('.dark-mode-toggle, [data-theme-toggle]');
        if (toggleBtn) toggleBtn.click();
      }
      // Arrow up at top to scroll to top
      if (e.key === 'ArrowUp' && window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  function showShortcutsPanel(shortcuts) {
    var existing = document.querySelector('.shortcuts-panel');
    if (existing) {
      existing.remove();
      return;
    }

    var panel = document.createElement('div');
    panel.className = 'shortcuts-panel';
    var html = '<div class="shortcuts-header">Keyboard Shortcuts</div><div class="shortcuts-list">';
    shortcuts.forEach(function(s) {
      html += '<div class="shortcut-item">' +
        '<span class="shortcut-key"><kbd>' + s.mod + '</kbd><kbd>' + s.key + '</kbd></span>' +
        '<span>' + s.label + '</span>' +
      '</div>';
    });
    html += '</div>';
    panel.innerHTML = html;
    document.body.appendChild(panel);

    setTimeout(function() {
      panel.classList.add('active');
    }, 10);

    panel.addEventListener('click', function(e) {
      if (e.target === panel) {
        panel.classList.remove('active');
        setTimeout(function() { panel.remove(); }, 200);
      }
    });
  }

  // ==========================================
  // PHASE 7A: Rating Distribution Bar Chart
  // ==========================================
  function initRatingChart() {
    var charts = document.querySelectorAll('.rating-chart');
    if (!charts.length) return;

    charts.forEach(function(container) {
      var data = [
        { label: '5★', count: 8, color: '#10B981' },
        { label: '4★', count: 12, color: '#3B82F6' },
        { label: '3★', count: 5, color: '#F59E0B' },
        { label: '2★', count: 2, color: '#F97316' },
        { label: '1★', count: 1, color: '#EF4444' }
      ];
      var maxCount = Math.max.apply(Math, data.map(function(d) { return d.count; }));

      var html = '<div class="rating-chart-bars">';
      data.forEach(function(d) {
        var pct = (d.count / maxCount) * 100;
        html += '<div class="rating-chart-row">' +
          '<span class="rating-chart-label">' + d.label + '</span>' +
          '<div class="rating-chart-bar"><div class="rating-chart-fill" style="width:' + pct + '%;background:' + d.color + '"></div></div>' +
          '<span class="rating-chart-count">' + d.count + '</span>' +
        '</div>';
      });
      html += '</div>';
      container.innerHTML = html;
    });
  }

  // ==========================================
  // PHASE 7B: Feature Comparison Mini-Chart
  // ==========================================
  function initComparisonChart() {
    var containers = document.querySelectorAll('.comparison-chart');
    if (!containers.length) return;

    containers.forEach(function(container) {
      var data = [
        { label: 'Ease of Use', a: 4.5, b: 4.0 },
        { label: 'Features', a: 4.8, b: 4.2 },
        { label: 'Pricing', a: 3.5, b: 4.5 },
        { label: 'Support', a: 4.0, b: 4.3 },
        { label: 'Performance', a: 4.7, b: 4.1 }
      ];

      var toolNameA = container.getAttribute('data-tool-a') || 'Tool A';
      var toolNameB = container.getAttribute('data-tool-b') || 'Tool B';

      var html = '<div class="comparison-chart-header">' +
        '<span class="comparison-chart-title">Feature Comparison</span>' +
        '<div class="comparison-chart-legend">' +
          '<span><span class="legend-dot" style="background:var(--accent)"></span>' + toolNameA + '</span>' +
          '<span><span class="legend-dot" style="background:var(--accent-secondary, #8B5CF6)"></span>' + toolNameB + '</span>' +
        '</div>' +
      '</div><div class="comparison-chart-body">';

      data.forEach(function(d) {
        html += '<div class="comparison-row">' +
          '<span class="comparison-label">' + d.label + '</span>' +
          '<div class="comparison-bars">' +
            '<div class="comparison-bar comparison-bar-a" style="width:' + (d.a / 5 * 100) + '%"></div>' +
            '<div class="comparison-bar comparison-bar-b" style="width:' + (d.b / 5 * 100) + '%"></div>' +
          '</div>' +
          '<div class="comparison-values">' +
            '<span>' + d.a.toFixed(1) + '</span><span>' + d.b.toFixed(1) + '</span>' +
          '</div>' +
        '</div>';
      });

      html += '</div>';
      container.innerHTML = html;
    });
  }

  // ==========================================
  // Utility: element in viewport
  // ==========================================
  function isElementInViewport(el, offset) {
    offset = offset || 0;
    var rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight + offset &&
      rect.bottom > -offset
    );
  }

  // ==========================================
  // Initialize
  // ==========================================
  function init() {
    initSmartSearch();
    initRelatedTools();
    initReadingTime();
    initImageReveal();
    initNoiseTexture();
    initParallaxImages();
    initKeyboardShortcuts();
    initRatingChart();
    initComparisonChart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
