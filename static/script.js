'use strict';

/* ─────────────────────────────────────────
   1. DOM RESTRUCTURE — Experience entries
   Wraps each h3-block in .exp-entry div
───────────────────────────────────────── */
(function restructureExperience() {
  const container = document.getElementById('expBody');
  if (!container) return;

  // Remove markdown section h2 and the following date p
  const h2 = container.querySelector('h2');
  if (h2) {
    const next = h2.nextElementSibling;
    if (next?.tagName === 'P') next.remove();
    h2.remove();
  }

  const children = Array.from(container.children);
  const frag = document.createDocumentFragment();
  let wrapper = null;

  for (const el of children) {
    if (el.tagName === 'H3') {
      wrapper = document.createElement('div');
      wrapper.className = 'exp-entry';
      frag.appendChild(wrapper);
    }
    if (!wrapper) {
      frag.appendChild(el);
      continue;
    }

    // Tag the em-only paragraph as exp-meta
    if (el.tagName === 'P' && el.querySelector('em') && wrapper.children.length === 1) {
      el.className = 'exp-meta';
    }
    wrapper.appendChild(el);
  }

  container.appendChild(frag);
})();

/* ─────────────────────────────────────────
   2. DOM RESTRUCTURE — Projects, Blogs & Research
   Generic, DRY restructure for card/block listings with staggered reveal
───────────────────────────────────────── */
function restructureBlockList(containerId, { className = 'project-block reveal', dateClass = 'proj-date', staggerDelay = 0.08 } = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const h2 = container.querySelector('h2');
  if (h2) {
    const next = h2.nextElementSibling;
    if (next?.tagName === 'P') next.remove();
    h2.remove();
  }

  const children = Array.from(container.children);
  const frag = document.createDocumentFragment();
  let wrapper = null;
  let index = 0;

  for (const el of children) {
    if (el.tagName === 'H3') {
      wrapper = document.createElement('div');
      wrapper.className = className;
      if (staggerDelay) {
        wrapper.style.transitionDelay = `${index * staggerDelay}s`;
      }
      index++;
      frag.appendChild(wrapper);
    }
    if (!wrapper) {
      frag.appendChild(el);
      continue;
    }

    if (el.tagName === 'P' && el.querySelector('em') && wrapper.children.length === 1) {
      el.className = dateClass;
    }
    wrapper.appendChild(el);
  }

  container.appendChild(frag);
}

restructureBlockList('projBody');
restructureBlockList('blogsBody');
restructureBlockList('researchBody');

/* ─────────────────────────────────────────
   2d. DOM RESTRUCTURE — Contact card & footer
   Dynamically transforms markdown contact into the inverted card UI.
   All content (heading, subtitle, links, footer) is derived 100%
   from content/contact.md with zero hardcoded fallbacks.
───────────────────────────────────────── */
(function restructureContact() {
  const container = document.getElementById('contactBody');
  if (!container) return;

  // 1. Heading — directly from markdown h2 (omitted if 'Contact' to avoid duplicate heading with section marker)
  const h2 = container.querySelector('h2');
  let headingText = '';
  if (h2) {
    const rawHeading = h2.textContent.trim();
    const clean = rawHeading.replace(/^\d+\s*(?:->|=>|[-—])\s*/, '').trim();
    if (clean.toLowerCase() !== 'contact') {
      headingText = clean;
    }
  }

  // 2. Subheading — from paragraph before ul
  const ul = container.querySelector('ul');
  let subheadingText = '';
  if (ul) {
    const prev = ul.previousElementSibling;
    if (prev?.tagName === 'P') {
      subheadingText = prev.textContent.trim();
    }
  }

  // 3. Footer — from paragraph after ul
  let footerText = '';
  if (ul) {
    const next = ul.nextElementSibling;
    if (next?.tagName === 'P') {
      footerText = next.textContent.trim();
    }
  }

  // 4. Contact links — mapped from markdown ul li
  let linksHtml = '';
  if (ul) {
    const items = ul.querySelectorAll('li');
    for (const li of items) {
      const a = li.querySelector('a');
      if (!a) continue;
      const href = a.getAttribute('href') || '#';
      const text = a.textContent.trim();

      // Category label: from *(Label)* in markdown, or auto-detected from link
      const em = li.querySelector('em');
      let label = '';
      if (em) {
        label = em.textContent.replace(/[()]/g, '').trim().toUpperCase();
      } else {
        const lowerHref = href.toLowerCase();
        const lowerText = text.toLowerCase();
        if (lowerHref.startsWith('mailto:') || lowerText.includes('@')) label = 'EMAIL';
        else if (lowerHref.includes('github.com')) label = 'GITHUB';
        else if (lowerHref.includes('linkedin.com')) label = 'LINKEDIN';
        else if (lowerHref.includes('leetcode.com')) label = 'LEETCODE';
        else if (lowerHref.includes('twitter.com') || lowerHref.includes('x.com')) label = 'TWITTER';
        else label = 'WEBSITE';
      }

      linksHtml += `
        <a href="${href}" class="contact-row" target="_blank" rel="noopener">
          <span class="contact-row-left">
            <span class="contact-row-arrow" aria-hidden="true">&rarr;</span>
            <span class="contact-row-value">${text}</span>
          </span>
          <span class="contact-row-label">${label}</span>
        </a>`;
    }
  }

  let cardHtml = '<div class="contact-card">';
  if (headingText) {
    cardHtml += `<h2 class="contact-heading">${headingText}</h2>`;
  }
  if (subheadingText) {
    cardHtml += `<p class="contact-subheading">${subheadingText}</p>`;
  }
  if (linksHtml) {
    cardHtml += `<div class="contact-links">${linksHtml}</div>`;
  }
  cardHtml += '</div>';

  if (footerText) {
    cardHtml += `
      <footer class="site-footer">
        <div class="footer-divider" aria-hidden="true"></div>
        <p class="footer-copy">${footerText}</p>
      </footer>`;
  }

  container.innerHTML = cardHtml;
})();

