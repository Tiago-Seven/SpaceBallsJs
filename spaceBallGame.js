let ball;
let hit = false;
let balls = [];
let time = 0;
let timeFinal = -1;
let written = [];
let recordL = 0;
let first = true;
let page = 0;
let n = 1;
let maxspeed = 10;
let maxForce = 0.5;

function setup() {
  setupBalls();
}

function setupBalls() {
  createCanvas(window.innerWidth, window.innerHeight);
  ResetGame();
  nome = createDiv("Tiago Costa Neves MIEIC");
  nome.position(2, height - 31);
  nome.style("color", "#6f6f6f");
  nome.style("font-size", "15pt");
  var reset = createButton("Try again");
  reset.position(0, 0);
  reset.mousePressed(ResetGame);
  page = 1;
}

function draw() {
  time++;
  background(0);
  if (!hit) {
    for (var i = 0; i < balls.length; i++) {
      var mouseV = createVector(mouseX, mouseY);
      var bPos = balls[i].pos;
      var desired = createVector(mouseV.x - bPos.x, mouseV.y - bPos.y); //target - pos atual
      desired.setMag(maxspeed)
      var steering = createVector(desired.x - balls[i].v.x, desired.y - balls[i].v.y) // desired velocity-actual velocity
      steering.limit(maxForce);
      balls[i].addForce(steering);
      balls[i].update();
      balls[i].show();
      if (dist(balls[i].pos.x, balls[i].pos.y, mouseX, mouseY) < 10)
        hit = true;
    }
    stroke(3 + time, 8, 110 - (time * 3) / 7);
    rect(0, 0, (width * time) / (60 * 5), 12);
  } else {
    background(255, 0, 0);
    if (timeFinal == -1) {
      timeFinal = time;
      stroke(3, 8, 110);
      rect(0, 0, (width * timeFinal) / (60 * 5), 12);
    }
    stroke(3, 8, 110);
    rect(0, 0, (width * timeFinal) / (60 * 5), 12);
  }
  push();
  strokeWeight(1);
  line(0, 20, width, 20);
  pop();
  if (time > 60 * 5) {
    var c = balls.length + 5;
    balls = [];
    while (c > 0) {
      ball = new Ball();
      balls.push(ball);
      c--;
    }
    time = 0;
    if (!hit) {
      if (n > recordL) {
        recordL = n;
        if (!first) {
          record.remove();
        }
        record = createDiv("Record: " + n.toString());
        record.position(width - 170, height - 31);
        record.style("color", "#6f6f6f");
        record.style("font-size", "20pt");
        first = false;
      }
      text = createDiv(n);
      for (var i = 0; i < written.length; i++) {
        written[i].remove();
      }
      written = [];
      if (n >= 10) {
        text.position(width - 25 - 17, 30);
      } else {
        text.position(width - 25, 30);
      }

      text.style("color", "#6f6f6f");
      text.style("font-size", "30pt");
      written.push(text);
      n++;
    }
  }
}


function ResetGame() {
  balls = [];
  var c = 5;
  while (c > 0) {
    ball = new Ball();
    balls.push(ball);
    c--;
  }
  hit = false;
  for (var i = 0; i < written.length; i++) {
    written[i].remove();
  }
  written = [];
  n = 1;
  time = 0;
  timeFinal = -1;
}


class Ball {
  constructor() {
    this.pos = createVector(random(width), random(21, height));
    while (dist(this.pos.x, this.pos.y, mouseX, mouseY) < 30) {
      this.pos.x = random(1350);
      this.pos.y = random(650);
    }
    this.v = createVector();
    this.acc = createVector();
  }


  addForce(force) {
    this.v.add(force);

  };

  update() {
    this.pos.add(this.v);
    this.v.add(this.acc);
    this.v.mult(0.99);
    if (this.pos.y > height - 1) {
      this.v.y = -this.v.y;
      this.pos.y = height - 1;
    }
    if (this.pos.y < 30) {
      this.v.y = -this.v.y;
      this.pos.y = 30;
    }
    if (this.pos.x < 0) {
      this.v.x = -this.v.x;
      this.pos.x = 1;
    }
    if (this.pos.x > width - 1) {
      this.v.x = -this.v.x;
      this.pos.x = width - 1;
    }
  };

  show() {
    stroke(255);
    strokeWeight(18);
    point(this.pos.x, this.pos.y);
  };
}