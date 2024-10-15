function Cell(x, y) {
  this.x = x;
  this.y = y;
	this.wallWidth = w * 0.1 > 5 ? 5 : w * 0.1;
	this.halfWallWidth = this.wallWidth * 0.5;
	this.connections = [];
	this.parent;
	this.visited = 0;
	// this.c = {r:255, g:0, b:255, a:100};
	this.c = {h:startHue, s:0, b:0, a:100};

	this.getConnections = function() {
		this.connections[0] = grid[index(this.x, this.y - 1)]; //top
		this.connections[1] = grid[index(this.x - 1, this.y)]; //left
		this.connections[2] = grid[index(this.x, this.y + 1)]; //bottom
		this.connections[3] = grid[index(this.x + 1, this.y)]; //right
	};

	this.checkNeighbors = function(sort=shuffle) {
		var neighbors = [];
		this.getConnections();
		for (let i = 0; i < this.connections.length; i++) {
			const connection = this.connections[i];
			if(connection && !connection.visited) { neighbors.push(connection); }
		}
		sort(neighbors);
		return neighbors;
	}

  this.show = function () {
		this.pointParent(this.wallWidth, {h:100, s:0, b:255, a:127});
		if(this.visited) {
			// this.pointParent(this.wallWidth, {h:100, s:255, b:255, a:127});
			// this.shiftHue();
			// strokeWeight(this.wallWidth);
			// stroke((this.c.h + hueShift) % 360, this.c.s, this.c.b, this.c.a);
			// top, left, bottom, right
			// this.drawWalls();
		}
		this.drawBorderWalls();
  };

	// top, left, bottom, right
	this.drawBorderWalls = function(
		sWeight = this.wallWidth,
		sColor = {h:(this.c.h + hueShift) % 360, s:this.c.s, b:this.c.b, a:this.c.a}
	) {
		let x = this.x * w;
		let y = this.y * w;
		strokeWeight(sWeight);
		// stroke((this.c.h + hueShift) % 360, this.c.s, this.c.b, this.c.a);
		stroke(sColor.h, sColor.s, sColor.b, sColor.a);
		if(!this.connected(this.connections[0])){ line(x + this.halfWallWidth, y + this.halfWallWidth, x + w - this.halfWallWidth, y + this.halfWallWidth); }
		if(!this.connected(this.connections[1])){ line(x + this.halfWallWidth, y + this.halfWallWidth, x + this.halfWallWidth, y + w - this.halfWallWidth); }
		if(!this.connected(this.connections[2])){ line(x + this.halfWallWidth, y + w - this.halfWallWidth, x + w - this.halfWallWidth, y + w - this.halfWallWidth); }
		if(!this.connected(this.connections[3])){ line(x + w - this.halfWallWidth, y + this.halfWallWidth, x + w - this.halfWallWidth, y + w - this.halfWallWidth); }
	}

	// top, left, bottom, right
	this.drawWalls = function(
		sWeight = this.wallWidth,
		sColor = {h:(this.c.h + hueShift) % 360, s:this.c.s, b:this.c.b, a:this.c.a}
	) {
		let x = this.x * w;
		let y = this.y * w;
		strokeWeight(sWeight);
		// stroke((this.c.h + hueShift) % 360, this.c.s, this.c.b, this.c.a);
		stroke(sColor.h, sColor.s, sColor.b, sColor.a);
		if(!this.connected(this.connections[0])){ line(x, y, x + w, y); }
		if(!this.connected(this.connections[1])){ line(x, y, x, y + w); }
		if(!this.connected(this.connections[2])){ line(x, y + w, x + w, y + w); }
		if(!this.connected(this.connections[3])){ line(x + w, y, x + w, y + w); }
	}

	this.pointParent = function(
		sWeight = this.wallWidth,
		sColor = {h:(this.c.h + hueShift) % 360, s:this.c.s, b:this.c.b, a:this.c.a}
	) {
		let x = this.x * w;
		let y = this.y * w;
		strokeWeight(sWeight);
		stroke((this.c.h + hueShift + 45) % 360, this.c.s, this.c.b, this.c.a);
		// stroke(sColor.h, sColor.s, sColor.b, sColor.a);
		let halfW = w * 0.5;
		if (this.parent)
			line(x + halfW, y + halfW, (this.parent.x * w) + halfW, (this.parent.y * w) + halfW);
	}

	this.isParent = function(otherCell) {
		if (!otherCell) return false;
		return this.x == otherCell.x && this.y == otherCell.y;
	}

	this.connected = function(otherCell) {
		if (!otherCell) return false;
		return this.isParent(otherCell.parent) || otherCell.isParent(this.parent);
	}

	this.shiftHue = function(val) {
		this.c.h += val;
		if(this.c.h > 359) this.c.h = this.c.h % 360;
		if(this.c.h < 0) this.c.h = 360 - (-this.c.h % 360);
	}

	this.highlight = function(color = this.c) {
		noStroke();
		fill(color.h, color.s, color.b, color.a);
		rect(this.x * w, this.y * w, w, w);
	}

	this.goBlack = function(){
		if (this.c.r > 0) return this.c.r--;
		if (this.c.b > 0) return this.c.b--;
		if (this.c.g > 0) return this.c.g--;
	}

	this.goWhite = function(){
		if (this.c.r < 255) return this.c.r++;
		if (this.c.b < 255) return this.c.b++;
		if (this.c.g < 255) return this.c.g++;
	}

	this.visit = function(visitedIndex, startHue){
		this.visited = visitedIndex;
		// this.c = {r:255, g:0, b:255, a:100};
		// this.c = {h:0, s:0, b:255, a:255};
		this.c = {h:((visitedIndex* 0.1) % 360), s:100, b:100, a:100};
	}
}