/* ─────────────────────────────────────────
   3. SCROLL REVEAL — IntersectionObserver
───────────────────────────────────────── */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function observeReveals() {
  const elements = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.07, rootMargin: '0px 0px -28px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// Run after DOM restructure settles
requestAnimationFrame(observeReveals);

/* ─────────────────────────────────────────
   4. ACTIVE NAV — IntersectionObserver
───────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        for (const a of navLinks) {
          const isActive = a.getAttribute('href') === `#${entry.target.id}`;
          a.classList.toggle('is-active', isActive);
        }
      }
    }
  },
  { rootMargin: '-35% 0px -60% 0px' }
);

document.querySelectorAll('section[id]').forEach(section => {
  navObserver.observe(section);
});

/* ─────────────────────────────────────────
   5. THEME TOGGLE
───────────────────────────────────────── */
const THEME_KEY = 'yk-theme';
const root = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');

function syncToggleLabel() {
  if (!toggleBtn) return;
  const current = root.getAttribute('data-theme');
  const isDark = current === 'dark';
  toggleBtn.textContent = isDark ? '[ light ]' : '[ dark ]';
  toggleBtn.setAttribute(
    'aria-label',
    isDark ? 'Switch to light mode' : 'Switch to dark mode'
  );
}

if (toggleBtn) {
  syncToggleLabel();

  toggleBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    syncToggleLabel();
  });
}

