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
dropzones.forEach(zone => {
  zone.addEventListener("dragover", (e) => e.preventDefault()); // Tillader drop

  zone.addEventListener("drop", (e) => { // Når der droppes
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain"); // Hent id'et af det element, der blev trukket
    const draggedEl = document.getElementById(draggedId); // Hent elementet

    // 1. Fjern draggedEl fra tidligere dropzone (hvis det findes)
    dropzones.forEach(z => {
      if (z.contains(draggedEl)) { // Hvis draggedEl er i en dropzone
        z.removeChild(draggedEl); // Fjerner det fra den dropzone
      }
    });

    // 2. Fjern alle andre præventionsmidler fra alle dropzones
    dropzones.forEach(z => {  // Gå igennem alle dropzones
      if (z.firstChild) { 
        z.removeChild(z.firstChild);
      }
    });

    // 3. Tilføj det nye element til den valgte dropzone
    zone.appendChild(draggedEl); // Tilføj draggedEl til den dropzone, der blev droppet i
    draggedEl.style.position = "static"; // Sæt position til statisk

    const correct = correctMatches[zone.id];
    if (
      (Array.isArray(correct) && correct.includes(draggedId)) ||
      correct === draggedId
    ) {
      feedback.textContent = "Korrekt!";
      feedback.style.color = "green";
    } else {
      feedback.textContent = "Forkert placering";
      feedback.style.color = "red";
    }
  });
});