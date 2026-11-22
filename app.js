
const status = document.querySelector("#status");
const launchesContainer = document.querySelector("#launches");
const searchInput = document.querySelector("#search-launches");
const agencyFilter = document.querySelector("#filter-agency");
const resultsCount = document.querySelector("#results-count");
const clearFiltersButton = document.querySelector("#clear-filters");
const retryButton = document.querySelector("#retry-launches");

// Launch details dialog
const launchDialog = document.querySelector("#launch-dialog");
const launchDialogTitle = document.querySelector("#launch-dialog-title");
const launchDialogContent = document.querySelector("#launch-dialog-content");
const closeLaunchDialogButton = document.querySelector("#close-launch-dialog");

// Navigation elements
const navOverview = document.querySelector("#nav-overview");
const navLaunches = document.querySelector("#nav-launches");
const navGuide = document.querySelector("#nav-guide");
const navIntelligence = document.querySelector("#nav-intelligence");

// Page sections
const viewOverview = document.querySelector("#view-overview");
const viewLaunches = document.querySelector("#view-launches");
const viewGuide = document.querySelector("#view-guide");
const viewIntelligence = document.querySelector("#view-intelligence");

let allLaunches = [];
let countdownInterval = null;

const API_URL =
  "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=50";

// The free API allows about 15 requests per hour, so responses are cached
const CACHE_KEY = "spacehub-launches-cache";
const CACHE_DURATION_MS = 15 * 60 * 1000;

// COUNTDOWN

function hasConfirmedLaunchTime(launch) {
  if (!launch.net) {
    return false;
  }

  const launchDate = new Date(launch.net);

  if (Number.isNaN(launchDate.getTime())) {
    return false;
  }

  const precision = (
    typeof launch.net_precision === "string"
      ? launch.net_precision
      : launch.net_precision?.name || ""
  ).toLowerCase();

  if (
    precision.includes("day") ||
    precision.includes("month") ||
    precision.includes("year")
  ) {
    return false;
  }

  const isMidnight =
    launchDate.getUTCHours() === 0 &&
    launchDate.getUTCMinutes() === 0 &&
    launchDate.getUTCSeconds() === 0;

  return !isMidnight;
}

function updateCountdowns() {
  const countdownElements = document.querySelectorAll(
    ".launch-countdown[data-target]"
  );

  const now = Date.now();

  for (const countdown of countdownElements) {
    const target = Number(countdown.dataset.target);
    const remaining = target - now;

    if (remaining <= 0) {
      countdown.textContent = "Scheduled launch time reached";
      countdown.classList.add("countdown-finished");
      continue;
    }

    const totalSeconds = Math.floor(remaining / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdown.textContent =
      `T− ${days}d ${String(hours).padStart(2, "0")}h ` +
      `${String(minutes).padStart(2, "0")}m ` +
      `${String(seconds).padStart(2, "0")}s`;

    countdown.classList.remove("countdown-finished");
  }
}

// NAVIGATION BETWEEN TABS

// Each view has its own address (#home, #launches, #guide,
// #guide/<topic>, #intelligence). The sidebar items are plain links to
// those addresses, and handleRoute() shows the matching view, so links
// can be shared, opened in a new tab, and the back button works.

// PHONE MENU (the ☰ button is only visible on small screens)

const sidebar = document.querySelector(".sidebar");
const menuToggle = document.querySelector("#menu-toggle");

function setMenuOpen(isOpen) {
  sidebar.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(!sidebar.classList.contains("menu-open"));
});

// Close after choosing a view, tapping outside or pressing Escape
window.addEventListener("hashchange", () => setMenuOpen(false));

for (const link of document.querySelectorAll(".sidebar .nav-link")) {
  link.addEventListener("click", () => setMenuOpen(false));
}

document.addEventListener("click", (event) => {
  if (!sidebar.contains(event.target)) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
  }
});

// HIDE / SHOW THE SIDEBAR (computer)

const appLayout = document.querySelector(".app-layout");
const sidebarToggle = document.querySelector("#sidebar-toggle");
const mainContent = document.querySelector(".main-content");
const SIDEBAR_STORAGE_KEY = "spacehub-sidebar-collapsed";

function setSidebarCollapsed(isCollapsed, save = true) {
  appLayout.classList.toggle("sidebar-collapsed", isCollapsed);

  const label = isCollapsed ? "Show sidebar" : "Hide sidebar";
  sidebarToggle.setAttribute("aria-label", label);
  sidebarToggle.title = label;
  sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));

  if (save) {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, isCollapsed ? "1" : "0");
    } catch {
      // Storage may be blocked; the choice just won't be remembered
    }
  }
}

sidebarToggle.addEventListener("click", () => {
  setSidebarCollapsed(!appLayout.classList.contains("sidebar-collapsed"));
});

// Restore the last choice without animating it on page load
try {
  if (localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1") {
    appLayout.classList.add("sidebar-instant");
    setSidebarCollapsed(true, false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => appLayout.classList.remove("sidebar-instant"));
    });
  }
} catch {
  // Storage may be blocked; start with the sidebar open
}

// The globe needs to know its new size once the sidebar has moved
mainContent.addEventListener("transitionend", (event) => {
  if (event.target === mainContent && event.propertyName === "margin-left") {
    if (cesiumViewer && !viewIntelligence.hidden) {
      cesiumViewer.resize();
      cesiumViewer.scene.requestRender();
    }
  }
});

function handleRoute() {
  const [view = "", topic = ""] = location.hash
    .replace(/^#\/?/, "")
    .split("/");

  if (view === "guide") {
    showView("guide");
    showGuideTopic(topic);
    return;
  }

  if (view === "intelligence") {
    showView("intelligence");
    openSpaceIntelligence();
    document.title = "Space Intelligence · SpaceHub";
    return;
  }

  if (view === "launches") {
    showView("launches");
    document.title = "Launches · SpaceHub";
    return;
  }

  // Empty, #home or unknown addresses open the Overview
  showView("overview");
  document.title = "SpaceHub";
}

function showView(view) {
  const isOverview = view === "overview";
  const isLaunches = view === "launches";
  const isGuide = view === "guide";
  const isIntelligence = view === "intelligence";

  viewOverview.hidden = !isOverview;
  viewLaunches.hidden = !isLaunches;
  viewGuide.hidden = !isGuide;
  viewIntelligence.hidden = !isIntelligence;

  navOverview.classList.toggle("active", isOverview);
  navLaunches.classList.toggle("active", isLaunches);
  navGuide.classList.toggle("active", isGuide);
  navIntelligence.classList.toggle("active", isIntelligence);

  // Tell screen readers which page is open
  for (const [link, isCurrent] of [
    [navOverview, isOverview],
    [navLaunches, isLaunches],
    [navGuide, isGuide],
    [navIntelligence, isIntelligence]
  ]) {
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }

  // The Overview's ISS card only updates while it is visible
  if (isOverview) {
    startOverviewIss();
  } else {
    pauseOverviewIss();
  }

  // Only update satellite positions and draw the globe while visible
  if (isIntelligence) {
    resumeSatelliteTracking();
  } else {
    pauseSatelliteTracking();
  }

  setGlobeRendering(isIntelligence);
}

// LOAD LAUNCHES FROM THE API

function readLaunchCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY));

    if (!cache || !Array.isArray(cache.results)) {
      return null;
    }

    return cache;
  } catch {
    return null;
  }
}

function saveLaunchCache(results) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), results })
    );
  } catch {
    // Storage may be full or blocked; the site still works without it
  }
}

function showLaunches(launches) {
  allLaunches = launches;

  populateAgencyFilter(allLaunches);

  renderLaunches(allLaunches);
  renderOverviewLaunches(allLaunches);

  // Keep the launch site markers on the globe in sync
  updateLaunchSiteMarkers();
}

