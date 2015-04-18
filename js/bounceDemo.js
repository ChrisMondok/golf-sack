// Variable aliases
var Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies;

// create a Matter.js engine
var engine = Engine.create(document.getElementById("gameArea"));

// create two boxes and a ground
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
var ceil = Bodies.rectangle(400, 0, 810, 60, { isStatic: true });
var left = Bodies.rectangle(0, 300, 60, 600, { isStatic: true });
var right = Bodies.rectangle(800, 300, 60, 600, { isStatic: true });

var ball = Bodies.circle(400, 300, 5, {density:.005, restitution:0.5});

// add all of the bodies to the world
World.add(engine.world, [ground, ceil, left, right, ball]);

// run the engine
Engine.run(engine);
engine.world.gravity = {x:0, y:0.00001};

engine.fg = [];
engine.fg.push({
	
	draw: function(ctx) {
		ctx.font = "48px Helvetica";
		ctx.fillStyle = "white";
		ctx.fillText("BACKGR'ND", ball.position.x, ball.position.y);
	}
});

engine.bg = [];

window.setInterval(function() {
	var forceMag = 0.04 * ball.mass;
	Matter.Body.applyForce(ball, ball.position,
		{x:-forceMag+(Math.random()*2*forceMag), y:-forceMag+(Math.random()*2*forceMag)}
	);
}, 1000);