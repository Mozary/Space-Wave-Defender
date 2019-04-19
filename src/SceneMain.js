export default class SceneMain extends Phaser.Scene {
  constructor() {
    super('SceneMain');
  }
  preload(){
    /* Load images and sounds, assets, etc from directories */
    this.load.image('bg','assets/playfield/bg.png'); 
    this.load.image('area','assets/playfield/area.png'); 

    this.load.spritesheet('player-idle','assets/player/player-idle.png',{ frameWidth:80 , frameHeight:80});
    this.load.spritesheet('player-run','assets/player/player-run.png',{ frameWidth:80 , frameHeight:80});
    this.load.spritesheet('player-shoot','assets/player/player-run-shot.png',{ frameWidth:80 , frameHeight:80});
    this.load.spritesheet('player-jump','assets/player/player-jump.png',{ frameWidth:80 , frameHeight:80});

    this.load.spritesheet('shot','assets/fx/shot.png',{ frameWidth:6 , frameHeight:4});
  
    this.load.spritesheet('crab-idle','assets/monster/crab-idle.png',{ frameWidth:48 , frameHeight:32});
    this.load.spritesheet('crab-walk','assets/monster/crab-walk.png',{ frameWidth:48 , frameHeight:32});
    this.load.spritesheet('jumper-idle','assets/monster/jumper-idle.png',{ frameWidth:47 , frameHeight:32});
    this.load.spritesheet('octopus','assets/monster/octopus.png',{ frameWidth:24 , frameHeight:32});
    this.load.spritesheet('jumper-jump','assets/monster/jumper-jump.png',{ frameWidth:47 , frameHeight:32});
    this.load.spritesheet('enemy-death','assets/fx/enemy-death.png',{frameWidth:83.75, frameHeight:48});

    this.load.audio('bgm',['assets/audio/bgm.ogg','assets/audio/bgm.wav']);
    this.load.audio('jump',['assets/audio/jump.ogg','assets/audio/jump.wav']);
    this.load.audio('boom',['assets/audio/boom.ogg','assets/audio/boom.wav']);
    this.load.audio('laser',['assets/audio/laser.mp3','assets/audio/laser.mp3']);
    this.load.audio('charge',['assets/audio/Charge.ogg']);
    this.load.audio('poison',['assets/audio/Poison.ogg']);
    var timer;
  }
  create(){
    /* Define our objects,'intialization' (after preload) */
    this.add.image(0,0,'bg').setOrigin(0,0);
    this.add.image(0,0,'area').setOrigin(0,0);

    /*add Music*/
    this.lasersound = this.sound.add('laser', { loop: false });
    this.jumpsound = this.sound.add('jump', { lopp: false });
    this.boomsound = this.sound.add('boom', { loop: false });
    this.chargesound = this.sound.add('charge', { loop: false });


    //player
    this.player = this.physics.add.sprite(320, 300, 'player-idle'); 
    this.player.setCollideWorldBounds(true); 
    this.player.setGravityY(400); 
    this.player.setSize(32,80);
    this.health = 3;
    this.healthPoint = this.add.text(280, 16, 'Health: 3', { fontSize: '20px', fill: '#fff', align: 'center' });
    //Pysics
    this.monster = this.physics.add.group(); 
    this.boss = this.physics.add.group();
    this.bossHealth = 10;
    this.bullet = this.physics.add.group(); 
    this.bossbullet = this.physics.add.group(); 
    //Counter
    this.timerToActive = 0;
    this.spawn = 0; 
    this.minion = 0;
    this.wave = 1; 
    this.score = 0; 
    this.isShooting = false;
    this.bossIsCharging = false;
    this.isCharging = false;
    this.bossCooldown = false;
    
    //platforms
    this.floor = this.physics.add.sprite(0,480).setOrigin(0,0); // (postion)(origin)
    this.floor.displayWidth = 640; //area (lebar)
    this.floor.displayHeight = 60; //area (tinggi)
    this.floor.setCollideWorldBounds(true);
    this.floor.body.immovable = true;

    this.floor2 = this.physics.add.sprite(0,318).setOrigin(0,0);// (postion)(origin)
    this.floor2.displayWidth = 120;
    this.floor2.displayHeight = 5;
    this.floor2.setCollideWorldBounds(true);
    this.floor2.body.immovable = true;

    this.floor3 = this.physics.add.sprite(640,318).setOrigin(0,0);// (postion)(origin)
    this.floor3.displayWidth = 85;
    this.floor3.displayHeight = 101;
    this.floor3.setCollideWorldBounds(true);
    this.floor3.body.immovable = true;

    //"Attack Range"

    //collider
    this.physics.add.collider(this.player,this.floor); 
    this.physics.add.collider(this.player,this.floor2);
    this.physics.add.collider(this.player,this.floor3);

    this.physics.add.collider(this.monster,this.floor);
    this.physics.add.collider(this.monster,this.floor2);
    this.physics.add.collider(this.monster,this.floor3);

    this.physics.add.collider(this.boss,this.floor); 
    this.physics.add.collider(this.boss,this.floor2);
    this.physics.add.collider(this.boss,this.floor3);

    //overlap
    this.physics.add.overlap(this.bullet,this.monster,this.enemyDead.bind(this));
    this.physics.add.overlap(this.bullet,this.boss, this.bosshit.bind(this));
    this.physics.add.overlap(this.player, this.monster, this.playerhit.bind(this));
    this.physics.add.overlap(this.player, this.boss, this.playerhit.bind(this));
    this.physics.add.overlap(this.bossbullet,this.player, this.playerhit.bind(this));

    //input cursor
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.Replay = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.Skill = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
    //animation
    this.anims.create({
      key: 'p-idle',
      frames: this.anims.generateFrameNumbers('player-idle',{start:0,end:3}),
      frameRate:10,
      repeat: -1
    });
    this.anims.create({
      key: 'p-run',
      frames: this.anims.generateFrameNumbers('player-run',{start:0,end:9}),
      frameRate:10,
      repeat: -1 
    });
    this.anims.create({
      key: 'p-shoot',
      frames: this.anims.generateFrameNumbers('player-shoot',{start:0,end:9}),
      frameRate:10,
      repeat: -1 
    });
    this.anims.create({
      key: 'p-jump',
      frames: this.anims.generateFrameNumbers('player-jump',{start:0,end:5}),
      frameRate:10,
      repeat: 0 
    });
    this.anims.create({
      key: 'p-shooti',
      frames: this.anims.generateFrameNumbers('player-shoot',{start:1, end:1}),
      frameRate:10,
      repeat:-1
    });
    this.anims.create({
      key: 'shoot',
      frames:this.anims.generateFrameNumbers('shot',{start:0,end:1}),
      frameRate:10,
      repeat:-1
    });
    this.anims.create({
      key: 'c-idle',
      frames:this.anims.generateFrameNumbers('crab-idle',{start:0,end:3}),
      frameRate:10,
      repeat:-1
    });
    this.anims.create({
      key: 'c-walk',
      frames:this.anims.generateFrameNumbers('crab-walk',{start:0,end:3}),
      frameRate:10,
      repeat:-1
    });
    this.anims.create({
      key: 'j-idle',
      frames:this.anims.generateFrameNumbers('jumper-idle',{start:0,end:3}),
      frameRate:10,
      repeat:-1
    });
    this.anims.create({
      key: 'j-jump',
      frames:this.anims.generateFrameNumbers('crab-idle',{start:0,end:0}),
      frameRate:10,
      repeat:1
    });
    this.anims.create({
      key: 'octs',
      frames:this.anims.generateFrameNumbers('octopus',{start:0,end:3}),
      frameRate:10,
      repeat:-1
    });
    this.anims.create({
      key: 'e-death',
      frames:this.anims.generateFrameNumbers('enemy-death',{start:0,end:4}),
      frameRate:10,
      repeat:0
    });
    this.scoreText = this.add.text(16,16,"SCORE: 0",{
      fontSize: '40px',
      fill:'#fff'
    });
    this.waveText = this.add.text(640-180,16,"WAVE: 1",{
      fontSize: '40px',
      fill:'#fff'
    });
    this.player.anims.play('p-idle',true);

  }

  doShoot(arah){ //physic arah bullet
    if(this.isShooting == false){
      if(arah == true){
        var peluru = this.bullet.create(this.player.x-20,this.player.y+15,'shot');
        peluru.anims.play('shoot');
        peluru.body.setVelocityX(-450);
        this.lasersound.play();
      }
      else{
        var peluru = this.bullet.create(this.player.x+10,this.player.y+15,'shot');
        peluru.anims.play('shoot');
        peluru.body.setVelocityX(450);
        this.lasersound.play();
      }
      this.isShooting = true;
      this.time.addEvent({ //set delay shoot
        delay: 300,
        callback: () =>{
          this.isShooting = false;
        }
      });
    }   
  }
  doSkill(player,arah){
    this.isCharging = false;
    if(this.isCharging == false){
      if(arah == true){
        for (var i = 0;i<5;i++){
          var peluru = this.bullet.create(this.player.x-20,this.player.y+15,'shot');
          peluru.anims.play('shoot');
          peluru.body.setVelocityX(-750);
        }
        this.player.anims.play('p-shooti',true);
        this.lasersound.play();
      }
      else{
        for (i = 0;i<5;i++){
          var peluru = this.bullet.create(this.player.x+10,this.player.y+15,'shot');
          peluru.anims.play('shoot');
          peluru.body.setVelocityX(750);
        }
        this.player.anims.play('p-shooti',true);
        this.lasersound.play();
      }
      this.isCharging = true;
      this.time.addEvent({ //set delay shoot
        delay: 4000,
        callback: () =>{
          this.isCharging = false;
        }
      });
    }
  }
  currentWave(wave){
    switch(wave){
      case 1:
        return 1;
      case 2:
        return 3;
      case 3 :
        return 6;
    }
  }
  spawnEnemy(){
    if(this.spawn != this.currentWave(this.wave) && this.wave <= 3){
      var rand = Phaser.Math.Between(0,1);
      if(rand>0){
        var crabMonster = this.monster.create(100,100,'crab-walk');
        crabMonster.anims.play('c-walk');
      }
      else{
        var crabMonster = this.monster.create(550,100,'crab-walk');
        crabMonster.anims.play('c-walk');
      }
      this.spawn++;

    }
    else if(this.spawn ==this.currentWave(this.wave) && this.monster.countActive(true)==0){
      this.wave++;
      this.waveText.text = "WAVE: "+this.wave;
      this.spawn = 0;
    }
    else if (this.wave == 4){
      this.spawnBoss();
      this.wave = 5;
    }
  }
  spawnBoss(){
    var bossMonster = this.boss.create(325,100,'octopus');
    bossMonster.anims.play('octs');
    this.minion = 0;
  }
  timeSpawn(timer){
    this.timerToActive--;
    if(this.timerToActive < 0){
      //Method spawnEnemy
      this.spawnEnemy()
      this.timerToActive = timer;
    }
  }
  enemyDead(bullet,enemy){
    bullet.destroy();
    enemy.destroy();
    this.score+=10;
    this.scoreText.text = "SCORE: "+this.score;
    var explosion = this.add.sprite(enemy.x, enemy.y).play('e-death', true);
    this.boomsound.play();
    explosion.on('animationcomplete', function() {
        explosion.destroy();
    });
    this.minion -= 1;
    this.health += 1;
    this.healthPoint.setText('Health: ' + this.health);
  }
  playerhit(player, monster) {
    this.health -= 1;
    this.healthPoint.setText('Health: ' + this.health);
    if (this.health > 0) {
      if (player.flipX == false) {
          player.x -= 30;
          monster.x += 30;

      } else {
          player.x += 30;
          monster.x -= 30;
      }
    } else {
        player.disableBody(true, true);
        this.add.sprite(player.x, player.y).play('e-death', true).on('animationcomplete', function() {
          this.destroy();
        });
        this.healthPoint.setText('You died \n press R to Replay');
    }
  }
  bosshit(bullet,boss) {
    bullet.destroy();
    this.bossHealth -= 1;
    if (this.bossHealth > 0) {
      if (boss.flipX == false) {
          boss.x -= 10;
          bullet.destroy();
      } else {
          boss.x += 30;
          bullet.destroy();
      }
    } else{
        boss.destroy();
        this.score+=50;
        this.scoreText.text = "SCORE: "+this.score;
        this.add.sprite(boss.x, boss.y).play('e-death', true).on('animationcomplete', function() {
          this.destroy();
        });
        this.boomsound.play();
    }
  }
  bossSkill(boss){
      var crabMonster1 = this.monster.create(100,100,'crab-walk');
      crabMonster1.anims.play('c-walk');

      var crabMonster2 = this.monster.create(550,100,'crab-walk');
      crabMonster2.anims.play('c-walk');
  }
  
  update(){
    //Cursor Movement Listener
    this.timeSpawn(100);
    //Running
    if(!this.player.body.touching.down){
      if(this.cursors.left.isDown){
        this.player.flipX = true;
        this.player.setVelocityX(-160);
      }
      else if(this.cursors.right.isDown){
        this.player.flipX = false;
        this.player.setVelocityX(160);
      }
      else{
        this.player.setVelocityX(0);
      }
      if(this.spaceKey.isDown)this.doShoot(this.player.flipX);
    }
    else if(this.spaceKey.isDown && this.player.body.touching.down){
      if(this.cursors.left.isDown){
        this.player.flipX = true;
        this.player.setVelocityX(-160);
        this.player.anims.play('p-shoot',true);
      }
      else if(this.cursors.right.isDown){
        this.player.flipX = false;
        this.player.setVelocityX(160); 
        this.player.anims.play('p-shoot',true);
      }
      else{
        this.player.setVelocityX(0); 
        this.player.anims.play('p-shooti',true);
      }
      this.doShoot(this.player.flipX);
    }
    else{
      if(this.cursors.left.isDown){
        this.player.flipX = true;
        this.player.setVelocityX(-160);
        this.player.anims.play('p-run',true);
      }
      else if(this.cursors.right.isDown){
        this.player.flipX = false;
        this.player.setVelocityX(160); 
        this.player.anims.play('p-run',true);
      }
      else{
        this.player.setVelocityX(0); 
        this.player.anims.play('p-idle',true);
      }
    }
    //Skill
    if(this.Skill.isDown && this.player.body.touching.down){
      if (this.isCharging == false){
        this.isCharging = true;
        this.chargesound.play();
        this.time.addEvent({ //set delay shoot
          delay: 1800,
          callback: () =>{
            this.doSkill(this.player,this.player.flipX);
          }
        });
      }
      
    }
    //Jumping
    if(this.cursors.up.isDown && this.player.body.touching.down){
      this.player.setVelocityY(-320);
      this.player.anims.play('p-jump',true);
      this.jumpsound.play();
    }
    if (this.Replay.isDown) {
      this.scene.restart();
    }
    this.monster.children.each(enemy =>{
      if(this.player.x>enemy.x){
        enemy.body.setGravityY(400);
        enemy.flipX = false;
        enemy.setVelocityX(50);
      }
      else{
        enemy.body.setGravityY(400);
        enemy.flipX = true;
        enemy.setVelocityX(-50);
      }
    });
    this.boss.children.each(enemy =>{
      enemy.body.setGravityY(400);
      if(this.bossCooldown == false && enemy.body.touching.down){
        this.bossIsCharging = true;
        if(this.minion<2){
          this.minion += 2;
          enemy.setVelocityX(0);
          this.time.addEvent({ //set delay shoot
            delay: 2000,
            callback: () =>{
              this.bossSkill(enemy);
              this.bossIsCharging = false;
              this.bossCooldown = true;
            }
          });
          this.time.addEvent({ //set delay shoot
            delay: 8000,
            callback: () =>{
              this.bossCooldown = false;
            }
          });
        }
      }
      else if (this.bossIsCharging == false){
        if(this.player.x>enemy.x){
          enemy.flipX = false;
          enemy.setVelocityX(60);
        }
        else{
          enemy.flipX = true;
          enemy.setVelocityX(-60);
        }
      }
      if (enemy.body.touching.down){
        var rand = Phaser.Math.Between(0,200);
        if(rand>198){
          enemy.setVelocityY(-320);
        }
      }
      
    });
  }
}
