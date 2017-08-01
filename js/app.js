// General game and state settings
let game = {
    over: false,
    started: false,
    overlay: document.getElementById('overlay'),
    overlay_text: document.getElementById('text'),

    // Shows the death-screen and set the game-states accordingly
    death_screen: function() {
        this.over = true;
        this.started = false;
        this.overlay.style.display = 'block';
        this.overlay_text.innerHTML = 'GAME OVER!<br><br>You have scored ' + player.score + ' time(s)<br><br><small>Click on the Screen to play again!</small>';
    },
    // Shows the start-screen and set the game-states accordingly
    start_screen: function() {
        this.over = false;
        this.started = false;
        this.overlay.style.display = 'block';
        this.overlay_text.innerHTML = 'Click on the Screen to begin playing!<br><br>Move to the water with Arrow-Keys to score!<br><br>Score as much as you can!<br><br>Avoid the bugs!!';
    },
    // Hide the overlay-screen set the game-states accordingly (we're playing!)
    hide_screen: function() {
        game.over = false;
        game.started = true;
        this.overlay.style.display = 'none';
    }
};

// Enemies our player must avoid
let Enemy = function(row = 1, name = 'Bug') {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // The width of the Enemy sprite on the playing field
    this.width = 101;
    // The starting row on the playing field
    this.row = row;
    // Horizontal starting point (off the screen)
    this.x = 0 - this.width;
    // Vertical starting point
    this.y = -23 + ((row - 1) * 83);
    // Random enemy speed
    this.speed = Math.floor(Math.random() * (10 - 1) + 1);
    // Every Bug need a name!
    this.name = name;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Check if enemy hits the player, vertical we are checking if lanes are equal,
    // horizontaly we are checking for pixel-collision
    if ( this.x + this.width >= player.x + 18 && this.x <= player.x + 85 && this.row === player.row) {
        player.catched = true;
    }

    // Move the enemy
    this.x = this.x + (this.speed * 25 * dt);

    // If the enemy moves out of the canvas set the position to the start and set a new (random) speed, multiplied by player score
    if (this.x > canvas.width) {
        this.x = 0 - this.width;
        this.speed = Math.floor(Math.random() * (10 - 1) + 1 + player.score);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

let Player = function() {
    // Player Image
    this.sprite = 'images/char-boy.png';
    // The distance, by which the players moves horizontaly with every step
    this.xstep = 101;
    // The distance, by which the players moves vertically with every step
    this.ystep = 83;
    // The starting row on the playing grid
    this.startRow = 8;
    // The starting col on the playing grid
    this.startCol = 3;
    // The numbers of lives to start the game with
    this.startLives = 3;
    // Set some starting values
    this.lives = 0;
    this.score = 0;
    this.col = this.startCol;
    this.row = this.startRow;
};

Player.prototype.update = function() {
    // Update player position
    this.x = this.xstep * (this.col - 1);
    this.y = this.ystep * (this.row - 1) - 10;

    // Check if player made it to the water, if so, we've won!
    if (this.y === -10) {
        // Increase score by 1
        this.score++;
        // Set player to starting row
        this.row = this.startRow;
        // Increase speed of all Enemies by 1 every time you score - makes the game harder the more points you score
        allEnemies.forEach(function(enemy) {
            enemy.speed++;
        });
    }

    // Check if player is catched, if so, reset to start
    if (this.catched) {
        // set player to starting row
        this.row = this.startRow;
        // set player to starting col
        this.col = this.startCol;
        // substract a player live
        this.lives--;
        // set catched to false
        this.catched = false;
        // All lives lost?
        if (this.lives === 0) {
            // Call the Death Screen
            game.death_screen();
        }
    }
};

// Reset the Player, which in effect (re)starts the game
Player.prototype.reset = function() {
    // Set player to starting row
    this.row = this.startRow;
    // Set player to starting col
    this.col = this.startCol;
    // Set score to 0
    this.score = 0;
    // Set lives to default
    this.lives = this.startLives;
    // Set catched to false (can't be catched if you've just started)
    this.catched = false;
    // Set all Enemies to start position
    allEnemies.forEach(function(enemy) {
        enemy.x = 0 - enemy.width;
    });
    // Hide the Overlay-screen - we're playing!
    game.hide_screen();
}

// Render Player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(pressedKey) {
    // No actions if game is finished or isn't started
    if (game.over || !game.started) {
        return;
    }

    if (pressedKey === 'up') {
        if (this.row > 1) {
            this.row--;
        }
    } else if (pressedKey === 'down') {
        if (this.row < canvas.height / 101) {
            this.row++;
        }
    } else if (pressedKey === 'left') {
        if (this.col > 1) {
            this.col--;
        }
    } else if (pressedKey === 'right') {
        if (this.col < canvas.width / 101) {
            this.col++;
        }
    }
};


// Instantiate Enemies
let enemy1 = new Enemy(2, 'Honkey');
let enemy2 = new Enemy(3, 'Sweety');
let enemy3 = new Enemy(4, 'Bugzilla');
let enemy4 = new Enemy(6, 'Donkey');
let enemy5 = new Enemy(7, 'Monkey');

// Place all enemy objects in an array called allEnemies
let allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5];
// Place the player object in a variable called player
let player = new Player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// This listens for a mouse-click, and resets the game
// if it hasn't started or is finished
document.addEventListener('click', function() {
    if (game.over || !game.started) {
        player.reset();
    }
});

