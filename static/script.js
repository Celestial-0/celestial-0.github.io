'use strict';

/* ─────────────────────────────────────────
   1. DOM RESTRUCTURE — Experience entries
   Wraps each h3-block in .exp-entry div
───────────────────────────────────────── */
(function restructureExperience() {
  var container = document.getElementById('expBody');
  if (!container) return;

  // Remove markdown section h2 and the following date p
  var h2 = container.querySelector('h2');
  if (h2) {
    var next = h2.nextElementSibling;
    if (next && next.tagName === 'P') next.remove();
    h2.remove();
  }

  var children = Array.from(container.children);
  var frag = document.createDocumentFragment();
  var wrapper = null;

  children.forEach(function(el) {
    if (el.tagName === 'H3') {
      wrapper = document.createElement('div');
      wrapper.className = 'exp-entry';
      frag.appendChild(wrapper);
    }
    if (!wrapper) { frag.appendChild(el); return; }

    // Tag the em-only paragraph as exp-meta
    if (el.tagName === 'P' && el.querySelector('em') && wrapper.children.length === 1) {
      el.className = 'exp-meta';
    }
    wrapper.appendChild(el);
  });

  container.appendChild(frag);
}());

/* ─────────────────────────────────────────
   2. DOM RESTRUCTURE — Project blocks
   Wraps each h3-block in .project-block div
───────────────────────────────────────── */
(function restructureProjects() {
  var container = document.getElementById('projBody');
  if (!container) return;

  // Remove markdown section h2 and the following date p
  var h2 = container.querySelector('h2');
  if (h2) {
    var next = h2.nextElementSibling;
    if (next && next.tagName === 'P') next.remove();
    h2.remove();
  }

  var children = Array.from(container.children);
  var frag = document.createDocumentFragment();
  var wrapper = null;
  var index = 0;

  children.forEach(function(el) {
    if (el.tagName === 'H3') {
      wrapper = document.createElement('div');
      wrapper.className = 'project-block reveal';
      // Stagger reveal delay per project
      wrapper.style.transitionDelay = (index * 0.08) + 's';
      index++;
      frag.appendChild(wrapper);
    }
    if (!wrapper) { frag.appendChild(el); return; }

    // Tag the em-only paragraph as proj-date
    if (el.tagName === 'P' && el.querySelector('em') && wrapper.children.length === 1) {
      el.className = 'proj-date';
    }
    wrapper.appendChild(el);
  });

  container.appendChild(frag);
}());

/* ─────────────────────────────────────────
   2b. DOM RESTRUCTURE — Blog blocks
───────────────────────────────────────── */
(function restructureBlogs() {
  var container = document.getElementById('blogsBody');
  if (!container) return;

  var h2 = container.querySelector('h2');
  if (h2) {
    var next = h2.nextElementSibling;
    if (next && next.tagName === 'P') next.remove();
    h2.remove();
  }

  var children = Array.from(container.children);
  var frag = document.createDocumentFragment();
  var wrapper = null;
  var index = 0;

  children.forEach(function(el) {
    if (el.tagName === 'H3') {
      wrapper = document.createElement('div');
      wrapper.className = 'project-block reveal';
      wrapper.style.transitionDelay = (index * 0.08) + 's';
      index++;
      frag.appendChild(wrapper);
    }
    if (!wrapper) { frag.appendChild(el); return; }

    if (el.tagName === 'P' && el.querySelector('em') && wrapper.children.length === 1) {
      el.className = 'proj-date';
    }
    wrapper.appendChild(el);
  });

  container.appendChild(frag);
}());

/* ─────────────────────────────────────────
   2c. DOM RESTRUCTURE — Research blocks
───────────────────────────────────────── */
(function restructureResearch() {
  var container = document.getElementById('researchBody');
  if (!container) return;

  var h2 = container.querySelector('h2');
  if (h2) {
    var next = h2.nextElementSibling;
    if (next && next.tagName === 'P') next.remove();
    h2.remove();
  }

  var children = Array.from(container.children);
  var frag = document.createDocumentFragment();
  var wrapper = null;
  var index = 0;

  children.forEach(function(el) {
    if (el.tagName === 'H3') {
      wrapper = document.createElement('div');
      wrapper.className = 'project-block reveal';
      wrapper.style.transitionDelay = (index * 0.08) + 's';
      index++;
      frag.appendChild(wrapper);
    }
    if (!wrapper) { frag.appendChild(el); return; }

    if (el.tagName === 'P' && el.querySelector('em') && wrapper.children.length === 1) {
      el.className = 'proj-date';
    }
    wrapper.appendChild(el);
  });

  container.appendChild(frag);
}());

