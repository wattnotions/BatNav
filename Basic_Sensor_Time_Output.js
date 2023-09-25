let circles = [];
let sensors = [];
let cooldown = 1000; // Cooldown time in milliseconds
let timerStarted = false;
let startTime;
let maxCircleSize = 300; // Maximum size for the circles
let collidedSensorCount = 0; // Counter for collided sensors

function setup() {
  createCanvas(800, 800);

  // Create a new Circle object and add it to the array
  

  // Create three Sensor objects with defined x and y positions
  sensors.push(new Sensor(100, 100, 1));
  sensors.push(new Sensor(700, 100, 2));
  sensors.push(new Sensor(400, 700, 3));
}

function draw() {
  background(220);

  // Loop through the circles array and display each circle
  for (let i = 0; i < circles.length; i++) {
    circles[i].display();
    circles[i].expand();

   

    // Check if the expanding circle's outer line collides with a sensor circle
    for (let j = 0; j < sensors.length; j++) {
      let sensor = sensors[j];
      if (circles[i].outerIntersects(sensor) && !sensor.hasCollided && millis() - sensor.startTime > cooldown) {
        // Circle's outer line hits the sensor and cooldown time has passed
        print("Sensor " + sensor.id + " milliseconds: " + (millis() - sensor.startTime));
        sensor.startTime = millis(); // Reset the timer for this sensor
        sensor.hasCollided = true; // Set the flag to indicate collision
        collidedSensorCount++; // Increment the collided sensor count
      }

      
    }
  }

  // Loop through the sensors array and display each sensor
  for (let i = 0; i < sensors.length; i++) {
    sensors[i].display();
  }
  
  if (collidedSensorCount === 3) {
    print("All three sensors have collided!");
    circles.splice(0, circles.length);
    collidedSensorCount =0;
    // You can add additional actions here when all sensors have collided
  }
}

function mouseClicked() {
  // When the mouse is clicked, create an expanding black line circle
  let newCircle = new Circle(mouseX, mouseY, 2); // Start with a small circle
  circles.push(newCircle);

  // Start the timer
  timerStarted = true;
  startTime = millis();
  
  for (let i = 0; i < sensors.length; i++) {
      sensors[i].hasCollided = false;
    }
}

// Define the Circle class
class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = 1; // Speed at which the circle expands
  }

  // Display the circle
  display() {
    stroke(0);
    noFill();
    ellipse(this.x, this.y, this.r * 2);
  }

  // Expand the circle
  expand() {
    this.r += this.speed;
  }

  // Check if this circle intersects with another circle
  outerIntersects(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    return d <= this.r + other.radius && d >= abs(this.r - other.radius);
  }
}

// Define the Sensor class
class Sensor {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.radius = 20; // Radius of the sensor circle
    this.id = id; // Sensor identifier
    this.startTime = 0; // Initialize timer for this sensor
    this.hasCollided = false; // Flag to indicate collision
  }

  // Display the sensor as a red circle with a label
  display() {
    fill(255, 0, 0); // Red color
    ellipse(this.x, this.y, this.radius * 2); // Adjust the size as needed
    fill(0); // Black color for text
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.id, this.x, this.y); // Display the sensor number in the center
  }
}
