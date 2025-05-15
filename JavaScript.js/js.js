let points = 0;
const maxPoints = 9;
const matchedZones = {}; // Holder styr på korrekte match

function addPoint() {
  if (points < maxPoints) {
    points++;
    updatePoints();
  }
}

function updatePoints() {
  const fill = document.getElementById("pointsFill");
  const text = document.getElementById("pointsText");

  const percentage = (points / maxPoints) * 100;
  fill.style.width = percentage + "%";
  text.textContent = `${points}/${maxPoints}`;
}

// Drag and drop
const draggables = document.querySelectorAll(".draggable");
const dropzones = document.querySelectorAll(".dropzone");
const feedback = document.getElementById("feedback");

const correctMatches = {
  zone1: "P-sprøjte",
  zone2: ["P-piller", "Mini-piller"],
  zone3: "P-plaster",
  zone4: "P-stav",
  zone5: ["Homon-spiral", "Kobber-spiral"],
  zone6: ["Pessar", "Kondom"]
};



    // Tjek korrekthed
    const correct = correctMatches[zone.id];
    const isCorrect = (Array.isArray(correct) && correct.includes(draggedId)) || correct === draggedId;

    if (isCorrect) {
      feedback.textContent = "Korrekt!";
      feedback.style.color = "green";

      if (!matchedZones[zone.id]) {
        matchedZones[zone.id] = true;
        addPoint();
      }
    } else {
      feedback.textContent = "Forkert placering";
      feedback.style.color = "red";
      matchedZones[zone.id] = false;
    }
  });
});
