/* var this.game = new Phaser.this.game(800, 600, Phaser.AUTO, 'phaser-example', 
		{ 
			preload: preload, 
			create: create, 
			update: update, 
			render: render 
		});
*/


var nBack = nBack || {};
nBack.Create = function() {};

nBack.Create.prototype = {
	create: function () {
	
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

	    //  The scrolling starfield background
	    starfield = this.game.add.tileSprite(0, 0, 800, 600, 'starfield');

	    //  Our bullet group
	    bullets = this.game.add.group();
	    bullets.enableBody = true;
	    bullets.physicsBodyType = Phaser.Physics.ARCADE;
	    bullets.createMultiple(30, 'bullet');
	    bullets.setAll('anchor.x', 0.5);
	    bullets.setAll('anchor.y', 1);
	    bullets.setAll('outOfBoundsKill', true);
	    bullets.setAll('checkWorldBounds', true);

	    // The enemy's bullets
	    enemyBullets = this.game.add.group();
	    enemyBullets.enableBody = true;
	    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
	    enemyBullets.createMultiple(30, 'enemyBullet');
	    enemyBullets.setAll('anchor.x', 0.5);
	    enemyBullets.setAll('anchor.y', 1);
	    enemyBullets.setAll('outOfBoundsKill', true);
	    enemyBullets.setAll('checkWorldBounds', true);

	    //  The hero!
	    player = this.game.add.sprite(400, 500, 'ship');
	    player.anchor.setTo(0.5, 0.5);
	    this.game.physics.enable(player, Phaser.Physics.ARCADE);

	    //  The baddies!
	    aliens = this.game.add.group();
	    aliens.enableBody = true;
	    aliens.physicsBodyType = Phaser.Physics.ARCADE;

	    createAliens();

	    //  The score
	    scoreString = 'Score : ';
	    scoreText = this.game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

	    //  Lives
	    lives = this.game.add.group();
	    this.game.add.text(this.game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

	    //  Text
	    stateText = this.game.add.text(this.game.world.centerX,this.game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
	    stateText.anchor.setTo(0.5, 0.5);
	    stateText.visible = false;

	    for (var i = 0; i < 3; i++) 
	    {
	        var ship = lives.create(this.game.world.width - 100 + (30 * i), 60, 'ship');
	        ship.anchor.setTo(0.5, 0.5);
	        ship.angle = 90;
	        ship.alpha = 0.4;
	    }

	    //  An explosion pool
	    explosions = this.game.add.group();
	    explosions.createMultiple(30, 'kaboom');
	    explosions.forEach(setupInvader, this);

	    //  And some controls to play the this.game with
	    cursors = this.game.input.keyboard.createCursorKeys();
	    fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
	},
	update: function() {
	
	//  Scroll the background
	    starfield.tilePosition.y += 2;

	    if (player.alive)
	    {
	        //  Reset the player, then check for movement keys
	        player.body.velocity.setTo(0, 0);

	        if (cursors.left.isDown)
	        {
	            player.body.velocity.x = -200;
	        }
	        else if (cursors.right.isDown)
	        {
	            player.body.velocity.x = 200;
	        }

	        //  Firing?
	        if (fireButton.isDown)
	        {
	            fireBullet();
	        }

	        if (this.game.time.now > firingTimer)
	        {
	            enemyFires();
	        }

	        //  Run collision
	        this.game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
	        this.game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
	    }		
	}		
}

function setupInvader (invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');

}

function descend() {	
	
	if (aliens.countLiving() < 20 && aliens.countLiving() > 10){
		
		aliens.y += 15;
			
	} else {
		
		aliens.y += 10;
		
	}
}

function render() {

    // for (var i = 0; i < aliens.length; i++)
    // {
    //     this.game.debug.body(aliens.children[i]);
    // }

}

function collisionHandler (bullet, alien) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemyBullets.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        this.game.input.onTap.addOnce(restart,this);
    }
    
    if (aliens.countLiving() < 20 && aliens.countLiving() > 10){
		
		tween.updateTweenData("duration", 2000);
		
	} else  if (aliens.countLiving() < 10) {
		
		tween.updateTweenData("duration", 500);
		
	}

}

function createAliens () {

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = aliens.create(x * 48, y * 50, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
            alien.body.moves = false;
        }
    }

    aliens.x = 50;
    aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    tween = nBack.game.add.tween(aliens).to( { x: 300 }, 4000, Phaser.Easing.Linear.None, true, 0, -1, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(descend, this);
}

function enemyHitsPlayer (player,bullet) {
    
    bullet.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemyBullets.callAll('kill');

        stateText.text=" this.game OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        this.game.input.onTap.addOnce(restart,this);
    }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
        
        var random = nBack.game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        nBack.game.physics.arcade.moveToObject(enemyBullet,player,120);
        firingTimer = nBack.game.time.now + 2000;
        
        if (livingEnemies.length < 30 && livingEnemies.length > 0) {
        
        	random = nBack.game.rnd.integerInRange(0,livingEnemies.length-1);
        	shooter2 = livingEnemies[random];
            // And fire the bullet from this enemy
            enemyBullet.reset(shooter2.body.x, shooter2.body.y);

            nBack.game.physics.arcade.moveToObject(enemyBullet,player,360);
            firingTimer = nBack.game.time.now + 500;        	
        }        
    }
}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (nBack.game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = nBack.game.time.now + 200;
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //  A new level starts
    
    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;

}