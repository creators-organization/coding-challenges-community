function Maze(grid, cols, rows, goal, rooms, exits) {
	this.numIterations = 100;
	this.showUnexplored = false;
	this.visitIncrement = 1;
	this.mazeGenerationMethod = "DepthFirstSearch";
	this.stateSwitchMilliseconds = 2000;
	this.prev = goal;
	this.current = goal;
	this.next = goal;
	this.grid = grid;
	this.cols = cols;
	this.rows = rows;
	this.rooms = rooms;
	this.exits = exits;
	this.visitCount = 1;
	this.stack;
	this.unexplored;
	this.currentColor;
	this.unexploredColor;

	this.startTime;
	this.elapsedTime;

	this.reset = function(){
		this.startTime = new Date();
		this.state = "DepthFirstSearch";
		this.visitCount = 1;
		this.stack = [];
		this.unexplored = [];
		this.currentColor = color(0, 0, 255);
		this.unexploredColor = color(39, 255, 127);
		this.prev = this.current;
		this.next = this.current;
		if(this.numIterations > this.grid.length) {
			this.numIterations = this.grid.length;
		}
		for (let i = 0; i < this.grid.length - 1; i++) {
			var cell = this.grid[i];
			cell.visited = 0;
		}
	}

	this.depthFirstSearch = function() {
		this.current.visit(this.visitCount, startHue);
		let neighbors = this.current.checkNeighbors(sortFunc);
		if (this.showUnexplored){
			for (let i = 1; i < neighbors.length; i++) {
				const neighbor = neighbors[i];
				if(this.unexplored.length > 0){
					let found = this.unexplored.find((n) => {
						return n.x == neighbor.x && n.y == neighbor.y;
					});
					if (found != undefined) break;
					console.log('found: ', found);
				}
				this.unexplored.push(neighbor);
			}
		}
		if(neighbors[0]) {
			this.next = neighbors[0];
			this.visitCount += this.visitIncrement;
			this.current.visit(this.visitCount, startHue);
			this.stack.push(this.current);
			// this.current.removeWalls(this.current, this.next);
			this.next.parent = this.current;
			this.prev = this.current;
			this.current = this.next;
			if (this.showUnexplored) {
				// console.log(this.unexplored);
				let unexploredIndex = this.unexplored.findIndex((n) => {
					return n.x == this.next.x && n.y == this.next.y;
				});
				if (unexploredIndex >= 0) {
					this.unexplored.splice(unexploredIndex, 1);
				}
			}
			return false;
		}
		if (this.stack.length > 0) {
			this.visitCount -= this.visitIncrement;
			this.prev = this.current;
			this.current = this.stack.pop();
			this.next = this.stack.length > 0 ? this.stack[this.stack.length - 1] : this.current;
			return false;
		}
		hueShiftIncrement = 2;
		return true;
	}

	this.originShift = function() {
		// Create random out-edge on root
		this.current.getConnections();
		let connectionPool = [];
		for (let i = 0; i < this.current.connections.length; i++) {
			const connection = this.current.connections[i];
			if ( connection ) connectionPool.push(connection);
		}
		sortFunc(connectionPool);
		this.next = connectionPool[0];
		this.current.parent = this.next;
		this.next.parent = undefined;
		this.prev = this.current;
		this.current = this.next;
		this.current.shiftHue(10);
	}

	this.show = function() {
		// this.currentColor = color((this.current.c.h + 180) % 360, this.current.c.s, this.current.c.b);
		// this.prev.highlight({h:100, s:255, b:255, a:127});
		// this.current.highlight(this.currentColor);
		// this.current.highlight({h:50, s:255, b:255, a:127});
		this.next.highlight({h:0, s:255, b:255, a:127});
		for (let i = 0; i < this.unexplored.length && this.showUnexplored; i++) {
			this.unexplored[i].highlight(this.unexploredColor);
		}
		for (let i = 0; i < grid.length; i++) {
			grid[i].show();
		}
		// this.prev.drawBorderWalls(this.next.wallWidth, {h:250, s:255, b:255, a:127});
		// this.current.drawBorderWalls(this.current.wallWidth, {h:0, s:255, b:255, a:127});
		// this.next.drawBorderWalls(this.next.wallWidth, {h:50, s:255, b:255, a:127});
	}

	this.update = function() {
		if (paused) return;
		switch (this.state) {
			case "OriginShift":
				for (let i = 0; i < this.numIterations; i++) {
					this.originShift();
				}
				break;
			case "DepthFirstSearch":
			default:
				for (let i = 0; i < this.numIterations; i++) {
					// while (!this.depthFirstSearch()) {} 
					if (this.depthFirstSearch()) {
						this.elapsedTime = new Date() - this.startTime;
						this.elapsedTime = this.elapsedTime > this.stateSwitchMilliseconds ? this.elapsedTime : this.stateSwitchMilliseconds;
						this.startResetTimer(this.elapsedTime);
						this.state = "OriginShift";
					break;
					}
				}
				break;
		}
	}

	this.startResetTimer = async function (milliseconds = this.stateSwitchMilliseconds) {
		await new Promise((resolve) => {
			setTimeout(() => {
				this.reset();
			}, milliseconds);
		});
	}
}