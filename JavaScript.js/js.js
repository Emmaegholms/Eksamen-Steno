// poit system og fremdriftsbar

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




// Drag and drop starter her
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

// Når man starter med at trække
draggables.forEach(item => {
  item.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);

    // Deaktivér alle andre draggable elementer
    draggables.forEach(el => {
      if (el !== item) {
        el.setAttribute("draggable", "false");
        el.style.opacity = "0.4"; // Visuelt hint
      }
    });
  });

  // Når man slipper musen (drop eller ej)
  item.addEventListener("dragend", () => {
    // Genaktiver alle draggable elementer
    draggables.forEach(el => {
      el.setAttribute("draggable", "true");
      el.style.opacity = "1";
    });
  });
});

// Når man dropper noget
dropzones.forEach(zone => {
  zone.addEventListener("dragover", (e) => e.preventDefault());

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedEl = document.getElementById(draggedId);

    // Fjern draggedEl fra tidligere dropzone
    dropzones.forEach(z => {
      if (z.contains(draggedEl)) {
        z.removeChild(draggedEl);
      }
    });

 // ❗ Fjern draggedEl fra alle dropzones hvis den er der allerede
 dropzones.forEach(z => {
  if (z.contains(draggedEl)) {
    z.removeChild(draggedEl);
  }
});

// ❗ Fjern ALT fra kroppen (kun én ting må være aktiv ad gangen)
dropzones.forEach(z => {
  if (z.firstChild) {
    z.removeChild(z.firstChild);
  }
});


    // Håndter hvis noget allerede ligger i zonen
    if (zone.firstChild) {
      const existing = zone.firstChild;
      const correct = correctMatches[zone.id];

      const isExistingCorrect = (
        (Array.isArray(correct) && correct.includes(existing.id)) || correct === existing.id
      );

      if (!isExistingCorrect) {
        // Flyt det forkerte tilbage til valg-menuen
        document.querySelector(".præventionsformer").appendChild(existing);
        existing.style.position = "static";
      } else {
        // Tillad overskrivning af korrekt (kan fjernes hvis du vil låse det)
        zone.removeChild(existing);
      }
    }

    // Tilføj det nye element
    zone.appendChild(draggedEl);
    draggedEl.style.position = "static";



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

    // Genaktiver alle draggable elementer efter drop
    draggables.forEach(el => {
      el.setAttribute("draggable", "true");
      el.style.opacity = "1";
    });
  });
});
