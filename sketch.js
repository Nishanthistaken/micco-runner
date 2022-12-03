var PLAY = 1;
var END = 0;
var gameState = PLAY;
var miccoImage
var micco, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var bgImage;
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  bgImage = loadImage('bg.jpg')
  cloudImage = loadImage("cloud.png");
  miccoImage = loadImage("Realmicco.jpg")
  obstacle1 = loadImage("Ball.png");
  obstacle2 = loadImage("Dog_toy1.png");
  obstacle3 = loadImage("Dog_toy2.png");
  
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(1200, 800);
  
micco = createSprite(100,380,20,50);
  micco.addImage(miccoImage)
  micco.scale=0.015

 
  
  ground = createSprite(200,400,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(600,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(600,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,410,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  //trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(bgImage);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& micco.y >= 150) {
        micco.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    micco.velocityY = micco.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(micco)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      //trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      micco.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  micco.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
gameState= PLAY;
obstaclesGroup.destroyEach()
cloudsGroup.destroyEach()
score= 0
//trex.changeAnimation("running", trex_running);
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(1200,390,10,40);
   obstacle.y = Math.round(random(200,390));
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = 0.25;
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = 0.25;
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale = 0.25;
              break;
   
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
   
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(1200,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 400;
    
    //adjust the depth
    cloud.depth = micco.depth;
    micco.depth = micco.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

