let points = 0; // Initialize points to 0
const maxPoints = 9; // Maximum points allowed

function addPoint() // Add a point to the points variable 
{
  if (points < maxPoints) {
    points++; 
    updatePoints(); // Update the points display
  }
}

function updatePoints() {
  const fill = document.getElementById("pointsFill"); // Get the fill element
  const text = document.getElementById("pointsText"); // Get the text element

  const percentage = (points / maxPoints) * 100; // Calculate the percentage of points
  fill.style.width = percentage + "%"; // Set the width of the fill element
  text.textContent = `${points}/${maxPoints}`; // Change color based on points
}





// Drag and drop starter her //
const draggables = document.querySelectorAll(".draggable"); // Henter alle draggable elementer
const dropzones = document.querySelectorAll(".dropzone"); // Henter alle dropzone elementer
const feedback = document.getElementById("feedback"); // Henter feedback elementet

// Rigtige match
const correctMatches = {
  zone1: "P-sprøjte",
  zone2: ["P-piller", "Mini-piller"],
  zone3: "P-plaster",
  zone4: "P-stav",
  zone5: ["Homon-spiral", "Kobber-spiral"],
  zone6: ["Pessar", "Kondom"]
};


// Når man starter med at trække
draggables.forEach(item => {
  item.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
  });
});

// Drop handler
const matchedZones = {}; // For at holde styr på hvilke zoner der allerede er korrekt matchet
dropzones.forEach(zone => {
  zone.addEventListener("dragover", (e) => e.preventDefault()); // Tillader drop

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedEl = document.getElementById(draggedId);
  
    // Fjern fra tidligere dropzone
    dropzones.forEach(z => {
      if (z.contains(draggedEl)) {
        z.removeChild(draggedEl);
      }
    });
  
    // Fjern tidligere element i denne dropzone (kun én pr. zone)
    if (zone.firstChild) {
      zone.removeChild(zone.firstChild);
    }
  
    // Tilføj det nye element
    zone.appendChild(draggedEl);
    draggedEl.style.position = "static";
  
    const correct = correctMatches[zone.id];
    const isCorrect = (Array.isArray(correct) && correct.includes(draggedId)) || correct === draggedId;
  
    if (isCorrect) {
      feedback.textContent = "Korrekt!";
      feedback.style.color = "green";
  
      if (!matchedZones[zone.id]) {
        matchedZones[zone.id] = true; // Markér denne zone som matchet korrekt
        addPoint(); // Tilføj point kun første gang
      }
  
    } else {
      feedback.textContent = "Forkert placering";
      feedback.style.color = "red";
      matchedZones[zone.id] = false; // Fjern evt. tidligere korrekt markering
    }
  });  
});