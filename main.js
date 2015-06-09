Point = function() {
    this.x = randomInRange(-1, 1);
    this.y = randomInRange(-1, 1);
    this.inCircle = Math.pow(this.x,2) + Math.pow(this.y, 2) < 1;
}

Plot = function() {
    this.points = new Array();
    this.estimates = new Array();
}
Plot.prototype.addPoint = function () {
    var point = new Point();
    this.points.push(point);
    var estimate = this.estimatePi();
    this.estimates.push(estimate);
}
Plot.prototype.estimatePi = function () {
    var total = this.points.length;
    var inCircle = this.points.reduce(
	function(running, current) {
	    if (current.inCircle) return running + 1
	    else return running
	}, 0);
    return 4 * inCircle / total;
}

function approxPi(iterations) {
    plot = new Plot();
    for (var i = 0; i < iterations; i++)
	plot.addPoint();
    return plot.estimates.pop();
}

function randomInRange(lower, upper) {
    var width = upper - lower;
    return (width * Math.random()) + lower
}
