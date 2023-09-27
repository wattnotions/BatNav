let circle1X, circle1Y, circle1Radius;
let circle2X, circle2Y, circle2Radius;

function setup() {
  createCanvas(400, 400);
  
  // Define the circles
  circle1X = 200;
  circle1Y = 200;
  circle1Radius = 100;
  
  circle2X = 300;
  circle2Y = 300;
  circle2Radius = 80;
  
  // Calculate the distance between circle centers
  let d = dist(circle1X, circle1Y, circle2X, circle2Y);
  
  // Check for intersection
  if (d < circle1Radius + circle2Radius) {
    // Calculate intersection points
    let a = atan2(circle2Y - circle1Y, circle2X - circle1X);
    let d1 = (circle1Radius * circle1Radius - circle2Radius * circle2Radius + d * d) / (2 * d);
    let h = sqrt(circle1Radius * circle1Radius - d1 * d1);
    
    let intersectionX1 = circle1X + d1 * cos(a) + h * sin(a);
    let intersectionY1 = circle1Y + d1 * sin(a) - h * cos(a);
    
    let intersectionX2 = circle1X + d1 * cos(a) - h * sin(a);
    let intersectionY2 = circle1Y + d1 * sin(a) + h * cos(a);
    
    // Draw the circles with no fill (outline only)
    noFill();
    ellipse(circle1X, circle1Y, 2 * circle1Radius, 2 * circle1Radius);
    ellipse(circle2X, circle2Y, 2 * circle2Radius, 2 * circle2Radius);
    
    // Draw intersection points
    fill(0);
    ellipse(intersectionX1, intersectionY1, 10, 10);
    ellipse(intersectionX2, intersectionY2, 10, 10);
  } else {
    // Circles do not intersect
    background(255);
  }
}
