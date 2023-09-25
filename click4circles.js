let circles = [];

//Experimenting with making expanding circles based on mouse clock

function setup() {
  createCanvas(400, 400);
  // Create a new Circle object and add it to the array
  let circle = new Circle(200, 200, 50);
  circles.push(circle);
}

function draw() {
  background(220);

  // Loop through the circles array and display each circle
  for (let i = 0; i < circles.length; i++) {
    circles[i].display();
  }
}

function mouseClicked() {
  // When the mouse is clicked, create an expanding black line circle
  let newCircle = new Circle(mouseX, mouseY, 2); // Start with a small circle
  circles.push(newCircle);
}

// Define the Circle class
class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = 5; // Speed at which the circle expands
  }

  // Display the circle
  display() {
    stroke(0);
    noFill();
    ellipse(this.x, this.y, this.r * 2);
    this.r += this.speed; // Increase the size of the circle
  }
}
