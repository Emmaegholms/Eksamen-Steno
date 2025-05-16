let points = 0;
let pendingCorrectId = null;
const maxPoints = 9;
const matchedZones = {};

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

draggables.forEach(item => {
  item.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);

    // Deaktiver ikke andre draggables under drag
  });

  item.addEventListener("dragend", () => {
    // Genaktiver alle draggables efter drag
  });
});

dropzones.forEach(zone => {
  zone.addEventListener("dragover", (e) => e.preventDefault());

  zone.addEventListener("drop", (e) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedEl = document.getElementById(draggedId);
    const originalParent = draggedEl.parentNode; // Gem den oprindelige forælder

    // Fjern fra tidligere zone
    if (originalParent && originalParent.classList.contains('dropzone')) {
      // Tjek om det element der fjernes var korrekt placeret
      const wasCorrect = correctMatches[originalParent.id];
      const wasCorrectMatch = Array.isArray(wasCorrect) ? wasCorrect.includes(draggedId) : wasCorrect === draggedId;
      if (wasCorrectMatch && matchedZones[originalParent.id]) {
        delete matchedZones[originalParent.id]; // Fjern markeringen af zonen som matchet
        if (pendingCorrectId === draggedId) {
          pendingCorrectId = null;
        }
      }
    }

    // Fjern eksisterende i den nye zone
    if (zone.firstChild) {
      // Flyt eksisterende element tilbage til dets oprindelige position (hvis det kom fra en dropzone)
      const existingElement = zone.firstChild;
      if (existingElement.dataset.originalParentId) {
        const originalParentOfExisting = document.getElementById(existingElement.dataset.originalParentId);
        if (originalParentOfExisting) {
          originalParentOfExisting.appendChild(existingElement);
          existingElement.style.position = "static";
          delete existingElement.dataset.originalParentId;
          // Hvis det eksisterende element var korrekt, fjern markeringen af den zone
          const existingId = existingElement.id;
          const wasExistingCorrect = correctMatches[zone.id];
          const wasExistingCorrectMatch = Array.isArray(wasExistingCorrect) ? wasExistingCorrect.includes(existingId) : wasExistingCorrect === existingId;
          if (wasExistingCorrectMatch && matchedZones[zone.id]) {
            delete matchedZones[zone.id];
          }
        }
      } else {
        // Hvis det eksisterende element startede uden for en dropzone, fjern det helt (hvis det er den ønskede opførsel)
        zone.removeChild(existingElement);
      }
    }

    // Tilføj det nye element
    zone.appendChild(draggedEl);
    draggedEl.style.position = "static";
    draggedEl.dataset.originalParentId = zone.id; // Gem nuværende zone ID

    // Tjek om placering er korrekt
    const correct = correctMatches[zone.id];
    const isCorrect = Array.isArray(correct)
      ? correct.includes(draggedId)
      : correct === draggedId;

    if (isCorrect && !matchedZones[zone.id]) {
      matchedZones[zone.id] = true;
      pendingCorrectId = draggedId;
      showInfoBox(draggedId);
      feedback.textContent = "";
      feedback.style.color = ""; // Reset farve
    } else if (!isCorrect) {
      feedback.textContent = "Forkert placering";
      feedback.style.color = "red";
      if (matchedZones[zone.id]) {
        delete matchedZones[zone.id]; // Fjern markeringen, hvis et forkert element placeres i en tidligere korrekt zone
      }
      if (pendingCorrectId === draggedId) {
        pendingCorrectId = null;
      }
    }

    // Genaktiver alle draggables
    draggables.forEach(el => {
      el.setAttribute("draggable", "true");
      el.style.opacity = "1";
    });
  });
});



const preventionInfo = {
  "P-piller": { name: "P-piller", img: "images/P-piller.png" },
  "Mini-piller": { name: "Mini-piller", img: "images/Mini-piller.png" },
  "P-sprøjte": { name: "P-sprøjte", img: "images/P-sprøjte.png" },
  "P-plaster": { name: "P-plaster", img: "images/P-plaster.png" },
  "P-stav": { name: "P-stav", img: "images/P-stav.png" },
  "Homon-spiral": { name: "Homon-spiral", img: "images/Homon-spiral.png" },
  "Kobber-spiral": { name: "Kobber-spiral", img: "images/Kobber-spiral.png" },
  "Pessar": { name: "Pessar", img: "images/Pessar.png" },
  "Kondom": { name: "Kondom", img: "images/Kondom.png" }
};

