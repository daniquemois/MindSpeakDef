async function initMap() {
    const response = await fetch('/api/data');
    const data = await response.json();
  
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  
    data.forEach(row => {
      const [name, lat, lng, iconUrl] = row;
      new google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
        map,
        title: name,
        icon: iconUrl,
      });
    });
  }