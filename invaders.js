/**
 * BCLearningNetwork.com
 * Perfect Squares Invaders
 * @author Colin Bernard (colinjbernard@hotmail.com)
 * March 2017
 */



//////////////////// VARIABLES ////////////////////////////////////

// unicode characters
var EXPONENT_2 = "\u00B2";
var SQUARE_ROOT = "\u221A";

var questions = [	{question:SQUARE_ROOT+"64",answer:8,options:[2,3,1]},
					{question:SQUARE_ROOT+"81",answer:9,options:[2,3,1]},
					{question:SQUARE_ROOT+"25",answer:5,options:[2,3,1]},
					{question:"9"+EXPONENT_2,answer:81,options:[2,3,1]},
					{question:SQUARE_ROOT+"16",answer:4,options:[2,3,1]},
					{question:SQUARE_ROOT+"9",answer:3,options:[2,3,1]},
					{question:SQUARE_ROOT+"49",answer:7,options:[2,3,1]},
					{question:"10"+EXPONENT_2,answer:100,options:[2,3,1]},
					{question:"2"+EXPONENT_2,answer:4,options:[2,3,1]},
					{question:"6"+EXPONENT_2,answer:36,options:[2,3,1]},
					{question:"11"+EXPONENT_2,answer:121,options:[2,3,1]},
					{question:SQUARE_ROOT+"36",answer:6,options:[2,3,1]},
					{question:"5"+EXPONENT_2,answer:25,options:[2,3,1]},
					{question:SQUARE_ROOT+"4",answer:2,options:[2,3,1]}
				 ];


var FPS = 24;
var mute = false;

// constants (set in init function)
var STAGE_WIDTH;
var STAGE_HEIGHT;

var gameStarted = false;
var health;
var healthText;

// bitmap images
var playerImage;
var enemyImage;
var sidebarImage;
var starsImage;
var starsImage2;

/*
 * Handles initialization of game components
 * Called from HTML body onload.
 */
function init() {
	// set constants
	STAGE_WIDTH = document.getElementById("gameCanvas").getAttribute("width");
	STAGE_HEIGHT = document.getElementById("gameCanvas").getAttribute("height");

	// init state object
	stage = new createjs.Stage("gameCanvas"); // canvas id is gameCanvas
	stage.mouseEventsEnabled = true;
	stage.enableMouseOver(); // Default, checks the mouse 20 times/second for hovering cursor changes

	// add loading progress text (used by preload)
	progressText = new createjs.Text("", "20px Lato", "white");
	progressText.x = STAGE_WIDTH/2 - progressText.getMeasuredWidth() / 2;
	progressText.y = 20;
	//stage.addChild(progressText);
	stage.update();

	setupManifest(); // preloadJS
	startPreload();

	health = 100; // reset game health

	stage.update(); 
}

/*
 * Main update function
 */
 function tick(event) {
 	if (gameStarted) {
 		loopStarsBackground(); // update scrolling background


 	}

 	stage.update(event);
 }

 //////////////////////////////////////////////////////////////////////////// PRELOADJS FUNCTIONS

function setupManifest() {
	manifest= [{
		src: "images/logo.png",
		id: "logo"
	},
	{
		src: "sounds/click.mp3",
		id: "click"
	},
	{
		src: "images/player.png",
		id: "player"
	},
	{
		src: "images/enemy.png",
		id: "enemy"
	},
	{
		src: "images/sidebar.png",
		id: "sidebar"
	},
	{
		src: "images/stars.png",
		id: "stars"
	}
	];
}

function startPreload() {
	preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);          
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}

function handleFileLoad(event) {
    console.log("A file has loaded of type: " + event.item.type);
    // create bitmaps of images
   	if (event.item.id == "logo") {
   		//planeImages[0] = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "player") {
   		playerImage = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "enemy") {
   		enemyImage = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "sidebar") {
   		sidebarImage = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "stars") {
   		starsImage = new createjs.Bitmap(event.result);
   		starsImage2 = new createjs.Bitmap(event.result);
   	}
}

function loadError(evt) {
    console.log("Error!",evt.text);
}

