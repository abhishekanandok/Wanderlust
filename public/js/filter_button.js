//filter button
const filterButton = document.getElementById('filterButton');
const filterPopup = document.getElementById('filterPopup');
const filterContent = document.getElementById('filterContent');
const submitButton = document.getElementById('submitFilter');

// Function to fetch location options from the backend
async function fetchLocations() {
  try {
    const response = await fetch('/locations');
    const locations = await response.json();
    displayLocations(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
  }
}

// Function to display location options with checkboxes in the popup
function displayLocations(locations) {
  filterContent.innerHTML = ''; // Clear previous options
  locations.forEach(location => {
    const option = document.createElement('div');
    option.classList.add('location-option');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = location;
    checkbox.id = `location_${location.replace(/\s/g, '_')}`; // Create unique ID for each checkbox
    const label = document.createElement('label');
    label.htmlFor = `location_${location.replace(/\s/g, '_')}`;
    label.textContent = location;

    option.appendChild(checkbox);
    option.appendChild(label);

    filterContent.appendChild(option);
  });
}

// Function to get selected locations on submit
function getSelectedLocations() {
  const checkboxes = document.querySelectorAll('.location-option input[type="checkbox"]');
  const selectedLocations = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
  return selectedLocations;
}

// Function to open filter popup
function openFilterPopup() {
  const buttonRect = filterButton.getBoundingClientRect();
  filterPopup.style.display = 'block';
  filterPopup.style.top = '50%'; // Center vertically
  filterPopup.style.left = '50%'; // Center horizontally
  filterPopup.style.transform = 'translate(-50%, -50%)'; // Adjust position
}


// Function to close filter popup
function closeFilterPopup() {
  filterPopup.style.display = 'none';
}

// Event listener for the filter button click
filterButton.addEventListener('click', () => {
  fetchLocations(); // Fetch location options when the button is clicked
  openFilterPopup();
});

// Event listener for the submit button click
submitButton.addEventListener('click', () => {
  const selectedLocations = getSelectedLocations();
  console.log('Selected locations:', selectedLocations);
  closeFilterPopup(); // Close the popup after submission

  // Construct URL with selected locations as query parameters
  const queryParams = selectedLocations.map(location => `location=${encodeURIComponent(location)}`).join('&');
  const filterURL = `/listings?${queryParams}`;

  // Redirect to the filter page with selected locations as query parameters
  window.location.href = filterURL;
});


// Close the popup when clicking outside of it
document.addEventListener('click', event => {
  if (!filterPopup.contains(event.target) && event.target !== filterButton) {
    closeFilterPopup();
  }
});
