// 
// The Javascript functions for mouse callback in WebGL.
// 

window.subidPanel = %subidPanel%;
window.subidWidget = %subidWidget%;
window.subidRoot = %subidRoot%;
window.scenes = [window.subidPanel, window.subidWidget, window.subidRoot];

window.idpoints = %idpoints%


window.%begin% = function(x, y) {

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
		// ------------------------------------------------------------
		let ews_r = 37;
		let ews_pos = [0, 0, ews_r, 0];
		let ews_pos_new = rglwidgetClass.multVM(ews_pos, activeSub.par3d.userMatrix);

		let spheres = this.getObj(idpoints);
		for (let i = 0; i < spheres.vertices.length; i++) {

			let v = (spheres.vertices[i][0] - ews_pos_new[0])**2;
			v += (spheres.vertices[i][1] - ews_pos_new[1])**2;
			v += (spheres.vertices[i][2] - ews_pos_new[2])**2;
			v = Math.sqrt(v);
			v = 1 - 30 * Math.abs(v - ews_r);
			v = (v < 0) ? 0 : v;

			spheres.colors[i][3] = v; // alpha
			spheres.initialized = false;
		}
		this.drawScene();
		// ------------------------------------------------------------
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

	console.log(x, " ", this.userSave.x);
    x = (x - this.userSave.x) / this.canvas.width * 20; // degree ? 
    y = (y - this.userSave.y) / this.canvas.height * 20;

    for (let item of scenes) {
        activeSub = this.scene.objects[item];
        activeSub.par3d.userMatrix.load(objects[item].userSaveMat);
        activeSub.par3d.userMatrix.rotate(x, 0, 1, 0);
        activeSub.par3d.userMatrix.rotate(y, -1, 0, 0);
        this.drawScene();
    }

	// ------------------------------------------------------------
	let ews_r = 37;
	let ews_pos = [0, 0, ews_r, 0];
	let ews_pos_new = rglwidgetClass.multVM(ews_pos, activeSub.par3d.userMatrix);

    let spheres = this.getObj(idpoints);
	for (let i = 0; i < spheres.vertices.length; i++) {

		let v = (spheres.vertices[i][0] - ews_pos_new[0])**2;
		v += (spheres.vertices[i][1] - ews_pos_new[1])**2;
		v += (spheres.vertices[i][2] - ews_pos_new[2])**2;
		v = Math.sqrt(v);
		v = 1 - 30 * Math.abs(v - ews_r);
		v = (v < 0) ? 0 : v;

		spheres.colors[i][3] = v; // alpha
		spheres.initialized = false;
	}
	this.drawScene();
	// ------------------------------------------------------------
};


window.%end% = function() {
    this.canvas.style.cursor = this.userSave.cursor;
};
