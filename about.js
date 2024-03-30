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





