
const events = [
  {
    id: "open-house",
    title: "Open House",
    date: "2026-09-12",
    time: "10:00 AM - 1:00 PM",
    location: "Community Center, Main Hall",
    description: [
      "Our first open house of the year. Visitors toured the space, met the team, and tried a few activities.",
      "Thank you to everyone who came."
    ],
    linkText: "View photos",
    href: "#"
  },
  {
    id: "intro-workshop",
    title: "Intro Workshop",
    date: "2026-10-24",
    time: "2:00 PM - 4:00 PM",
    location: "Room 204, Library Annex",
    description: [
      "A hands-on session for beginners. No experience is needed, and all materials are provided.",
      "Space is limited, so please register ahead of time."
    ],
    linkText: "Register",
    href: "#"
  },
  {
    id: "fundraiser",
    title: "Community Fundraiser",
    date: "2026-11-14",
    time: "6:00 PM - 9:00 PM",
    location: "Riverside Hall",
    description: [
      "An evening of food, music, and a silent auction. All proceeds support next year's programs.",
      "Tickets include dinner. Children under 12 attend free."
    ],
    linkText: "Get tickets",
    href: "#"
  },
  {
    id: "volunteer-training",
    title: "Volunteer Training",
    date: "2027-01-23",
    time: "9:30 AM - 12:00 PM",
    location: "Online (link sent after sign-up)",
    description: [
      "Learn how our programs run and where help is needed most. This session is required for new volunteers."
    ],
    linkText: "Sign up",
    href: "#"
  },
  {
    id: "annual-meeting",
    title: "Annual Meeting",
    date: "2027-03-06",
    time: "11:00 AM - 12:30 PM",
    location: "Community Center, Main Hall",
    description: [
      "A look back at the year, a financial update, and an open question period. Everyone is welcome."
    ],
    linkText: "Add to calendar",
    href: "#"
  }
];

const listEl = document.getElementById("event-list");
const detailEl = document.getElementById("event-detail");

const today = new Date();
today.setHours(0, 0, 0, 0);


const parse = (iso) => new Date(iso + "T00:00:00");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

events.sort((a, b) => a.date.localeCompare(b.date));

function renderList() {
  listEl.innerHTML = "";
  events.forEach((ev) => {
    const d = parse(ev.date);

    const button = el("button", "event-item" + (d < today ? " is-past" : ""));
    button.type = "button";
    button.dataset.id = ev.id;

    const badge = el("span", "event-date");
    badge.append(
      el("span", "event-month", d.toLocaleDateString(undefined, { month: "short" })),
      el("span", "event-day", String(d.getDate()))
    );

    const text = el("span");
    text.append(el("span", "event-name", ev.title), el("span", "event-where", ev.location));

    button.append(badge, text);

    const li = el("li");
    li.append(button);
    listEl.append(li);
  });
}


function select(id, scroll) {
  const ev = events.find((e) => e.id === id) || events[0];
  const d = parse(ev.date);

  listEl.querySelectorAll(".event-item").forEach((b) => {
    b.setAttribute("aria-current", b.dataset.id === ev.id ? "true" : "false");
  });

  detailEl.innerHTML = "";
  detailEl.append(el("p", "label", d < today ? "Past event" : "Upcoming event"));
  detailEl.append(el("h2", "", ev.title));

  const meta = el("dl", "event-meta");
  const rows = [
    ["Date", d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })],
    ["Time", ev.time],
    ["Where", ev.location]
  ];
  rows.forEach(([label, value]) => {
    meta.append(el("dt", "", label), el("dd", "", value));
  });
  detailEl.append(meta);

  ev.description.forEach((p) => detailEl.append(el("p", "", p)));

  if (ev.href) {
    const link = el("a", "event-button", ev.linkText || "Learn more");
    link.href = ev.href;
    detailEl.append(link);
  }

  if (scroll && window.matchMedia("(max-width: 48rem)").matches) {
    detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}


function idFromHash() {
  return decodeURIComponent(location.hash.slice(1));
}

listEl.addEventListener("click", (e) => {
  const button = e.target.closest(".event-item");
  if (!button) return;
  select(button.dataset.id, true);
  try { history.pushState(null, "", "#" + button.dataset.id); } catch (err) {}
});

window.addEventListener("popstate", () => select(idFromHash(), false));
window.addEventListener("hashchange", () => select(idFromHash(), false));

-
renderList();
const fromUrl = events.find((e) => e.id === idFromHash());
const nextUp = events.find((e) => parse(e.date) >= today) || events[events.length - 1];
select((fromUrl || nextUp).id, false);
