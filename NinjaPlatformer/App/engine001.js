//DISPLAY
var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');

//Buffer canvas
var buffer = document.createElement('canvas');
var bctx = buffer.getContext('2d');

var display = {
    resize: function(){
        buffer.width = window.innerWidth -20;
        buffer.height = window.innerHeight - 40;
        canvas.width = window.innerWidth -20;
        canvas.height = window.innerHeight - 40;
    },

    render: function() {
        ctx.drawImage(buffer, 0, 0);
    },

    // Executes every frame
    frame: function(){
        game.world.loadWorld();
        controller.movement.movePlayer();
        game.player.draw();     
        display.render();     
    },
}
setInterval(display.frame, 1000/100);   
// Event listeners
window.addEventListener('load', display.resize());
window.addEventListener('resize', function(){display.resize()});
window.addEventListener('keydown', function(){controller.movement.move(event)})
window.addEventListener('keyup', function(){controller.movement.stopMove(event)})

var controller = {
    movement: {

        jumpState: false,

        keyStates: {
            left: 0,
            right: 0,
            up: 0
        },

        move: function(e){
            switch (e.keyCode) {
                case 65:
                case 37:
                    controller.movement.keyStates.left = 1;
                    break;
                case 68:
                case 39:
                    controller.movement.keyStates.right = 1;
                    break;
                case 87:
                case 38:
                case 32:
                    controller.movement.keyStates.up = 1;
                    controller.movement.jump();
                    break;
            }
        },

        stopMove: function(e){
            switch (e.keyCode) {
                case 65:
                case 37:
                    controller.movement.keyStates.left = 0;
                    break;
                case 68:
                case 39:
                    controller.movement.keyStates.right = 0;
                    break;
                case 87:
                case 38:
                    controller.movement.keyStates.up = 0;
                    break;
            }
        },

        jump: function(){
            if(controller.movement.jumpState === false){
                controller.movement.jumpState = true;
                game.player.loc.y -= 10;
                game.player.vel.y = -5;
                engine.collision.onPlatform = false;
            }
            
        },

        strafe: function(dir){
            
            switch (dir) {
                case 0:
                    game.player.vel.x -= game.player.acceleration;
                    if(-game.player.vel.x > game.player.maxSpeed){
                        game.player.vel.x = -3;
                    }
                    break;
            
                case 1:
                    game.player.vel.x += game.player.acceleration;
                    if(game.player.vel.x > game.player.maxSpeed){
                        game.player.vel.x = game.player.maxSpeed;
                    }
                    break;
            }
        },

        movePlayer: function(){
            var increment = 0;
            var increment1 = 0;
            if(controller.movement.keyStates.left === 1){ // Accelerates the player
                controller.movement.strafe(0);
            }if(controller.movement.keyStates.left === 0){ // Decelerates the player
                if(game.player.vel.x < 0){
                    var times = Math.floor(game.player.vel.x/ -game.player.deceleration);
                    if(increment1 === times){
                        game.player.vel.x = 0;
                    }
                    if(game.player.vel.x < 0){
                        game.player.vel.x += game.player.deceleration;
                        increment1++;
                    }
                }
            }
            if(controller.movement.keyStates.right === 1){ // Accelerates the player
                controller.movement.strafe(1);
            }if(controller.movement.keyStates.right === 0){ // Decelerates the player
                if(game.player.vel.x > 0){
                    var times = Math.floor(game.player.vel.x/game.player.deceleration);
                    if(increment === times){
                        game.player.vel.x = 0;
                    }
                    if(game.player.vel.x > 0){
                        game.player.vel.x -= game.player.deceleration;
                        increment++;
                    }
                }
            }
        }
    }
}

