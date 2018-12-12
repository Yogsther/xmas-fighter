class StageItem{
    constructor(type, x, y, width, height, color, path){
        this.image;
        if(color === undefined) color = "black";
        if(type == "image"){
            if(path === undefined) console.warn("No path to image")
            this.image = new Image();
            this.image.src = path;
        }

        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}

var stages = {
    defaultStage: {
        bgcolor: "#3d3d3d",
        content: [
            new StageItem("block", 60, 300, 600, 100, "white"),
            new StageItem("block", 300, 200, 50, 50, "white")
        ]
    }
}