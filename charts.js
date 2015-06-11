(function (exports) {
    /*
      Controls the create of two plots: the dartboard and the convergence. The
      dartboard visualizes where the random points land, and whether or not
      they are in the circle. The convergence plot shows the estimate of Pi
      compared to the number of points in the sample considered. 
     */
    var plot, dartboard, convergence, xaxis, yaxis, lineFunc;

    var width = 600, height = 300, margin = 40; // Width of graphics

    var scale1 = d3.scale.linear().domain([-1,1])
	.range([margin, width + margin]); // Scale for dartboard

    // Scales for convergence
    var scaley = d3.scale.linear().domain([2, 4])
	.range([height + margin, margin]);

    var scalex;

    exports.init = function (n) {
	// Initializes and renders the first graphics, with n points
	plot = new Plot();
	// Add the data to the plots
	for (var i = 0; i < n; i++) plot.addPoint();

	// Initialize dartboard
	dartboard = d3.select('.graphic')
	    .attr({'width': width + 2 * margin,
		   'height': width + 2 * margin});
	var radius = width / 2;
	dartboard.append('circle')
	    .attr({'r': radius, 'stroke': 'red', 'fill': 'none',
		  'cx':  radius + margin, 'cy': radius + margin });

	// Initialize convergence
	convergence = d3.select('.convergencePlot')
	    .attr({'width': width + 2 * margin,
		   'height': height + 2 * margin});

	yaxis = d3.svg.axis().scale(scaley).ticks(4).orient('left');
	xaxis = d3.svg.axis().scale(scalex);

	convergence.append('line')
	    .attr({'x1': margin, 'x2': width + margin,
		   'y1': scaley(Math.PI), 'y2': scaley(Math.PI),
		   'stroke-width': 2, 'stroke': 'red'});

	convergence.append('text')
	    .attr({'x': width - 200, 'y': 30, 'fill': 'red',
		  'font-size': '20px'})
	    .text(Math.PI.toString());

	scalex = d3.scale.linear().domain([0, n])
	    .range([margin, width + margin]);

	// Add the X Axis
	xaxis = d3.svg.axis().scale(scalex)
	    .orient("bottom").ticks(5);

	convergence.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height + margin) + ")")
            .call(xaxis);

	// Add the Y Axis
	yaxis = d3.svg.axis().scale(scaley)
	    .orient("left").ticks(5);
	convergence.append("g")
            .attr("class", "y axis")
	    .attr('transform', 'translate(' + margin + ',0)')
            .call(yaxis);

	lineFunc = d3.svg.line()
	    .x(function(d, i) { return scalex(i) })
	    .y(function(d) { return scaley(d) })
	    .interpolate('linear');

	convergence.append('path')
	    .attr({'d': lineFunc(plot.estimates),
		   'stroke': 'blue',
		   'stroke-width': 2,
		   'fill': 'none'});

	// Add points to dartboard by simply updating it
	updateDartboard();
    }
    exports.update = function (n) {
	// Updates the plots, with n points

	// New points:
	for (var i = 0; i < n; i++) plot.addPoint();
	// Update the plots
	updateDartboard();
	updateConvergence();
    }

    function updateDartboard() {
	// The Dartboard:
	dartboard.selectAll('circle')
	    .data(plot.points)
	    .enter()
	    .append('circle')
	    .attr({'r': 3,
		  'cx': function(d){return scale1(d.x) },
		  'cy': function(d){return scale1(d.y) },
		  'fill': function(d){return d.inCircle ? 'red' : 'black'} } );
    }

    function updateConvergence() {
	// The Convergence:
	scalex.domain([0, plot.estimates.length]);
	var changes = convergence.transition();
	changes.select('.line')
	    .duration(750)
	    .attr('d', lineFunc(plot.estimates));
	changes.select('.x.axis')
	    .duration(750)
	    .call(xaxis)
   }

})(this.plotCalc = {});
