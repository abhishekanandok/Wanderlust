 // Function to send a GET request to filter listings by type
 function filterByType(type) {
    const queryParams = `type=${encodeURIComponent(type)}`;
    const filterURL = `/listings?${queryParams}`;
    window.location.href = filterURL;
  }