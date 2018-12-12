class Game{
    constructor(stage){
        this.stage = stage;
        this.running = true;
        this.players = [];
    }

    addPlayer(player){
        this.players.push(player);
    }

    removePlayer(){
            
    }

    kill(){
        this.running = false;
    }
}