const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {

    console.log('The bot is ready.');

    client.user.setStatus('available')
    client.user.setPresence({
        game: {
            name: "minigames | !help",
            type: "STREAMING",
            url: "https://www.twitch.tv/"
        }
    });



});

var bsGames = {}; // games for battleship
var bjGames = {}; // games for blackjack
var rpsGames = {}; // games for rock, paper, scissors
var warGames = {}; // games for war

client.on('message', message => {
    var sender = '<@!' + message.author.id + '>';

    if (message.content === 'test') {
        message.delete(1);
        message.channel.send("Working!");
    }

		// !help
		//___________________________________________________________
		if (message.content == "!help") {
			message.channel.send(generateEmbed("Help", "This will have all of the commands and stuff."));
		}

		// battleship
    //___________________________________________________________

		if (message.content === '!bs' && !bsGames.hasOwnProperty(message.author.id)) {
        bsGames[message.author.id] = {
          started: true,
					inGame: false
        };

        message.channel.send(generateEmbed("Battleship", 'Opening a game of battleship with ' + sender + '... \n \n Use `new board` to generate your board and proceed.')).then((msg) => {
            bsGames[message.author.id].editable = msg;
        })

        message.delete(1);
    } else {
        if (message.content === '!bs' && bsGames.hasOwnProperty(message.author.id)) {
            message.channel.send("You're already in a game of battleship! Use `!bs stop` to stop playing.");
						message.delete(1);
        }
    }
	
	
		// if game opened
		if (bsGames.hasOwnProperty(message.author.id)) {
			// !bs stop
      if (message.content === "!bs stop") {
				message.delete(1);

        delete bsGames[message.author.id];
        message.channel.send("Your game has now stopped. Thank you for playing, " + sender + "!");
      } else {
				// new board
				if (message.content === "new board" && !bsGames[message.author.id].inGame) {
					message.delete(1);
					var color = ":blue_square:";
					bsGames[message.author.id].color = color;
	
					function newBoard(){
						return [
							[":blue_square:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:", "\n"],
							[":regional_indicator_a:", color, color, color, color, color, color, color, color, color, color, "\n"],
							[":regional_indicator_b:", color, color, color, color, color, color, color, color, color, color, "\n"],
							[":regional_indicator_c:", color, color, color, color, color, color, color, color, color, color, "\n"],
							[":regional_indicator_d:", color, color, color, color, color, color, color, color, color, color, "\n"],
							[":regional_indicator_e:", color, color, color, color, color, color, color, color, color, color, "\n"],
							[":regional_indicator_f:", color, color, color, color, color, color, color, color, color, color, "\n"],
							[":regional_indicator_g:", color, color, color, color, color, color, color, color, color, color, "\n"],
							[":regional_indicator_h:", color, color, color, color, color, color, color, color, color, color, "\n"],
							[":regional_indicator_i:", color, color, color, color, color, color, color, color, color, color, "\n"],
							[":regional_indicator_j:", color, color, color, color, color, color, color, color, color, color]
						];
					}
	
					bsGames[message.author.id].playerBoard = newBoard();
					bsGames[message.author.id].playerShips = [];
	
					bsGames[message.author.id].botPreview = newBoard();
					bsGames[message.author.id].botBoard = newBoard();
					bsGames[message.author.id].botShips = [];
					bsGames[message.author.id].botKnowledge = {
						hits: {
							standing:{},
							sunken: {}
						},

						misses: []
					}
	
					function shufflePlayerBoard(){
							bsGames[message.author.id].playerBoard = newBoard();
							bsGames[message.author.id].playerShips = [];
	
							var ships = [5, 4, 3, 3, 2]; // lengths of ships
	
							// player board
							for(var i = 0; i < ships.length; i++){
								var shipCoords = [];
								shipCoords[0] = Math.floor(Math.random() * (bsGames[message.author.id].playerBoard.length - 1) + 1); // picks row
								shipCoords[1] = Math.floor(Math.random() * ((bsGames[message.author.id].playerBoard[1].length - 1) - 1) + 1); // picks column
	
								bsGames[message.author.id].playerShips[i] = {
									length: ships[i],
									coords: [],
									hits: [],
									color: color
								};
						
								// gets hit array
								for(var j = 0; j < ships[i]; j++){
									bsGames[message.author.id].playerShips[i].hits.push(false);
								}
						
								// right
								var right = true;
						
								// detects if ship can be placed to right
								for(var j = 0; j < ships[i]; j++){
									if(bsGames[message.author.id].playerBoard[shipCoords[0]][shipCoords[1] + j] != color){
										right = false;
										break;
									}
								}
						
								// places ship if possible
								if(right){
									for(var j = 0; j < ships[i]; j++){
										bsGames[message.author.id].playerBoard[shipCoords[0]][shipCoords[1] + j] = ":fast_forward:";
										bsGames[message.author.id].playerShips[i].coords.push([shipCoords[0], shipCoords[1] + j]);
									}
									bsGames[message.author.id].playerShips[i].direction = "right";
									continue;
								}
						
								// up
								var up = true;
						
								// detects if ship can be placed upwards
								for(var j = 0; j < ships[i]; j++){
									if(bsGames[message.author.id].playerBoard[shipCoords[0] - j][shipCoords[1]] != color){
										up = false;
										break;
									}
								}
						
								// places ship if possible
								if(up){
									for(var j = 0; j < ships[i]; j++){
										bsGames[message.author.id].playerBoard[shipCoords[0] - j][shipCoords[1]] = ":arrow_double_up:";
										bsGames[message.author.id].playerShips[i].coords.push([shipCoords[0] - j, shipCoords[1]]);
									}
									bsGames[message.author.id].playerShips[i].direction = "up";
									continue;
								}
						
								// left
								var left = true;
						
								// detects if ship can be placed to the left
								for(var j = 0; j < ships[i]; j++){
									if(bsGames[message.author.id].playerBoard[shipCoords[0]][shipCoords[1] - j] != color){
										left = false;
										break;
									}
								}
						
								// places ship if possible
								if(left){
									for(var j = 0; j < ships[i]; j++){
										bsGames[message.author.id].playerBoard[shipCoords[0]][shipCoords[1] - j] = ":rewind:";
										bsGames[message.author.id].playerShips[i].coords.push([shipCoords[0], shipCoords[1] - j]);
									}
									bsGames[message.author.id].playerShips[i].direction = "left";
									continue;
								}
						
								var down = true;
						
								for(var j = 0; j < ships[i]; j++){
									if(bsGames[message.author.id].playerBoard[shipCoords[0] + j][shipCoords[1]] != color){
										down = false;
										break;
									}
								}
						
								if(down){
									for(var j = 0; j < ships[i]; j++){
										bsGames[message.author.id].playerBoard[shipCoords[0] + j][shipCoords[1]] = ":arrow_double_down:";
										bsGames[message.author.id].playerShips[i].coords.push([shipCoords[0] + j, shipCoords[1]]);
									}
									bsGames[message.author.id].playerShips[i].direction = "down";
									continue;
								}
						
								// if there are no positions for the coordinates, it will generate new coordinates
								if(!up && !down && !left && !right){
									i--;
									continue;
								}
						
							}
						}
					
					function shuffleBotBoard(){
							bsGames[message.author.id].botBoard = newBoard();
							bsGames[message.author.id].botShips = [];
						
							var ships = [5, 4, 3, 3, 2]; // lengths of ships
						
							// bot board
							for(var i = 0; i < ships.length; i++){
								var shipCoords = [];
								shipCoords[0] = Math.floor(Math.random() * (bsGames[message.author.id].botBoard.length - 1) + 1); // picks row
								shipCoords[1] = Math.floor(Math.random() * ((bsGames[message.author.id].botBoard[1].length - 1) - 1) + 1); // picks column
						
								bsGames[message.author.id].botShips[i] = {
									length: ships[i],
									coords: [],
									hits: []
								};
						
								// gets hit array
								for(var j = 0; j < ships[i]; j++){
									bsGames[message.author.id].botShips[i].hits.push(false);
								}
						
								// right
								var right = true;
						
								// detects if ship can be placed to right
								for(var j = 0; j < ships[i]; j++){
									if(bsGames[message.author.id].botBoard[shipCoords[0]][shipCoords[1] + j] != color){
										right = false;
										break;
									}
								}
						
								// places ship if possible
								if(right){
									for(var j = 0; j < ships[i]; j++){
										bsGames[message.author.id].botBoard[shipCoords[0]][shipCoords[1] + j] = ":fast_forward:";
										bsGames[message.author.id].botShips[i].coords.push([shipCoords[0], shipCoords[1] + j]);
									}
									bsGames[message.author.id].botShips[i].direction = "right";
									continue;
								}
						
								// up
								var up = true;
						
								// detects if ship can be placed upwards
								for(var j = 0; j < ships[i]; j++){
									if(bsGames[message.author.id].botBoard[shipCoords[0] - j][shipCoords[1]] != color){
										up = false;
										break;
									}
								}
						
								// places ship if possible
								if(up){
									for(var j = 0; j < ships[i]; j++){
										bsGames[message.author.id].botBoard[shipCoords[0] - j][shipCoords[1]] = ":arrow_double_up:";
										bsGames[message.author.id].botShips[i].coords.push([shipCoords[0] - j, shipCoords[1]]);
									}
									bsGames[message.author.id].botShips[i].direction = "up";
									continue;
								}
						
								// left
								var left = true;
						
								// detects if ship can be placed to the left
								for(var j = 0; j < ships[i]; j++){
									if(bsGames[message.author.id].botBoard[shipCoords[0]][shipCoords[1] - j] != color){
										left = false;
										break;
									}
								}
						
								// places ship if possible
								if(left){
									for(var j = 0; j < ships[i]; j++){
										bsGames[message.author.id].botBoard[shipCoords[0]][shipCoords[1] - j] = ":rewind:";
										bsGames[message.author.id].botShips[i].coords.push([shipCoords[0], shipCoords[1] - j]);
									}
									bsGames[message.author.id].botShips[i].direction = "left";
									continue;
								}
						
								var down = true;
						
								for(var j = 0; j < ships[i]; j++){
									if(bsGames[message.author.id].botBoard[shipCoords[0] + j][shipCoords[1]] != color){
										down = false;
										break;
									}
								}
						
								if(down){
									for(var j = 0; j < ships[i]; j++){
										bsGames[message.author.id].botBoard[shipCoords[0] + j][shipCoords[1]] = ":arrow_double_down:";
										bsGames[message.author.id].botShips[i].coords.push([shipCoords[0] + j, shipCoords[1]]);
									}
									bsGames[message.author.id].botShips[i].direction = "down";
									continue;
								}
						
								// if there are no positions for the coordinates, it will generate new coordinates
								if(!up && !down && !left && !right){
									i--;
									continue;
								}
						
							}
						}
	
					shufflePlayerBoard();
					shuffleBotBoard();
	
					bsGames[message.author.id].editable.edit(generateEmbed("Battleship", "You are given a new board: \n \n" + stringifyArray(bsGames[message.author.id].playerBoard) + "\n \n Use `new board` to generate another board, or use `start` to start the game."));
	      }
	
				// start
				if (message.content === "start" && !bsGames[message.author.id].inGame) {
					message.delete(1);
		
					bsGames[message.author.id].inGame = true;
					bsGames[message.author.id].turn = "player";
					bsGames[message.author.id].editable.edit(generateEmbed("Battleship", "The game has now started. Use `(number)(letter)` to attack your enemy. For example, `1a` will attack the position 1a on the enemy map. \n \n Preview of my board: \n \n " + stringifyArray(bsGames[message.author.id].botPreview)));
				}
	
				// if game started
				if(bsGames[message.author.id].inGame){
	
					// (number)(letter)
					if ((message.content.length == 2 || message.content.length == 3) && bsGames[message.author.id].turn == "player") {
						message.delete(1);

						var coordinates = ["", ""];
						var numbers = "1234567890";
						var letters = "abcdefghij"
	
						for(var i = 0; i < message.content.length; i++){
							if(numbers.includes(message.content[i])){
								coordinates[0] += message.content[i];
							} else {
								coordinates[1] += message.content[i].toLowerCase();
							}
						}
	
						coordinates[0] = parseInt(coordinates[0], 10);
						
						var invalid = coordinates[0] > 10 || !letters.includes(coordinates[1]) || coordinates[1].length > 1;
	
						var output = (!invalid) ? `You fire at the coordinates ${coordinates[0]}, ${coordinates[1]}` : `The coordinates ${coordinates[0]}, ${coordinates[1]}  are invalid.` +  "\n \n Try again by using `(number)(letter)` to attack your enemy. For example, `1a` will attack the position 1a on the enemy map.";

						if(!invalid){
							attackCoordinates(bsGames[message.author.id].botBoard, coordinates);
						}

						function attackCoordinates(board, coordinates){
							var simpleCoords = coordinates;
							var letters = "abcdefghij";
							var numbers = "123456789";
						
							// turns letter, number or number, letter notation into number, number notation
							if((simpleCoords + "").length == 4){
								// contains 10
								if(numbers.includes((simpleCoords[0] + "")[0])){
						
									// starts with number
									simpleCoords = [10, letters.indexOf(simpleCoords[1].toLowerCase()) + 1];
								} else {
						
									// starts with letter
									simpleCoords = [10, letters.indexOf(simpleCoords[0].toLowerCase()) + 1];
								}
							} else {
								// doesn't contain 10
								if(numbers.includes(simpleCoords[0])){
						
									// starts with number
									simpleCoords = [simpleCoords[0], letters.indexOf(simpleCoords[1].toLowerCase()) + 1];
								} else {
						
									// starts with letter
									simpleCoords = [simpleCoords[1], letters.indexOf(simpleCoords[0].toLowerCase()) + 1];
								}
							}
							
							var aimedShip = -1;
							var aimedShipPoint = -1;
							if(board == bsGames[message.author.id].playerBoard){
									for(var i = 0; i < bsGames[message.author.id].playerShips.length; i++){
										if((bsGames[message.author.id].playerShips[i].coords + "").includes(simpleCoords)){
											aimedShip = bsGames[message.author.id].playerShips[i];
											aimedShipPoint = (bsGames[message.author.id].playerShips[i].coords + "").indexOf(simpleCoords)
											break;
										}
									}
								} else {
									for(var i = 0; i < bsGames[message.author.id].botShips.length; i++){
										if((bsGames[message.author.id].botShips[i].coords + "").includes(simpleCoords)){
											aimedShip = bsGames[message.author.id].botShips[i];
											aimedShipPoint = (bsGames[message.author.id].botShips[i].coords + "").indexOf(simpleCoords)
											break;
										}
									}
								}
						
							if(board[simpleCoords[1]][simpleCoords[0]] == bsGames[message.author.id].color){
								// miss
								if(board == bsGames[message.author.id].botBoard){
									bsGames[message.author.id].botPreview[simpleCoords[1]][simpleCoords[0]] = ":x:";
								}
								
								board[simpleCoords[1]][simpleCoords[0]] = ":x:";
								output += " and miss."
							} else if(board[simpleCoords[1]][simpleCoords[0]] == ":x:" ||  board[simpleCoords[1]][simpleCoords[0]] == ":white_check_mark:"){
								// hit there already
								output = "You can't fire there because you already did before!";
							} else {
								// hit
								if(board == bsGames[message.author.id].botBoard){
									bsGames[message.author.id].botPreview[simpleCoords[1]][simpleCoords[0]] = ":white_check_mark:";
								}
								
								board[simpleCoords[1]][simpleCoords[0]] = ":white_check_mark:";
						
								output += " and hit!";
							}

							if(output != "You can't fire there because you already did before!"){
								bsGames[message.author.id].turn = "bot";
								output += "\n \n Preview of my board (remember, :x: means miss and :white_check_mark: means hit): \n \n" + stringifyArray(bsGames[message.author.id].botPreview) + "\n \n Type `ok` to continue.";
							} else {
								output += "\n \n Try again by using `(number)(letter)` to attack your enemy. For example, `1a` will attack the position 1a on the enemy map."
							}
						}

						bsGames[message.author.id].editable.edit(generateEmbed("Battleship", output));

					}

					// ok
					if (message.content == "ok" && bsGames[message.author.id].turn == "bot") {
						console.log(bsGames[message.author.id].playerShips[0].coords);
						message.delete(1);

						var letters = "abcdefghij";
						var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
						var coordinates = [(Math.floor(Math.random() * Math.floor(10)) + 1), letters[Math.floor(Math.random() * Math.floor(letters.length))]];

						if(Object.keys(bsGames[message.author.id].botKnowledge.hits).length == 0){
							while(bsGames[message.author.id].botKnowledge.misses.includes(coordinates)){
								coordinates = [(Math.floor(Math.random() * Math.floor(10)) + 1), letters[Math.floor(Math.random() * Math.floor(letters.length))]];
							}
						} else if(bsGames[message.author.id].botKnowledge.hits[Object.keys(bsGames[message.author.id].botKnowledge.hits).length - 1].nextFound == false){
							var hitShip = bsGames[message.author.id].botKnowledge.hits[Object.keys(bsGames[message.author.id].botKnowledge.hits).length - 1;

							var i = 0;
							while(bsGames[message.author.id].botKnowledge.misses.includes(coordinates)){
								var directionNumber = Math.floor(Math.random() * Math.floor(1)) == 0 ? 1: -1;
								var directionLetter = Math.floor(Math.random() * Math.floor(1)) == 0 ? 1: -1;

								coordinates = [hitShip.split(",")[0] + directionNumber, letters[hitShip.split(",")[1] + directionLetter]];
								i++;
								
								if(i > 5) break;
							}
							
							bsGames[message.author.id].botKnowledge.hits[hitShip].nextFound = true;
						} else {
							while(bsGames[message.author.id].botKnowledge.misses.includes(coordinates)){
								coordinates = [(Math.floor(Math.random() * Math.floor(10)) + 1), letters[Math.floor(Math.random() * Math.floor(letters.length))]];
							}
						}

						var output = `I fire at the coordinates ${coordinates[0]}, ${coordinates[1]}`;
						attackCoordinates(bsGames[message.author.id].playerBoard, coordinates);

						function attackCoordinates(board, coordinates){
							var simpleCoords = coordinates;
							var letters = "abcdefghij";
							var numbers = "123456789";

							// turns letter, number or number, letter notation into number, number notation
							if((simpleCoords + "").length == 4){
								// contains 10
								if(numbers.includes((simpleCoords[0] + "")[0])){

									// starts with number
									simpleCoords = [10, letters.indexOf(simpleCoords[1].toLowerCase()) + 1];
								} else {

									// starts with letter
									simpleCoords = [10, letters.indexOf(simpleCoords[0].toLowerCase()) + 1];
								}
							} else {
								// doesn't contain 10
								if(numbers.includes(simpleCoords[0])){
						
									// starts with number
									simpleCoords = [simpleCoords[0], letters.indexOf(simpleCoords[1].toLowerCase()) + 1];
								} else {
						
									// starts with letter
									simpleCoords = [simpleCoords[1], letters.indexOf(simpleCoords[0].toLowerCase()) + 1];
								}
							}
							
							var aimedShip = -1;
							var aimedShipPoint = -1;
							if(board == bsGames[message.author.id].playerBoard){
									for(var i = 0; i < bsGames[message.author.id].playerShips.length; i++){
										if((bsGames[message.author.id].playerShips[i].coords + "").includes(simpleCoords)){
											aimedShip = bsGames[message.author.id].playerShips[i];
											aimedShipPoint = (bsGames[message.author.id].playerShips[i].coords + "").indexOf(simpleCoords);
											break;
										}
									}
								} else {
									for(var i = 0; i < bsGames[message.author.id].botShips.length; i++){
										if((bsGames[message.author.id].botShips[i].coords + "").includes(simpleCoords)){
											aimedShip = bsGames[message.author.id].botShips[i];
											aimedShipPoint = (bsGames[message.author.id].botShips[i].coords + "").indexOf(simpleCoords);
											break;
										}
									}
								}
						
							if(board[simpleCoords[1]][simpleCoords[0]] == bsGames[message.author.id].color){
								// miss
								board[simpleCoords[1]][simpleCoords[0]] = ":x:";
								bsGames[message.author.id].botKnowledge.misses.push(coordinates);
								output += " and miss."
							} else if(board[simpleCoords[1]][simpleCoords[0]] == ":x:" ||  board[simpleCoords[1]][simpleCoords[0]] == ":white_check_mark:"){
								// hit there already
								output = "You can't fire there because you already did before!";
							} else {
								// hit
								board[simpleCoords[1]][simpleCoords[0]] = ":white_check_mark:";
								bsGames[message.author.id].botKnowledge.hits[coordinates.toString()] = {nextFound: false};
								output += " and hit!";
							}

							if(output != "You can't fire there because you already did before!"){
								bsGames[message.author.id].turn = "player";
								output += "\n \n Your board: (remember, :x: means miss and :white_check_mark: means hit): \n \n" + stringifyArray(bsGames[message.author.id].playerBoard) + "\n \n Use `(number)(letter)` to attack your enemy. For example, `1a` will attack the position 1a on the enemy map.";
							} else {
								output += "\n \n Try again by using `(number)(letter)` to attack your enemy. For example, `1a` will attack the position 1a on the enemy map.";
							}
						}

						bsGames[message.author.id].editable.edit(generateEmbed("Battleship", output));
					}
				}
			}
		}

    // blackjack
    //___________________________________________________________

    // starts game

    if (message.content === '!bj' && !bjGames.hasOwnProperty(message.author.id)) {
        bjGames[message.author.id] = {
            started: true
        };

				// deck
				bjGames[message.author.id].deck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

				// deals cards
				bjGames[message.author.id].playerCards = [bjGames[message.author.id].deck.splice(Math.floor(Math.random() * Math.floor(13)), 1), bjGames[message.author.id].deck.splice(Math.floor(Math.random() * Math.floor(13)), 1)];
				bjGames[message.author.id].playerCards = bjGames[message.author.id].playerCards.flat(2);

				bjGames[message.author.id].botCards = [bjGames[message.author.id].deck.splice(Math.floor(Math.random() * Math.floor(13)), 1), bjGames[message.author.id].deck.splice(Math.floor(Math.random() * Math.floor(13)), 1)];
				bjGames[message.author.id].botCards = bjGames[message.author.id].botCards.flat(2);
				
				// assigns names to cards
				var deckCards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"]
				var deckPlayerCards = [deckCards[bjGames[message.author.id].playerCards[0]], deckCards[bjGames[message.author.id].playerCards[1]]];
				var deckBotCards = [deckCards[bjGames[message.author.id].botCards[0]], deckCards[bjGames[message.author.id].botCards[1]]];
				
				// asigns values to cards
				var valueCards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, "1 or 10"];
				var valuePlayerCards = [valueCards[bjGames[message.author.id].playerCards[0]], valueCards[bjGames[message.author.id].playerCards[1]]];
				var valueBotCards = [valueCards[bjGames[message.author.id].botCards[0]], valueCards[bjGames[message.author.id].botCards[1]]];
				
        message.channel.send(generateEmbed("Blackjack", 'Starting a game of blackjack with ' + sender + '... \n \n The cards are now dealt. You have a ' + deckPlayerCards[0] + ' (worth ' + valuePlayerCards[0] + ' points) and a ' + deckPlayerCards[1] + ' (worth ' + valuePlayerCards[1]  + ' points). \n I have a ' + deckBotCards[0] + " (worth " + valueBotCards[0] + " points) and an unknown card. \n \n Use `hit me` or `stand` to proceed.")).then((msg) => {
            bjGames[message.author.id].editable = msg;
        })
        message.delete(1);
    } else {
        if (message.content === '!bj' && bjGames.hasOwnProperty(message.author.id)) {
            message.channel.send("You're already in a game of blackjack! Use `!bj stop` to stop playing.");
        }
    }
	
		// if game started
	
		if (bjGames.hasOwnProperty(message.author.id)) {

        // !bj stop
        if (message.content === "!bj stop") {
						message.delete(1);
					
            delete bjGames[message.author.id];
            message.channel.send("Your game has now stopped. Thank you for playing, " + sender + "!");
        }
			
				// hit me
				if (message.content === "hit me") {
						message.delete(1);
						
						var newCard = bjGames[message.author.id].deck.splice(Math.floor(Math.random() * Math.floor(13)), 1);
						newCard = newCard.flat(2);
						bjGames[message.author.id].playerCards.push(newCard);
						
						// assigns names and values to cards
						
						var valueCards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, "1 or 10"];
						var deckCards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
						var deckPlayerCards = [];
						var deckBotCards = [];
						var deckPlayerValueCards = [];
						var deckBotValueCards = [];
						
						for(var i = 0; i < deckCards[bjGames[message.author.id].playerCards.length]; i++){
							deckPlayerCards.push(deckCards[bjGames[message.author.id].playerCards[i]]);
							deckPlayerValueCards.push(valueCards[bjGames[message.author.id].playerCards[i]]);
						}
					
						deckPlayerCards.pop();
						deckPlayerValueCards.pop();
						deckPlayerCards.pop();
						deckPlayerValueCards.pop();
					
						for(var i = 0; i < deckCards[bjGames[message.author.id].botCards.length]; i++){
							deckBotCards.push(deckCards[bjGames[message.author.id].botCards[i]]);
							deckBotValueCards.push(valueCards[bjGames[message.author.id].botCards[i]]);
						}
					
						deckBotCards.pop();
						deckBotValueCards.pop();
						deckBotCards.pop();
						deckBotValueCards.pop();
						
						// gets readable hand for player
						
						var playerHand = "";
						
						for(var i = 0; i < deckPlayerCards.length; i++){
							playerHand += deckPlayerCards[i] + " (worth " + deckPlayerValueCards[i] + "), ";
						}
							
						playerHand = playerHand.slice(0, -2); // removes the ", " at the end
					
						// gets total value of cards
					
						var playerTotal;
					
						// alters total based on aces
						if(deckPlayerValueCards.includes("1 or 10")){
							var alteredValue = deckPlayerValueCards;
							alteredValue.splice(alteredValue.indexOf("1 or 10"), 1);
							
							var alteredTotal = alteredValue.reduce((a, b) => a + b, 0);
							
							if((alteredTotal + 10) <= 21){ // checks if an extra 10 would still help
								playerTotal = alteredTotal + " or " + (alteredTotal + 10);
							} else {
								playerTotal = alteredTotal + 1;
							}
							
						} else {
							playerTotal = deckPlayerValueCards.reduce((a, b) => a + b, 0);
						}
						
						playerHand += ". The total value is **" + playerTotal + "**.";
				
						// bust
						// checks if playerTotal is a number (if it doesn't contain an ace worth more than 1)
						if((playerTotal === parseInt(playerTotal, 10)) && playerTotal > 21){
							
							bjGames[message.author.id].editable.edit(generateEmbed("Blackjack", "You were dealt a " + deckPlayerCards[deckPlayerCards.length - 1] + " (worth " + deckPlayerValueCards[deckPlayerValueCards.length - 1] + "). \n \n Your current hand: " + playerHand + " \n \n My current hand: " + deckBotCards[0] + " (worth " + deckBotValueCards[0] + " points) and an unknown card. \n \n **Bust!** Since you got over 21, you lose. \n \n Thank you for playing, " + sender + "."));
							
							delete bjGames[message.author.id];
							
						} else {
							bjGames[message.author.id].editable.edit(generateEmbed("Blackjack", "You were dealt a " + deckPlayerCards[deckPlayerCards.length - 1] + " (worth " + deckPlayerValueCards[deckPlayerValueCards.length - 1] + "). \n \n Your current hand: " + playerHand + " \n \n My current hand: " + deckBotCards[0] + " (worth " + deckBotValueCards[0] + " points) and an unknown card."));
						}
        }

				// stand
				if (message.content === "stand") {
					message.delete(1);
					
					// assigns names and values to cards

						var valueCards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, "1 or 10"];
						var deckCards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
						var deckPlayerCards = [];
						var deckBotCards = [];
						var deckPlayerValueCards = [];
						var deckBotValueCards = [];
						
						// gets names and values from card ids
						for(var i = 0; i < deckCards[bjGames[message.author.id].playerCards.length]; i++){
							deckPlayerCards.push(deckCards[bjGames[message.author.id].playerCards[i]]);
							deckPlayerValueCards.push(valueCards[bjGames[message.author.id].playerCards[i]]);
						}
					
						// removes blank items of arrays
						deckPlayerCards.pop();
						deckPlayerValueCards.pop();
						deckPlayerCards.pop();
						deckPlayerValueCards.pop();
						
						// gets names and values from card ids
						for(var i = 0; i < deckCards[bjGames[message.author.id].botCards.length]; i++){
							deckBotCards.push(deckCards[bjGames[message.author.id].botCards[i]]);
							deckBotValueCards.push(valueCards[bjGames[message.author.id].botCards[i]]);
						}
						
						// removes blank items of arrays
						deckBotCards.pop();
						deckBotValueCards.pop();
						deckBotCards.pop();
						deckBotValueCards.pop();
						
						// gets card values
						
						// player
						var playerTotal;
					
						// alters player total based on aces
						if(deckPlayerValueCards.includes("1 or 10")){
							var alteredValue = deckPlayerValueCards;
							alteredValue.splice(alteredValue.indexOf("1 or 10"), 1);
							
							var alteredTotal = alteredValue.reduce((a, b) => a + b, 0);
							
							if((alteredTotal + 10) <= 21){ // checks if an extra 10 would result in a bust
								playerTotal = alteredTotal + 10;
							} else {
								playerTotal = alteredTotal + 1;
							}
							
						} else {
							playerTotal = deckPlayerValueCards.reduce((a, b) => a + b, 0);
						}
					
						//bot
					
						var botTotal;
					
						// alters bot total based on aces
						if(deckBotValueCards.includes("1 or 10")){
							var alteredValue = deckBotValueCards;
							alteredValue.splice(alteredValue.indexOf("1 or 10"), 1);
							
							var alteredTotal = alteredValue.reduce((a, b) => a + b, 0);
							
							if((alteredTotal + 10) <= 21){ // checks if an extra 10 would result in a bust
								botTotal = alteredTotal + 10;
							} else {
								botTotal = alteredTotal + 1;
							}
							
						} else {
							botTotal = deckBotValueCards.reduce((a, b) => a + b, 0);
						}
					
					
						var outputMessage = "";
						
						// calculates bot's moves
						
						var botMaxGamble = Math.floor(Math.random() * (18 - 16) + 16);
						
						while(botTotal < botMaxGamble){ // calculates how many times bot should be hit
						// deals new card
							
						var newCard = bjGames[message.author.id].deck.splice(Math.floor(Math.random() * Math.floor(13)), 1);
						newCard = newCard.flat(2);
						bjGames[message.author.id].botCards.push(newCard);
						
						outputMessage += "I use `hit me` and recieve another card. \n \n"
						
						// revaluates values
						
						botTotal += [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 10][newCard];
						
						// revaluates variables
						
						deckBotValueCards = [];
						deckBotCards = [];
						
						for(var i = 0; i < deckCards[bjGames[message.author.id].botCards.length]; i++){
							deckBotCards.push(deckCards[bjGames[message.author.id].botCards[i]]);
							deckBotValueCards.push(valueCards[bjGames[message.author.id].botCards[i]]);
						}
					
						deckBotCards.pop();
						deckBotValueCards.pop();
						deckBotCards.pop();
						deckBotValueCards.pop();
						
						}
						
						// bot stands
						outputMessage += "I use `stand`. \n \n Now that everyone has used `stand`, we reveal our hands and see who wins. \n \n";
						
						// gets readable hand for player
						
						var playerHand = "";
						
						for(var i = 0; i < deckPlayerCards.length; i++){
							playerHand += deckPlayerCards[i] + " (worth " + deckPlayerValueCards[i] + "), ";
						}
							
						playerHand = playerHand.slice(0, -2); // removes the ", " at the end
					
						// gets readable hand for bot
					
						var botHand = "";
						
						for(var i = 0; i < deckBotCards.length; i++){
							botHand += deckBotCards[i] + " (worth " + deckBotValueCards[i] + "), ";
						}
					
						botHand = botHand.slice(0, -2); // removes the ", " at the end
						
						// reveals both hands
						outputMessage += "My revealed hand: " + botHand + " worth a total of **" + botTotal + "** points. \n \n Your revealed hand: " + playerHand + " worth a total of **" + playerTotal + "** points.";
					
						// calculates who won
						
						if(botTotal > 21){
							outputMessage += "\n \n **Bust!** Since I had a total value of more than 21, I lose! \n \n :tada: **You win!** :tada: \n Thank you for playing, " + sender + "!";
						} else if(playerTotal > 21){
							outputMessage += "\n \n **Bust!** Since you had a total value of more than 21, you lose! \n \n :tada: **I win!** :tada: \n Thank you for playing, " + sender + "!";
						} else if(botTotal > playerTotal){
							outputMessage += "\n \n I have more points than you without going over 21. \n \n :tada: **I win!** :tada: \n Thank you for playing, " + sender + "!";
						} else if(botTotal == playerTotal){
							outputMessage += "\n \n We got the same score without going over 21. \n \n :tada: **It's a tie!** :tada: \n Thank you for playing, " + sender + "!";
						} else {
							outputMessage += "\n \n You have more points than me without going over 21. \n \n :tada: **You win!** :tada: \n Thank you for playing, " + sender + "!";
						}
					
					bjGames[message.author.id].editable.edit(generateEmbed("Blackjack", outputMessage));
					delete bjGames[message.author.id];
						
				}
			
		}


    // rock, paper, scissors
    //___________________________________________________________

    // starts game
    if (message.content === '!rps' && !rpsGames.hasOwnProperty(message.author.id)) {
        rpsGames[message.author.id] = {
            started: true
        };
        message.channel.send(generateEmbed("Rock, Paper, Scissors", 'Starting a game of rock, paper, scissors with ' + sender + '... \n \n Use `r`, `p`, or `s` to choose rock, paper, or scissors.')).then((msg) => {
            rpsGames[message.author.id].editable = msg;
        })
        message.delete(1);
    } else {
        if (message.content === '!rps' && rpsGames.hasOwnProperty(message.author.id)) {
            message.channel.send("You're already in a game of rock, paper, scissors! Use `!rps stop` to stop playing.");
        }
    }

    // if game started

    if (rpsGames.hasOwnProperty(message.author.id)) {

        // !rps stop
        if (message.content === "!rps stop") {
						message.delete(1);
					
            delete rpsGames[message.author.id];
            message.channel.send("Your game has now stopped. Thank you for playing, " + sender + "!");
        }

        // rock, paper, or scissors
        if (message.content === "rock" || message.content === "paper" || message.content === "scissors" || message.content === "r" || message.content === "p" || message.content === "s") {
            var playerAttack = message.content[0];
            var botAttack = ["r", "p", "s"];
						botAttack = botAttack[Math.floor(Math.random() * Math.floor(3))];
						
						var fullAttacks = ["rock", "paper", "scissors"];
						var abbAttacks = ["r", "p", "s"];
						
						var fullBotAttack = fullAttacks[abbAttacks.indexOf(botAttack)];
						var fullPlayerAttack = fullAttacks[abbAttacks.indexOf(playerAttack)];
					
            message.delete(1);

            //User wins the round
            if ((botAttack == "r" && playerAttack == "p") || (botAttack == "p" && playerAttack == "s") || (botAttack == "s" && playerAttack == "r")) {
                rpsGames[message.author.id].editable.edit(generateEmbed("Rock, Paper, Scissors", "I used " + fullBotAttack + " and you used " + fullPlayerAttack + ". You win!"));
                delete rpsGames[message.author.id];
                //Bot wins the round
            } else if ((botAttack == "p" && playerAttack == "r") || (botAttack == "s" && playerAttack == "p") || (botAttack == "r" && playerAttack == "s")) {
                rpsGames[message.author.id].editable.edit(generateEmbed("Rock, Paper, Scissors", "I used " + fullBotAttack + " and you used " + fullPlayerAttack + ". I win! Better luck next time."));
                delete rpsGames[message.author.id];
                //Tie
            } else {
                rpsGames[message.author.id].editable.edit(generateEmbed("Rock, Paper, Scissors", "I used " + fullBotAttack + " and you used " + fullPlayerAttack + ". It's a tie! \n Starting tiebreaker round... \n \n Use `r`, `p`, or `s` to choose rock, paper, or scissors."));
            }

        }
    }

    // war
    //___________________________________________________________


    // starts game
    if ((message.content === '!war' || message.content === '!war kill' || message.content === '!war capture') && !warGames.hasOwnProperty(message.author.id)) {
        warGames[message.author.id] = {};
				
				// capture or kill
				if(message.content === '!war capture'){
					warGames[message.author.id].type = "Capture";
				} else {
					warGames[message.author.id].type = "Kill";
				}
				
        message.channel.send(generateEmbed("War (" + warGames[message.author.id].type + ")", 'Starting a game of war with ' + sender + '... \n Type `go` to turn up a card.')).then((msg) => {
            warGames[message.author.id].editable = msg;
        })

        warGames[message.author.id].stakes = 1;
				
				

        message.delete(1);

        // generates deck and draws random card for both players
        var deckNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        deckNumbers = shuffle(deckNumbers);

        //splits deck between bot and player
        var playerCards = deckNumbers.splice(0, 26);
        var botCards = deckNumbers;
        warGames[message.author.id].playerCards = playerCards;
        warGames[message.author.id].botCards = botCards;



    } else {
        if ((message.content === '!war' || message.content === '!war kill' || message.content === '!war capture') && warGames.hasOwnProperty(message.author.id)) {
            message.channel.send("You're already in a game of war! Use `!war stop` to stop playing.");
        }
    }

    // if game started

    if (warGames.hasOwnProperty(message.author.id)) {

        // !war stop
        if (message.content === "!war stop") {
						message.delete(1);
					
            delete warGames[message.author.id];
            message.channel.send("Your game has now stopped. Thank you for playing, " + sender + "!");
        }

        // go
        if (message.content === "go") {

            message.delete(1);

            // gets the cards that were used
            var deckCards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"]
            var playerAttack = deckCards[warGames[message.author.id].playerCards[0]];
            var botAttack = deckCards[warGames[message.author.id].botCards[0]];

            /*Bot wins the round*/
            if (warGames[message.author.id].botCards[0] > warGames[message.author.id].playerCards[0]) {
							
								//adjusts the stakes
								if(warGames[message.author.id].stakes > warGames[message.author.id].playerCards.length){
									warGames[message.author.id].stakes = warGames[message.author.id].playerCards.length;
								}
							
								// repeats for the stakes
                for (var i = 0; i < warGames[message.author.id].stakes; i++) {
                    // moves card to end of bot deck
                    warGames[message.author.id].botCards.push(warGames[message.author.id].botCards[0]);
										
                    warGames[message.author.id].botCards.shift();
										
										// adds defeated card to user deck if type is capture
										if(warGames[message.author.id].type == "Capture"){
											warGames[message.author.id].botCards.push(warGames[message.author.id].playerCards[0]);
										}

                    // deletes defeated card(s)
                    warGames[message.author.id].playerCards.shift();
                }

                // resets the stakes
                warGames[message.author.id].stakes = 1;

                var winner = ""

                if (warGames[message.author.id].playerCards.length < 1) {
                    winner = " \n :tada: **I win!** :tada: \n Thank you for playing, " + sender + "!";
                }

                warGames[message.author.id].editable.edit(generateEmbed("War (" + warGames[message.author.id].type + ")", "You turned a " + playerAttack + " and I turned a " + botAttack + '. I won this round. Type `go` to proceed to the next round.' + "\n \n You have " + warGames[message.author.id].playerCards.length + " cards left. I have " + warGames[message.author.id].botCards.length + " cards left." + winner));

                if (warGames[message.author.id].playerCards.length < 1) {
                    delete warGames[message.author.id];
                }

            /*User wins the round*/
            } else if (warGames[message.author.id].botCards[0] < warGames[message.author.id].playerCards[0]) {
								
								//adjusts the stakes
								if(warGames[message.author.id].stakes > warGames[message.author.id].botCards.length){
									warGames[message.author.id].stakes = warGames[message.author.id].botCards.length;
								}
							
								// repeats for the stakes
                for (var i = 0; i < warGames[message.author.id].stakes; i++) {
                    // moves card to end of user deck
                    warGames[message.author.id].playerCards.push(warGames[message.author.id].playerCards[0]);
                    warGames[message.author.id].playerCards.shift();
										
										// adds defeated card to user deck if type is capture
										if(warGames[message.author.id].type == "Capture"){
											warGames[message.author.id].playerCards.push(warGames[message.author.id].botCards[0]);
										}

                    // deletes defeated card(s)
                    warGames[message.author.id].botCards.shift();
                }

                // resets the stakes
                warGames[message.author.id].stakes = 1;

                // winning condition

                var winner = ""

                if (warGames[message.author.id].botCards.length < 1) {
                    winner = " \n :tada: **You win!** :tada: \n Thank you for playing, " + sender + "!";
                }

                warGames[message.author.id].editable.edit(generateEmbed("War (" + warGames[message.author.id].type + ")", "You turned a " + playerAttack + " and I turned a " + botAttack + '. You won this round. Type `go` to proceed to the next round.' + "\n \n You have " + warGames[message.author.id].playerCards.length + " cards left. I have " + warGames[message.author.id].botCards.length + " cards left." + winner));

                if (warGames[message.author.id].botCards.length < 1) {
                    delete warGames[message.author.id];
                }

            /*Tie*/
            } else {

                warGames[message.author.id].stakes = 5;

                // moves card to end of user deck
                warGames[message.author.id].playerCards.push(warGames[message.author.id].playerCards[0]);
                warGames[message.author.id].playerCards.shift();

                // moves card to end of bot deck
                warGames[message.author.id].botCards.push(warGames[message.author.id].botCards[0]);
                warGames[message.author.id].botCards.shift();

                warGames[message.author.id].editable.edit(generateEmbed("War (" + warGames[message.author.id].type + ")", "You turned a " + playerAttack + " and I turned a " + botAttack + ". It's a tie so the stakes of the next rounds will be an extra four cards. This means whoever loses the next round will lose five cards rather than just one. Type `go` to proceed to the next round." + "\n \n You have " + warGames[message.author.id].playerCards.length + " cards left. I have " + warGames[message.author.id].botCards.length + " cards left."));

            }
        }
    }

});

// function to get variable names
const varToString = varObj => Object.keys(varObj)[0];

// function to generate embeds
function generateEmbed(title, desc, imageSrc = undefined) {
    const newEmbed = new Discord.RichEmbed()
        .setColor('#b00000')
        .setTitle(title)
        .setDescription(desc)
        .setFooter('Created by ArjhanToteck', 'https://arjhantoteck.neocities.org/favicon.png');
	
		if(!!imageSrc){
			newEmbed.setImage(imageSrc);
		}

    var output = {
        embed: newEmbed
    }

    return output;
}

// function to shuffle arrays
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

// function to stringify arrays
function stringifyArray(arr, split = ""){
	var output = "";
	var arrFlat = arr.flat();

	for(var i = 0; i < arrFlat.length; i++){
		output += arrFlat[i] + split;
	}

	return output;
}

// bot login
client.login(process.env.BOT_TOKEN); //process.env.BOT_TOKEN is the Client Secret
