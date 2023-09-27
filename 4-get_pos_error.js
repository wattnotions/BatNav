let circles = [];
let sensors = [];
let cooldown = 1000; // Cooldown time in milliseconds
let timerStarted = false;
let startTime;
let maxCircleSize = 300; // Maximum size for the circles
let collidedSensorCount = 0; // Counter for collided sensors
let lastTime = 0;
let speed = 20;
let clickx = 0;
let clicky = 0;
let myerror;
let inter_array = [];

function setup() {
  createCanvas(800, 800);
  frameRate(30);

  // Create three Sensor objects with defined x and y positions
  sensors.push(new Sensor(100, 100, 1));
  sensors.push(new Sensor(700, 100, 2));
  sensors.push(new Sensor(400, 700, 3));

  myerror = new ShowError();
}

function draw() {
  background(220);

  myerror.displayClickOrigin();

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

        sensor.hasCollided = true; // Set the flag to indicate collision
        sensor.collisionTime = millis();

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

    // Check for intersections between the sensors
    for (let i = 0; i < sensors.length; i++) {
      for (let j = i + 1; j < sensors.length; j++) {
        const sensor1 = sensors[i];
        const sensor2 = sensors[j];

        // Calculate the intersection points between sensor1 and sensor2
        const intersections = findCircleIntersections(
          sensor1.x,
          sensor1.y,
          sensor1.collisionCircleRadius,
          sensor2.x,
          sensor2.y,
          sensor2.collisionCircleRadius
        );

        if (intersections.length > 0) {
          print(`Sensors ${sensor1.id} and ${sensor2.id} intersect at:`);
          for (let k = 0; k < intersections.length; k++) {
            const intersection = intersections[k];
            print(`(${intersection.x}, ${intersection.y})`);
            // You can add additional actions here for each intersection point

            // Draw a small red circle at the intersection point
            fill(255, 0, 0); // Red color
            noStroke();
            if (intersection.x != undefined) {
              
              ellipse(intersection.x, intersection.y, 10); // Adjust the size as needed

              inter_array.push([intersection.x, intersection.y]); // Store intersection points
              
            }
          }
        }
      }
    }

    // Estimate the position based on the intersections and sensors
    calculateMinDistances(inter_array)
    inter_array.splice(0, inter_array.length);
    noLoop();

    // Clear the circles and reset the collidedSensorCount
    circles.splice(0, circles.length);
    collidedSensorCount = 0;
  }
}

function mouseClicked() {
  loop();

  clickx = mouseX;
  clicky = mouseY;
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
    this.speed = speed; // Speed at which the circle expands in pixels per second
  }
  
  // Expand the circle
  expand() {

    // Adjust the radius based on frame rate
    this.r += (this.speed);
  }
  


  // Display the circle
  display() {
    stroke(255, 0, 0); // Set stroke color to red (R: 255, G: 0, B: 0)
    noFill();
    ellipse(this.x, this.y, this.r * 2);
  }
  

  // Check if this circle intersects with another circle
  outerIntersects(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    return d <= this.r + other.radius && d >= abs(this.r - other.radius);
  }
}

class ShowError {
  constructor() {
    this.calced_x = 0;
    this.calced_y = 0;
  }
  
  
  displayClickOrigin() {
    stroke(0, 255, 0); //green dot
    fill(0,255,0);
    ellipse(clickx, clicky, 10);
    
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
    this.collisionTime = 0; // property to store the time of collision
    this.collisionCircleRadius=0;
  }

  // Display the sensor as a red circle with a label
  display() {
    fill(255, 0, 0); // Red color
    ellipse(this.x, this.y, this.radius * 2); // Adjust the size as needed
    fill(0); // Black color for text
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.id, this.x, this.y); // Display the sensor number in the center
    
    if (this.hasCollided) {
      noFill();
      stroke(0);
      let numFrames = ((this.collisionTime-startTime)/1000)*(30)
      let radiuss= numFrames*speed
      this.collisionCircleRadius=radiuss;
      ellipse(this.x, this.y, radiuss*2);
      //print(this.collisionTime-startTime);
      //print(radiuss);
      
    }
  }
}

function findCircleIntersections(x1, y1, r1, x2, y2, r2) {
  // Calculate the distance between the two circle centers
  const d = dist(x1, y1, x2, y2);

  // Check if the circles are too far apart to intersect
  if (d > r1 + r2) {
    return "No intersection (circles are too far apart)";
  }

  // Check if one circle is completely inside the other
  if (d < Math.abs(r1 - r2)) {
    return "No intersection (one circle is inside the other)";
  }

  // Calculate the intersection points
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(r1 * r1 - a * a);
  const x3 = x1 + (a * (x2 - x1)) / d;
  const y3 = y1 + (a * (y2 - y1)) / d;
  const x4 = x3 + (h * (y2 - y1)) / d;
  const y4 = y3 - (h * (x2 - x1)) / d;

  // Calculate the second intersection point (if it exists)
  const x5 = x3 - (h * (y2 - y1)) / d;
  const y5 = y3 + (h * (x2 - x1)) / d;
  


  return [{ x: x4, y: y4 }, { x: x5, y: y5 }];
}

function calculateCumDistances(points) {
  for (let i = 0; i < points.length; i++) {
    let totalDistance = 0;
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        let d = dist(points[i][0], points[i][1], points[j][0], points[j][1]);
        totalDistance += d;
      }
    }
    console.log(`point ${i + 1} : cumulative distance : ${totalDistance}`);
  }
}

function calculateMinDistances(points) {
  
  print(points);
  for (let i = 0; i < points.length; i++) {
    let minDistance = Infinity; // Initialize with a high value
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        let d = dist(points[i][0], points[i][1], points[j][0], points[j][1]);
        if (d < minDistance) {
          minDistance = d; // Update minimum distance if a smaller one is found
        }
      }
    }
    console.log(`point ${i + 1} : minimum distance : ${minDistance}`);
  }
}
