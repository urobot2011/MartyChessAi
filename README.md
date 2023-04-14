# MartyChessAi
Reinforcement Learning Marty Chess Engine.(aka Marty Deep Chess)


How to use:
```html
<script src="https://urobot2011.github.io/MartyChessAi/src/MartyChessAi.js"></script>
```
```html
<!-- model -->
<script src="https://urobot2011.github.io/MartyChessAi/model/model_1000data.js"></script>
```
```js
var game = new Chess();
var Marty = new MartyChessAi(game);
Marty.fromJSON(MartyChessAiModels.model_1000);
Marty.train(50); // Higher this number gives better performance but slower learning

game.reset();
game.header('White', 'MartyBot L6');
game.header('Black', 'MartyBot L6');
while(!game.game_over()) {
	var move = Marty.play();
	game.move(move);
}
console.log('Game over. Pgn:', game.pgn());
//
game.reset();
game.header('White', 'you');
game.header('Black', 'MartyChessAi');
while(!game.game_over()) {
	if(game.turn() === 'w') {
		console.log(game.ascii());
		const input = prompt('Enter your move:');
		game.move(input);
	} else {
		game.move(Marty.play());
		console.log(game.ascii());
	}
}
console.log('Game over. Pgn:', game.pgn());
```

## todo
* [ ] Learn to provide data by default
