// Initial Setup
let canvas_background = document.getElementById('background');
let c_b = canvas_background.getContext('2d');
canvas_background.width = innerWidth;
canvas_background.height = innerHeight;
//-----------zmiana resize----------
addEventListener("resize", function() {
	canvas_background.width = innerWidth;	
	canvas_background.height = innerHeight;
});

let colors_dots_background = [
	'#023E73',
	'#013861',
	'#30A9D9',
	'#BBE2F2',
];
function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}
// Objects
function Object(x, y, dx, dy, radius, color) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.radius1 = radius;
	this.color = color;
	this.update = function() {
		if (this.x + this.radius >= canvas_background.width || this.x - this.radius <= 0) this.dx = -this.dx;
		if (this.y + this.radius >= canvas_background.height || this.y - this.radius <= 0) this.dy = -this.dy;
		this.x += this.dx;
		this.y += this.dy;
		//powiekszenie 
		/*
		if (mouse.x + 50 > this.x && mouse.x - 50 < this.x && mouse.y + 50 > this.y && mouse.y - 50 < this.y && this.radius <5) {
			this.radius ++;
		}
		else if (this.radius>this.radius1) this.radius --;
		*/
		this.draw();
	};
	this.draw = function() {
		c_b.beginPath();
		c_b.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c_b.fillStyle = this.color;
		c_b.fill();
		c_b.closePath();
	};
}
let v = 0.05;
// Implementation
let obiekty = [];
function wczytanie() {
	obiekty = [];
	for (let i=0; i < canvas_background.width / 8; i++) {
		let radius = Math.random() * (2.5 - 1) + 1; 
		let dx = Math.random() * (v + v) - v;
		let dy =  Math.random() * (v + v) - v;
		let x =  Math.random() * (canvas_background.width - radius - dx - (radius + dx)) + radius + dx;
		let y =  Math.random() * (canvas_background.width - radius - dy - (radius + dy)) + radius + dy;
		obiekty[i] = new Object(x, y, dx, dy, radius, randomColor(colors_dots_background));
	}
}
wczytanie();
// Animation Loop
function loop() {
	requestAnimationFrame(loop);
	c_b.clearRect(0, 0, canvas_background.width, canvas_background.height);
	for  (let i=0; i < obiekty.length; i++) obiekty[i].update();
}
loop();