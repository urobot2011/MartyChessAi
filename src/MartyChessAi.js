function MartyChessAi(MAINgame = new Chess(), config = {}, AiChess = Chess){
    const COL = 'abcdefgh'.split('');
    const ptn = {
        'p': 1,
        'n': 2,
        'b': 3,
        'r': 4,
        'q': 5,
        'k': 6
    };
    const ctn = {
        'b': 7,
        'w': 8
    };
    let QTable = {};
    config.train = config.train ? config.train : {};
    let trainConfig = {
        alpha: config.train.alpha ? config.train.alpha : 0.5, 
        gamma: config.train.gamma ? config.train.gamma : 0.9, 
        epsilon: config.train.epsilon ? config.train.epsilon : 0.1
    };
    config.play = config.play ? config.play : {};
    let playConfig = {
        alpha: config.play.alpha ? config.train.alpha : 0, 
        gamma: config.play.gamma ? config.train.gamma : 0, 
        epsilon: config.play.epsilon ? config.train.epsilon : 1
    };
    function initializeQTable(game) {
        const state = getState(game);
        if(!QTable[state]) {
            QTable[state] = {};
            game.moves().forEach(move => {
                QTable[state][move] = 0;
            });
        }
    }
    function reward(game) {
        if(game.in_checkmate()) {
            if(game.turn() === 'w') {
                return -1;
            } else {
                return 1;
            }
        } else if(game.in_draw() || game.in_stalemate() || game.in_threefold_repetition() || game.insufficient_material()) {
            return 0;
        } else {
            return null;
        }
    }
    function getState(game){
        let v = 0;
        let k = 0;
        let state = 0;
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                let cell = COL[Math.floor(i+j/10)] + (i+j - Math.floor(i+j/10)*10+1);
                if(game.get(cell) == null){
                    v = 0;
                } else {
                    let sq = game.get(cell);
                    v = ptn[sq.type]*10 + ctn[sq.color];
                }
        
                state += Math.pow(3,k) * v;
                k++;
            }
        }
        return state;
    }
    function qLearning(game, alpha, gamma, epsilon) {
        const state = getState(game);
        if(!QTable[state]) {
            QTable[state] = {};
            game.moves().forEach(move => {
                QTable[state][move] = 0;
            });
        }
        let nextMove;
        if(Math.random() < epsilon) {
            nextMove = game.moves()[Math.floor(Math.random() * game.moves().length)];
        } else {
            nextMove = game.moves().reduce((bestMove, move) => {
                if(QTable[state][move] > QTable[state][bestMove]) {
                    return move;
                }
                else {
                    return bestMove;
                }
            }, game.moves()[0]);
        }
        game.move(nextMove);
        const nextState = getState(game);
        const r = reward(game);
        initializeQTable(game);
        if(r !== null) {
            QTable[state][nextMove] += alpha * (r - QTable[state][nextMove]);
        }
        else {
            QTable[state][nextMove] += alpha * (gamma * Math.max(...Object.values(QTable[nextState])) - QTable[state][nextMove]);
        }
        return [nextMove, game];
    }
    function train(episodes) {
        let game = new AiChess();
        for(let i = 0; i < episodes; i++) {
            while(!game.game_over()) {
                [_move, game] = qLearning(game, trainConfig.alpha, trainConfig.gamma, trainConfig.epsilon);
            }
            game.reset();
        }
    }
    function play() {
        let AIgame = new AiChess();
        AIgame.load(MAINgame.fen());
        var [move, _game_] = qLearning(AIgame, playConfig.alpha, playConfig.gamma, playConfig.epsilon);
        //let history = AIgame.history();
        return move//history[history.length];
    }
    function setConfig(set_config) {
        config = set_config;
        config.train = config.train ? config.train : {};
        trainConfig = {
            alpha: config.train.alpha ? config.train.alpha : 0.5, 
            gamma: config.train.gamma ? config.train.gamma : 0.9, 
            epsilon: config.train.epsilon ? config.train.epsilon : 0.1
        };
        config.play = config.play ? config.play : {};
        playConfig = {
            alpha: config.play.alpha ? config.train.alpha : 0, 
            gamma: config.play.gamma ? config.train.gamma : 0, 
            epsilon: config.play.epsilon ? config.train.epsilon : 1
        };
    }
    function getConfig() {
        return config;
    }
    function fromJSON(json) {
        //json = JSON.parse(json);
        QTable = json.table;
        setConfig(json.config);
    }
    function toJSON() {
        return {table: QTable, config};//JSON.stringify({table: QTable, config});
    }
    function setGame(set_game) {
        game = set_game;
    }
    function setAiChess(set_AiChess) {
        AiChess = set_AiChess;
    }
    function getGame() {
        return game;
    }
    function getAiChess() {
        return AiChess;
    }
    return {
        train, 
        play,
        fromJSON, 
        toJSON,
        setConfig,
        getConfig,
        setGame,
        setAiChess,
        getGame,
        getAiChess
    };
}
