const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');
const stars = [];
const numberOfStars = 500;

let twinkleFactor = 1.5; 

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function Star(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.opacity = Math.random();
    this.factor = Math.random() < 0.5 ? -1 : 1;
    this.increment = Math.random() * 0.02;
}

Star.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
};

Star.prototype.update = function() {
    this.opacity += this.increment * this.factor * twinkleFactor;
    if (this.opacity <= 0.1 || this.opacity >= 1) {
        this.factor = -this.factor;
    }
    this.draw();
};

for (let i = 0; i < numberOfStars; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 1.5;
    stars.push(new Star(x, y, radius));
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        star.update();
    });
}

document.getElementById('speedSlider').addEventListener('input', function(e) {
    twinkleFactor = parseFloat(e.target.value);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars.length = 0;
    for (let i = 0; i < numberOfStars; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5;
        stars.push(new Star(x, y, radius));
    }
});

animate();
