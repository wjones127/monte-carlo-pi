function Point() {
    this.x = randomInRange(-1, 1);
    this.y = randomInRange(-1, 1);
    this.inCircle = Math.pow(this.x,2) + Math.pow(this.y, 2) < 1;
}

function Plot() {
    this.points = [];
    this.estimates = [];
}

Plot.prototype.addPoint = function () {
    var point = new Point();
    this.points.push(point);
    var estimate = this.estimatePi();
    this.estimates.push(estimate);
};

Plot.prototype.estimatePi = function () {
    var total = this.points.length;
    var num_in_circle = this.points
            .filter(is_in_circle)
            .length;
    function is_in_circle (point) { return point.inCircle; }
    return 4 * num_in_circle / total;
};

function approxPi(iterations) {
    var plot = new Plot();
    for (var i = 0; i < iterations; i++)
	plot.addPoint();
    return plot.estimates.pop();
}

function randomInRange(lower, upper) {
    var width = upper - lower;
    return (width * Math.random()) + lower;
}

