'use strict';

// Mock catalog until the backend API exists.
const EVENTS = [
  { id: 'evt-101', title: 'Tech Career Fair 2026', date: '2026-10-14T09:00', venue: 'University Gymnasium', capacity: 120, category: 'Career', description: 'Meet recruiters from 30+ IT companies and bring your resume for on-the-spot interviews.' },
  { id: 'evt-102', title: 'Generative AI Workshop', date: '2026-10-21T13:00', venue: 'IT Building, Lab 3', capacity: 30, category: 'Workshop', description: 'Hands-on session on prompt engineering and building apps with AI assistants.' },
  { id: 'evt-103', title: 'Intramurals Opening Ceremony', date: '2026-10-28T07:30', venue: 'Main Field', capacity: 500, category: 'Sports', description: 'Parade of colleges, torch lighting and the first round of the basketball league.' },
  { id: 'evt-104', title: 'Cybersecurity Awareness Talk', date: '2026-11-05T15:00', venue: 'Audio-Visual Room', capacity: 3, category: 'Seminar', description: 'Learn how to spot phishing, secure your accounts and protect student data.' },
  { id: 'evt-105', title: 'Campus Music Night', date: '2026-11-12T18:00', venue: 'Open Amphitheater', capacity: 200, category: 'Culture', description: 'Student bands and solo artists perform live. Free entry for registered students.' },
  { id: 'evt-106', title: 'Capstone Project Expo', date: '2026-11-19T10:00', venue: 'Library Lobby', capacity: 80, category: 'Academic', description: 'Graduating students demo their capstone systems to faculty and industry panelists.' }
];

const EMAIL_DOMAIN = '@univ.edu.ph';
const STUDENT_ID_PATTERN = /^\d{4}-\d{5}$/;
const STORAGE_KEY = 'cem.registrations';

// ---------- Pure helpers (no DOM, unit-testable) ----------

function countRegistrations(eventId, registrations) {
  return registrations.filter((r) => r.eventId === eventId).length;
}

function seatsLeft(event, registrations) {
  return Math.max(0, event.capacity - countRegistrations(event.id, registrations));
}

/**
 * Validates a registration. Returns an object of { fieldName: message };
 * an empty object means the data is valid.
 */
function validateRegistration(data, events, registrations) {
  const errors = {};
  const fullName = (data.fullName || '').trim();
  const studentId = (data.studentId || '').trim();
  const email = (data.email || '').trim().toLowerCase();
  const eventId = data.eventId || '';

  if (!fullName) errors.fullName = 'Enter your full name.';
  else if (fullName.length < 2) errors.fullName = 'Name must be at least 2 characters.';

  if (!studentId) errors.studentId = 'Enter your student ID.';
  else if (!STUDENT_ID_PATTERN.test(studentId)) errors.studentId = 'Use the format 2021-00123.';

  if (!email) errors.email = 'Enter your university email.';
  else if (!email.endsWith(EMAIL_DOMAIN) || email.length <= EMAIL_DOMAIN.length || email.indexOf('@') !== email.length - EMAIL_DOMAIN.length) {
    errors.email = `Use your university email ending in ${EMAIL_DOMAIN}.`;
  }

  const event = events.find((e) => e.id === eventId);
  if (!eventId) errors.eventId = 'Choose an event.';
  else if (!event) errors.eventId = 'That event no longer exists.';
  else if (seatsLeft(event, registrations) === 0) errors.eventId = 'Sorry, this event is full.';
  else if (!errors.email && registrations.some((r) => r.eventId === eventId && r.email === email)) {
    errors.email = 'This email is already registered for the selected event.';
  }

  return errors;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-PH', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
  });
}

// Share of seats below which a card shows the "Few seats left" badge.
const LOW_SEAT_RATIO = 0.2;

function categoryKey(event) {
  return event.category.toLowerCase();
}

// Case-insensitive match on title, venue, description and category;
// an empty category set means "all categories".
function filterEvents(events, query, categories) {
  const q = query.trim().toLowerCase();
  return events.filter((event) => {
    if (categories.size && !categories.has(event.category)) return false;
    if (!q) return true;
    return [event.title, event.venue, event.description, event.category]
      .some((text) => text.toLowerCase().includes(q));
  });
}

