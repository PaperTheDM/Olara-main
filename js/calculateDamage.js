function increment(id) {
    var input = document.getElementById(id);
    input.value = parseInt(input.value) + 1;
  }
  
function decrement(id) {
    var input = document.getElementById(id);
    if (parseInt(input.value) > 0) {
      input.value = parseInt(input.value) - 1;
    }
  }
  
function calculateDamage() {
    var d4 = parseInt(document.getElementById('d4').value);
    var d6 = parseInt(document.getElementById('d6').value);
    var d8 = parseInt(document.getElementById('d8').value);
    var d10 = parseInt(document.getElementById('d10').value);
    var d12 = parseInt(document.getElementById('d12').value);
    var d20 = parseInt(document.getElementById('d20').value);
  
    var minDamage = d4 + d6 + d8 + d10 + d12 + d20;
    var maxDamage = d4 * 4 + d6 * 6 + d8 * 8 + d10 * 10 + d12 * 12 + d20 * 20;
    var avgDamage = (minDamage + maxDamage) / 2;
  
    document.getElementById('result').innerHTML = "Minimum Damage: " + minDamage + "<br>" +
                                                   "Maximum Damage: " + maxDamage + "<br>" +
                                                   "Average Damage: " + avgDamage.toFixed(2);
  }