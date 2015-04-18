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

engine.world.gravity = {x:0, y:0};
// run the engine
Engine.run(engine);


function getZeroVector(){return {x:0,y:0}};

var TARGET_RADIUS = 45;
var SPEED_DEAD_ZONE = 0.02;

function drawAimingCircle(target, ctx) {

	if(target.speed < SPEED_DEAD_ZONE) {
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.arc(target.position.x, target.position.y, TARGET_RADIUS, 0, 2*Math.PI);
		ctx.stroke();
	}
	
	window.requestAnimationFrame(drawAimingCircle.bind(this,target,ctx));
	
}

var ctx = document.getElementsByTagName("canvas")[0].getContext("2d");
drawAimingCircle(ball,ctx);

var ac = new AimingCircle(ball, ctx);
	