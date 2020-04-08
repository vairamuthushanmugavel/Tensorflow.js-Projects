var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var animationFrame = window.requestAnimationFrame;

var x_vals = [];
var y_vals = [];
//initializing the learning rate
const LERNING_RATE = 0.1;

//initializing the value of m and b
m = tf.variable(tf.scalar(Math.random()*10));
b = tf.variable(tf.scalar(Math.random()*10))

//initializing the optimizer function
let optimizer = tf.train.sgd(LERNING_RATE);

function predict(x) {
  let x_tensor = tf.tensor1d(x);
  return m.mul(x_tensor).add(b);
}

function loss(ypredict, ylabel) {
  return ypredict.sub(ylabel).square().mean();
}

canvas.addEventListener("click", function (event) {
  let rect = canvas.getBoundingClientRect();
  let mousex = event.clientX - rect.left;
  let mousey = event.clientY - rect.top;
  let x = map(mousex, 0, canvasWidth, 0, 1);
  let y = map(mousey, 0, canvasHeight, 1, 0);
  x_vals.push(x);
  y_vals.push(y);
});

function visuvalizePoints() {
  for (let i = 0; i < x_vals.length; i++) {
    let x = map(x_vals[i], 0, 1, 0, canvasWidth);
    let y = map(y_vals[i], 0, 1, canvasHeight, 0);
    ctx.beginPath();
    ctx.strokeStle = "white";
    ctx.fillStyle = "white";
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
}
function drawLine() {
  tf.tidy(() => {
    var x_line = [0, 1];
    var y_line = predict(x_line);
    liney = y_line.dataSync();
    let x1 = map(x_line[0], 0, 1, 0, canvasWidth);
    let x2 = map(x_line[1], 0, 1, 0, canvasWidth);
    let y1 = map(liney[0], 0, 1, canvasHeight, 0);
    let y2 = map(liney[1], 0, 1, canvasHeight, 0);
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  visuvalizePoints();
  drawLine();
  if(x_vals.length > 0){
    tf.tidy(()=>{
      ys_tensor = tf.tensor1d(y_vals);
      optimizer.minimize(() => loss(predict(x_vals),ys_tensor));
      ys_tensor.dispose()
    })
  }
  animationFrame(draw);
}
animationFrame(draw);
