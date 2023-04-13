# MartyChessAi
Reinforcement Learning Marty Chess Engine.(aka Marty Deep Chess)


How to use:
```html
<script src="https://urobot2011.github.io/MartyChessAi/src/MartyChessAi.js"></script>
```
```js
var game = new Chess();
var Marty = new MartyChessAi(game);
Marty.train(50); // Higher this number gives better performance but slower learning
// game.move(Marty.play());
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
console.log('Game over. Result:', game.result());
```

## todo
* [ ] Learn to provide data by default