async function loadLaunches() {
  status.textContent = "Loading launches...";
  retryButton.hidden = true;
  launchesContainer.replaceChildren();

  const cache = readLaunchCache();
  const cacheIsFresh =
    cache && Date.now() - cache.savedAt < CACHE_DURATION_MS;

  if (cacheIsFresh) {
    status.textContent = "";
    showLaunches(cache.results);
    return;
  }

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.results)) {
      throw new Error("Unexpected API response format.");
    }

    saveLaunchCache(data.results);

    status.textContent = "";

    showLaunches(data.results);
  } catch (error) {
    console.error(error);

    const isRateLimited = error.message.includes("429");

    const reason = isRateLimited
      ? "Too many requests to the launch API. Please wait a few minutes."
      : "Could not load launches.";

    // Fall back to older saved data if there is any
    if (cache) {
      const savedTime = new Date(cache.savedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      status.textContent =
        `${reason} Showing saved data from ${savedTime}.`;

      showLaunches(cache.results);
    } else {
      status.textContent = reason;
      renderOverviewLaunches([]);
    }

    retryButton.hidden = false;
  }
}

// DISPLAY LAUNCHES

function renderLaunches(launches) {
  launchesContainer.replaceChildren();

  // Stop the previous countdown timer
  if (countdownInterval !== null) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  // Update the results counter
  const count = launches.length;

  const hasFilters =
    searchInput.value.trim() !== "" ||
    agencyFilter.value !== "all";

  resultsCount.textContent = hasFilters
    ? `${count} ${count === 1 ? "launch" : "launches"} found`
    : "";

  // Show a message if no launches match
  if (count === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";

    const heading = document.createElement("h3");
    heading.textContent = "No launches found";

    const message = document.createElement("p");
    message.textContent =
      "Try another search term or clear your filters.";

    emptyState.append(heading, message);
    launchesContainer.append(emptyState);

    return;
  }

  // Create a card for each launch
  for (const launch of launches) {
    const card = document.createElement("article");
    card.className = "launch-card";

    // Launch image
    const imageContainer = createLaunchImage(launch);

    // Mission name
    const title = document.createElement("h2");
    title.textContent = launch.name || "Unknown mission";

    // Launch agency
    const agency = document.createElement("p");
    agency.textContent = `Agency: ${getAgencyName(launch)}`;

    // Mission status badge
    const missionStatus = createStatusBadge(launch);

    // Launch date
    const date = document.createElement("p");
    date.textContent = `Date: ${formatLaunchDate(launch)}`;

    // Countdown
    let countdown = null;

    if (hasConfirmedLaunchTime(launch)) {
      countdown = document.createElement("p");
      countdown.className = "launch-countdown";
      countdown.dataset.target = new Date(launch.net).getTime();
    }

    // Launch location
    const location = document.createElement("p");
    location.textContent = `Location: ${
      launch.pad?.location?.name || "Unknown location"
    }`;

    // View details button
    const detailsButton = document.createElement("button");

    detailsButton.className = "launch-details-button";
    detailsButton.type = "button";
    detailsButton.textContent = "View details";

    detailsButton.addEventListener("click", () => {
      showLaunchDetails(launch);
    });

    // Add information to the card
    card.append(
      imageContainer,
      title,
      agency,
      missionStatus,
      date
    );

    if (countdown) {
      card.append(countdown);
    }

    card.append(location, detailsButton);

    launchesContainer.append(card);
  }

  // Start updating countdowns every second
  updateCountdowns();
  countdownInterval = setInterval(updateCountdowns, 1000);
}

// SHARED LAUNCH CARD PARTS (used by Launches and Overview)

function createLaunchImage(launch) {
  const imageContainer = document.createElement("div");
  imageContainer.className = "launch-image";

  const imageUrl =
    launch.image?.image_url ||
    launch.image?.thumbnail_url;

  if (imageUrl) {
    const image = document.createElement("img");

    image.src = imageUrl;
    image.alt = `Image for ${launch.name || "rocket launch"}`;
    image.loading = "lazy";

    image.addEventListener(
      "error",
      () => {
        image.remove();

        const fallback = document.createElement("span");
        fallback.className = "image-placeholder";
        fallback.textContent = "🚀";

        imageContainer.prepend(fallback);
      },
      { once: true }
    );

    imageContainer.append(image);
  } else {
    const fallback = document.createElement("span");
    fallback.className = "image-placeholder";
    fallback.textContent = "🚀";

    imageContainer.append(fallback);
  }

  return imageContainer;
}

function createStatusBadge(launch) {
  const missionStatus = document.createElement("span");
  const statusName = launch.status?.name || "Unknown status";

  missionStatus.className = "launch-status";
  missionStatus.textContent = statusName;

  const normalizedStatus = statusName.toLowerCase();

  if (
    normalizedStatus.includes("success") ||
    normalizedStatus.includes("complete")
  ) {
    missionStatus.classList.add("status-success");
  } else if (
    normalizedStatus.includes("fail") ||
    normalizedStatus.includes("scrub") ||
    normalizedStatus.includes("cancel")
  ) {
    missionStatus.classList.add("status-failure");
  } else if (
    normalizedStatus.includes("go") ||
    normalizedStatus.includes("in flight") ||
    normalizedStatus.includes("flight")
  ) {
    missionStatus.classList.add("status-active");
  } else if (
    normalizedStatus.includes("tbd") ||
    normalizedStatus.includes("unknown") ||
    normalizedStatus.includes("to be determined")
  ) {
    missionStatus.classList.add("status-unknown");
  } else {
    missionStatus.classList.add("status-planned");
  }

  return missionStatus;
}

// "22 Nov 2026, 12:23 UTC", "22 Nov 2026" or "To be confirmed"
function formatLaunchDate(launch) {
  if (!launch.net) {
    return "To be confirmed";
  }

  const launchDate = new Date(launch.net);

  const isMidnight =
    launchDate.getUTCHours() === 0 &&
    launchDate.getUTCMinutes() === 0 &&
    launchDate.getUTCSeconds() === 0;

  const isEndOfYear =
    launchDate.getUTCMonth() === 11 &&
    launchDate.getUTCDate() === 31;

  if (isMidnight && isEndOfYear) {
    return "To be confirmed";
  }

  const dateText = launchDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });

  if (isMidnight) {
    return dateText;
  }

  const timeText = launchDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC"
  });

  return `${dateText}, ${timeText} UTC`;
}

// SEARCH AND FILTERS

searchInput.addEventListener("input", applyFilters);
agencyFilter.addEventListener("change", applyFilters);

function getAgencyName(launch) {
  return launch.launch_service_provider?.name
    || "Unknown agency";
}

function populateAgencyFilter(launches) {
  const agencies = [
    ...new Set(launches.map(getAgencyName))
  ].sort();

  agencyFilter.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All agencies";
  agencyFilter.append(allOption);

  for (const agency of agencies) {
    const option = document.createElement("option");

    option.value = agency;
    option.textContent = agency;

    agencyFilter.append(option);
  }
}

function applyFilters() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedAgency = agencyFilter.value;

  const filteredLaunches = allLaunches.filter((launch) => {
    const name = (launch.name || "").toLowerCase();
    const agency = getAgencyName(launch);

    const matchesSearch = name.includes(query);

    const matchesAgency =
      selectedAgency === "all" ||
      agency === selectedAgency;

    return matchesSearch && matchesAgency;
  });

  renderLaunches(filteredLaunches);
}

// RETRY LOADING LAUNCHES

retryButton.addEventListener("click", () => {
  loadLaunches();
});

// CLEAR FILTERS

clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  agencyFilter.value = "all";

  applyFilters();
});

// SHOW LAUNCH DETAILS


