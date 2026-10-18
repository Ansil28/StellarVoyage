
const status = document.querySelector("#status");
const launchesContainer = document.querySelector("#launches");
const searchInput = document.querySelector("#search-launches");
const agencyFilter = document.querySelector("#filter-agency");
const resultsCount = document.querySelector("#results-count");
const clearFiltersButton = document.querySelector("#clear-filters");

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
  "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=50";

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

navLaunches.addEventListener("click", () => {
  showView("launches");
});

navGuide.addEventListener("click", () => {
  showView("guide");
});

navIntelligence.addEventListener("click", () => {
  showView("intelligence");
});

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
}

// LOAD LAUNCHES FROM THE API

async function loadLaunches() {
  status.textContent = "Loading launches...";
  launchesContainer.replaceChildren();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    allLaunches = data.results;

    populateAgencyFilter(allLaunches);

    status.textContent = "";

    renderLaunches(allLaunches);
  } catch (error) {
    status.textContent =
      "Could not load launches. Please try again.";

    console.error(error);
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


  launchDialog.showModal();
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
navIntelligence.addEventListener("click", () => {
  initializeSpaceIntelligence();

  // Refresh the globe size after showing its section
  requestAnimationFrame(() => {
    if (cesiumViewer) {
      cesiumViewer.resize();
    }
  });
});






