// Define racial bonuses object

var usedPoints = 0;
var currentValue;

var racialBonuses = {
    "strength": 0,
    "dexterity": 0,
    "constitution": 0,
    "intelligence": 0,
    "wisdom": 0,
    "charisma": 0
  };
var selectedBonuses = {"+1": null,"+2": null};
  
  // Function to set racial bonus for an ability score
function setRacialBonus(ability, bonus) {
    // If the bonus is already selected, deselect it
    if (selectedBonuses["+1"] === ability && bonus === 1) {
      selectedBonuses["+1"] = null;
      racialBonuses[ability] = 0;
    } else if (selectedBonuses["+2"] === ability && bonus === 2) {
      selectedBonuses["+2"] = null;
      racialBonuses[ability] = 0;
    } else {
      // Reset all racial bonuses for the selected ability
      for (var key in racialBonuses) {
        if (key !== ability) {
          racialBonuses[key] = 0;
        }
      }
      // Set the selected racial bonus
      racialBonuses[ability] = bonus;
      // Update selected bonuses
      if (bonus === 1) {
        selectedBonuses["+1"] = ability;
      } else if (bonus === 2) {
        selectedBonuses["+2"] = ability;
      }
    }
    updateRemainingPoints();
}

function increment(id) {
    var input = document.getElementById(id);
    if (parseInt(input.value) < 15) {
        input.value = parseInt(input.value) + 1;
        if (currentValue < 15 && remainingPoints >= 2) {
            if (currentValue === 13) {
                input.value = currentValue + 1;
                usedPoints += 2;
            } 
            else {
                input.value = currentValue + 1;
                usedPoints += 1;
            }
        }
    }
    updateRemainingPoints();
}
  // Function to decrement ability score
function decrement(id) {
    var input = document.getElementById(id);
    if (parseInt(input.value) > 8) {
        input.value = parseInt(input.value) - 1;
        if (currentValue < 15 && remainingPoints >= 2) {
            if (currentValue === 13) {
                input.value = currentValue + 1;
                usedPoints -= 2;
            } 
            else {
                input.value = currentValue + 1;
                usedPoints -= 1;
            }
        }
    }
    updateRemainingPoints();
}
  // Function to calculate ability scores
  function calculateAbilityScores() {
    // Get ability scores
    var abilityScores = {
      "strength": parseInt(document.getElementById('strength').value),
      "dexterity": parseInt(document.getElementById('dexterity').value),
      "constitution": parseInt(document.getElementById('constitution').value),
      "intelligence": parseInt(document.getElementById('intelligence').value),
      "wisdom": parseInt(document.getElementById('wisdom').value),
      "charisma": parseInt(document.getElementById('charisma').value)
    };
  
    // Calculate and display final ability scores and modifiers
    var finalScoresHTML = "<h2>Final Ability Scores</h2>";
    for (var ability in abilityScores) {
      var score = abilityScores[ability] + racialBonuses[ability];
      finalScoresHTML += "<p>" + ability.charAt(0).toUpperCase() + ability.slice(1) + ": " + score + " (Modifier: " + calculateModifier(score) + ")</p>";
    }
    document.getElementById('finalScores').innerHTML = finalScoresHTML;
    updateRemainingPoints();
  }
  
  function calculateModifier(score) {
    return Math.floor((score - 10) / 2);
  }
  
function updateRemainingPoints() {
    var totalPoints = 27;
    var remainingPoints = totalPoints - usedPoints;
    document.getElementById('remainingPoints').textContent = "Remaining Points: " + remainingPoints;
    }