function showLaunchDetails(launch) {
  launchDialogTitle.textContent =
    launch.name || "Unknown mission";

  launchDialogContent.replaceChildren();

  const details = [
    {
      label: "Mission",
      value: launch.mission?.name
    },
    {
      label: "Mission type",
      value: launch.mission?.type
    },
    {
      label: "Mission description",
      value: launch.mission?.description
    },
    {
      label: "Rocket",
      value:
        launch.rocket?.configuration?.full_name ||
        launch.rocket?.configuration?.name
    },
    {
      label: "Manufacturer",
      value:
        launch.rocket?.configuration?.manufacturer?.name
    },
    {
      label: "Launch provider",
      value: launch.launch_service_provider?.name
    },
    {
      label: "Launch status",
      value: launch.status?.name
    },
    {
      label: "Launch designator",
      value: launch.launch_designator
    },
    {
      label: "Orbit",
      value: launch.mission?.orbit?.name
    },
    {
      label: "Destination",
      value:
        launch.mission?.orbit?.celestial_body?.name
    },
    {
      label: "Launch pad",
      value: launch.pad?.name
    },
    {
      label: "Location",
      value: launch.pad?.location?.name
    },
    {
      label: "Launch date",
      value: launch.net
        ? new Date(launch.net).toLocaleString("en-GB", {
            dateStyle: "long",
            timeStyle: "short",
            timeZone: "UTC"
          }) + " UTC"
        : null
    }
  ];

  for (const detail of details) {
    if (
      detail.value === null ||
      detail.value === undefined ||
      detail.value === ""
    ) {
      continue;
    }

    const paragraph = document.createElement("p");
    const label = document.createElement("strong");

    label.textContent = `${detail.label}: `;

    paragraph.append(label, detail.value);
    launchDialogContent.append(paragraph);
  }


    
  // MISSION LINKS
  const wikipediaUrl = launch.pad?.wiki_url;

  if (wikipediaUrl) {
    try {
      const url = new URL(wikipediaUrl);

      if (
        url.protocol === "https:" &&
        url.hostname === "en.wikipedia.org"
      ) {
        const section = document.createElement("div");
        const heading = document.createElement("p");
        const headingText = document.createElement("strong");
        const paragraph = document.createElement("p");
        const anchor = document.createElement("a");

        headingText.textContent = "Useful links";
        heading.append(headingText);

        anchor.href = url.href;
        anchor.textContent = "Launch Pad Wikipedia";
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.className = "mission-link";

        paragraph.append(anchor);
        section.append(heading, paragraph);
        launchDialogContent.append(section);
      }
    } catch {
      // Ignore invalid URLs
    }
  }


  // ADD TO CALENDAR (only when the exact launch time is known)
  if (hasConfirmedLaunchTime(launch)) {
    launchDialogContent.append(
      createCalendarControl(launch, "load-button calendar-button")
    );
  } else {
    const calendarNote = document.createElement("p");

    calendarNote.className = "calendar-note";
    calendarNote.textContent =
      "Calendar export will be available once the launch time is confirmed.";

    launchDialogContent.append(calendarNote);
  }

  launchDialog.showModal();
}

// CALENDAR FILE (.ics)