function handleFileProgress(event) {
    progressText.text = (preload.progress*100|0) + " % Loaded";
    progressText.x = STAGE_WIDTH/2 - progressText.getMeasuredWidth() / 2;
    stage.update();
}

/*
 * Displays the start screen.
 */
function loadComplete(event) {
    console.log("Finished Loading Assets");

    // display start screen
    startText = new createjs.Text("Click To Start", "50px Lato", "white");
    startText.x = STAGE_WIDTH/2 - startText.getMeasuredWidth()/2;
    startText.y = STAGE_HEIGHT/2 - startText.getMeasuredHeight()/2;
    stage.addChild(startText);
    stage.update();
    stage.on("stagemousedown", startGame, null, false);
}

//////////////////////////////////////////////////////////////////////////////// END PRELOADJS FUNCTIONS

/*
 * Starts the game.
 */
function startGame(event) {
	playSound("click");

	event.remove();
	//ticker calls update function, set the FPS
	createjs.Ticker.setFPS(FPS);
	createjs.Ticker.addEventListener("tick", tick); // call tick function
	createjs.Tween.get(startText)
		.to({x:-500},500) // remove start text from visible canvas
		.call(initGraphics);
	stage.removeChild(progressText);

}

/*
 * Displays end game screen.
 */
function endGame() {
	gameStarted = false;
	var playAgainText = new createjs.Text("Click to play again", "40px Lato", "white");
	playAgainText.x = STAGE_WIDTH/2 - playAgainText.getMeasuredWidth()/2;
    playAgainText.y = STAGE_HEIGHT/2 - playAgainText.getMeasuredHeight()/2 + 70;
    stage.addChild(playAgainText);
	stage.update();
	stage.on("stagemousedown", function() {
		playSound("click");
		location.reload(); // for now just reload the document
	});
}

/*
 * Adds images to stage and sets initial position
 */
function initGraphics() {

	// health text
	healthText = new createjs.Text("Health: " + health + "%", "20px Lato", "green");
	healthText.x = STAGE_WIDTH - healthText.getMeasuredWidth() - 10;
	healthText.y = 10;
	stage.addChild(healthText);

	// left side bar
	stage.addChild(sidebarImage);

	// scrolling stars
	starsImage.x = sidebarImage.getBounds().width;
	starsImage2.x = sidebarImage.getBounds().width;
	starsImage2.y = sidebarImage.getBounds().height;
	stage.addChild(starsImage);
	stage.addChild(starsImage2);

	gameStarted = true; // once graphics are loaded, game is started
}

/*
 * Setup enemies.
 */
 function setupEnemies() {
 	// TODO
 }

 /*
  * Plays a sound if the game is not muted.
  */
 function playSound(id) {
 	if (!mute) {
 		createjs.Sound.play(id);
 	}
 }

 /*
  * Sends an alert to the user.
  */
  function sendAlertMessage(message) {

  }

 /*
 * Updates game health (including displayed text)
 */
function updatehealth(amount) {
	health += amount;
	healthText.text = "health: " + health;
	healthText.x = STAGE_WIDTH - healthText.getMeasuredWidth() - 10;
}

/*
 * Called by update function. 
 * Scrolls the stars down, and loops them.
 */
function loopStarsBackground() {
 	starsImage.y++;
	starsImage2.y++;
	if (starsImage.y > -5) {
		starsImage2.y = starsImage.y - starsImage2.getBounds().height;
	} 
	if (starsImage2.y > -5) {
		starsImage.y = starsImage2.y - starsImage.getBounds().height;
	}
}

/*
 * Toggles mute variable. Called from HTML button.
 */
function toggleMute() {
	mute = !mute;

	if (mute) {
		document.getElementById("mute").firstElementChild.setAttribute("src", "images/mute.png");
		ambianceSound.stop();
		ambianceSound = null;
	} else {
		document.getElementById("mute").firstElementChild.setAttribute("src", "images/unmute.png");
		ambianceSound = createjs.Sound.play("ambiance", {loop:-1});
		ambianceSound.volume = 0.8;
	}
}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}