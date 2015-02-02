var load_state = {

  preload: function() {

    game.load.bitmapFont('jawbreaker', 'assets/fonts/jawbreaker.png', 'assets/fonts/jawbreaker.fnt');
    game.stage.backgroundColor = '#000000';

    game.load.image('shark', 'assets/images/essentials/shark.png');
    game.load.image('sand', 'assets/images/essentials/sand.png');
    
    game.load.image('rock_1', 'assets/images/obstacles/rock_1.png');
    game.load.image('anchor', 'assets/images/obstacles/anchor.png');
    game.load.image('mine', 'assets/images/obstacles/mine.png');
    game.load.image('drum', 'assets/images/obstacles/drum.png');
    
    game.load.image('bloom', 'assets/images/effects/bloom.png');
    game.load.image('fade', 'assets/images/effects/fade.png');
    game.load.image('sea', 'assets/images/effects/sea.png');
    
    game.load.image('school_1', 'assets/images/schools/school_1.png');
    game.load.image('school_2', 'assets/images/schools/school_2.png');
    game.load.image('school_3', 'assets/images/schools/school_3.png');
    game.load.image('school_4', 'assets/images/schools/school_4.png');
    game.load.image('school_5', 'assets/images/schools/school_5.png');
    game.load.image('school_6', 'assets/images/schools/school_6.png');
    game.load.image('school_7', 'assets/images/schools/school_7.png');
    game.load.image('school_8', 'assets/images/schools/school_8.png');
    game.load.spritesheet('explosion', 'assets/images/explosion_spritesheet.png', 200, 240);
    
    game.load.audio('swim', 'assets/sounds/swim.wav');
    game.load.audio('underwater', 'assets/sounds/underwater.wav');
    game.load.audio('bleep', 'assets/sounds/bleep.wav');
    game.load.audio('punch', 'assets/sounds/punch.wav');
    game.load.audio('fall', 'assets/sounds/fall.wav');
    game.load.audio('explosion', 'assets/sounds/explosion.wav');

  },

  create: function() {

    game.stage.backgroundColor = '#005470';
    game.state.start('play');
  }
};
