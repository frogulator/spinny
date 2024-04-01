const abt = document.querySelector('.abt');
const abtSct = document.querySelector('.abt-sct');

abt.addEventListener('click', function(event) {
    abtSct.classList.toggle('visible');
    event.stopPropagation(); 
});

document.addEventListener('click', function(event) {
    if (!abtSct.contains(event.target) && !abt.contains(event.target) && abtSct.classList.contains('visible')) {
        abtSct.classList.remove('visible');
    }
});



document.addEventListener("DOMContentLoaded", function() {
    var toggleButton = document.getElementById('toggleAdjustments');
    var adjustments = document.querySelector('.adjustments');

    toggleButton.addEventListener('click', function() {
        var isVisible = adjustments.style.display === 'flex';
        adjustments.style.display = isVisible ? 'none' : 'flex';
        if (isVisible) {
            toggleButton.innerHTML = 'open adjustments <img src="assets/arrow.svg">';
        } else {
            toggleButton.innerHTML = 'close adjustments <img src="assets/arrow.svg" class="rotate">';
        }
    });
});








