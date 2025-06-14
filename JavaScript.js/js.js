
let points = 0; // Antal korrekte placeringer
let pendingCorrectId = null; // Bruges til midlertidigt at holde styr på korrekt element inden point gives
const maxPoints = 9; // Maksimalt antal korrekte
const matchedZones = {}; // Gemmer hvilke zoner der allerede er matchet korrekt

// Skjul infoboksen ved start (Emma)
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("infoBox").style.display = "none";
});


// Opdater fremdriftsbar og tal (Andreas)
function addPoint() {
  if (points < maxPoints) {
    points++;
    updatePoints(); 
  }


  if (points === maxPoints) {
    const popup = document.querySelector('.popup-succes');
    if (popup) popup.classList.add('vis');  // vis popup
  }
}

function updatePoints() {
  const fill = document.getElementById("pointsFill");
  const text = document.getElementById("pointsText");
  const percentage = (points / maxPoints) * 100;
  fill.style.width = percentage + "%";
  text.textContent = `${points}/${maxPoints}`;
}


// Find alle draggable elementer og dropzones (Emma)
const draggables = document.querySelectorAll(".draggable");
const dropzones = document.querySelectorAll(".dropzone");


// Angiver hvilke elementer der hører til hvilke dropzones (Kristoffer)
const correctMatches = {
  zone1: "P-sprøjte",
  zone2: ["P-piller", "Mini-piller"],
  zone3: "P-plaster",
  zone4: "P-stav",
  zone5: ["Hormon-spiral", "Kobber-spiral"],
  zone6: ["Pessar", "Kondom"]
}; 

const preventionInfo = {
  "P-piller": { name: "P-piller", img: "images/P-piller.png" },
  "Mini-piller": { name: "Mini-piller", img: "images/Mini-piller.png" },
  "P-sprøjte": { name: "P-sprøjte", img: "images/P-sprøjte.png" },
  "P-plaster": { name: "P-plaster", img: "images/P-plaster.png" },
  "P-stav": { name: "P-stav", img: "images/P-stav.png" },
  "Hormon-spiral": { name: "Hormon-spiral", img: "images/Homon-spiral.png" },
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
  "Hormon-spiral": "spiral",
  "Kobber-spiral": "kobber_spiral",
  "Pessar": "pessar",
  "Kondom": "kondom"
};

