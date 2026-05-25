/*
 * three-effects.js — NO LONGER USED
 *
 * Three.js and its related effects have been replaced by pure CSS animations.
 * See style.css for .hero-canvas gradient/grid/particle animations.
 * The floating shapes (hero-shape-*) are still handled via CSS in style.css.
 * The fluid background, card tilt, and parallax effects have been removed.
 */
(function() {
  'use strict';

  // This file is no longer used. Three.js has been replaced by pure CSS animations.
  return;

  var THREE = window.THREE;

  // ==========================================
  // 1. Neural Network Particle Hero
  // ==========================================
  function initNeuralNetwork() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas || !THREE) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var COUNT = 140;
    var positions = new Float32Array(COUNT * 3);
    var velocities = [];
    var sizes = new Float32Array(COUNT);

    for (var i = 0; i < COUNT; i++) {
      positions[i*3] = (Math.random() - 0.5) * 28;
      positions[i*3+1] = (Math.random() - 0.5) * 20;
      positions[i*3+2] = (Math.random() - 0.5) * 14;
      velocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.008
      });
      sizes[i] = 0.08 + Math.random() * 0.12;
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var particleColor = new THREE.Color(isDark ? '#60A5FA' : '#3B82F6');
    var lineColor = new THREE.Color(isDark ? '#60A5FA' : '#3B82F6');

    var mat = new THREE.PointsMaterial({
      size: 0.15,
      color: particleColor,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    var particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // Line connections
    var maxLines = 180;
    var linePositions = new Float32Array(maxLines * 6);
    var lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setDrawRange(0, 0);
    var lineMat = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    var lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    var mouseX = 0;
    var mouseY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
      requestAnimationFrame(animate);

      var pos = geo.attributes.position.array;
      var linePos = lineGeo.attributes.position.array;

      for (var i = 0; i < COUNT; i++) {
        pos[i*3] += velocities[i].x;
        pos[i*3+1] += velocities[i].y;
        pos[i*3+2] += velocities[i].z;
        if (Math.abs(pos[i*3]) > 14) velocities[i].x *= -1;
        if (Math.abs(pos[i*3+1]) > 10) velocities[i].y *= -1;
        if (Math.abs(pos[i*3+2]) > 7) velocities[i].z *= -1;
      }
      geo.attributes.position.needsUpdate = true;

      var lineIdx = 0;
      var threshold = 4.5;
      var d = document.documentElement.getAttribute('data-theme') === 'dark';
      var baseOp = d ? 0.15 : 0.08;

      for (var i = 0; i < COUNT && lineIdx < maxLines; i++) {
        for (var j = i + 1; j < COUNT && lineIdx < maxLines; j++) {
          var dx = pos[i*3] - pos[j*3];
          var dy = pos[i*3+1] - pos[j*3+1];
          var dz = pos[i*3+2] - pos[j*3+2];
          var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < threshold) {
            linePos[lineIdx*6] = pos[i*3];
            linePos[lineIdx*6+1] = pos[i*3+1];
            linePos[lineIdx*6+2] = pos[i*3+2];
            linePos[lineIdx*6+3] = pos[j*3];
            linePos[lineIdx*6+4] = pos[j*3+1];
            linePos[lineIdx*6+5] = pos[j*3+2];
            lineIdx++;
          }
        }
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx * 2);
      lineMat.opacity = baseOp * Math.min(lineIdx / 40, 1);

      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 1.2 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      particles.rotation.y += 0.0003;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Watch theme changes
    var themeObserver = new MutationObserver(function() {
      var dark = document.documentElement.getAttribute('data-theme') === 'dark';
      var c = new THREE.Color(dark ? '#60A5FA' : '#3B82F6');
      mat.color.copy(c);
      lineMat.color.copy(c);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  // ==========================================
  // 2. 3D Floating Elements for Category Cards
  // ==========================================
  function initFloating3DElements() {
    var cards = document.querySelectorAll('.category-card');
    if (!cards.length) return;

    cards.forEach(function(card, idx) {
      var icon = card.querySelector('.category-icon');
      if (!icon) return;

      icon.style.transition = 'transform 0.1s ease-out';
      card.style.transition = 'transform 0.3s ease-out';

      card.addEventListener('mousemove', function(e) {
        var rect = this.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotX = (y - 0.5) * -8;
        var rotY = (x - 0.5) * 8;

        this.style.transform =
          'perspective(600px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-4px)';
        icon.style.transform =
          'translateZ(30px) rotateX(' + (rotX * -0.5) + 'deg) rotateY(' + (rotY * -0.5) + 'deg)';
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        icon.style.transform = '';
      });
    });
  }

  // ==========================================
  // 3. Enhanced 3D Card Tilt with Depth Layers
  // ==========================================
  function initEnhancedCardTilt() {
    var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    document.querySelectorAll('.tool-card').forEach(function(card) {
      var layers = card.querySelectorAll(
        '.tool-card-header, .tool-description, .tool-meta, .tool-footer, .tool-logo'
      );

      card.addEventListener('mousemove', function(e) {
        var rect = this.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var tiltX = (y - 0.5) * -16;
        var tiltY = (x - 0.5) * 16;

        this.style.transform =
          'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-6px)';
        this.style.boxShadow =
          (tiltY > 0 ? '' : '-') + Math.abs(tiltY) * 1.5 + 'px ' +
          (tiltX > 0 ? '' : '-') + Math.abs(tiltX) * 1.5 + 'px 30px -5px rgba(0,0,0,0.12), ' +
          '0 10px 10px -5px rgba(0,0,0,0.04)';

        // Depth layers
        layers.forEach(function(layer, idx) {
          var depth = (idx + 1) * 8;
          var translateZ = 15 + depth;
          var rotComp = (idx % 2 === 0) ? 1 : -0.5;
          layer.style.transform =
            'translateZ(' + translateZ + 'px) rotateX(' + (tiltX * 0.3 * rotComp) + 'deg) rotateY(' + (tiltY * 0.3 * rotComp) + 'deg)';
        });
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
        layers.forEach(function(l) { l.style.transform = ''; });
      });
    });
  }

  // ==========================================
  // 4. WebGL Fluid Background (simplified canvas)
  // ==========================================
  function initFluidBackground() {
    var el = document.querySelectorAll('.fluid-bg');
    if (!el.length) return;

    el.forEach(function(section) {
      var canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
      section.style.position = 'relative';
      section.insertBefore(canvas, section.firstChild);

      var ctx = canvas.getContext('2d');
      var w, h;
      var particles = [];
      var particleCount = 60;

      function resize() {
        w = section.offsetWidth;
        h = section.offsetHeight;
        canvas.width = w;
        canvas.height = h;
      }

      function isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
      }

      function createParticles() {
        particles = [];
        for (var i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: 15 + Math.random() * 30,
            alpha: 0.02 + Math.random() * 0.03
          });
        }
      }

      resize();
      createParticles();

      var time = 0;

      function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, w, h);
        time += 0.002;

        var dark = isDark();
        var hue = 210 + Math.sin(time * 0.5) * 10;

        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];
          p.x += p.vx + Math.sin(time + i) * 0.1;
          p.y += p.vy + Math.cos(time + i) * 0.1;

          if (p.x < -p.r) p.x = w + p.r;
          if (p.x > w + p.r) p.x = -p.r;
          if (p.y < -p.r) p.y = h + p.r;
          if (p.y > h + p.r) p.y = -p.r;

          var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          if (dark) {
            gradient.addColorStop(0, 'hsla(' + hue + ', 80%, 60%, ' + p.alpha + ')');
            gradient.addColorStop(1, 'hsla(' + (hue + 30) + ', 70%, 50%, 0)');
          } else {
            gradient.addColorStop(0, 'hsla(' + hue + ', 90%, 70%, ' + p.alpha + ')');
            gradient.addColorStop(1, 'hsla(' + (hue + 40) + ', 80%, 60%, 0)');
          }
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animate();

      window.addEventListener('resize', function() {
        resize();
        createParticles();
      });

      // Re-create on theme change
      var obs = new MutationObserver(function() {
        resize();
        createParticles();
      });
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    });
  }

  // ==========================================
  // 5. Scroll-Driven 3D Parallax Sections
  // ==========================================
  function initScrollParallax() {
    var shapes = document.querySelectorAll('.hero-shape');
    if (!shapes.length) return;

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var scrollY = window.scrollY;
          shapes.forEach(function(shape, idx) {
            var speed = 0.1 + idx * 0.03;
            var yOffset = scrollY * speed;
            shape.style.transform = 'translateY(' + yOffset + 'px)';
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ==========================================
  // Initialize Everything
  // ==========================================
  function init() {
    if (document.querySelector('.hero')) {
      initNeuralNetwork();
      initScrollParallax();
    }
    initFloating3DElements();
    initEnhancedCardTilt();
    initFluidBackground();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init on bfcache restore
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) init();
  });

})();