/* ─────────────────────────────────────────
   3. SCROLL REVEAL — IntersectionObserver
───────────────────────────────────────── */
var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function observeReveals() {
  var els = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    els.forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -28px 0px' });
  els.forEach(function(el) { io.observe(el); });
}

// Run after DOM restructure settles
requestAnimationFrame(observeReveals);

/* ─────────────────────────────────────────
   4. ACTIVE NAV — IntersectionObserver
───────────────────────────────────────── */
var navLinks = document.querySelectorAll('.nav-links a');

var navObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      navLinks.forEach(function(a) {
        var active = a.getAttribute('href') === '#' + e.target.id;
        a.classList.toggle('is-active', active);
      });
    }
  });
}, { rootMargin: '-35% 0px -60% 0px' });

document.querySelectorAll('section[id]').forEach(function(s) {
  navObserver.observe(s);
});

/* ─────────────────────────────────────────
   5. THEME TOGGLE
───────────────────────────────────────── */
var THEME_KEY = 'yk-theme';
var root      = document.documentElement;
var toggleBtn = document.getElementById('themeToggle');

function syncToggleLabel() {
  var current = root.getAttribute('data-theme');
  toggleBtn.textContent = current === 'dark' ? '[ light ]' : '[ dark ]';
  toggleBtn.setAttribute('aria-label',
    current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

syncToggleLabel();

toggleBtn.addEventListener('click', function() {
  var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  syncToggleLabel();
});

/* ─────────────────────────────────────────
   6. SEARCH FUNCTIONALITY (macOS Spotlight)
   - Builds dynamic DOM index at startup
   - Fuzzy substring matching across fields
   - Keyboard accessibility (Esc, Cmd+K, Arrow keys, Enter)
   - Smooth scroll-to-element highlights
───────────────────────────────────────── */
(function initSpotlightSearch() {
  var modal = document.getElementById('searchModal');
  var input = document.getElementById('searchInput');
  var resultsContainer = document.getElementById('searchResults');
  var openBtn = document.getElementById('searchToggle');
  var backdrop = document.getElementById('searchBackdrop');
  
  if (!modal || !input || !resultsContainer || !openBtn) return;

  var searchIndex = [];
  var activeIndex = -1;
  var isOpen = false;

  // Build index from DOM content
  function buildDOMSearchIndex() {
    searchIndex = [];

    // Helper to sanitize and get clean text content
    function getCleanText(el) {
      return el.textContent.replace(/\s+/g, ' ').trim();
    }

    // 1. Experience
    document.querySelectorAll('#expBody .exp-entry').forEach(function(el) {
      var h3 = el.querySelector('h3');
      if (!h3) return;
      searchIndex.push({
        title: h3.textContent.trim(),
        category: 'Experience',
        text: getCleanText(el),
        element: el
      });
    });

    // 2. Research
    document.querySelectorAll('#researchBody .project-block').forEach(function(el) {
      var h3 = el.querySelector('h3');
      if (!h3) return;
      searchIndex.push({
        title: h3.textContent.trim(),
        category: 'Research',
        text: getCleanText(el),
        element: el
      });
    });

    // 3. Projects
    document.querySelectorAll('#projBody .project-block').forEach(function(el) {
      var h3 = el.querySelector('h3');
      if (!h3) return;
      searchIndex.push({
        title: h3.textContent.trim(),
        category: 'Software',
        text: getCleanText(el),
        element: el
      });
    });

    // 4. Blogs
    document.querySelectorAll('#blogsBody .project-block').forEach(function(el) {
      var h3 = el.querySelector('h3');
      if (!h3) return;
      searchIndex.push({
        title: h3.textContent.trim(),
        category: 'Blogs',
        text: getCleanText(el),
        element: el
      });
    });

    // 5. Skills
    document.querySelectorAll('#skills table tbody tr').forEach(function(el) {
      var cells = el.querySelectorAll('td');
      if (cells.length < 2) return;
      var cat = cells[0].textContent.replace(/\*/g, '').trim();
      var techs = cells[1].textContent.trim();
      searchIndex.push({
        title: cat,
        category: 'Skills',
        text: techs,
        element: document.getElementById('skills')
      });
    });

    // 6. Background
    var bgSec = document.getElementById('background');
    if (bgSec) {
      var h3s = bgSec.querySelectorAll('.md-body h3');
      h3s.forEach(function(h3) {
        var textParts = [];
        var sibling = h3.nextElementSibling;
        while (sibling && sibling.tagName !== 'H3') {
          textParts.push(sibling.textContent);
          sibling = sibling.nextElementSibling;
        }
        searchIndex.push({
          title: h3.textContent.trim(),
          category: 'Background',
          text: textParts.join(' ').replace(/\s+/g, ' ').trim(),
          element: h3
        });
      });
    }
  }

  // Toggle modal open/close
  function toggleModal(show) {
    isOpen = show;
    modal.classList.toggle('is-open', show);
    modal.setAttribute('aria-hidden', !show);
    if (show) {
      buildDOMSearchIndex();
      setTimeout(function() { input.focus(); }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      input.value = '';
      resultsContainer.innerHTML = '<div class="search-empty">Type to search...</div>';
      activeIndex = -1;
      document.body.style.overflow = '';
    }
  }

  // Handle perform search
  function performSearch(query) {
    resultsContainer.innerHTML = '';
    activeIndex = -1;

    if (!query.trim()) {
      resultsContainer.innerHTML = '<div class="search-empty">Type to search...</div>';
      return;
    }

    var term = query.toLowerCase().trim();
    var matches = [];

    searchIndex.forEach(function(item) {
      var titleScore = item.title.toLowerCase().indexOf(term);
      var textScore = item.text.toLowerCase().indexOf(term);

      if (titleScore !== -1 || textScore !== -1) {
        var score = 0;
        if (titleScore !== -1) {
          score += 100 - titleScore;
        }
        if (textScore !== -1) {
          score += 10 - textScore;
        }
        matches.push({ item: item, score: score });
      }
    });

    matches.sort(function(a, b) { return b.score - a.score; });

    if (matches.length === 0) {
      resultsContainer.innerHTML = '<div class="search-no-results">No results found for "' + query + '"</div>';
      return;
    }

    var limit = Math.min(matches.length, 8);
    for (var i = 0; i < limit; i++) {
      var match = matches[i].item;
      var itemEl = document.createElement('div');
      itemEl.className = 'search-item';
      itemEl.dataset.index = i;

      var snippet = match.text;
      var termIdx = snippet.toLowerCase().indexOf(term);
      if (termIdx > 40) {
        snippet = '...' + snippet.substring(termIdx - 30, termIdx + 100) + '...';
      } else if (snippet.length > 120) {
        snippet = snippet.substring(0, 120) + '...';
      }

      itemEl.innerHTML = 
        '<div class="search-item-header">' +
          '<span class="search-item-title">' + match.title + '</span>' +
          '<span class="search-item-category">' + match.category + '</span>' +
        '</div>' +
        '<div class="search-item-snippet">' + snippet + '</div>';

      (function(targetEl) {
        itemEl.addEventListener('click', function() {
          navigateToElement(targetEl);
        });
      })(match.element);

      resultsContainer.appendChild(itemEl);
    }

    updateActiveItem(0);
  }

  function updateActiveItem(index) {
    var items = resultsContainer.querySelectorAll('.search-item');
    if (items.length === 0) return;

    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;

    if (activeIndex !== -1 && items[activeIndex]) {
      items[activeIndex].classList.remove('is-active');
    }

    activeIndex = index;
    var activeItem = items[activeIndex];
    activeItem.classList.add('is-active');
    
    activeItem.scrollIntoView({ block: 'nearest' });
  }

  function navigateToElement(el) {
    toggleModal(false);
    
    if (!el) return;

    setTimeout(function() {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      el.classList.add('search-highlight');
      setTimeout(function() {
        el.classList.remove('search-highlight');
      }, 2000);
    }, 150);
  }

  input.addEventListener('input', function(e) {
    performSearch(e.target.value);
  });

  input.addEventListener('keydown', function(e) {
    var items = resultsContainer.querySelectorAll('.search-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      updateActiveItem(activeIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      updateActiveItem(activeIndex - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex !== -1 && items[activeIndex]) {
        items[activeIndex].click();
      }
    }
  });

  openBtn.addEventListener('click', function() {
    toggleModal(true);
  });

  backdrop.addEventListener('click', function() {
    toggleModal(false);
  });

  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) {
      toggleModal(false);
    }
    
    if (e.key === '/' && !isOpen && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      toggleModal(true);
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleModal(!isOpen);
    }
  });
}());
