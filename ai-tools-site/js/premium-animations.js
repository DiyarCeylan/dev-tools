(function() {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================
  // PHASE 2: GSAP-level Scroll Animations
  // ==========================================

  // 1. Split Text Reveal (word-by-word)
  function initSplitTextReveal() {
    document.querySelectorAll('.hero h1, .section-header h2, .page-header h1').forEach(function(el) {
      if (el.closest('.hero')) return; // Hero already has word split
      if (el.querySelector('.word')) return;
      var text = el.textContent;
      var words = text.split(' ');
      el.innerHTML = words.map(function(w) {
        return '<span class="word">' + w + '</span>';
      }).join(' ');
    });
  }

  // 2. Staggered Entrance with Direction Variants
  function initStaggeredEntrance() {
    // Set CSS custom property for delay (used by CSS scroll-driven animation)
    document.querySelectorAll('[data-reveal][data-delay]').forEach(function(el) {
      el.style.setProperty('--delay', el.getAttribute('data-delay'));
    });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseFloat(el.getAttribute('data-delay')) || 0;
          var dir = el.getAttribute('data-dir') || 'up';

          el.style.opacity = '0';
          if (dir === 'left') {
            el.style.transform = 'translateX(-40px)';
          } else if (dir === 'right') {
            el.style.transform = 'translateX(40px)';
          } else if (dir === 'scale') {
            el.style.transform = 'scale(0.9)';
          } else {
            el.style.transform = 'translateY(30px)';
          }

          requestAnimationFrame(function() {
            el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ' + delay + 's';
            el.style.opacity = '1';
            el.style.transform = 'translate(0) scale(1)';
          });

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(function(el) {
      observer.observe(el);
    });
  }

  // 3. Animated Number Counters
  function initCounters() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count')) || 0;
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = parseInt(el.getAttribute('data-duration')) || 2000;
          var startTime = performance.now();

          function update(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current.toLocaleString() + suffix;

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              el.textContent = target.toLocaleString() + suffix;
            }
          }
          requestAnimationFrame(update);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter').forEach(function(el) {
      observer.observe(el);
    });
  }

  // 4. Horizontal Scroll Section
  function initHorizontalScroll() {
    var container = document.querySelector('.scroll-horizontal');
    if (!container) return;

    var wrapper = container.querySelector('.scroll-horizontal-track');
    if (!wrapper) return;

    var stickyContainer = document.createElement('div');
    stickyContainer.className = 'scroll-horizontal-sticky';
    container.parentNode.insertBefore(stickyContainer, container);
    stickyContainer.appendChild(container);

    var scrollSpeed = parseFloat(container.getAttribute('data-speed')) || 1;

    function updateHorizontalScroll() {
      var rect = stickyContainer.getBoundingClientRect();
      var parentHeight = stickyContainer.parentElement.offsetHeight;

      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        var progress = -rect.top / (stickyContainer.offsetHeight - window.innerHeight);
        var maxScroll = wrapper.scrollWidth - container.offsetWidth;
        var x = progress * maxScroll * scrollSpeed;
        wrapper.style.transform = 'translateX(' + (-x) + 'px)';
      }
    }

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          updateHorizontalScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    window.addEventListener('resize', updateHorizontalScroll);
  }

  // 5. Reveal on scroll with progress tracking
  function initProgressReveal() {
    document.querySelectorAll('[data-progress]').forEach(function(el) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var rect = entry.boundingClientRect;
            var windowH = window.innerHeight;
            var progress = 1 - (rect.top / windowH);
            progress = Math.max(0, Math.min(1, progress));
            var eased = 1 - Math.pow(1 - progress, 2);
            el.style.setProperty('--progress', eased);
            el.classList.add('in-view');
          } else {
            el.classList.remove('in-view');
          }
        });
      }, { threshold: Array.from({length: 20}, function(_, i) { return i / 20; }) });
      observer.observe(el);
    });
  }

  // ==========================================
  // PHASE 4: Premium Visual Effects
  // ==========================================

  // 1. Dynamic Mesh Gradient (follows mouse on hero)
  function initMeshGradient() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    var shapes = hero.querySelectorAll('.hero-shape');
    hero.addEventListener('mousemove', function(e) {
      var rect = this.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;

      shapes.forEach(function(shape, idx) {
        var speed = 15 + idx * 8;
        var rotSpeed = 0.5 + idx * 0.3;
        shape.style.transform =
          'translate(' + (x * speed) + 'px, ' + (y * speed) + 'px) ' +
          'rotate(' + (x * y * rotSpeed * 20) + 'deg)';
      });
    });

    hero.addEventListener('mouseleave', function() {
      shapes.forEach(function(shape) {
        shape.style.transform = '';
      });
    });
  }

  // 2. Spotlight Effect on Dark sections
  function initSpotlight() {
    var sections = document.querySelectorAll('.newsletter, .footer');
    if (!sections.length) return;

    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    sections.forEach(function(section) {
      var spot = document.createElement('div');
      spot.className = 'spotlight';
      section.appendChild(spot);

      section.addEventListener('mousemove', function(e) {
        var rect = this.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        spot.style.background =
          'radial-gradient(circle at ' + x + '% ' + y + '%, rgba(59,130,246,0.12) 0%, transparent 60%)';
        spot.style.opacity = '1';
      });

      section.addEventListener('mouseleave', function() {
        spot.style.opacity = '0';
      });
    });
  }

  // 3. Liquid Button Effect
  function initLiquidButtons() {
    var buttons = document.querySelectorAll('.btn-primary.btn-lg, .btn-accent.btn-lg');
    if (!buttons.length) return;

    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    buttons.forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var rect = this.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;

        this.style.setProperty('--mx', x);
        this.style.setProperty('--my', y);
        this.classList.add('liquid');
      });

      btn.addEventListener('mouseleave', function() {
        this.classList.remove('liquid');
      });
    });
  }

  // ==========================================
  // INITALIZE
  // ==========================================
  function init() {
    if (prefersReducedMotion) {
      // Reveal everything immediately without animation
      document.querySelectorAll('[data-reveal]').forEach(function(el) {
        el.classList.add('in-view');
        el.style.opacity = '1';
      });
      document.querySelectorAll('.tool-card, .category-card, .blog-card').forEach(function(el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      document.querySelectorAll('[data-progress]').forEach(function(el) {
        el.classList.add('in-view');
      });
      document.querySelectorAll('.stagger-children > *').forEach(function(el) {
        el.style.opacity = '1';
      });
      document.querySelectorAll('.section-header h2 .word, .page-header h1 .word').forEach(function(el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      document.querySelectorAll('.hero p, .hero-buttons, .hero-stats').forEach(function(el) {
        el.style.opacity = '1';
        el.style.animation = 'none';
      });
      return; // Skip all animated effects
    }
    initSplitTextReveal();
    initStaggeredEntrance();
    initCounters();
    initHorizontalScroll();
    initProgressReveal();
    initMeshGradient();
    initSpotlight();
    initLiquidButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('pageshow', function(e) {
    if (e.persisted) init();
  });

})();