var game = {

    gamemode: {
        level: 1,
        
        playerSpawn: {x: 0, y: 0},
        goal: {x: 0, y: 0, x2: 0, y2: 0},

        startGame: function(){
            game.player.loc.x = game.gamemode.playerSpawn.x;
            game.player.loc.y = game.gamemode.playerSpawn.y;
            console.log(game.gamemode.playerSpawn.y);
            
        },

        restart: function(){
            game.player.loc.x = game.gamemode.playerSpawn.x;
            game.player.loc.y = game.gamemode.playerSpawn.y;
        },

        newLevel: false,

        nextLevel: function(){
            if(game.gamemode.newLevel === false){
                game.gamemode.level++;
                game.gamemode.newLevel = true;
                game.world.added = false;
                game.gamemode.startGame();
                setTimeout(function(){game.gamemode.newLevel = false;}, 1000)
            }
        }

    },

    world: {
        columns: 20,
        rows: 20,

        currentMap: [],

        maps: [
            [   // Test Map
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,
                2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
            ],

            [   // Level 1
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,
                2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0
            ],
        ],

        added: false,

    loadWorld: function(){
        var x = 0;
        var y = 0;
        var i = 0;
        var blockWidth = canvas.width/20;
        var blockHeight = canvas.height/20;
    
        game.world.currentMap = game.world.maps[game.gamemode.level];



        game.world.currentMap.forEach(e => {
            i++;
            switch (e) {
                case 0:
                    bctx.fillStyle = "#167EAB";
                    bctx.fillRect(x, y, blockWidth, blockHeight);
                    x+= blockWidth;
                    if(game.world.added === false){
                        engine.collision.trianglesx.push(x - blockWidth);
                        engine.collision.trianglesx2.push(x);
                        engine.collision.trianglesy.push(y);
                        game.world.increment = true;
                    }
                    break;
                case 1:
                    bctx.fillStyle = "#AB0032";
                    bctx.fillRect(x, y, blockWidth, blockHeight);
                    x+= blockWidth;
                    if(game.world.added === false){
                        engine.collision.trianglesx.push(x - blockWidth);
                        engine.collision.trianglesx2.push(x);
                        engine.collision.trianglesy.push(y);
                        game.world.increment = true;
                    }             
                    break;

                case 2:
                    game.gamemode.playerSpawn.x = x + blockWidth/2 - 12.5;
                    game.gamemode.playerSpawn.y = y;
                    bctx.fillStyle = "#73AB60";
                    bctx.fillRect(x, y, blockWidth, blockHeight);
                    x+= blockWidth;
                    if(game.world.added === false){
                        engine.collision.trianglesx.push(x - blockWidth);
                        engine.collision.trianglesx2.push(x);
                        engine.collision.trianglesy.push(y);
                        game.gamemode.startGame();
                        game.world.increment = true;
                    }                               
                    break;
                case 3:
                    game.gamemode.goal.x = x; 
                    game.gamemode.goal.y = y;  
                    game.gamemode.goal.x2 = x + blockWidth;
                    game.gamemode.goal.y2= y + blockHeight; 
                    bctx.fillStyle = "#000000";
                    bctx.fillRect(x, y, blockWidth, blockHeight);
                    x+= blockWidth;
                    if(game.world.added === false){
                        engine.collision.trianglesx.push(x - blockWidth);
                        engine.collision.trianglesx2.push(x);
                        engine.collision.trianglesy.push(y);
                        game.world.increment = true;
                    }              
                    break;
            }
            if(i === 20){
                i = 0;
                x = 0;
                y += blockHeight;
            }
        });
        game.world.added = true;
    },
},

    player: {
        loc: {x:200, y: 0},
        vel: {x: 0, y: 0},
        maxSpeed: 4,
        acceleration: .06,
        deceleration: .08,

        draw: function(){
            game.player.loc.x += game.player.vel.x;
            game.player.loc.y += game.player.vel.y;
            bctx.fillStyle = "#AA6AAB"
            bctx.fillRect(game.player.loc.x,game.player.loc.y, 25, 25);
        }
    }
    
}

var engine = {

    commands: {
        startEngine: function(){
            setInterval(engine.physics.gravity.applyGravity, 1000/100);
            setInterval(engine.collision.checkCollision, 1000/999);

        }
    },

    physics: {

        gravity: {
            force: .07,

            applyGravity: function(){
                if(engine.collision.onPlatform === false){
                    game.player.vel.y += engine.physics.gravity.force;
                }

            }
        }
        
    },

    collision: {

        onPlatform: false,
        trianglesx: [],
        trianglesx2: [],
        trianglesy: [],

        showCollision: false,

        between:function between(x, min, max) {
            return x >= min && x <= max;
          },

        checkCollision: function(){
            
            for (let index = 0; index < engine.collision.trianglesx.length; index++) {
                if(engine.collision.between(game.player.loc.y + 25, engine.collision.trianglesy[index]-10, engine.collision.trianglesy[index]+10) && game.player.loc.y > 3){
                    if (game.player.loc.x> engine.collision.trianglesx[index] && game.player.loc.x< engine.collision.trianglesx2[index] || game.player.loc.x + 25 > engine.collision.trianglesx[index] && game.player.loc.x + 25 < engine.collision.trianglesx2[index]) {
                        engine.collision.onHit(game.world.currentMap[index]);     
                    }
                    if(engine.collision.showCollision === true) {  // Show collision if show collision is on
                        bctx.fillStyle = "#000000"
                        bctx.fillRect(engine.collision.trianglesx[index] , engine.collision.trianglesy[index], 10,10);    
                        bctx.fillStyle = "#000000"
                        bctx.fillRect(engine.collision.trianglesx2[index] , engine.collision.trianglesy[index], 10,10);   
                    }
                                
                }else{
                    engine.collision.onPlatform = false;
                }
            }
        },

        onHit: function(block){            
            switch (block) {
                case 1: // Normal block
                    game.player.vel.y = 0;
                    controller.movement.jumpState = false;
                    engine.collision.onPlatform = true;
                    break;

                case 2: // Player start

                    break;

                case 3: // Goal
                        game.gamemode.nextLevel();
                    break;
            }
        },
    },
}

engine.commands.startEngine();