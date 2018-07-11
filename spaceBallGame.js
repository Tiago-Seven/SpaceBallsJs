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
let debug = false;

function setup() {
  setupBalls();
}

function setupBalls() {
  createCanvas(window.innerWidth, window.innerHeight);
  resetGame();
  nome = createDiv("Tiago Costa Neves MIEIC");
  nome.position(2, height - 31);
  nome.style("color", "#6f6f6f");
  nome.style("font-size", "15pt");
  let reset = createButton("Try again");
  reset.position(0, 0);
  reset.mousePressed(resetGame);
  page = 1;
}

function draw() {
  // background(0);
  // balls[0].pos.x = width / 2;
  // balls[0].pos.y = height / 2;
  // balls[0].v.x = 0;
  // balls[0].v.y = 1;
  // balls[0].show(createVector(0,0));
  time++;
  background(0);
  if (!hit) {
    for (let ball of balls) {
      let bPos = ball.pos;
      let desired = createVector(mouseX - bPos.x, mouseY - bPos.y); //target - pos atual
      desired.setMag(maxspeed);
      let steering = createVector(desired.x - ball.v.x, desired.y - ball.v.y); // desired velocity-actual velocity
      steering.limit(maxForce);
      ball.addForce(steering);
      ball.update();
      ball.show(steering);
      if (dist(bPos.x, bPos.y, mouseX, mouseY) < 10) hit = true;
    }
    showTimebar(time);
  } else {
    background(255, 0, 0);
    if (timeFinal == -1) timeFinal = time;

    showTimebar(timeFinal);
  }
  push();
  strokeWeight(1);
  line(0, 20, width, 20);
  pop();
  if (time > 60 * 5) {


    let c = balls.length * 2; //adiciona bolas
    balls = [];
    console.log(c);
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
      for (let i = 0; i < written.length; i++) {
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

function showTimebar(time) {
  let r = 3 + time;
  let g = 8;
  let b = 110 - (time * 3) / 7;
  stroke(r, g, b);
  fill(r, g, b);
  rect(0, 0, (width * time) / (60 * 5), 15);
}

function resetGame() {
  balls = [];
  let c = 1;
  while (c > 0) {
    ball = new Ball();
    balls.push(ball);
    c--;
  }
  hit = false;
  for (let i = 0; i < written.length; i++) {
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
  }

  addForce(force) {
    this.v.add(force);
  }

  update() {
    this.pos.add(this.v);
    this.v.mult(0.99);
    this.hitBorders();
  }

  hitBorders() {
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
  }

  show(force) {

    this.drawSmoke(force);
    this.drawMainBall();
  }

  drawMainBall() {
    stroke(255);
    // strokeWeight(18);
    //triangle function didnt work with cos and sin so made triangle by hand
    push();
    translate(this.pos.x, this.pos.y);
    scale(0.4);
    let angle = Math.atan2(this.v.x, -this.v.y);

    rotate(angle);
    fill(255, 255, 255);
    triangle(-10, 7, 10, 7, 0, -18);
    pop();
    //hitbox
    if (debug) {
      stroke(255, 0, 0);
      strokeWeight(18);
      point(this.pos.x, this.pos.y);
    }
  }

  drawSmoke(force) {
    stroke(255, 0, 0);
    strokeWeight(10);
    point(this.pos.x - force.x * 10, this.pos.y - force.y * 10);
  }
}