function formatCalendarDate(date) {
  // 2026-11-22T12:23:56.000Z -> 20261122T122356Z
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeCalendarText(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// Calendar lines must be at most 75 bytes; longer lines continue
// on the next line, starting with a space
function foldCalendarLine(line) {
  const encoder = new TextEncoder();
  const parts = [];
  let current = "";
  let currentBytes = 0;

  for (const character of line) {
    const size = encoder.encode(character).length;
    const limit = parts.length === 0 ? 75 : 74;

    if (currentBytes + size > limit) {
      parts.push(current);
      current = "";
      currentBytes = 0;
    }

    current += character;
    currentBytes += size;
  }

  parts.push(current);

  return parts.join("\r\n ");
}

// Details shared by the .ics file and the Google Calendar link
function getLaunchCalendarEvent(launch) {
  const start = new Date(launch.net);
  const windowEnd = new Date(launch.window_end);

  // Use the end of the launch window, or one hour if there is none
  const end =
    windowEnd.getTime() > start.getTime()
      ? windowEnd
      : new Date(start.getTime() + 60 * 60 * 1000);

  const eventLocation = [launch.pad?.name, launch.pad?.location?.name]
    .filter(Boolean)
    .join(", ");

  const descriptionLines = [
    launch.rocket?.configuration?.full_name &&
      `Rocket: ${launch.rocket.configuration.full_name}`,
    launch.launch_service_provider?.name &&
      `Provider: ${launch.launch_service_provider.name}`,
    launch.mission?.description,
    "Launch times often change. Check SpaceHub for the latest schedule."
  ].filter(Boolean);

  return {
    start,
    end,
    title: `Launch: ${launch.name || "Unknown mission"}`,
    location: eventLocation,
    descriptionLines
  };
}

function buildLaunchCalendarFile(launch) {
  const {
    start,
    end,
    title,
    location: eventLocation,
    descriptionLines
  } = getLaunchCalendarEvent(launch);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SpaceHub//Launch Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${launch.id || formatCalendarDate(start)}@spacehub`,
    `DTSTAMP:${formatCalendarDate(new Date())}`,
    `DTSTART:${formatCalendarDate(start)}`,
    `DTEND:${formatCalendarDate(end)}`,
    `SUMMARY:${escapeCalendarText(title)}`,
    eventLocation && `LOCATION:${escapeCalendarText(eventLocation)}`,
    `DESCRIPTION:${escapeCalendarText(descriptionLines.join("\n\n"))}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:-PT30M",
    `DESCRIPTION:${escapeCalendarText(`${launch.name || "Launch"} in 30 minutes`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].filter(Boolean);

  return lines.map(foldCalendarLine).join("\r\n") + "\r\n";
}

// Downloads an .ics file (Apple Calendar on Mac, Outlook and others)
function downloadLaunchCalendarFile(launch) {
  const content = buildLaunchCalendarFile(launch);

  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const fileName =
    (launch.slug || launch.name || "launch")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + ".ics";

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Opens Google Calendar with the event already filled in
function openGoogleCalendar(launch) {
  const event = getLaunchCalendarEvent(launch);

  // Keep the link short enough for every browser
  let details = event.descriptionLines.join("\n\n");
  if (details.length > 900) {
    details = `${details.slice(0, 897)}...`;
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatCalendarDate(event.start)}/${formatCalendarDate(event.end)}`,
    details,
    location: event.location
  });

  window.open(
    `https://calendar.google.com/calendar/render?${params}`,
    "_blank",
    "noopener"
  );
}

// On iPhone and iPad, Safari opens calendar data straight in the
// Calendar app's "Add Event" screen
function addToIPhoneCalendar(launch) {
  const content = buildLaunchCalendarFile(launch);

  window.location.href =
    `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
}

function getCalendarPlatform() {
  const userAgent = navigator.userAgent;

  // iPadOS reports itself as a Mac, but has a touch screen
  const isIOS =
    /iPhone|iPad|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    // Chrome, Firefox, Edge and in-app browsers on iOS cannot open
    // calendar files, so they use Google Calendar instead
    const isOtherBrowser =
      /CriOS|FxiOS|EdgiOS|OPiOS|GSA|FBAN|FBAV|Instagram|Line\//.test(userAgent);

    return isOtherBrowser ? "ios-other" : "ios-safari";
  }

  if (/Android/i.test(userAgent)) {
    return "android";
  }

  return "desktop";
}

// "Add to calendar" button: goes straight to the phone's calendar on
// mobile, and shows a choice of calendars on a computer
function createCalendarControl(launch, buttonClassName) {
  const control = document.createElement("div");
  control.className = "calendar-control";

  const button = document.createElement("button");
  button.type = "button";
  button.className = buttonClassName;
  button.textContent = "Add to calendar";

  control.append(button);

  const platform = getCalendarPlatform();

  if (platform === "ios-safari") {
    button.addEventListener("click", () => addToIPhoneCalendar(launch));
    return control;
  }

  if (platform !== "desktop") {
    button.addEventListener("click", () => openGoogleCalendar(launch));
    return control;
  }

  // Computer: small menu with both options
  const menu = document.createElement("div");
  menu.className = "calendar-menu";
  menu.hidden = true;

  const options = [
    { label: "Google Calendar", action: () => openGoogleCalendar(launch) },
    { label: "Apple Calendar / Outlook (.ics)", action: () => downloadLaunchCalendarFile(launch) }
  ];

  for (const option of options) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "calendar-menu-item";
    item.textContent = option.label;

    item.addEventListener("click", () => {
      menu.hidden = true;
      option.action();
    });

    menu.append(item);
  }

  const closeMenu = (event) => {
    if (event.type === "keydown" && event.key !== "Escape") {
      return;
    }

    if (event.type === "click" && control.contains(event.target)) {
      return;
    }

    menu.hidden = true;
    document.removeEventListener("click", closeMenu);
    document.removeEventListener("keydown", closeMenu);
  };

  button.setAttribute("aria-haspopup", "true");

  button.addEventListener("click", () => {
    menu.hidden = !menu.hidden;
    button.setAttribute("aria-expanded", String(!menu.hidden));

    if (!menu.hidden) {
      document.addEventListener("click", closeMenu);
      document.addEventListener("keydown", closeMenu);
    }
  });

  control.append(menu);
  return control;
}

// ROCKET GUIDE ARTICLES

const guideGrid = document.querySelector("#view-guide .guide-grid");
const guideContent = document.querySelector("#guide-content");

for (const button of document.querySelectorAll(".guide-button[data-topic]")) {
  button.addEventListener("click", () => {
    location.hash = `guide/${button.dataset.topic}`;
  });
}

function showGuideTopic(topicKey) {
  const topic = Object.hasOwn(GUIDE_TOPICS, topicKey)
    ? GUIDE_TOPICS[topicKey]
    : null;

  // No topic (or an unknown one): show the list of topics
  if (!topic) {
    guideContent.replaceChildren();
    guideContent.hidden = true;
    guideGrid.hidden = false;
    document.title = "Rocket Guide · SpaceHub";
    return;
  }

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "guide-button guide-back-button";
  backButton.textContent = "← Back to topics";
  backButton.addEventListener("click", () => {
    location.hash = "guide";
  });

  const title = document.createElement("h2");
  title.textContent = topic.title;

  const intro = document.createElement("p");
  intro.textContent = topic.intro;

  const article = [backButton, title, intro];

  for (const section of topic.sections) {
    const heading = document.createElement("h3");
    heading.textContent = section.heading;
    article.push(heading);

    // Paragraphs come before the list; "after" paragraphs follow it
    for (const text of section.paragraphs || []) {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      article.push(paragraph);
    }

    if (section.list) {
      const list = document.createElement("ul");

      for (const item of section.list) {
        const listItem = document.createElement("li");

        if (typeof item === "string") {
          listItem.textContent = item;
        } else {
          const term = document.createElement("strong");
          term.textContent = `${item.term}: `;
          listItem.append(term, item.text);
        }

        list.append(listItem);
      }

      article.push(list);
    }

    for (const text of section.after || []) {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      article.push(paragraph);
    }
  }

  guideContent.replaceChildren(...article);
  guideGrid.hidden = true;
  guideContent.hidden = false;
  document.title = `${topic.title} · SpaceHub`;

  window.scrollTo({ top: 0 });
}


// CLOSE LAUNCH DETAILS

closeLaunchDialogButton.addEventListener("click", () => {
  launchDialog.close();
});

// CLOSE WHEN CLICKING OUTSIDE THE DIALOG

launchDialog.addEventListener("click", (event) => {
  if (event.target === launchDialog) {
    launchDialog.close();
  }
});


// SPACE INTELLIGENCE — 3D GLOBE
let cesiumViewer = null;

function initializeSpaceIntelligence() {
  const container = document.querySelector("#cesiumContainer");

  if (!container || cesiumViewer) {
    return;
  }

  if (typeof Cesium === "undefined") {
    container.textContent =
      "Could not load the 3D globe library. Please refresh the page.";
    return;
  }

  // Remove the temporary placeholder
  container.replaceChildren();

  try {
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Im52NDMzaElfYUxnNzB3dFgiLCJqdGkiOiJlZGNkZjNmOC1lMWNhLTQzMmItOWYzMi0yMWNmNGFjZDRiM2EiLCJpZCI6NTI5NDQ5LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3OTIzNDMwNzh9.ygxySbSj2TPhQCyxRPOpUpsSW-vUCdSnILH_YxToBxo";
    cesiumViewer = new Cesium.Viewer("cesiumContainer", {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: true,
      sceneModePicker: false,
      navigationHelpButton: true,
      infoBox: false,
      selectionIndicator: false,
      fullscreenButton: true,

      // Performance: only draw a new frame when something changes
      // (camera movement, tiles loading or satellite updates)
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,

      // Quality: render at the screen's real resolution (see below)
      useBrowserRecommendedResolution: false
    });

    // Sharp markers on high-DPI screens, capped at 1.5x so the globe
    // does not get too heavy on 4K or Retina displays
    const pixelRatio = window.devicePixelRatio || 1;
    cesiumViewer.resolutionScale = Math.min(pixelRatio, 1.5) / pixelRatio;

    
    // Improve the Earth's visual appearance
    cesiumViewer.scene.globe.enableLighting = true;
    cesiumViewer.scene.globe.showGroundAtmosphere = true;
    cesiumViewer.scene.skyAtmosphere.show = true;
    cesiumViewer.scene.fog.enabled = true;

    // Set the initial camera position
    cesiumViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        0,
        20,
        20000000
      ),
      duration: 2
    });

    setUpGlobeInteraction();
    updateLaunchSiteMarkers();
    startSatelliteTracking();

  } catch (error) {
  console.error("Cesium initialization failed:", error);

  container.replaceChildren();

  const errorMessage = document.createElement("p");
  errorMessage.className = "globe-placeholder";
  errorMessage.textContent =
    `Globe error: ${error.message || error}`;

  container.append(errorMessage);
}
}

// Initialize the globe when opening Space Intelligence
function openSpaceIntelligence() {
  initializeSpaceIntelligence();

  // Refresh the globe size after showing its section
  requestAnimationFrame(() => {
    if (cesiumViewer) {
      cesiumViewer.resize();
      cesiumViewer.scene.requestRender();
    }
  });
}

// Stop Cesium's render loop while the globe is hidden
function setGlobeRendering(isVisible) {
  if (!cesiumViewer) {
    return;
  }

  cesiumViewer.useDefaultRenderLoop = isVisible;

  if (isVisible) {
    cesiumViewer.scene.requestRender();
  }
}

// MARKER IMAGES
// Drawn on a canvas at 3x size so they stay sharp on any screen

const MARKER_IMAGE_SCALE = 3;
const markerImageCache = new Map();

function createMarkerImage(key, size, draw) {
  if (markerImageCache.has(key)) {
    return markerImageCache.get(key);
  }

  const canvas = document.createElement("canvas");
  canvas.width = size * MARKER_IMAGE_SCALE;
  canvas.height = size * MARKER_IMAGE_SCALE;

  const context = canvas.getContext("2d");
  context.scale(MARKER_IMAGE_SCALE, MARKER_IMAGE_SCALE);
  draw(context, size);

  markerImageCache.set(key, canvas);
  return canvas;
}

// Orange badge with a small white rocket
function getLaunchSiteImage() {
  return createMarkerImage("launch-site", 28, (context, size) => {
    const center = size / 2;

    // Badge with a soft shadow
    context.shadowColor = "rgba(0, 0, 0, 0.55)";
    context.shadowBlur = 4;

    const fill = context.createLinearGradient(0, 3, 0, size - 3);
    fill.addColorStop(0, "#fdba74");
    fill.addColorStop(1, "#ea580c");

    context.beginPath();
    context.arc(center, center, 11, 0, Math.PI * 2);
    context.fillStyle = fill;
    context.fill();

    context.shadowBlur = 0;
    context.lineWidth = 1.5;
    context.strokeStyle = "rgba(255, 255, 255, 0.9)";
    context.stroke();

    // Rocket body
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.moveTo(center, 6.5);
    context.quadraticCurveTo(center + 3, 9.5, center + 3, 14);
    context.lineTo(center + 3, 17.5);
    context.lineTo(center - 3, 17.5);
    context.lineTo(center - 3, 14);
    context.quadraticCurveTo(center - 3, 9.5, center, 6.5);
    context.fill();

    // Fins
    context.beginPath();
    context.moveTo(center - 3, 14.5);
    context.lineTo(center - 5.5, 18.5);
    context.lineTo(center - 3, 17.5);
    context.moveTo(center + 3, 14.5);
    context.lineTo(center + 5.5, 18.5);
    context.lineTo(center + 3, 17.5);
    context.fill();

    // Window
    context.fillStyle = "#ea580c";
    context.beginPath();
    context.arc(center, 11.5, 1.3, 0, Math.PI * 2);
    context.fill();

    // Flame
    context.fillStyle = "#fde68a";
    context.beginPath();
    context.moveTo(center - 1.8, 18);
    context.lineTo(center, 21.5);
    context.lineTo(center + 1.8, 18);
    context.fill();
  });
}

// Bigger orange badge with the number of launches, for grouped launch sites
function getLaunchClusterImage(count) {
  return createMarkerImage(`launch-cluster-${count}`, 34, (context, size) => {
    const center = size / 2;

    context.beginPath();
    context.arc(center, center, 16, 0, Math.PI * 2);
    context.fillStyle = "rgba(251, 146, 60, 0.25)";
    context.fill();

    const fill = context.createLinearGradient(0, 4, 0, size - 4);
    fill.addColorStop(0, "#fdba74");
    fill.addColorStop(1, "#ea580c");

    context.beginPath();
    context.arc(center, center, 12.5, 0, Math.PI * 2);
    context.fillStyle = fill;
    context.fill();
    context.lineWidth = 1.5;
    context.strokeStyle = "rgba(255, 255, 255, 0.9)";
    context.stroke();

    context.fillStyle = "#ffffff";
    context.font = `700 ${count > 99 ? 10 : 12}px Inter, system-ui, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(String(count), center, center + 0.5);
  });
}

// Satellite icon (body and solar panels) with a glow in its colour
function getSatelliteImage(color) {
  return createMarkerImage(`satellite-${color}`, 40, (context, size) => {
    const center = size / 2;
    const glowColor = Cesium.Color.fromCssColorString(color);

    const glow = context.createRadialGradient(center, center, 0, center, center, center);
    glow.addColorStop(0, glowColor.withAlpha(0.55).toCssColorString());
    glow.addColorStop(0.45, glowColor.withAlpha(0.18).toCssColorString());
    glow.addColorStop(1, glowColor.withAlpha(0).toCssColorString());

    context.fillStyle = glow;
    context.fillRect(0, 0, size, size);

    context.translate(center, center);
    context.rotate(-Math.PI / 4);

    // Boom between the panels
    context.strokeStyle = "#e2e8f0";
    context.lineWidth = 1.2;
    context.beginPath();
    context.moveTo(-12, 0);
    context.lineTo(12, 0);
    context.stroke();

    // Solar panels
    for (const side of [-1, 1]) {
      const x = side === -1 ? -14 : 5;

      context.fillStyle = color;
      context.fillRect(x, -3.5, 9, 7);

      context.strokeStyle = "rgba(255, 255, 255, 0.85)";
      context.lineWidth = 0.8;
      context.strokeRect(x, -3.5, 9, 7);

      context.beginPath();
      context.moveTo(x + 4.5, -3.5);
      context.lineTo(x + 4.5, 3.5);
      context.stroke();
    }

    // Body
    context.fillStyle = "#f8fafc";
    context.strokeStyle = "#0f172a";
    context.lineWidth = 1;
    context.beginPath();
    context.roundRect(-3.5, -4.5, 7, 9, 1.5);
    context.fill();
    context.stroke();
  });
}

// Shared look for the name tags next to markers
function createMarkerLabel(text, color, offsetX) {
  return {
    text,
    font: "600 12px Inter, system-ui, sans-serif",
    fillColor: color,
    showBackground: true,
    backgroundColor: Cesium.Color.fromCssColorString("#080d19").withAlpha(0.82),
    backgroundPadding: new Cesium.Cartesian2(7, 4),
    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
    verticalOrigin: Cesium.VerticalOrigin.CENTER,
    pixelOffset: new Cesium.Cartesian2(offsetX, 0)
  };
}



/* SPACE INTELLIGENCE — LAUNCH SITES */


let launchSiteSource = null;
const launchSiteLaunches = new Map(); // marker id -> launches from that pad

// One marker per launch pad, built from the upcoming launches
function updateLaunchSiteMarkers() {
  if (!cesiumViewer) {
    return;
  }

  if (!launchSiteSource) {
    launchSiteSource = new Cesium.CustomDataSource("launch-sites");

    // Group launch sites that are too close together on screen
    const clustering = launchSiteSource.clustering;
    clustering.enabled = true;
    clustering.pixelRange = 22;
    clustering.minimumClusterSize = 2;

    clustering.clusterEvent.addEventListener((entities, cluster) => {
      const launchCount = entities.reduce(
        (total, entity) => total + (launchSiteLaunches.get(entity.id)?.length || 0),
        0
      );

      cluster.label.show = false;
      cluster.billboard.show = true;
      cluster.billboard.id = cluster.label.id; // the grouped entities, for clicks
      cluster.billboard.image = getLaunchClusterImage(launchCount);
      cluster.billboard.width = 34;
      cluster.billboard.height = 34;
      cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.CENTER;
      cluster.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
    });

    cesiumViewer.dataSources.add(launchSiteSource);
  }

  launchSiteSource.entities.removeAll();
  launchSiteLaunches.clear();

  const sites = new Map();

  for (const launch of allLaunches) {
    const latitude = Number(launch.pad?.latitude);
    const longitude = Number(launch.pad?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      continue;
    }

    const key = launch.pad.id ?? `${latitude},${longitude}`;

    if (!sites.has(key)) {
      sites.set(key, { pad: launch.pad, latitude, longitude, launches: [] });
    }

    sites.get(key).launches.push(launch);
  }

  const image = getLaunchSiteImage();
  const labelColor = Cesium.Color.fromCssColorString("#fed7aa");

  for (const [key, site] of sites) {
    const id = `launch-site-${key}`;
    const count = site.launches.length;
    const padName = site.pad.name || "Launch site";

    launchSiteSource.entities.add({
      id,
      name: padName,
      position: Cesium.Cartesian3.fromDegrees(
        site.longitude,
        site.latitude,
        2000
      ),
      billboard: {
        image,
        width: 28,
        height: 28,
        // Slightly smaller when the camera is far away
        scaleByDistance: new Cesium.NearFarScalar(1.5e6, 1.1, 2.5e7, 0.75),
        // Never cut by the globe; markers behind the Earth are hidden
        // by updateMarkerVisibility() instead
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      label: {
        ...createMarkerLabel(
          count > 1 ? `${padName} · ${count} launches` : padName,
          labelColor,
          18
        ),
        // Only show the names when the camera is close, to avoid clutter
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000),
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    });

    launchSiteLaunches.set(id, site.launches);
  }

  cesiumViewer.scene.requestRender();
}

// Markers ignore the globe's depth so they are never cut in half,
// so hide the ones that are on the far side of the Earth by hand
function updateMarkerVisibility() {
  const occluder = new Cesium.EllipsoidalOccluder(
    Cesium.Ellipsoid.WGS84,
    cesiumViewer.camera.positionWC
  );
  const time = cesiumViewer.clock.currentTime;

  const markers = [
    ...(launchSiteSource ? launchSiteSource.entities.values : []),
    ...[...trackedSatellites.values()].map(tracked => tracked.entity)
  ];

  for (const entity of markers) {
    const position = entity.position?.getValue(time);
    const isVisible = !position || occluder.isPointVisible(position);

    if (entity.show !== isVisible) {
      entity.show = isVisible;
    }
  }
}

// Clicking a launch site opens its next launch, clicking a group of
// launch sites zooms in on them, and clicking a satellite selects it
function handleGlobeClick(entity) {
  if (!entity) {
    return;
  }

  if (Array.isArray(entity)) {
    const time = cesiumViewer.clock.currentTime;
    const positions = entity
      .map(groupedEntity => groupedEntity.position?.getValue(time))
      .filter(Boolean);

    // Zoom in just enough for the closest launch sites to separate
    let smallestGap = Infinity;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        smallestGap = Math.min(
          smallestGap,
          Cesium.Cartesian3.distance(positions[i], positions[j])
        );
      }
    }

    const range = Math.min(
      Math.max(smallestGap * 18, 25000),
      cesiumViewer.camera.positionCartographic.height / 2
    );

    cesiumViewer.camera.flyToBoundingSphere(
      Cesium.BoundingSphere.fromPoints(positions),
      {
        duration: 1.5,
        offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), range)
      }
    );
    return;
  }

  if (launchSiteLaunches.has(entity.id)) {
    showLaunchDetails(launchSiteLaunches.get(entity.id)[0]);
    return;
  }

  const satelliteId = String(entity.id).replace(/^satellite-/, "");

  if (trackedSatellites.has(satelliteId)) {
    selectSatellite(satelliteId);
  }
}