// Fuld faktatekst, citater og billeder (Line)
const faktaData = {
  p_piller: {
    billede: 'images/Pille.png',
    alt: 'ikon p-pille',
    overskrift: 'RIGTIGT',
    citat: '"Det er nemt at tage en pille hver dag, og jeg føler mig i kontrol."',
    fakta: 'P-piller er en af de mest udbredte former for prævention og indeholder en kombination af østrogen og gestagen. De tages dagligt og virker ved at hæmme ægløsningen. P-pillen blev introduceret i USA i 1960 og kom til Danmark i 1966. Siden da har den spillet en stor rolle i kvinders mulighed for at styre deres fertilitet.'
  },
  mini_piller: {
    billede: 'images/Pille.png',
    alt: 'ikon mini-pille',
    overskrift: 'RIGTIGT',
    citat: '"Jeg bruger mini-piller, fordi de ikke indeholder så meget hormon, og det passer godt til min krop."',
    fakta: 'Mini-piller indeholder kun gestagen og ikke østrogen som almindelige p-piller. De tages dagligt og gør livmoderhalsslimet ugennemtrængeligt for sædceller samt hæmmer ofte ægløsningen. De egner sig særligt til kvinder, der ikke tåler østrogen, f.eks. under amning. Mini-piller blev introduceret i Danmark i 1970’erne.'
  },
  p_sproejte: {
    billede: 'images/Sprøjte.png',
    alt: 'ikon p-sprøjte',
    overskrift: 'RIGTIGT!',
    citat: '"Jeg får bare en sprøjte hver tredje måned, og så behøver jeg ikke tænke mere over det."',
    fakta: 'P-sprøjten er en hormonel præventionsmetode, der indeholder gestagen. Den gives som en indsprøjtning hver 8.-12. uge, ofte i baldemusklen. Den virker ved at forhindre ægløsning og gøre slimhinden i livmoderen mindre modtagelig. P-sprøjten blev populær i 1990’erne i Danmark, men bruges i dag mindre hyppigt på grund af bivirkninger som vægtøgning og uregelmæssige blødninger.'
  },
  p_plaster: {
    billede: 'images/Plaster.png',
    alt: 'ikon p-plaster',
    overskrift: 'RIGTIGT',
    citat: '"P-plasteret passer godt til min hverdag – jeg sætter det bare på én gang om ugen."',
    fakta: 'P-plaster er et lille hudplaster, der frigiver østrogen og gestagen gennem huden. Det skiftes en gang om ugen i tre uger, med en pause i den fjerde uge. Det virker på samme måde som p-piller, men uden behov for daglig indtagelse. P-plasteret blev godkendt i EU i begyndelsen af 2000’erne og kom kort efter til Danmark.'
  },
  p_stav: {
    billede: 'images/Stav2.png',
    alt: 'ikon p-stav',
    overskrift: 'RIGTIGT',
    citat: '“P-staven passer til mig, fordi jeg ikke skal huske noget hver dag.”',
    fakta: 'P-staven er en lille plaststav, som indeholder gestagen og placeres under huden på overarmen. Den frigiver hormoner langsomt og virker i op til 3 år. P-staven forhindrer ægløsning og ændrer livmoderhalsslimet. Den blev introduceret i Danmark i slutningen af 1990’erne og er kendt for sin høje sikkerhed og lave vedligeholdelse.'
  },
  spiral: {
    billede: 'images/spiral.png',
    alt: 'ikon spiral',
    overskrift: 'RIGTIGT',
    citat: '"Jeg har hormonspiral, fordi den virker i flere år og giver færre menstruationer."',
    fakta: 'Hormonspiralen er en T-formet plastikindsats, der placeres i livmoderen og langsomt frigiver gestagen. Den virker i 3–8 år afhængigt af typen og gør slimhinden uegnet til graviditet samt ændrer livmoderhalsslimet. Hormonspiralen kom til Danmark i 1990’erne og er blevet mere populær i de seneste år på grund af dens effektivitet og langvarige virkning.'
  },
  kobber_spiral: {
    billede: 'images/spiral.png',
    alt: 'ikon kobberspiral',
    overskrift: 'RIGTIGT',
    citat: '"Kobberspiralen er et godt valg for mig, fordi den ikke indeholder hormoner."',
    fakta: 'Kobberspiralen er en lille T-formet plastgenstand omviklet med kobbertråd, som placeres i livmoderen. Kobberet virker sæddræbende og forhindrer befrugtning. Den indeholder ingen hormoner og virker i op til 5–10 år. Kobberspiralen blev introduceret i Danmark i 1970’erne og bruges stadig som en effektiv, hormonfri præventionsform.'
  },
  pessar: {
    billede: 'images/Kondom2.png',
    alt: 'ikon pessar',
    overskrift: 'RIGTIGT',
    citat: '"Pessar er smart, fordi jeg selv kan sætte den op – og så beskytter den også mod sygdomme."',
    fakta: 'Pessaret er en silikone- eller gummiskål, der sættes op i skeden før samleje og dækker livmoderhalsen. Det bruges sammen med sæddræbende creme. Pessaret er en ikke-hormonel metode og kan genbruges. Det var især udbredt i første halvdel af 1900-tallet i Danmark, men bruges i dag mere sjældent.'
  },
  kondom: {
    billede: 'images/Kondom2.png',
    alt: 'ikon kondom',
    overskrift: 'RIGTIGT',
    citat: '“Kondom er nemt at bruge, og så beskytter den mod sygdomme.”',
    fakta: 'Kondomet er den eneste præventionsform, der beskytter både mod graviditet og seksuelt overførte sygdomme. Det er en tynd gummihinde, der rulles ud over penis før samleje. Kondomer i latex blev udviklet i begyndelsen af 1900-tallet, men blev for alvor udbredt i Danmark i 1960’erne og fik fornyet betydning under HIV-epidemien i 1980’erne.'
  }
};

// Viser infoboksen med korrekt billede og navn (Emma)
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

// Fylder faktaboksen med data (Andreas)
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

// Aktiver dragstart og gør alle andre inaktive (Kristoffer)
draggables.forEach(item => {
  item.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    draggables.forEach(el => {
      if (el !== e.target) {
        el.setAttribute("draggable", "false");
        el.style.opacity = "0.5";
      }
    });
  });
});

