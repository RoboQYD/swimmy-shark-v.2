var play_state = {

  //Initializes all sprites, audio, and variables//
  create: function() {

    game.physics.startSystem(Phaser.Physics.ARCADE); //Starts the ARCADE physics engine//

    //Variables//
    this.score = 0; //Sets the score to 0//
    this.start = 0; //Sets start to 0//
    this.round = -1;
    this.exploded = 0;
    this.worldy = game.world.height; //Defines "worldy" as the height of the world//
    this.worldx = game.world.width; //Defines "worldx" as the width of the world//

    //Input//
    this.space_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); //Imports the keyboard as input//
    this.space_key.onDown.add(this.play, this); //Sets the spacebar as the start button//

    this.background = game.add.group();
    
    //Obstacles Group//
    this.obstacles = game.add.group(); //Creates the obstacle group//
    this.obstacles.enableBody = true; //Enables body for the obstacle group//

    this.ground = game.add.group();
    this.ground.enableBody = true;

    //Ground//
    this.sand = game.add.tileSprite(0, 550, 920, 640, 'sand'); //Creates the ground sprite//
    game.physics.enable(this.sand); //Enables physics for the ground//
    this.sand.body.immovable = true; //Sets the ground as an immovable object//
    this.ground.add(this.sand); //Adds the ground into the ground group//
    //game.world.addAt(this.sand, 1);

    //Audio//
    this.swim = game.add.audio('swim', 0.5); //Creates the swim sound//
    this.bleep = game.add.audio('bleep'); //Creates the scoring sound//
    this.punch = game.add.audio('punch'); //Creates the impact sound//
    this.fall = game.add.audio('fall'); //Creates the impact sound//
    this.thud = game.add.audio('thud'); //Creates the impact sound//
    this.explosion_sound = game.add.audio('explosion'); //Creates the impact sound//
    this.underwater = game.add.audio('underwater', 0.5, true); //Creates the underwater ambiance sound//
    this.underwater.play();

    //The Shark//
    this.shark = game.add.sprite(this.worldx/4, this.worldy/2, 'shark'); //Creates the shark sprite//
    this.shark.anchor.setTo(0.5, 0.5); //Sets the pivot point of the shark to the middle//
    this.shark.alive = true; //Sets a property of the shark "alive" to true//

    this.sea = game.add.sprite(0, 0, 'sea');
    this.sea.alpha = 0.35;
    game.add.tween(this.sea).to({ alpha: 0.30 }, 3000, Phaser.Easing.Linear.None, true)
    .to({ alpha: 0.5 }, 3000, Phaser.Easing.Linear.None, true)
    .loop()
    .start();
 
    //The Title//
    this.title = game.add.bitmapText(20, 45, 'jawbreaker', "SWIMMY SHARK", 35);
    this.title.fixedToCamera = true;
   
    //The Start Text//
    this.start_text = game.add.bitmapText(125, 400, 'jawbreaker', "TAP TO BEGIN", 20);
    this.start_text.fixedToCamera = true;
  
    this.headline = game.add.bitmapText(15, 25, 'jawbreaker', "FIRST TEAM 333 PRESENTS...", 15);
    this.headline.fixedToCamera = true;
    
    //The Bloom Sprite//
    this.bloom = game.add.sprite(0, 0, 'bloom'); //Creates the bloom sprite//
    this.bloom.alpha = 0; //Makes the bloom invisible//
    this.bloom.bringToTop(); //Brings the bloom sprite to the front//
   
    //The Fade Sprite//
    this.fade = game.add.sprite(0, 0, 'fade'); //Creates the bloom sprite//
    this.fade.alpha = 1; //Makes the bloom invisible//
    this.fade.bringToTop(); //Brings the bloom sprite to the front//
    game.add.tween(this.fade).to({ alpha: 0}, 250, Phaser.Easing.Linear.None, true); //Makes the fade sprite fade//

    this.fish_timer = game.time.events.loop(3000, this.addFish, this);
  },


  //Starts the game//
  play: function(){

    if(this.start == 0){ 

      this.start = 1; //Set start to 1//

      this.space_key.onDown.add(this.jump, this); //Sets the space key to the jump button//
    
      this.shark.enableBody = true; //Enables body for the shark//
      game.physics.enable(this.shark); //Enables physics for the shark//
      this.shark.body.gravity.y = 800; //Sets the gravity of the shark to 400//
      this.shark.body.setSize(100, 25, 0, 0);
      this.jump(); //Tells the shark to jump//
      
      this.score_text = game.add.bitmapText((this.worldx/2) - 20, 25, 'jawbreaker', "0", 50);
      this.score_text.alpha = 0;
      this.score_text.fixedToCamera = true;

      game.add.tween(this.title).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
      game.add.tween(this.start_text).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
      game.add.tween(this.headline).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
      game.add.tween(this.score_text).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
      
      this.obstacle_timer = game.time.events.loop(2000, this.addObstacle, this);
    }
  },

  //Adds an obstacle in the shark's way//
  addObstacle: function(){

    //In a later installation, these obstacles will become objects//

    var speed = (10000/this.score);
    var orientation = utilities.randomizer(1, 6); //A number selected for the arangement of the obstacles//
    var top_y = utilities.randomizer(50, 250); //A number created for the top obstacle's y-position//
    var bottom_y = top_y + 125; //A number created for the bottom obstacle's y-position; This creates the hole//

    if(orientation == 1 || orientation == 4){
      //Mine//
      this.mine = this.obstacles.create(560, bottom_y + 325, 'mine'); //Creates the mine as an object//
      this.mine.anchor.setTo(0.5, 0.5); //Sets the anchor of the mine to the center//
      this.mine.angle = -2; //Tilts the angle of the mine to -2//
      this.mine.outOfBoundsKill = true; //Tells the mine to kill itself if it is out of bounds//
      this.mine.body.setSize(5, 600, 0, 0); //Changes the bounding box's number//
      this.mine.body.velocity.x = -200; //Makes the mine move to the left//

      var sway = game.add.tween(this.mine) //An animation for the mine that makes it sway back and forth//
        .to({angle: '+4'}, speed, Phaser.Easing.Linear.None, true)
        .to({angle: '-4'}, speed, Phaser.Easing.Linear.None, true)
        .loop()
        .start();
    
      var lift = game.add.tween(this.mine) //An animation for the anchor that makes it lift up and down//
        .to({y: '+25'}, speed, Phaser.Easing.Linear.None, true)
        .to({y: '-25'}, speed, Phaser.Easing.Linear.None, true)
        .loop()
        .start();

    }

    if(orientation == 1 || orientation == 2 || orientation == 5){
      //Anchor//
      this.anchor = this.obstacles.create(560, top_y, 'anchor'); //Creates the anchor as an object//
      this.anchor.body.setSize(5, 600, 0, 0); //Changes the bounding box's size//
      this.anchor.anchor.setTo(0.5, 1); //Sets the anchor of the anchor to the middle of the bottom of it//
      this.anchor.outOfBoundsKill = true; //Tells the anchor to kill itself if it is outside of the canvas//
      this.anchor.body.velocity.x = -200; //Makes the anchor move to the left//
      
      var lift = game.add.tween(this.anchor) //An animation for the anchor that makes it lift up and down//
        .to({y: '+50'}, speed, Phaser.Easing.Linear.None, true)
        .to({y: '-50'}, speed, Phaser.Easing.Linear.None, true)
        .loop()
        .start();
       
    }

    if(orientation == 3){
      //Drum// 
      this.drum = this.obstacles.create(560, 0, 'drum'); //Creates the drum as an object//
      this.drum.anchor.setTo(0.5, 0.5); //Sets the anchor of the drum to the center of it//
      this.drum.outOfBoundsKill = true; //Tells the drum to kill itself if it is out of the screen//
      game.physics.enable(this.drum); //Tells the physics engine to include the drum//
      this.drum.body.velocity.x = -200; //Tells the drum to move to the left//
      this.drum.body.gravity.y = 200; //Tells the drum to fall downward//
      this.drum.body.bounce.y = 0.75; //Tells the drum to become bouncy//
      game.add.tween(this.drum).to({angle: '+20'}, 50, Phaser.Easing.Linear.None, true) //An animation for the drum to constantly spin//
      .loop()
      .start();
    }

    if(orientation == 2 || orientation == 3 || orientation == 6){
      //Stalagmite//
      this.stalagmite = this.obstacles.create(560, bottom_y + 100, 'rock_1'); //Creates the stalagmite as an object//
      if(orientation == 2){ //If the stalagmite is created with the anchor//
        this.stalagmite.y -= 50; //Subtract the y-position by 50//
      }
      this.stalagmite.body.setSize(5, 600, 0, 0); //Changes the size of the bounding box to a thin strip//
      game.physics.enable(this.stalagmite); //Enables physics for the stalagmite//
      this.stalagmite.anchor.setTo(0.5, 0); //Sets the anchor of the stalagmite to the top middle//
      this.stalagmite.body.immovable = true; //Makes the stalagmite into an immovable object//
      this.stalagmite.outOfBoundsKill = true; //Tells the stalagmite to kill itself if it is outside of the screen//
      this.stalagmite.body.velocity.x = -200; //Tells the stalagmite to move to the right//
    }
    
    this.round += 1;
    if(this.round > 0){
      this.score += 1;
      this.bleep.play();
      this.score_text.text = this.score;
    }
 },

  addFish: function(){

    var ypos = utilities.randomizer(50, 500); //A variable for the fish y-position//
    var fish_factor = utilities.randomizer(5, 7); //A variable for the fish time on the screen//
    var time = 15 - fish_factor;
    var school = utilities.randomizer(1, 8); //A variable for the fish school shape//

    this.school = this.background.create(1000, ypos, 'school_' + school); //Creates the school of fish as an object//
    this.school.alpha = (fish_factor - 2) * 0.1; //Sets the alpha of the school of fish//
    this.school.scale.x = fish_factor * 0.1; //Sets the size of the school of fish//
    this.school.scale.y = fish_factor * 0.1;
    this.school.anchor.setTo(0.5, 0.5);//
    this.school.outOfBoundsKill = true;
    game.add.tween(this.school).to({ x: -350 }, (time + 3) * 1000, Phaser.Easing.Linear.None, true);
    
  },
  
  //Makes the shark Jump//
  jump: function(){
    if(this.shark.alive == true){
      this.shark.body.velocity.y -= 350;
      this.swim.play();
      
      if(this.shark.angle > -45){
        game.add.tween(this.shark).to({angle: '-13'}, 100, Phaser.Easing.Linear.None, true);
      }
    }
  },

  explode: function(){

    if(this.exploded == 0){
      this.exploded = 1;
      this.explosion = game.add.sprite(this.mine.x, this.mine.y - 350, 'explosion');
      this.explosion.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 15, false);
      this.explosion_sound.play();
      this.explosion.animations.play('explode');
      this.explosion.anchor.setTo(0.5, 0.5);
      this.explosion.alpha = 0;
      game.add.tween(this.explosion).to({alpha: 1}, 500, Phaser.Easing.Linear.None, true)
      .to({alpha: 0}, 500, Phaser.Easing.Linear.None, true)
      .start();
      this.mine.kill();
    }
  },

  //Kills the shark//
  death: function(){  
    if(this.shark.alive == true){ 
      game.time.events.remove(this.obstacle_timer);
      game.time.events.remove(this.message_timer);
      this.punch.play();
      this.obstacles.forEachAlive(function(p){
        p.body.velocity.x = 0;
      },this);
      var bloom = game.add.tween(this.bloom)
      .to({alpha: 1}, 100, Phaser.Easing.Linear.None, true)
      .to({alpha: 0}, 100, Phaser.Easing.Linear.None, true)
      .start();
      this.shark.body.velocity.y = 0;
      this.shark.alive = false;
      this.space_key.onDown.add(this.restart, this);
      if(this.shark.y < 500){
        this.fall.play();
      }
      this.retry_text = game.add.bitmapText(35, 600, 'jawbreaker', '...PRESS SPACE TO RETRY...', 20);
      this.retry_text.alpha = 0;
      game.add.tween(this.retry_text).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
    }
  },

  //Constantly updates variables//
  update: function(){

    
    if(this.start == 1){
      game.physics.arcade.overlap(this.shark, this.obstacles, this.death, null, this);
      game.physics.arcade.overlap(this.shark, this.mine, this.explode, null, this);
      game.physics.arcade.overlap(this.shark, this.ground, this.death, null, this);
      game.physics.arcade.collide(this.shark, this.ground);

      this.obstacles.forEachAlive(function(p){game.physics.arcade.collide(p, this.obstacles);},this);
     
      if(this.shark.y < 0){
        this.shark.body.velocity.y = 250;
        game.add.tween(this.shark).to({ angle: 15}, 250, Phaser.Easing.Linear.None, true);
      }

      if(this.shark.angle < 45 && this.shark.body.touching.down == false){
        this.shark.angle += 0.65;
      }
    }
    
    if(this.shark.alive == true){
        this.sand.tilePosition.x -= 4;
    }
  },
  
  //Restarts the game//
  restart: function(){
    if(this.shark.body.touching.down == true){
      this.underwater.pause();
      this.score_text.alpha = 0;
      this.retry_text.alpha = 0;
      game.add.tween(this.fade).to({ alpha: 1}, 250, Phaser.Easing.Linear.None, true);
      game.time.events.add(Phaser.Timer.SECOND * 0.5, this.refresh, this); 
    }
  },

  refresh: function(){
    this.start = 0;
    game.state.start('play');
  }
};