function getClickableEntity(screenPosition) {
  const picked = cesiumViewer.scene.pick(screenPosition);
  const entity = picked?.id;

  // A group of launch sites
  if (Array.isArray(entity) && entity.length > 0) {
    return entity;
  }

  if (!(entity instanceof Cesium.Entity)) {
    return null;
  }

  const isClickable =
    launchSiteLaunches.has(entity.id) ||
    String(entity.id).startsWith("satellite-");

  return isClickable ? entity : null;
}

function setUpGlobeInteraction() {
  // Runs only when a frame is drawn, and checks about 20 markers
  cesiumViewer.scene.preRender.addEventListener(updateMarkerVisibility);

  const handler = new Cesium.ScreenSpaceEventHandler(cesiumViewer.scene.canvas);

  handler.setInputAction((click) => {
    handleGlobeClick(getClickableEntity(click.position));
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // Show a pointer cursor over things that can be clicked.
  // Picking is expensive, so it runs at most every 120 ms.
  let hoverPosition = null;
  let hoverTimer = null;

  handler.setInputAction((movement) => {
    hoverPosition = Cesium.Cartesian2.clone(movement.endPosition);

    if (hoverTimer) {
      return;
    }

    hoverTimer = setTimeout(() => {
      hoverTimer = null;

      cesiumViewer.scene.canvas.style.cursor =
        getClickableEntity(hoverPosition) ? "pointer" : "";
    }, 120);
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}


/* SPACE INTELLIGENCE — SATELLITE TRACKING */

// noradId is the satellite's number in the NORAD catalogue (used by CelesTrak)
const SATELLITES = [
  {
    id: "iss",
    label: "ISS",
    name: "International Space Station",
    noradId: 25544,
    color: "#00ffff"
  },
  {
    id: "tiangong",
    label: "Tiangong",
    name: "Tiangong Space Station",
    noradId: 48274,
    color: "#a78bfa"
  },
  {
    id: "hubble",
    label: "Hubble",
    name: "Hubble Space Telescope",
    noradId: 20580,
    color: "#4ade80"
  }
];

// CelesTrak asks clients not to download the same data more than
// once every 2 hours, so orbital data is cached for that long
const TLE_CACHE_DURATION_MS = 2 * 60 * 60 * 1000;
const ORBIT_STEP_SECONDS = 30;
const ORBIT_REFRESH_MS = 60 * 1000;

const trackedSatellites = new Map(); // id -> config, satrec and entities
let selectedSatelliteId = "iss";
let satelliteTrackingStarted = false;
let satelliteUpdateTimer = null;
let lastOrbitUpdate = 0;

function pauseSatelliteTracking() {
  if (satelliteUpdateTimer) {
    clearInterval(satelliteUpdateTimer);
    satelliteUpdateTimer = null;
  }
}

function resumeSatelliteTracking() {
  if (
    trackedSatellites.size === 0 ||
    satelliteUpdateTimer ||
    viewIntelligence.hidden
  ) {
    return;
  }

  updateSatellites();
  satelliteUpdateTimer = setInterval(updateSatellites, 1000);
}

function parseTle(text) {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const line1Index = lines.findIndex(line => line.startsWith("1 "));

  if (line1Index < 0 || !lines[line1Index + 1]?.startsWith("2 ")) {
    throw new Error("The orbital data format is invalid.");
  }

  return [lines[line1Index], lines[line1Index + 1]];
}

async function loadTle(noradId) {
  const cacheKey = `spacehub-tle-${noradId}`;
  let cache = null;

  try {
    cache = JSON.parse(localStorage.getItem(cacheKey));
  } catch {
    cache = null;
  }

  const hasCache = Array.isArray(cache?.lines) && cache.lines.length === 2;

  if (hasCache && Date.now() - cache.savedAt < TLE_CACHE_DURATION_MS) {
    return cache.lines;
  }

  try {
    const response = await fetch(
      `https://celestrak.org/NORAD/elements/gp.php?CATNR=${noradId}&FORMAT=TLE`
    );

    if (!response.ok) {
      throw new Error(`Could not fetch the orbital data (HTTP ${response.status}).`);
    }

    const lines = parseTle(await response.text());

    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ savedAt: Date.now(), lines })
      );
    } catch {
      // Storage may be full or blocked; tracking still works without it
    }

    return lines;
  } catch (error) {
    // Older orbital data is still accurate enough for a few days
    if (hasCache) {
      return cache.lines;
    }

    throw error;
  }
}