// Aktiver dropzones ved dragover (Line)
dropzones.forEach(zone => {
  zone.addEventListener("dragover", (e) => e.preventDefault());

  zone.addEventListener("drop", (e) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedEl = document.getElementById(draggedId);
    const originalParent = draggedEl.parentNode;

    if (originalParent && originalParent.classList.contains('dropzone')) {
      const wasCorrect = correctMatches[originalParent.id];
      const wasCorrectMatch = Array.isArray(wasCorrect) ? wasCorrect.includes(draggedId) : wasCorrect === draggedId;
      if (wasCorrectMatch && matchedZones[originalParent.id]) {
        delete matchedZones[originalParent.id];
        if (pendingCorrectId === draggedId) {
          pendingCorrectId = null;
        }
      }
    }
    // Håndter hvis der allerede ligger noget i dropzonen fx når der skal ligge flere i samme dropzone (Andreas)
    if (zone.firstChild) {
      const existingElement = zone.firstChild;
      if (existingElement.dataset.originalParentId) {
        const originalParentOfExisting = document.getElementById(existingElement.dataset.originalParentId);
        if (originalParentOfExisting) {
          originalParentOfExisting.appendChild(existingElement);
          existingElement.style.position = "static";
          delete existingElement.dataset.originalParentId;
          const existingId = existingElement.id;
          const wasExistingCorrect = correctMatches[zone.id];
          const wasExistingCorrectMatch = Array.isArray(wasExistingCorrect) ? wasExistingCorrect.includes(existingId) : wasExistingCorrect === existingId;
          if (wasExistingCorrectMatch && matchedZones[zone.id]) {
            delete matchedZones[zone.id];
          }
        }
      } else {
        zone.removeChild(existingElement);
      }
    }

    // Tilføj det trukne element til dropzonen (Emma)
    zone.appendChild(draggedEl);
    draggedEl.style.position = "static";
    draggedEl.dataset.originalParentId = zone.id;

    const correct = correctMatches[zone.id];
    const isCorrect = Array.isArray(correct)
      ? correct.includes(draggedId)
      : correct === draggedId;

      // Tjek om det er korrekt placeret (Line)
      if (isCorrect && !matchedZones[zone.id]) {
        matchedZones[zone.id] = true;
        pendingCorrectId = draggedId;
        showInfoBox(draggedId);
      
        // Skjul overskriften første gang noget placeres korrekt (Kristoffer)
        const overskriftEl = document.getElementById("overskrift");
        if (overskriftEl) overskriftEl.style.display = "none";
      
        draggables.forEach(el => {
          el.setAttribute("draggable", "false");
          el.style.opacity = "0.5";
        });
      
      
    } else if (!isCorrect) {
      if (matchedZones[zone.id]) {
        delete matchedZones[zone.id];
      }
      if (pendingCorrectId === draggedId) {
        pendingCorrectId = null;
      }

      // Vis forkert boks (Andreas)
      const wrongBox = document.getElementById("wrongBox");
      wrongBox.style.display = "flex";
      wrongBox.style.zIndex = "1000";
      const wrongElement = document.getElementById(draggedId);

      // Når boksen klikkes,  bliver man sendt tilbage til start og kan vælge et nyt element (Emma)
      wrongBox.onclick = () => {
        wrongBox.style.display = "none";
        const startZone = document.querySelector(".præventionsformer");
        const index = parseInt(wrongElement.dataset.index);
        const siblings = Array.from(startZone.children);
        const insertBeforeEl = siblings.find(el => parseInt(el.dataset.index) > index);
        if (insertBeforeEl) {
          startZone.insertBefore(wrongElement, insertBeforeEl);
        } else {
          startZone.appendChild(wrongElement);
        }

        // Gør aktiv igen (Line)
        wrongElement.style.position = "static";
        delete wrongElement.dataset.originalParentId;
        wrongElement.setAttribute("draggable", "true");
        wrongElement.style.opacity = "1";
        draggables.forEach(el => {
          if (el !== wrongElement) {
            el.setAttribute("draggable", "false");
            el.style.opacity = "0.5";
          }
        });
      };
    }
  });
});


// Luk infoboks og giv point (Andreas)
function closeInfoBox() {
  document.getElementById("infoBox").style.display = "none";
  document.getElementById("boks-info").style.display = "none";
  if (pendingCorrectId) {
    const el = document.getElementById(pendingCorrectId);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
    draggables.forEach(el => {
      el.setAttribute("draggable", "true");
      el.style.opacity = "1";
    });
    addPoint();
    pendingCorrectId = null;
  }
}


function lukPopup() {
  // Skjul popup (Line)
  document.querySelector(".popup-succes").style.display = "none";

  // Nulstil .præventionsformer (Emma)
  const container = document.querySelector(".præventionsformer");
  container.innerHTML = `
    <img src="images/Kondom.png" class="draggable" id="Kondom" draggable="true" data-index="0">
    <img src="images/Homon-spiral.png" class="draggable" id="Hormon-spiral" draggable="true" data-index="1">
    <img src="images/P-sprøjte.png" class="draggable" id="P-sprøjte" draggable="true" data-index="2">
    <img src="images/P-piller.png" class="draggable" id="P-piller" draggable="true" data-index="3">
    <img src="images/Pessar.png" class="draggable" id="Pessar" draggable="true" data-index="4">
    <img src="images/Kobber-spiral.png" class="draggable" id="Kobber-spiral" draggable="true" data-index="5">
    <img src="images/Mini-piller.png" class="draggable" id="Mini-piller" draggable="true" data-index="6"> 
    <img src="images/P-plaster.png" class="draggable" id="P-plaster" draggable="true" data-index="7">
    <img src="images/P-stav.png" class="draggable" id="P-stav" draggable="true" data-index="8">
  `;
  container.style.display = "flex";

    // Tilføj dragstart event listeners igen (Kristoffer)
    document.querySelectorAll(".draggable").forEach(el => {
      el.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", e.target.id);
      });
    });

  // Ryd dropzones (Andreas)
  document.querySelectorAll(".dropzone").forEach(zone => {
    zone.innerHTML = "";
  });

  // Nulstil fremdrift (Line)
  document.getElementById("pointsFill").style.width = "0%";
  document.getElementById("pointsText").textContent = "0/9";

  if (typeof resetScore === "function") {
    resetScore();
  }
}