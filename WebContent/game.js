var player;
var aliens;
var bullets;
var bulletTime = 0;
var cursors;
var fireButton;
var explosions;
var starfield;
var score = 0;
var scoreString = '';
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var stateText;
var livingEnemies = [];
var difficult = 0;
var tween;

var nBack = nBack || {};

nBack.game = new Phaser.Game(800, 600, Phaser.AUTO, '');

nBack.game.state.add('Preload', nBack.Preload);
nBack.game.state.add('MainMenu', nBack.MainMenu);
nBack.game.state.add('Create', nBack.Create);
nBack.game.state.start('Preload');