const mapping = {
  "P-piller": "p_piller",
  "Mini-piller": "mini_piller",
  "P-sprøjte": "p_sproejte",
  "P-plaster": "p_plaster",
  "P-stav": "p_stav",
  "Homon-spiral": "spiral",
  "Kobber-spiral": "kobber_spiral",
  "Pessar": "pessar",
  "Kondom": "kondom"
};



const faktaData = {
  p_piller: {
    billede: 'images/P-piller.png',
    alt: 'ikon p-pille',
    overskrift: 'FAKTA: P-piller',
    citat: '"Jeg bruger p-piller, fordi..."',
    fakta: 'P-piller tages dagligt og indeholder hormoner...'
  },
  mini_piller: {
    billede: 'images/Mini-piller.png',
    alt: 'ikon mini-pille',
    overskrift: 'FAKTA: Mini-piller',
    citat: '"Jeg bruger mini-piller, fordi..."',
    fakta: 'Mini-piller tages dagligt...'
  },
  p_sproejte: {
    billede: 'images/P-sprøjte.png',
    alt: 'ikon p-sprøjte',
    overskrift: 'FAKTA: P-sprøjte',
    citat: '"Jeg foretrækker p-sprøjten, fordi..."',
    fakta: 'P-sprøjten gives som en indsprøjtning...'
  },
  p_plaster: {
    billede: 'images/P-plaster.png',
    alt: 'ikon p-plaster',
    overskrift: 'FAKTA: P-plaster',
    citat: '"Jeg bruger plaster, fordi..."',
    fakta: 'P-plaster sættes på huden...'
  },
  p_stav: {
    billede: 'images/P-stav.png',
    alt: 'ikon p-stav',
    overskrift: 'FAKTA: P-stav',
    citat: '"P-staven passer mig, fordi..."',
    fakta: 'P-staven placeres under huden...'
  },
  spiral: {
    billede: 'images/Homon-spiral.png',
    alt: 'ikon spiral',
    overskrift: 'FAKTA: Spiral',
    citat: '"Jeg har valgt spiral, fordi..."',
    fakta: 'Spiralen placeres i livmoderen...'
  },
  kobber_spiral: {
    billede: 'images/Kobber-spiral.png',
    alt: 'ikon kobberspiral',
    overskrift: 'FAKTA: Kobberspiral',
    citat: '"Jeg bruger kobberspiralen, fordi..."',
    fakta: 'Kobberspiralen er hormonfri...'
  },
  pessar: {
    billede: 'images/Pessar.png',
    alt: 'ikon pessar',
    overskrift: 'FAKTA: Pessar',
    citat: '"Jeg bruger pessar, fordi..."',
    fakta: 'Pessar er en silikonekop...'
  },
  kondom: {
    billede: 'images/Kondom.png',
    alt: 'ikon kondom',
    overskrift: 'FAKTA: Kondom',
    citat: '"Jeg bruger kondom, fordi..."',
    fakta: 'Kondomet beskytter mod graviditet og sygdomme...'
  }
};

function showInfoBox(id) {
  const info = preventionInfo[id];
  if (!info) return;

  document.getElementById("infoBox").style.display = "flex";
  document.getElementById("infoTitle").textContent = info.name;
  document.getElementById("infoImage").src = info.img;

  const faktaKey = mapping[id];
  if (faktaKey && faktaData[faktaKey]) {
    visFaktaBoksInfo(faktaData[faktaKey]);
  }
}


function visFaktaBoksInfo(data) {
  const boks = document.getElementById('boks-info');
  boks.style.display = 'flex';
  boks.style.visibility = 'visible';
  boks.style.opacity = '1';
  boks.style.zIndex = '1000';
  document.getElementById('info-img').src = data.billede;
  document.getElementById('info-img').alt = data.alt;
  document.getElementById('info-overskrift').textContent = data.overskrift;
  document.getElementById('info-citat').textContent = data.citat;
  document.getElementById('info-tekst').textContent = data.fakta;
}



function closeInfoBox() {
  document.getElementById("infoBox").style.display = "none";
  document.getElementById("boks-info").style.display = "none";

  if (pendingCorrectId) {
    // Elementet bliver nu ikke fjernet her.
    addPoint();
    pendingCorrectId = null;
  }
}

console.log("Droppet:", draggedId, "i zone:", zone.id);
console.log("Er korrekt?:", isCorrect);




 //dont touch ts emma