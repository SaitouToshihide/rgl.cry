// 
// The Javascript functions for mouse callback in WebGL.
// 

window.%begin% = function(x, y) {

    window.subidPanel = %subidPanel%;
    window.subidWidget = %subidWidget%;
    window.subidRoot = %subidRoot%;
    window.scenes = [subidPanel, subidWidget, subidRoot];

    var activeSub = this.getObj(subidPanel);

    if (typeof this.userSave === "undefined") {
        this.userSave = {  }
        this.userSave.start = 0
    }

    let now = new Date(); // milliseconds
    let time_difference = now - this.userSave.start;
    this.userSave.start = now;
    let viewport = activeSub.par3d.viewport;
	
    this.userSave = Object.assign(this.userSave, {
		x:x, y:y, viewport:viewport,
        cursor:this.canvas.style.cursor });

    if (time_difference > 100 & time_difference < 200) {
        for (let item of scenes) {
            activeSub = this.scene.objects[item];
            activeSub.par3d.userMatrix.makeIdentity();
            this.drawScene();
        }
    }

    // save the userMatrix.
    for (let item of scenes) {
        activeSub = this.scene.objects[item];
        activeSub.userSaveMat = new CanvasMatrix4(activeSub.par3d.userMatrix);
    }

    this.canvas.style.cursor = "grabbing";
};


window.%update% = function(x, y) { 

    var activeSub = this.getObj(subidPanel);

    let objects = this.scene.objects,
        viewport = this.userSave.viewport,
        par3d;

    x = (x - this.userSave.x) / this.canvas.width * 20;
    y = (y - this.userSave.y) / this.canvas.height * 20;

    for (let item of scenes) {
        activeSub = this.scene.objects[item];
        activeSub.par3d.userMatrix.load(objects[item].userSaveMat);
        activeSub.par3d.userMatrix.rotate(x,  0, 1, 0);
        activeSub.par3d.userMatrix.rotate(y,  -1, 0, 0);
        this.drawScene();
    }

};


window.%end% = function() {
    this.canvas.style.cursor = this.userSave.cursor;
};