function getSatellitePosition(satrec, date) {
  const result = satellite.propagate(satrec, date);

  if (!result || !result.position) {
    return null;
  }

  const geodetic = satellite.eciToGeodetic(
    result.position,
    satellite.gstime(date)
  );

  return {
    latitude: satellite.degreesLat(geodetic.latitude),
    longitude: satellite.degreesLong(geodetic.longitude),
    altitudeKm: geodetic.height
  };
}

function toCartesian(position) {
  return Cesium.Cartesian3.fromDegrees(
    position.longitude,
    position.latitude,
    position.altitudeKm * 1000
  );
}

// Predicted path for one full orbit (about 90 minutes for the ISS).
// It is drawn over the rotating Earth, so it does not close into a loop.
function getOrbitPath(satrec, startDate) {
  const periodMinutes = (2 * Math.PI) / satrec.no; // satrec.no is in radians per minute
  const steps = Math.ceil((periodMinutes * 60) / ORBIT_STEP_SECONDS);
  const points = [];

  for (let step = 0; step <= steps; step++) {
    const date = new Date(
      startDate.getTime() + step * ORBIT_STEP_SECONDS * 1000
    );
    const position = getSatellitePosition(satrec, date);

    if (position) {
      points.push(toCartesian(position));
    }
  }

  return points;
}

