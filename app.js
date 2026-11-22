
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

  // Only update the ISS position while its view is visible
  if (isIntelligence) {
    resumeISSTracking();
  } else {
    pauseISSTracking();
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

// LOAD THE WEBSITE

loadLaunches();


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

    startISSTracking();

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



/* SPACE INTELLIGENCE — ISS TRACKING */

let issEntity = null;
let issSatrec = null;
let issUpdateTimer = null;
let updateISSPositionFn = null; // Set once tracking has started

function pauseISSTracking() {
  if (issUpdateTimer) {
    clearInterval(issUpdateTimer);
    issUpdateTimer = null;
  }
}

function resumeISSTracking() {
  if (!updateISSPositionFn || issUpdateTimer || viewIntelligence.hidden) {
    return;
  }

  updateISSPositionFn();
  issUpdateTimer = setInterval(updateISSPositionFn, 1000);
}

async function startISSTracking() {
  if (!cesiumViewer || issSatrec) return;

  try {
    if (typeof satellite === "undefined") {
      throw new Error("The satellite.js library could not be loaded.");
    }

    const response = await fetch(
      "https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE"
    );

    if (!response.ok) {
      throw new Error("Could not fetch the orbital data.");
    }

    const tleText = await response.text();

    const lines = tleText
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);

    const line1Index = lines.findIndex(line =>
      line.startsWith("1 ")
    );

    if (
      line1Index < 0 ||
      !lines[line1Index + 1]?.startsWith("2 ")
    ) {
      throw new Error("The orbital data format is invalid.");
    }

    const tleLine1 = lines[line1Index];
    const tleLine2 = lines[line1Index + 1];

    issSatrec = satellite.twoline2satrec(
      tleLine1,
      tleLine2
    );

    issEntity = cesiumViewer.entities.add({
      name: "ISS — International Space Station",

      position: Cesium.Cartesian3.fromDegrees(0, 0, 420000),

      point: {
        pixelSize: 12,
        color: Cesium.Color.CYAN,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },

      label: {
        text: "ISS",
        font: "bold 14px sans-serif",
        fillColor: Cesium.Color.CYAN,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 3,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(12, -12),
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    });

    
    // ISS information panel
    let issPanel = document.querySelector("#iss-info-panel");

    if (!issPanel) {
      issPanel = document.createElement("div");
      issPanel.id = "iss-info-panel";
      issPanel.className = "iss-info-panel";

      issPanel.innerHTML = `
        <div class="iss-panel-header">
          <div>
            <p class="iss-panel-eyebrow">LIVE ORBITAL TRACKING</p>
            <h3>International Space Station</h3>
          </div>
          <span class="iss-status">
            <span class="iss-status-dot"></span>
            Tracking
          </span>
        </div>

        <div class="iss-panel-grid">
          <div class="iss-data-card">
            <span>ALTITUDE</span>
            <strong id="iss-altitude">-- km</strong>
          </div>

          <div class="iss-data-card">
            <span>LATITUDE</span>
            <strong id="iss-latitude">--</strong>
          </div>

          <div class="iss-data-card">
            <span>LONGITUDE</span>
            <strong id="iss-longitude">--</strong>
          </div>

          <div class="iss-data-card">
            <span>LAST UPDATE (UTC)</span>
            <strong id="iss-update-time">--:--:--</strong>
          </div>
        </div>

        <button id="iss-focus-button" type="button">
          Centre camera on ISS ↗
        </button>
      `;

      document.querySelector("#cesiumContainer")
        .insertAdjacentElement("afterend", issPanel);

      document.querySelector("#iss-focus-button")
        .addEventListener("click", () => {
          if (!cesiumViewer || !issEntity) return;

          const currentPosition = issEntity.position.getValue(
            Cesium.JulianDate.now()
          );

          if (!currentPosition) return;

          const cartographic =
            Cesium.Cartographic.fromCartesian(currentPosition);

          cesiumViewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromRadians(
              cartographic.longitude,
              cartographic.latitude,
              cartographic.height + 1800000
            ),
            duration: 1.5
          });
        });
    }


    function updateISSPosition() {
      if (!cesiumViewer || !issSatrec || !issEntity) return;

      const now = new Date();
      const result = satellite.propagate(issSatrec, now);

      if (!result || !result.position) return;

      const gmst = satellite.gstime(now);

      const geodetic = satellite.eciToGeodetic(
        result.position,
        gmst
      );

      const longitude = satellite.degreesLong(geodetic.longitude);
      const latitude = satellite.degreesLat(geodetic.latitude);
      const altitudeMeters = geodetic.height * 1000;
      
      const altitudeElement = document.querySelector("#iss-altitude");
      const latitudeElement = document.querySelector("#iss-latitude");
      const longitudeElement = document.querySelector("#iss-longitude");
      const updateElement = document.querySelector("#iss-update-time");

      if (altitudeElement) {
        altitudeElement.textContent =
          `${Math.round(geodetic.height)} km`;
      }

      if (latitudeElement) {
        latitudeElement.textContent =
          `${latitude.toFixed(2)}°`;
      }

      if (longitudeElement) {
        longitudeElement.textContent =
          `${longitude.toFixed(2)}°`;
      }

      if (updateElement) {
        updateElement.textContent =
          now.toISOString().slice(11, 19);
      }


      issEntity.position = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        altitudeMeters
      );
    }

    updateISSPositionFn = updateISSPosition;
    resumeISSTracking();

    console.log("ISS tracking started.");

  } catch (error) {
    console.error("ISS tracking error:", error);
  }
}







// START THE ROUTER
// Runs last so every view's code and variables are ready

window.addEventListener("hashchange", handleRoute);
handleRoute();
