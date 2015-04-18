require(['lib/matter-0.8.0.min.js'], function() {
	Matter.Render.world = function(engine) {
		var Render = this;
		var render = engine.render,
			world = engine.world,
			canvas = render.canvas,
			context = render.context,
			options = render.options,
			Composite = Matter.Composite,
			allBodies = Composite.allBodies(world),
			allConstraints = Composite.allConstraints(world),
			background = options.wireframes ? options.wireframeBackground : options.background,
			bodies = [],
			constraints = [],
			i;

		// apply background if it has changed
		if (render.currentBackground !== background)
			_applyBackground(render, background);

		// clear the canvas with a transparent fill, to allow the canvas background to show
		context.globalCompositeOperation = 'source-in';
		context.fillStyle = "transparent";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.globalCompositeOperation = 'source-over';

		// handle bounds
		if (options.hasBounds) {
			var boundsWidth = render.bounds.max.x - render.bounds.min.x,
				boundsHeight = render.bounds.max.y - render.bounds.min.y,
				boundsScaleX = boundsWidth / options.width,
				boundsScaleY = boundsHeight / options.height;

			// filter out bodies that are not in view
			for (i = 0; i < allBodies.length; i++) {
				var body = allBodies[i];
				if (Bounds.overlaps(body.bounds, render.bounds))
					bodies.push(body);
			}

			// filter out constraints that are not in view
			for (i = 0; i < allConstraints.length; i++) {
				var constraint = allConstraints[i],
					bodyA = constraint.bodyA,
					bodyB = constraint.bodyB,
					pointAWorld = constraint.pointA,
					pointBWorld = constraint.pointB;

				if (bodyA) pointAWorld = Vector.add(bodyA.position, constraint.pointA);
				if (bodyB) pointBWorld = Vector.add(bodyB.position, constraint.pointB);

				if (!pointAWorld || !pointBWorld)
					continue;

				if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
					constraints.push(constraint);
			}

			// transform the view
			context.scale(1 / boundsScaleX, 1 / boundsScaleY);
			context.translate(-render.bounds.min.x, -render.bounds.min.y);
		} else {
			constraints = allConstraints;
			bodies = allBodies;
		}
		
		if(engine.bg)
			Render.background(engine, context);

		if (!options.wireframes || (engine.enableSleeping && options.showSleeping)) {
			// fully featured rendering of bodies
			Render.bodies(engine, bodies, context);
		} else {
			// optimised method for wireframes only
			Render.bodyWireframes(engine, bodies, context);
		}

		if (options.showBounds)
			Render.bodyBounds(engine, bodies, context);

		if (options.showAxes || options.showAngleIndicator)
			Render.bodyAxes(engine, bodies, context);
		
		if (options.showPositions)
			Render.bodyPositions(engine, bodies, context);

		if (options.showVelocity)
			Render.bodyVelocity(engine, bodies, context);

		if (options.showIds)
			Render.bodyIds(engine, bodies, context);

		if (options.showCollisions)
			Render.collisions(engine, engine.pairs.list, context);

		Render.constraints(constraints, context);

		if (options.showBroadphase && engine.broadphase.controller === Grid)
			Render.grid(engine, engine.broadphase, context);
			
		if (engine.fg)
			Render.foreground(engine, context);

		if (options.showDebug)
			Render.debug(engine, context);

		if (options.hasBounds) {
			// revert view transforms
			context.setTransform(options.pixelRatio, 0, 0, options.pixelRatio, 0, 0);
		}
	};
	
	Matter.Render.background = function (engine, context) {
		
		for(var i=0; i<engine.bg.length; i++)
			engine.bg[i].draw(context);
		
	}

	Matter.Render.foreground = function (engine, context) {
		
		for(var i=0; i<engine.fg.length; i++)
			engine.fg[i].draw(context);
		
	}


	var _applyBackground = function(render, background) {
		var cssBackground = background;

		if (/(jpg|gif|png)$/.test(background))
			cssBackground = 'url(' + background + ')';

		render.canvas.style.background = cssBackground;
		render.canvas.style.backgroundSize = "contain";
		render.currentBackground = background;
	};
});
