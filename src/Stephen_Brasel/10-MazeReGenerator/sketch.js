let maze;
let w;
let minimumWidth = 15;
let resetSeconds = 5;
let resetting = false;
let maxCells = 30000;
let paused = false;

let hueShift;
let hueShiftIncrement = 1;
let startHue;
let sortIndex = 0;
let sortFunctions = []
let sortFunc = function(){};

/*
	- [x] Implement Maze Reshuffling
		https://www.youtube.com/watch?v=uctN47p_KVk
		Implement Root Directed Graph
	TODO: Implement Mighty Mouse Regulations
		https://www.youtube.com/watch?app=desktop&v=ZMQbHMgK2rw
		TODO: Prevent Hand-On-Wall Solves:
			Move Goal to center of maze
			Implement Free-standing (unconnected) walls
				Implement "Diagonal" spaces
		TODO: Implement Empty Contiguous, Non-Uniform Rooms
	TODO: Implement Penalty Spaces
		Areas that, through some effect, cost more to travel through than other spaces.

*/

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);
	colorMode(HSB);
	// frameRate(1);
	sortFunctions = [
		shuffle,
		followMouse,
		followPoint
	];
	reset();
}

function reset() {
	sortFunc = shuffle;
	resetting = false;
	hueShiftIncrement = 0.3;
	startHue = random(360);
	hueShift = startHue;

	maxDimension = (width > height) ? width : height;
	// w = floor(sqrt(maxCells / (maxDimension)));
	w = 1;
	if(w < minimumWidth) w = minimumWidth;
	cols = floor(width / w);
	rows = floor(height / w);
	background(0);

	grid = [];
	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < cols; i++) {
			var cell = new Cell(i, j);
			grid.push(cell);
		}
	}
	let rand = floor(random(0, grid.length-1));
	maze = new Maze(grid, cols, rows, grid[rand], [], []);
	maze.reset();
	while (!maze.depthFirstSearch()) {}
	// while(!maze.complete){
	// 	maze.iterate();
	// }
}

async function startResetTimer() {
	resetting = true;
	await new Promise((resolve) => {
		setTimeout(() => {
			reset();
		}, resetSeconds * 1000);
	});
}

function draw() {
	background(0);
	maze.show();
	if (!resetting) {
		maze.update();
	}
	hueShift += hueShiftIncrement;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	reset();
}

function index(x, y){
	return (x < 0 || y < 0 || x > cols - 1 || y > rows - 1)
		? -1
		: x + y * cols;
}

function keyPressed() {
	if (keyCode = " ") {
		paused = ~paused;
	}
}

function mousePressed() {
	cycleSortFunctions(1);
}

function mouseWheel(event) {
	console.log(event.delta);
	cycleSortFunctions((event.delta > 0) ? 1 : -1);
}

function cycleSortFunctions(val) {
	sortIndex += val;
	sortIndex = sortIndex % sortFunctions.length;
	if (sortIndex < 0) sortIndex = sortFunctions.length + sortIndex;
	switch (sortIndex) {
		case 2:
			sortFunc = followMouse;
			break;
		case 1:
			sortFunc = followPoint;
			break;
		case 0:
		default:
			sortFunc = shuffle;
			break;
	}
}

// function mouseOut() {
// 	sortFunc = shuffle;
// }

let shuffle = function(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

let followMouse = function(arr, point={x:mouseX, y:mouseY}) {
	arr.sort((a, b) => {
		let distA = dist(a.x*w, a.y*w, mouseX, mouseY);
		let distB = dist(b.x*w, b.y*w, mouseX, mouseY);
		let ret = distA - distB;
		return ret;
	});
}

let followPoint = function(arr, point={x:0, y:0}) {
	arr.sort((a, b) => {
		let distA = dist(a.x*w, a.y*w, point.x, point.y);
		let distB = dist(b.x*w, b.y*w, point.x, point.y);
		let ret = distA - distB;
		return ret;
	});
}