function updateSatellites() {
  if (!cesiumViewer) {
    return;
  }

  const now = new Date();
  const refreshOrbits = now.getTime() - lastOrbitUpdate > ORBIT_REFRESH_MS;

  for (const tracked of trackedSatellites.values()) {
    const position = getSatellitePosition(tracked.satrec, now);

    if (!position) {
      continue;
    }

    tracked.position = position;
    tracked.entity.position = toCartesian(position);

    if (refreshOrbits) {
      tracked.orbitEntity.polyline.positions =
        getOrbitPath(tracked.satrec, now);
    }
  }

  if (refreshOrbits) {
    lastOrbitUpdate = now.getTime();
  }

  updateSatellitePanel(now);

  // Request mode only draws when asked, so draw the new positions
  cesiumViewer.scene.requestRender();
}

function createSatelliteEntities(config, satrec) {
  const color = Cesium.Color.fromCssColorString(config.color);

  const entity = cesiumViewer.entities.add({
    id: `satellite-${config.id}`,
    name: config.name,
    position: Cesium.Cartesian3.fromDegrees(0, 0, 420000),
    billboard: {
      image: getSatelliteImage(config.color),
      width: 40,
      height: 40,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    },
    label: {
      ...createMarkerLabel(config.label, color, 20),
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  });

  const orbitEntity = cesiumViewer.entities.add({
    id: `orbit-${config.id}`,
    show: false,
    polyline: {
      positions: [],
      width: 6,
      arcType: Cesium.ArcType.NONE,
      material: new Cesium.PolylineGlowMaterialProperty({
        color: color.withAlpha(0.85),
        glowPower: 0.18,
        taperPower: 1
      })
    }
  });

  return { entity, orbitEntity };
}

function createSatellitePanel() {
  let panel = document.querySelector("#iss-info-panel");

  if (panel) {
    return;
  }

  panel = document.createElement("div");
  panel.id = "iss-info-panel";
  panel.className = "iss-info-panel";

  panel.innerHTML = `
    <div class="iss-panel-header">
      <div>
        <p class="iss-panel-eyebrow">LIVE ORBITAL TRACKING</p>
        <h3 id="satellite-name">--</h3>
      </div>
      <span class="iss-status">
        <span class="iss-status-dot"></span>
        Tracking
      </span>
    </div>

    <div class="satellite-selector" aria-label="Choose a satellite"></div>

    <div class="iss-panel-grid">
      <div class="iss-data-card">
        <span>ALTITUDE</span>
        <strong id="satellite-altitude">-- km</strong>
      </div>

      <div class="iss-data-card">
        <span>LATITUDE</span>
        <strong id="satellite-latitude">--</strong>
      </div>

      <div class="iss-data-card">
        <span>LONGITUDE</span>
        <strong id="satellite-longitude">--</strong>
      </div>

      <div class="iss-data-card">
        <span>LAST UPDATE (UTC)</span>
        <strong id="satellite-update-time">--:--:--</strong>
      </div>
    </div>

    <button id="satellite-focus-button" type="button">
      Centre camera ↗
    </button>
  `;

  const selector = panel.querySelector(".satellite-selector");

  for (const tracked of trackedSatellites.values()) {
    const button = document.createElement("button");
    const dot = document.createElement("span");

    button.type = "button";
    button.className = "satellite-option";
    button.dataset.satellite = tracked.id;

    dot.className = "satellite-option-dot";
    dot.style.setProperty("--dot-color", tracked.color);

    button.append(dot, tracked.label);
    button.addEventListener("click", () => selectSatellite(tracked.id));

    selector.append(button);
  }

  panel
    .querySelector("#satellite-focus-button")
    .addEventListener("click", focusSelectedSatellite);

  document
    .querySelector("#cesiumContainer")
    .insertAdjacentElement("afterend", panel);
}

function updateSatellitePanel(now) {
  const tracked = trackedSatellites.get(selectedSatelliteId);

  if (!tracked) {
    return;
  }

  const position = tracked.position;

  document.querySelector("#satellite-name").textContent = tracked.name;

  document.querySelector("#satellite-altitude").textContent =
    position ? `${Math.round(position.altitudeKm)} km` : "-- km";

  document.querySelector("#satellite-latitude").textContent =
    position ? `${position.latitude.toFixed(2)}°` : "--";

  document.querySelector("#satellite-longitude").textContent =
    position ? `${position.longitude.toFixed(2)}°` : "--";

  document.querySelector("#satellite-update-time").textContent =
    position ? now.toISOString().slice(11, 19) : "--:--:--";
}

function selectSatellite(id) {
  if (!trackedSatellites.has(id)) {
    return;
  }

  selectedSatelliteId = id;
  const tracked = trackedSatellites.get(id);

  // Only the selected satellite's orbit is drawn
  for (const other of trackedSatellites.values()) {
    other.orbitEntity.show = other.id === id;

    // Make the selected satellite slightly bigger
    other.entity.billboard.scale = other.id === id ? 1.2 : 0.9;
  }

  for (const button of document.querySelectorAll(".satellite-option")) {
    const isSelected = button.dataset.satellite === id;

    button.classList.toggle("active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  }

  document.querySelector("#satellite-focus-button").textContent =
    `Centre camera on ${tracked.label} ↗`;

  updateSatellitePanel(new Date());
  cesiumViewer.scene.requestRender();
}

function focusSelectedSatellite() {
  const tracked = trackedSatellites.get(selectedSatelliteId);

  if (!cesiumViewer || !tracked?.position) {
    return;
  }

  cesiumViewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      tracked.position.longitude,
      tracked.position.latitude,
      tracked.position.altitudeKm * 1000 + 1800000
    ),
    duration: 1.5
  });
}

function showGlobeMessage(text) {
  const message = document.createElement("p");

  message.className = "globe-caption";
  message.textContent = text;

  document
    .querySelector("#cesiumContainer")
    .insertAdjacentElement("afterend", message);
}

async function startSatelliteTracking() {
  if (!cesiumViewer || satelliteTrackingStarted) {
    return;
  }

  satelliteTrackingStarted = true;

  if (typeof satellite === "undefined") {
    console.error("The satellite.js library could not be loaded.");
    showGlobeMessage("Satellite tracking is unavailable. Please refresh the page.");
    return;
  }

  // Load every satellite independently, so one failure does not stop the rest
  const results = await Promise.allSettled(
    SATELLITES.map(config => loadTle(config.noradId))
  );

  results.forEach((result, index) => {
    const config = SATELLITES[index];

    if (result.status === "rejected") {
      console.error(`${config.name} tracking error:`, result.reason);
      return;
    }

    const satrec = satellite.twoline2satrec(...result.value);
    const { entity, orbitEntity } = createSatelliteEntities(config, satrec);

    trackedSatellites.set(config.id, {
      ...config,
      satrec,
      entity,
      orbitEntity,
      position: null
    });
  });

  if (trackedSatellites.size === 0) {
    showGlobeMessage("Satellite data could not be loaded. Please try again later.");
    return;
  }

  createSatellitePanel();

  selectSatellite(
    trackedSatellites.has(selectedSatelliteId)
      ? selectedSatelliteId
      : trackedSatellites.keys().next().value
  );

  resumeSatelliteTracking();

  console.log("Satellite tracking started.");
}


/* OVERVIEW (home page) */

const overviewNext = document.querySelector("#overview-next");
const overviewUpcoming = document.querySelector("#overview-upcoming");
const overviewIssStatus = document.querySelector("#overview-iss-status");

const OVERVIEW_UPCOMING_COUNT = 4;
const OVERVIEW_GUIDE_TOPICS = ["fundamentals", "propulsion", "stages"];

// Links such as "See all launches →" open another view
for (const button of document.querySelectorAll(".overview-link[data-route]")) {
  button.addEventListener("click", () => {
    location.hash = button.dataset.route;
  });
}

