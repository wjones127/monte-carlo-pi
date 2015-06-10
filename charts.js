(function (exports) {
    /*
      Controls the create of two plots: the dartboard and the convergence. The
      dartboard visualizes where the random points land, and whether or not
      they are in the circle. The convergence plot shows the estimate of Pi
      compared to the number of points in the sample considered. 
     */
    var plot, dartboard, convergence, xaxis, yaxis, lineFunc;

    var width = 600, height = 300; // Width of graphics

    var scale1 = d3.scale.linear().domain([-1,1])
	.range([0, width]); // Scale for dartboard

    // Scales for convergence
    var scaley = d3.scale.linear().domain([0, 5]).range([0, height]);

    exports.init = function (n) {
	// Initializes and renders the first graphics, with n points
	plot = new Plot();

	// Initialize dartboard
	dartboard = d3.select('.graphic')
	    .attr({'width': width, 'height': width});
	dartboard.append('circle')
	    .attr({'r': scale1(0), 'stroke': 'red', 'fill': 'none',
		  'cx': width / 2, 'cy': width / 2});

	// Initialize convergence
	convergence = d3.select('.convergencePlot')
	    .attr({'width': width, 'height': height});
	yaxis = d3.svg.axis().scale(scaley).ticks(4).orient('left');

	convergence.append('line')
	    .attr({'x1': 0, 'x2': width,
		   'y1': scaley(Math.PI), 'y2': scaley(Math.PI),
		   'stroke-width': 3, 'stroke': 'red'});


	// Add the data to the plots
	this.update(n);
    }
    exports.update = function (n) {
	// Updates the plots, with n points

	// New points:
	for (var i = 0; i < n; i++) plot.addPoint();

	// The Dartboard:
	dartboard.selectAll('circle')
	    .data(plot.points)
	    .enter()
	    .append('circle')
	    .attr({'r': 3,
		  'cx': function(d){return scale1(d.x) },
		  'cy': function(d){return scale1(d.y) },
		  'fill': function(d){return d.inCircle ? 'red' : 'black'} } );

	// The Convergence:
	var scalex = d3.scale.linear().domain([0, n]).range([0, width]);
	lineFunc = d3.svg.line()
	    .x(function(d, i) { return scalex(i) })
	    .y(function(d) { return scaley(d) })
	    .interpolate('linear');
	var xaxis = d3.svg.axis().scale(scalex).tickSize(-height).tickSubdivide(true);	
	convergence.append('svg:path')
	    .attr({'d': lineFunc(plot.estimates),
		   'stroke': 'blue',
		   'stroke-width': 2,
		   'fill': 'none'});
/*	convergence.append('svg:g')
	    .attr({'class': 'x axis',
		   'transform': 'translate(0,' + height + ')'})
	    .call(xaxis);
	convergence.append('svg:g')
	    .attr({'class': 'y axis',
		   'transform': 'translate(-25, 0)'})
	    .call(yaxis);*/

    }

})(this.plotCalc = {});