// Reads the category accent from the CSS tokens, so the banner follows the
// light/dark theme. SVG data URIs can't read CSS variables themselves.
function accentColor(event) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--accent-${categoryKey(event)}`).trim();
  return /^#[0-9a-f]{6}$/i.test(value) ? value : '#1E3A8A';
}

// Decorative banner in the category accent. It holds no text: the category and
// date are shown as real HTML over the image.
function bannerImage(event) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="${accentColor(event)}"/>
    <circle cx="270" cy="30" r="90" fill="#FFFFFF" fill-opacity="0.18"/>
    <circle cx="40" cy="170" r="70" fill="#0F172A" fill-opacity="0.14"/>
    <circle cx="200" cy="150" r="28" fill="#FFFFFF" fill-opacity="0.12"/>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

// ---------- Storage ----------

let memoryStore = [];

function loadRegistrations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return memoryStore;
  }
}

function saveRegistrations(list) {
  memoryStore = list;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    // Storage blocked (private mode); keep data in memory for this session.
  }
}

// ---------- DOM ----------

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'text') node.textContent = value;
    else if (key === 'className') node.className = value;
    else node.setAttribute(key, value);
  });
  children.forEach((child) => node.appendChild(child));
  return node;
}

// ---------- Filter state ----------

const filterState = { query: '', categories: new Set() };
let announceTimer;

// Calendar-style badge. Hidden from screen readers because the full date
// is already read from the <time> in the meta list.
function dateBadge(event) {
  const date = new Date(event.date);
  return el('p', { className: 'date-badge', 'aria-hidden': 'true' }, [
    el('span', { className: 'date-month', text: date.toLocaleString('en-PH', { month: 'short' }) }),
    el('span', { className: 'date-day', text: String(date.getDate()) })
  ]);
}

function capacityBlock(event, left) {
  const meterId = `${event.id}-seats`;
  const labelText = left === 0 ? 'No seats left' : `${left} of ${event.capacity} seats left`;
  const few = left > 0 && left / event.capacity < LOW_SEAT_RATIO;

  const meter = el('meter', {
    id: meterId,
    min: '0',
    max: String(event.capacity),
    low: String(event.capacity * LOW_SEAT_RATIO),
    high: String(event.capacity * 0.5),
    optimum: String(event.capacity),
    value: String(left),
    'aria-label': `${labelText} for ${event.title}`
  });

  const labelRow = el('p', { className: 'capacity-label' }, [
    el('label', { for: meterId, className: left === 0 ? 'seats full' : 'seats', text: labelText })
  ]);
  if (few) labelRow.appendChild(el('span', { className: 'badge badge-warn', text: 'Few seats left' }));

  return [labelRow, meter];
}

function renderEvents(registrations) {
  const list = document.getElementById('event-list');
  const visible = filterEvents(EVENTS, filterState.query, filterState.categories);
  list.replaceChildren();

  visible.forEach((event) => {
    const left = seatsLeft(event, registrations);
    const headingId = `${event.id}-title`;

    const button = el('button', {
      type: 'button',
      className: 'btn',
      'aria-describedby': headingId,
      text: left === 0 ? 'Full' : 'Register'
    });
    button.disabled = left === 0;
    button.addEventListener('click', () => selectEvent(event.id));

    const article = el('article', {
      className: 'event-card',
      'aria-labelledby': headingId,
      'data-category': categoryKey(event)
    }, [
      el('header', { className: 'event-media' }, [
        el('img', {
          src: bannerImage(event),
          alt: `Illustrated banner for ${event.title}, a ${event.category.toLowerCase()} event`,
          width: '320',
          height: '180'
        }),
        dateBadge(event),
        el('p', { className: 'category-chip', text: event.category })
      ]),
      // No accessible name, so this section is not exposed as a region landmark.
      el('section', { className: 'event-body' }, [
        el('h3', { id: headingId, text: event.title }),
        el('ul', { className: 'event-meta' }, [
          el('li', {}, [el('time', { datetime: event.date, text: formatDate(event.date) })]),
          el('li', { text: event.venue })
        ]),
        el('p', { className: 'event-desc', text: event.description }),
        el('footer', { className: 'event-footer' }, [...capacityBlock(event, left), button])
      ])
    ]);

    list.appendChild(el('li', {}, [article]));
  });

  renderEmptyState(visible.length);
  return visible.length;
}

function renderEmptyState(count) {
  const empty = document.getElementById('events-empty');
  const list = document.getElementById('event-list');
  empty.hidden = count > 0;
  list.hidden = count === 0;
  if (count > 0) return;

  const parts = [];
  if (filterState.query.trim()) parts.push(`matching "${filterState.query.trim()}"`);
  if (filterState.categories.size) parts.push(`in ${[...filterState.categories].join(', ')}`);
  document.getElementById('events-empty-detail').textContent =
    `There are no upcoming events ${parts.join(' ')}. Try a different search or clear the filters.`;
}

function announceCount(count, { immediate = false } = {}) {
  const status = document.getElementById('event-count');
  const text = `Showing ${count} event${count === 1 ? '' : 's'}`;
  clearTimeout(announceTimer);
  // Typing updates the grid at once but waits before announcing, so screen
  // readers don't read a count on every keystroke.
  if (immediate) status.textContent = text;
  else announceTimer = setTimeout(() => { status.textContent = text; }, 400);
}

function renderFilterButtons() {
  const list = document.getElementById('category-filters');
  const categories = [...new Set(EVENTS.map((e) => e.category))];
  const make = (value, label, ariaLabel) => {
    const pressed = value === '' ? filterState.categories.size === 0 : filterState.categories.has(value);
    const button = el('button', {
      type: 'button',
      className: 'chip',
      'aria-pressed': String(pressed),
      'aria-label': ariaLabel,
      'data-category': value ? value.toLowerCase() : 'all',
      'data-value': value,
      text: label
    });
    button.addEventListener('click', () => toggleCategory(value));
    return el('li', {}, [button]);
  };

  list.replaceChildren(
    make('', 'All', 'All events'),
    ...categories.map((c) => make(c, c, `${c} events`))
  );
}

function applyFilters(options) {
  const count = renderEvents(loadRegistrations());
  announceCount(count, options);
}

function toggleCategory(category) {
  if (category === '') filterState.categories.clear();
  else if (filterState.categories.has(category)) filterState.categories.delete(category);
  else filterState.categories.add(category);

  // Buttons are updated in place so keyboard focus stays on the one pressed.
  document.querySelectorAll('#category-filters .chip').forEach((chip) => {
    const value = chip.dataset.value;
    const pressed = value === '' ? filterState.categories.size === 0 : filterState.categories.has(value);
    chip.setAttribute('aria-pressed', String(pressed));
  });
  applyFilters({ immediate: true });
}

function clearFilters() {
  filterState.query = '';
  document.getElementById('event-search').value = '';
  toggleCategory('');
  document.getElementById('event-search').focus();
}

function renderEventOptions(registrations) {
  const select = document.getElementById('eventId');
  const filter = document.getElementById('attendee-filter');
  const selected = select.value;
  const filterValue = filter.value;

  select.replaceChildren(el('option', { value: '', text: 'Select an event' }));
  filter.replaceChildren(el('option', { value: '', text: 'All events' }));

  EVENTS.forEach((event) => {
    const full = seatsLeft(event, registrations) === 0;
    const option = el('option', { value: event.id, text: full ? `${event.title} (full)` : event.title });
    option.disabled = full;
    select.appendChild(option);
    filter.appendChild(el('option', { value: event.id, text: event.title }));
  });

  select.value = selected;
  filter.value = filterValue;
}

function renderAttendees(registrations) {
  const filter = document.getElementById('attendee-filter').value;
  const rows = document.getElementById('attendee-rows');
  const caption = document.getElementById('attendee-caption');
  const empty = document.getElementById('attendee-empty');
  const shown = filter ? registrations.filter((r) => r.eventId === filter) : registrations;
  const eventTitle = (id) => (EVENTS.find((e) => e.id === id) || {}).title || 'Unknown event';

  rows.replaceChildren();
  shown.forEach((r) => {
    rows.appendChild(el('tr', {}, [
      el('td', { text: r.fullName }),
      el('td', { text: r.studentId }),
      el('td', { text: r.email }),
      el('td', { text: eventTitle(r.eventId) }),
      el('td', {}, [el('time', { datetime: r.registeredAt, text: formatDate(r.registeredAt) })])
    ]));
  });

  caption.textContent = `${filter ? eventTitle(filter) : 'All registrations'} (${shown.length} attendee${shown.length === 1 ? '' : 's'})`;
  empty.hidden = shown.length > 0;
}

function selectEvent(eventId) {
  document.getElementById('eventId').value = eventId;
  document.getElementById('register').scrollIntoView();
  document.getElementById('fullName').focus({ preventScroll: true });
}

function showErrors(form, errors) {
  ['fullName', 'studentId', 'email', 'eventId'].forEach((name) => {
    const input = form.elements[name];
    const message = errors[name] || '';
    document.getElementById(`${name}-error`).textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  });
}

function refresh() {
  const registrations = loadRegistrations();
  renderEvents(registrations);
  renderEventOptions(registrations);
  renderAttendees(registrations);
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById('form-status');
  const registrations = loadRegistrations();
  const data = Object.fromEntries(new FormData(form));
  const errors = validateRegistration(data, EVENTS, registrations);

  showErrors(form, errors);

  const firstInvalid = Object.keys(errors)[0];
  if (firstInvalid) {
    status.className = 'status failure';
    status.textContent = `Please fix ${Object.keys(errors).length} error(s) in the form.`;
    form.elements[firstInvalid].focus();
    return;
  }

  const entry = {
    fullName: data.fullName.trim(),
    studentId: data.studentId.trim(),
    email: data.email.trim().toLowerCase(),
    eventId: data.eventId,
    registeredAt: new Date().toISOString()
  };
  saveRegistrations([...registrations, entry]);

  const title = EVENTS.find((e) => e.id === entry.eventId).title;
  form.reset();
  refresh();
  status.className = 'status success';
  status.textContent = `You're registered for ${title}. See you there, ${entry.fullName}!`;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registration-form').addEventListener('submit', handleSubmit);
    document.getElementById('attendee-filter').addEventListener('change', () => renderAttendees(loadRegistrations()));
    document.getElementById('event-search').addEventListener('input', (e) => {
      filterState.query = e.target.value;
      applyFilters();
    });
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    // Banners take their color from the theme tokens, so redraw them when it changes.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => renderEvents(loadRegistrations()));

    renderFilterButtons();
    refresh();
    announceCount(EVENTS.length, { immediate: true });
  });
}

// Exposed for unit tests (Task 4) when loaded in Node.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EVENTS, EMAIL_DOMAIN, validateRegistration, seatsLeft, countRegistrations };
}
