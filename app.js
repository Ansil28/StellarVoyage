
const button = document.querySelector("#load-launches");
const status = document.querySelector("#status");
const launchesContainer = document.querySelector("#launches");
const searchInput = document.querySelector("#search-launches");
const agencyFilter = document.querySelector("#filter-agency");
const resultsCount = document.querySelector("#results-count");
const clearFiltersButton = document.querySelector("#clear-filters");
let allLaunches = [];

const API_URL =
  "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=50";

button.addEventListener("click", loadLaunches);

async function loadLaunches() {
  button.disabled = true;
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

    status.textContent =
      `Found ${data.results.length} launches.`;
    resultsCount.textContent = `Showing ${data.results.length} of ${data.results.length} launches.`;

    renderLaunches(allLaunches);
  } catch (error) {
    status.textContent =
      "Could not load launches. Please try again.";

    console.error(error);
  } finally {
    button.disabled = false;
  }
}



function renderLaunches(launches) {
  launchesContainer.replaceChildren();

  // Update the results counter
  const count = launches.length;

  resultsCount.textContent =
    `${count} ${count === 1 ? "launch" : "launches"} found`;

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

    const title = document.createElement("h2");
    title.textContent = launch.name || "Unknown mission";

    const date = document.createElement("p");
    date.textContent = `Date: ${
      launch.net
        ? new Date(launch.net).toLocaleString("en-GB")
        : "To be confirmed"
    }`;

    const location = document.createElement("p");
    location.textContent = `Location: ${
      launch.pad?.location?.name || "Unknown location"
    }`;

    card.append(title, date, location);
    launchesContainer.append(card);
  }
}



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


clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  agencyFilter.value = "all";

  applyFilters();
});



