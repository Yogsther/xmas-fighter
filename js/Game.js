class Game{
    constructor(stage){
        this.stage = stage;
        this.running = true;
        this.players = [];
        this.items = [];
    }

    addPlayer(player){
        this.players.push(player);
    }

    removePlayer(){
            
    }

    addItem(item){
        this.items.push(item);
    }

    kill(){
        this.running = false;
    }
}