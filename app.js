
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
const navLaunches = document.querySelector("#nav-launches");
const navGuide = document.querySelector("#nav-guide");
const navIntelligence = document.querySelector("#nav-intelligence");

// Page sections
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

// Each view has its own address (#launches, #guide, #guide/<topic>,
// #intelligence). The buttons change the address and handleRoute()
// shows the matching view, so links can be shared and the browser's
// back button works.

navLaunches.addEventListener("click", () => {
  location.hash = "launches";
});

navGuide.addEventListener("click", () => {
  location.hash = "guide";
});

navIntelligence.addEventListener("click", () => {
  location.hash = "intelligence";
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

  showView("launches");
  document.title = "SpaceHub";
}

function showView(view) {
  const isLaunches = view === "launches";
  const isGuide = view === "guide";
  const isIntelligence = view === "intelligence";

  viewLaunches.hidden = !isLaunches;
  viewGuide.hidden = !isGuide;
  viewIntelligence.hidden = !isIntelligence;

  navLaunches.classList.toggle("active", isLaunches);
  navGuide.classList.toggle("active", isGuide);
  navIntelligence.classList.toggle("active", isIntelligence);

  // Only update satellite positions while their view is visible
  if (isIntelligence) {
    resumeSatelliteTracking();
  } else {
    pauseSatelliteTracking();
  }
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

    // Mission name
    const title = document.createElement("h2");
    title.textContent = launch.name || "Unknown mission";

    // Launch agency
    const agency = document.createElement("p");
    agency.textContent = `Agency: ${getAgencyName(launch)}`;

    // Mission status badge
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

    // Launch date
    const date = document.createElement("p");

    if (!launch.net) {
      date.textContent = "Date: To be confirmed";
    } else {
      const launchDate = new Date(launch.net);

      const isMidnight =
        launchDate.getUTCHours() === 0 &&
        launchDate.getUTCMinutes() === 0 &&
        launchDate.getUTCSeconds() === 0;

      const isEndOfYear =
        launchDate.getUTCMonth() === 11 &&
        launchDate.getUTCDate() === 31;

      if (isMidnight && isEndOfYear) {
        date.textContent = "Date: To be confirmed";
      } else {
        const dateText = launchDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "UTC"
        });

        if (isMidnight) {
          date.textContent = `Date: ${dateText}`;
        } else {
          const timeText = launchDate.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC"
          });

          date.textContent = `Date: ${dateText}, ${timeText} UTC`;
        }
      }
    }

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
    const calendarButton = document.createElement("button");

    calendarButton.type = "button";
    calendarButton.className = "load-button calendar-button";
    calendarButton.textContent = "Add to calendar";

    calendarButton.addEventListener("click", () => {
      downloadLaunchCalendarFile(launch);
    });

    launchDialogContent.append(calendarButton);
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

function downloadLaunchCalendarFile(launch) {
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
    `SUMMARY:${escapeCalendarText(`Launch: ${launch.name || "Unknown mission"}`)}`,
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

  const content = lines.map(foldCalendarLine).join("\r\n") + "\r\n";

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
    });

    
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
    }
  });
}



/* SPACE INTELLIGENCE — LAUNCH SITES */

const LAUNCH_SITE_COLOR = "#fb923c";

let launchSiteSource = null;
const launchSiteLaunches = new Map(); // marker id -> launches from that pad

// One marker per launch pad, built from the upcoming launches
function updateLaunchSiteMarkers() {
  if (!cesiumViewer) {
    return;
  }

  if (!launchSiteSource) {
    launchSiteSource = new Cesium.CustomDataSource("launch-sites");
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

  const color = Cesium.Color.fromCssColorString(LAUNCH_SITE_COLOR);
  const outline = Cesium.Color.fromCssColorString("#080d19");

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
      point: {
        pixelSize: 10,
        color,
        outlineColor: outline,
        outlineWidth: 2
      },
      label: {
        text: count > 1 ? `${padName} · ${count} launches` : padName,
        font: "12px sans-serif",
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 3,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        pixelOffset: new Cesium.Cartesian2(10, 0),
        // Only show the names when the camera is close, to avoid clutter
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 3000000)
      }
    });

    launchSiteLaunches.set(id, site.launches);
  }
}

// Clicking a launch site opens its next launch; clicking a satellite selects it
function handleGlobeClick(entity) {
  if (!entity) {
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

  if (!(entity instanceof Cesium.Entity)) {
    return null;
  }

  const isClickable =
    launchSiteLaunches.has(entity.id) ||
    String(entity.id).startsWith("satellite-");

  return isClickable ? entity : null;
}

function setUpGlobeInteraction() {
  const handler = new Cesium.ScreenSpaceEventHandler(cesiumViewer.scene.canvas);

  handler.setInputAction((click) => {
    handleGlobeClick(getClickableEntity(click.position));
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // Show a pointer cursor over things that can be clicked
  handler.setInputAction((movement) => {
    cesiumViewer.scene.canvas.style.cursor =
      getClickableEntity(movement.endPosition) ? "pointer" : "";
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
}

function createSatelliteEntities(config, satrec) {
  const color = Cesium.Color.fromCssColorString(config.color);

  const entity = cesiumViewer.entities.add({
    id: `satellite-${config.id}`,
    name: config.name,
    position: Cesium.Cartesian3.fromDegrees(0, 0, 420000),
    point: {
      pixelSize: 12,
      color,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    },
    label: {
      text: config.label,
      font: "bold 14px sans-serif",
      fillColor: color,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 3,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(12, -12),
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  });

  const orbitEntity = cesiumViewer.entities.add({
    id: `orbit-${config.id}`,
    show: false,
    polyline: {
      positions: [],
      width: 2,
      arcType: Cesium.ArcType.NONE,
      material: color.withAlpha(0.6)
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
  }

  for (const button of document.querySelectorAll(".satellite-option")) {
    const isSelected = button.dataset.satellite === id;

    button.classList.toggle("active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  }

  document.querySelector("#satellite-focus-button").textContent =
    `Centre camera on ${tracked.label} ↗`;

  updateSatellitePanel(new Date());
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


// START THE APP
// Runs last so every view's code and variables are ready

loadLaunches();

window.addEventListener("hashchange", handleRoute);
handleRoute();
