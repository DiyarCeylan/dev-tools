// js/store.js - Lightweight reactive state store
(function() {
  var subscribers = {};
  var state = {
    theme: 'light',
    lang: 'en',
    searchQuery: '',
    isOffline: !navigator.onLine
  };

  // Load initial state from existing sources
  try {
    state.theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    state.lang = localStorage.getItem('i18n_lang') || 'en';
  } catch(e) {}

  // Create reactive proxy
  window.__store = new Proxy(state, {
    set: function(target, key, value) {
      var oldVal = target[key];
      target[key] = value;
      if (subscribers[key]) {
        subscribers[key].forEach(function(fn) {
          try { fn(value, oldVal); } catch(e) {}
        });
      }
      return true;
    },
    get: function(target, key) {
      return target[key];
    }
  });

  // Subscribe to state changes
  window.__store.subscribe = function(key, fn) {
    if (!subscribers[key]) subscribers[key] = [];
    subscribers[key].push(fn);
    return function() {
      subscribers[key] = subscribers[key].filter(function(f) { return f !== fn; });
    };
  };
})();