/* ─────────────────────────────────────────
   6. SEARCH FUNCTIONALITY (macOS Spotlight)
   - Builds dynamic DOM index at startup
   - Fuzzy substring matching across fields
   - Keyboard accessibility (Esc, Cmd+K, Arrow keys, Enter)
   - Smooth scroll-to-element highlights
───────────────────────────────────────── */
(function initSpotlightSearch() {
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('searchResults');
  const openBtn = document.getElementById('searchToggle');
  const backdrop = document.getElementById('searchBackdrop');

  if (!modal || !input || !resultsContainer || !openBtn) return;

  let searchIndex = [];
  let activeIndex = -1;
  let isOpen = false;

  const getCleanText = el => el.textContent.replace(/\s+/g, ' ').trim();

  // Build index from DOM content
  function buildDOMSearchIndex() {
    searchIndex = [];

    // 1. Experience
    document.querySelectorAll('#expBody .exp-entry').forEach(el => {
      const h3 = el.querySelector('h3');
      if (!h3) return;
      searchIndex.push({
        title: h3.textContent.trim(),
        category: 'Experience',
        text: getCleanText(el),
        element: el
      });
    });

    // 2. Research
    document.querySelectorAll('#researchBody .project-block').forEach(el => {
      const h3 = el.querySelector('h3');
      if (!h3) return;
      searchIndex.push({
        title: h3.textContent.trim(),
        category: 'Research',
        text: getCleanText(el),
        element: el
      });
    });

    // 3. Projects
    document.querySelectorAll('#projBody .project-block').forEach(el => {
      const h3 = el.querySelector('h3');
      if (!h3) return;
      searchIndex.push({
        title: h3.textContent.trim(),
        category: 'Software',
        text: getCleanText(el),
        element: el
      });
    });

    // 4. Blogs
    document.querySelectorAll('#blogsBody .project-block').forEach(el => {
      const h3 = el.querySelector('h3');
      if (!h3) return;
      searchIndex.push({
        title: h3.textContent.trim(),
        category: 'Blogs',
        text: getCleanText(el),
        element: el
      });
    });

    // 5. Skills
    document.querySelectorAll('#skills table tbody tr').forEach(el => {
      const cells = el.querySelectorAll('td');
      if (cells.length < 2) return;
      const cat = cells[0].textContent.replace(/\*/g, '').trim();
      const techs = cells[1].textContent.trim();
      searchIndex.push({
        title: cat,
        category: 'Skills',
        text: techs,
        element: document.getElementById('skills')
      });
    });

    // 6. Background
    const bgSec = document.getElementById('background');
    if (bgSec) {
      const h3s = bgSec.querySelectorAll('.md-body h3');
      h3s.forEach(h3 => {
        const textParts = [];
        let sibling = h3.nextElementSibling;
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

    // 7. Contact links
    document.querySelectorAll('#contact .contact-row').forEach(row => {
      const val = row.querySelector('.contact-row-value');
      const lbl = row.querySelector('.contact-row-label');
      if (val) {
        const labelText = lbl ? lbl.textContent.trim() : 'Link';
        searchIndex.push({
          title: val.textContent.trim(),
          category: `Contact (${labelText})`,
          text: `Contact: ${labelText} ${val.textContent.trim()}`,
          element: row
        });
      }
    });
  }

  // Toggle modal open/close
  function toggleModal(show) {
    isOpen = show;
    modal.classList.toggle('is-open', show);
    modal.setAttribute('aria-hidden', String(!show));

    if (show) {
      buildDOMSearchIndex();
      setTimeout(() => input.focus(), 50);
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

    const trimmed = query.trim();
    if (!trimmed) {
      resultsContainer.innerHTML = '<div class="search-empty">Type to search...</div>';
      return;
    }

    const term = trimmed.toLowerCase();
    const matches = [];

    for (const item of searchIndex) {
      const titleScore = item.title.toLowerCase().indexOf(term);
      const textScore = item.text.toLowerCase().indexOf(term);

      if (titleScore !== -1 || textScore !== -1) {
        let score = 0;
        if (titleScore !== -1) score += 100 - titleScore;
        if (textScore !== -1)  score += 10 - textScore;
        matches.push({ item, score });
      }
    }

    matches.sort((a, b) => b.score - a.score);

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<div class="search-no-results">No results found for "${trimmed}"</div>`;
      return;
    }

    const limit = Math.min(matches.length, 8);
    for (let i = 0; i < limit; i++) {
      const { item: match } = matches[i];
      const itemEl = document.createElement('div');
      itemEl.className = 'search-item';
      itemEl.dataset.index = String(i);

      let snippet = match.text;
      const termIdx = snippet.toLowerCase().indexOf(term);
      if (termIdx > 40) {
        snippet = `...${snippet.substring(termIdx - 30, termIdx + 100)}...`;
      } else if (snippet.length > 120) {
        snippet = `${snippet.substring(0, 120)}...`;
      }

      itemEl.innerHTML = `
        <div class="search-item-header">
          <span class="search-item-title">${match.title}</span>
          <span class="search-item-category">${match.category}</span>
        </div>
        <div class="search-item-snippet">${snippet}</div>`;

      itemEl.addEventListener('click', () => {
        navigateToElement(match.element);
      });

      resultsContainer.appendChild(itemEl);
    }

    updateActiveItem(0);
  }

  function updateActiveItem(index) {
    const items = resultsContainer.querySelectorAll('.search-item');
    if (items.length === 0) return;

    let targetIndex = index;
    if (targetIndex < 0) targetIndex = items.length - 1;
    if (targetIndex >= items.length) targetIndex = 0;

    if (activeIndex !== -1 && items[activeIndex]) {
      items[activeIndex].classList.remove('is-active');
    }

    activeIndex = targetIndex;
    const activeItem = items[activeIndex];
    activeItem.classList.add('is-active');
    activeItem.scrollIntoView({ block: 'nearest' });
  }

  function navigateToElement(el) {
    toggleModal(false);
    if (!el) return;

    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('search-highlight');
      setTimeout(() => {
        el.classList.remove('search-highlight');
      }, 2000);
    }, 150);
  }

  input.addEventListener('input', e => {
    performSearch(e.target.value);
  });

  input.addEventListener('keydown', e => {
    const items = resultsContainer.querySelectorAll('.search-item');
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

  openBtn.addEventListener('click', () => toggleModal(true));
  backdrop?.addEventListener('click', () => toggleModal(false));

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) {
      toggleModal(false);
    }

    if (e.key === '/' && !isOpen && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      toggleModal(true);
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleModal(!isOpen);
    }
  });
})();