function createOverviewMessage(text) {
  const message = document.createElement("p");
  message.className = "overview-loading";
  message.textContent = text;
  return message;
}

function renderOverviewLaunches(launches) {
  if (launches.length === 0) {
    overviewNext.replaceChildren(
      createOverviewMessage("Launch data is unavailable right now. Please try again later.")
    );
    overviewUpcoming.replaceChildren(
      createOverviewMessage("No launches to show.")
    );
    return;
  }

  // The API's upcoming list can still include launches from the last
  // few hours, so start from the first one that has not happened yet
  const now = Date.now();
  const stillToCome = launches.filter(
    launch => launch.net && new Date(launch.net).getTime() > now
  );
  const list = stillToCome.length > 0 ? stillToCome : launches;

  renderOverviewHero(list[0]);
  renderOverviewUpcoming(list.slice(1, OVERVIEW_UPCOMING_COUNT + 1));
}

function renderOverviewHero(launch) {
  const image = createLaunchImage(launch);

  const body = document.createElement("div");
  body.className = "overview-hero-body";

  const title = document.createElement("h3");
  title.className = "overview-hero-title";
  title.textContent = launch.name || "Unknown mission";

  const rocketName =
    launch.rocket?.configuration?.full_name ||
    launch.rocket?.configuration?.name;

  const provider = document.createElement("p");
  provider.className = "overview-hero-meta";
  provider.textContent = [getAgencyName(launch), rocketName]
    .filter(Boolean)
    .join(" · ");

  const place = document.createElement("p");
  place.className = "overview-hero-meta";
  place.textContent = launch.pad?.location?.name || "Unknown location";

  const date = document.createElement("p");
  date.className = "overview-hero-date";
  date.textContent = formatLaunchDate(launch);

  body.append(createStatusBadge(launch), title, provider, place, date);

  const isConfirmed = hasConfirmedLaunchTime(launch);

  if (isConfirmed) {
    const countdown = document.createElement("p");
    countdown.className = "launch-countdown overview-countdown";
    countdown.dataset.target = new Date(launch.net).getTime();
    body.append(countdown);
  } else {
    const note = document.createElement("p");
    note.className = "overview-note";
    note.textContent = "The exact launch time has not been confirmed yet.";
    body.append(note);
  }

  const actions = document.createElement("div");
  actions.className = "overview-hero-actions";

  const detailsButton = document.createElement("button");
  detailsButton.type = "button";
  detailsButton.className = "load-button";
  detailsButton.textContent = "View details";
  detailsButton.addEventListener("click", () => showLaunchDetails(launch));
  actions.append(detailsButton);

  if (isConfirmed) {
    actions.append(
      createCalendarControl(launch, "overview-secondary-button")
    );
  }

  body.append(actions);
  overviewNext.replaceChildren(image, body);

  // The countdown uses the same timer as the launch cards
  updateCountdowns();
}

function renderOverviewUpcoming(launches) {
  if (launches.length === 0) {
    overviewUpcoming.replaceChildren(
      createOverviewMessage("No other launches are scheduled yet.")
    );
    return;
  }

  const rows = launches.map((launch) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "overview-launch-row";
    row.addEventListener("click", () => showLaunchDetails(launch));

    // Calendar-style date block
    const dateBlock = document.createElement("span");
    dateBlock.className = "overview-launch-date";

    const isDateKnown = formatLaunchDate(launch) !== "To be confirmed";
    const launchDate = new Date(launch.net);

    const day = document.createElement("strong");
    const month = document.createElement("span");

    day.textContent = isDateKnown
      ? launchDate.toLocaleDateString("en-GB", { day: "2-digit", timeZone: "UTC" })
      : "TBC";
    month.textContent = isDateKnown
      ? launchDate.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }).toUpperCase()
      : "";

    dateBlock.append(day, month);

    const info = document.createElement("span");
    info.className = "overview-launch-info";

    const name = document.createElement("strong");
    name.textContent = launch.name || "Unknown mission";

    const details = document.createElement("span");
    details.textContent = [
      getAgencyName(launch),
      launch.pad?.location?.name
    ].filter(Boolean).join(" · ");

    info.append(name, details);
    row.append(dateBlock, info, createStatusBadge(launch));

    return row;
  });

  overviewUpcoming.replaceChildren(...rows);
}

// ISS RIGHT NOW (uses satellite.js only, so the globe is not loaded)

const ISS_NORAD_ID = 25544;

let overviewIssSatrec = null;
let overviewIssTimer = null;
let overviewIssLoading = false;

async function startOverviewIss() {
  if (overviewIssTimer || overviewIssLoading) {
    return;
  }

  if (!overviewIssSatrec) {
    overviewIssLoading = true;

    try {
      if (typeof satellite === "undefined") {
        throw new Error("The satellite.js library could not be loaded.");
      }

      overviewIssSatrec = satellite.twoline2satrec(
        ...(await loadTle(ISS_NORAD_ID))
      );
    } catch (error) {
      console.error("Overview ISS error:", error);
      overviewIssStatus.textContent = "ISS data is unavailable right now.";
      return;
    } finally {
      overviewIssLoading = false;
    }
  }

  // The user may have left the Overview while the data was loading
  if (viewOverview.hidden || overviewIssTimer) {
    return;
  }

  updateOverviewIss();
  overviewIssTimer = setInterval(updateOverviewIss, 1000);
}

function pauseOverviewIss() {
  if (overviewIssTimer) {
    clearInterval(overviewIssTimer);
    overviewIssTimer = null;
  }
}

function updateOverviewIss() {
  const now = new Date();
  const position = getSatellitePosition(overviewIssSatrec, now);
  const velocity = satellite.propagate(overviewIssSatrec, now)?.velocity;

  if (!position || !velocity) {
    return;
  }

  // Velocity is in km/s; the ISS moves at about 27,600 km/h
  const speedKmh = Math.hypot(velocity.x, velocity.y, velocity.z) * 3600;

  document.querySelector("#overview-iss-altitude").textContent =
    `${Math.round(position.altitudeKm)} km`;
  document.querySelector("#overview-iss-speed").textContent =
    `${Math.round(speedKmh).toLocaleString("en-GB")} km/h`;
  document.querySelector("#overview-iss-latitude").textContent =
    `${position.latitude.toFixed(2)}°`;
  document.querySelector("#overview-iss-longitude").textContent =
    `${position.longitude.toFixed(2)}°`;

  overviewIssStatus.textContent =
    `Live position · updated ${now.toISOString().slice(11, 19)} UTC`;
}

// FROM THE ROCKET GUIDE (copies of the guide's own cards)

function renderOverviewGuide() {
  const container = document.querySelector("#overview-guide");

  for (const topic of OVERVIEW_GUIDE_TOPICS) {
    const original = document
      .querySelector(`#view-guide .guide-button[data-topic="${topic}"]`)
      ?.closest(".guide-card");

    if (!original) {
      continue;
    }

    const card = original.cloneNode(true);
    card.classList.remove("guide-card-featured");

    card.querySelector(".guide-button").addEventListener("click", () => {
      location.hash = `guide/${topic}`;
    });

    container.append(card);
  }
}


// INSTALLABLE APP AND OFFLINE MODE

// The service worker saves the site so it opens without internet.
// It only works on a real web address (not when opening the file).
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  });
}

const offlineBanner = document.querySelector("#offline-banner");

function updateOnlineStatus() {
  offlineBanner.hidden = navigator.onLine;
}

window.addEventListener("offline", updateOnlineStatus);

window.addEventListener("online", () => {
  updateOnlineStatus();

  // Try again if the launches could not be loaded while offline
  if (!retryButton.hidden) {
    loadLaunches();
  }
});

updateOnlineStatus();


// START THE APP
// Runs last so every view's code and variables are ready

renderOverviewGuide();
loadLaunches();

window.addEventListener("hashchange", handleRoute);
handleRoute();
