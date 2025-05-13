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