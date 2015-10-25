var nBack = nBack || {};

nBack.MainMenu = function() {};

nBack.MainMenu.prototype = {
    create: function() {
        this.game.stage.backgroundColor = '#707070';
        starfield = this.game.add.tileSprite(0, 0, 800, 600, 'starfield');
        this.game.add.text(325,200, 'This is a game menu', {font:'14px Arial', fill: '#fff'});
                
        var startbtn = this.game.add.button(200,250, 'startbtn', this.startGame, this);        
        
    },
    update: function() {
        
    },
    startGame: function() {
    	this.state.start('Create');
    }
}