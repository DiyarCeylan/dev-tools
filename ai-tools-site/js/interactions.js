(function() {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ==========================================
  // PHASE 6A: Custom Cursor
  // ==========================================
  function initCustomCursor() {
    if (isTouch || prefersReduced) return;

    var cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
    document.body.appendChild(cursor);

    var dot = cursor.querySelector('.cursor-dot');
    var ring = cursor.querySelector('.cursor-ring');
    var posX = 0, posY = 0;
    var ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function(e) {
      posX = e.clientX;
      posY = e.clientY;
      dot.style.transform = 'translate(' + posX + 'px, ' + posY + 'px)';
    });

    var ringRAF = null;
    function smoothRing() {
      ringX += (posX - ringX) * 0.15;
      ringY += (posY - ringY) * 0.15;
      ring.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px)';
      ringRAF = requestAnimationFrame(smoothRing);
    }
    smoothRing();
    document.addEventListener('visibilitychange', function() {
      if (document.hidden && ringRAF) {
        cancelAnimationFrame(ringRAF);
        ringRAF = null;
      } else if (!document.hidden && !ringRAF) {
        smoothRing();
      }
    });

    // Hover effects for interactive elements
    var hoverTargets = 'a, button, .tool-card, .category-card, .btn, input, select, textarea';
    document.addEventListener('mouseover', function(e) {
      var target = e.target.closest(hoverTargets);
      if (target) {
        cursor.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', function(e) {
      var target = e.target.closest(hoverTargets);
      if (target) {
        cursor.classList.remove('cursor-hover');
      }
    });

    // Hide cursor on window leave
    document.addEventListener('mouseleave', function() {
      cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
      cursor.style.opacity = '1';
    });

    // Hide cursor on click
    document.addEventListener('mousedown', function() {
      cursor.classList.add('cursor-click');
      setTimeout(function() {
        cursor.classList.remove('cursor-click');
      }, 200);
    });
  }

  // ==========================================
  // PHASE 6B: Smooth Page Transitions (SPA-like)
  // ==========================================
  function initPageTransitions() {
    var transitionEl = document.createElement('div');
    transitionEl.className = 'page-transition';
    document.body.appendChild(transitionEl);

    var isTransitioning = false;

    function transitionTo(url) {
      if (isTransitioning) return;
      isTransitioning = true;

      transitionEl.classList.add('active');

      setTimeout(function() {
        window.location.href = url;
      }, 500);
    }

    document.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('https') ||
          href.startsWith('mailto:') || href.startsWith('javascript:') ||
          href.startsWith('tel:') || href.startsWith('#') || href.startsWith('/go/') ||
          link.getAttribute('target') === '_blank') {
        return;
      }

      if (href.indexOf('.html') === -1 && href !== '/') return;
      if (href === window.location.pathname || href === window.location.pathname.replace(/\/[^\/]*$/, '/') + href) return;

      e.preventDefault();
      transitionTo(href);
    });
  }

  // ==========================================
  // PHASE 6C: Command Palette (Cmd+K)
  // ==========================================
  function initCommandPalette() {
    var overlay = document.createElement('div');
    overlay.className = 'cmd-palette-overlay';
    overlay.innerHTML =
      '<div class="cmd-palette">' +
        '<div class="cmd-palette-header">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
            '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
          '</svg>' +
          '<input type="text" class="cmd-palette-input" placeholder="Search AI tools or type a command..." autocomplete="off">' +
          '<span class="cmd-palette-hint">ESC to close</span>' +
        '</div>' +
        '<div class="cmd-palette-results"></div>' +
        '<div class="cmd-palette-footer">' +
          '<span><strong>↑↓</strong> Navigate</span>' +
          '<span><strong>↵</strong> Open</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = overlay.querySelector('.cmd-palette-input');
    var results = overlay.querySelector('.cmd-palette-results');
    var isOpen = false;
    var highlightIdx = -1;

    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        togglePalette();
      }
      if (e.key === 'Escape' && isOpen) {
        closePalette();
      }
    });

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closePalette();
    });

    function togglePalette() {
      if (isOpen) closePalette();
      else openPalette();
    }

    function openPalette() {
      isOpen = true;
      overlay.classList.add('active');
      input.value = '';
      results.innerHTML = '<div class="cmd-palette-empty">Start typing to search...</div>';
      setTimeout(function() { input.focus(); }, 100);
    }

    function closePalette() {
      isOpen = false;
      overlay.classList.remove('active');
      input.blur();
    }

    // Tool data for search
    var toolData = typeof allTools !== 'undefined' ? allTools : [];

    // Also add navigation commands
    var commands = [
      { name: 'Go to Homepage', action: function() { window.location.href = 'index.html'; } },
      { name: 'Browse AI Writing Tools', action: function() { window.location.href = 'categories/writing-tools.html'; } },
      { name: 'Browse AI Image Tools', action: function() { window.location.href = 'categories/image-tools.html'; } },
      { name: 'Browse AI Coding Tools', action: function() { window.location.href = 'categories/coding-tools.html'; } },
      { name: 'Browse AI Video Tools', action: function() { window.location.href = 'categories/video-tools.html'; } },
      { name: 'Browse AI SEO Tools', action: function() { window.location.href = 'categories/seo-tools.html'; } },
      { name: 'Browse all Reviews', action: function() { window.location.href = 'index.html#featured-tools'; } },
      { name: 'Read Our Blog', action: function() { window.location.href = 'blog/blog.html'; } },
      { name: 'Take the AI Tool Quiz', action: function() { window.location.href = 'quiz.html'; } },
      { name: 'Toggle Dark Mode', action: function() {
          var btn = document.querySelector('.dark-mode-toggle');
          if (btn) btn.click();
          closePalette();
        }
      },
      { name: 'Go to Comparisons', action: function() { window.location.href = 'comparisons/comparisons.html'; } }
    ];

    input.addEventListener('input', function() {
      var q = this.value.toLowerCase().trim();
      highlightIdx = -1;

      if (!q) {
        results.innerHTML = '<div class="cmd-palette-empty">Start typing to search...</div>';
        return;
      }

      var matchedTools = toolData.filter(function(t) {
        return t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q);
      }).slice(0, 6);

      var matchedCommands = commands.filter(function(c) {
        return c.name.toLowerCase().includes(q);
      }).slice(0, 4);

      var html = '';

      if (matchedCommands.length) {
        html += '<div class="cmd-palette-group">Commands</div>';
        matchedCommands.forEach(function(cmd) {
          html += '<div class="cmd-palette-item" data-type="command" data-name="' + cmd.name.replace(/"/g, '&quot;') + '">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>' +
            '<span>' + cmd.name + '</span>' +
          '</div>';
        });
      }

      if (matchedTools.length) {
        html += '<div class="cmd-palette-group">AI Tools</div>';
        matchedTools.forEach(function(t) {
          var badgeClass = 'badge-' + (t.badge || '').toLowerCase();
          html += '<div class="cmd-palette-item" data-type="tool" data-slug="' + t.slug + '">' +
            '<span class="cmd-palette-tool-badge ' + badgeClass + '">' + (t.badge || '') + '</span>' +
            '<span>' + t.name + '</span>' +
            '<span class="cmd-palette-cat">AI ' + t.cat + '</span>' +
            '<span class="cmd-palette-rating">' + '★'.repeat(Math.floor(t.rating)) + ' ' + t.rating + '</span>' +
          '</div>';
        });
      }

      if (!matchedTools.length && !matchedCommands.length) {
        html = '<div class="cmd-palette-empty">No results for "<strong>' + q.replace(/</g,'&lt;') + '</strong>"</div>';
      }

      results.innerHTML = html;
    });

    // Click delegation for palette items
    results.addEventListener('click', function(e) {
      var item = e.target.closest('.cmd-palette-item');
      if (!item) return;
      var type = item.getAttribute('data-type');
      if (type === 'tool') {
        var slug = item.getAttribute('data-slug');
        closePalette();
        window.location.href = 'reviews/' + slug + '.html';
      } else if (type === 'command') {
        var name = item.getAttribute('data-name');
        var cmd = commands.find(function(c) { return c.name === name; });
        if (cmd) { closePalette(); cmd.action(); }
      }
    });

    // Keyboard nav
    input.addEventListener('keydown', function(e) {
      var items = results.querySelectorAll('.cmd-palette-item');
      if (!items.length) return;

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
      } else if (e.key === 'Enter' && highlightIdx >= 0) {
        e.preventDefault();
        items[highlightIdx].click();
      }
    });
  }

  // ==========================================
  // PHASE 5: Confetti Burst Effect
  // ==========================================
  var confettiColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  function burstConfetti(originX, originY) {
    if (prefersReduced) return;

    var container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    var count = 60;

    for (var i = 0; i < count; i++) {
      var piece = document.createElement('div');
      piece.className = 'confetti-piece';
      var color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      var size = 6 + Math.random() * 8;
      var angle = Math.random() * 360;
      var velocity = 4 + Math.random() * 8;
      var rad = angle * (Math.PI / 180);
      var vx = Math.cos(rad) * velocity;
      var vy = Math.sin(rad) * velocity - 2;
      var rot = Math.random() * 720;
      var delay = Math.random() * 0.3;

      piece.style.cssText =
        'position:absolute;left:' + originX + 'px;top:' + originY + 'px;' +
        'width:' + size + 'px;height:' + size * 0.6 + 'px;' +
        'background:' + color + ';' +
        'border-radius:' + (Math.random() > 0.5 ? '50%' : '2px') + ';' +
        'pointer-events:none;' +
        'opacity:1;' +
        'transform:rotate(0deg);' +
        'transition:none;';

      container.appendChild(piece);

      var startTime = performance.now();
      var duration = 1200 + Math.random() * 800;

      function animatePiece(currentTime) {
        var elapsed = currentTime - startTime;
        if (elapsed < delay * 1000) {
          requestAnimationFrame(animatePiece);
          return;
        }
        var progress = Math.min((elapsed - delay * 1000) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var x = vx * eased * 20;
        var y = vy * eased * 20 + (progress * progress * 200);
        var opacity = 1 - progress;
        var rotation = rot * eased;

        piece.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + rotation + 'deg)';
        piece.style.opacity = opacity;

        if (progress < 1) {
          requestAnimationFrame(animatePiece);
        } else {
          piece.remove();
        }
      }
      requestAnimationFrame(animatePiece);
    }

    setTimeout(function() {
      if (container.parentNode) container.remove();
    }, 3000);
  }

  // Hook confetti into badge unlock notifications
  (function() {
    // Patch: confetti on badge unlock
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(node) {
          if (node.classList && node.classList.contains('badge-toast')) {
            var rect = node.getBoundingClientRect();
            burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: false });
    window.addEventListener('pagehide', function() { observer.disconnect(); });
  })();

  // ==========================================
  // INITIALIZE
  // ==========================================
  function init() {
    if (!isTouch && !prefersReduced) {
      initCustomCursor();
    }
    initCommandPalette();

    // Only init page transitions on non-IE browsers
    if (!document.documentMode) {
      initPageTransitions();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      var trans = document.querySelector('.page-transition');
      if (trans) trans.classList.remove('active');
    }
  });

  // Expose confetti globally
  window.burstConfetti = burstConfetti;

})();
