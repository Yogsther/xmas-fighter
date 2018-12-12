class Input{
    constructor(name, keys){
        this.name = name;
        /* Key order: UP, DOWN, LEFT, RIGHT, DAMAGE, SPECIAL, JUMP */
        this.keys = keys;
        this.keyNames = ["up", "down", "left", "right", "damage", "special", "jump"]
    }  

    getKey(name){
        for(var i = 0; i < this.keys.length; i++){
            if(this.keyNames[i] == name){
                return this.keys[i];
            }
        }
    }
}