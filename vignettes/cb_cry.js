// 
// The Javascript functions for mouse callback in WebGL.
// 

// Variables placed in this position will be set before the event occurs. Avoid
// overwriting them.
window.cryPanel = %cryPanel%;
window.cryWidget = %cryWidget%;
window.cryRoot = %cryRoot%;
window.idpoints = %idpoints%;
window.dpPanel = %dpPanel%;
window.dpWidget = %dpWidget%;
window.dpRoot = %dpRoot%;


window.%begin% = function(x, y) {

    // I wasn't sure how to retrieve the rglwidgetClass object directly from
    // another widget instance, although I realized saving and retrieving the
    // object is possible. At this time, the object is retrieved from the HTML
    // page at the load event listener.
    //window.cryObj = this;	// rglwidgetClass Object


    // Make it visible in update() or end()
    window.cryScenes = [cryPanel, cryWidget, cryRoot];
    window.dpScenes = [dpPanel, dpWidget, dpRoot];

    let activeSub = this.getObj(cryPanel);

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

        for (let item of cryScenes) {
            activeSub = this.scene.objects[item];
            activeSub.par3d.userMatrix.makeIdentity();
            this.drawScene();
        }

		// ------------------------------------------------------------

		let dpSub = dpObj.getObj(dpPanel);
		for (let item of dpScenes) {
			dpSub = dpObj.scene.objects[item];
            dpSub.par3d.userMatrix.makeIdentity();
			dpObj.drawScene();
		}

		let ews_r = 37;
		let ews_pos = [0, 0, ews_r, 0];
		let ews_pos_new = rglwidgetClass.multVM(ews_pos, dpSub.par3d.userMatrix);

		let spheres = dpObj.getObj(idpoints);
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
		dpObj.drawScene();

    }

    // load the initial userMatrix.
    for (let item of cryScenes) {
        activeSub = this.scene.objects[item];
        activeSub.userSaveMat = new CanvasMatrix4(activeSub.par3d.userMatrix);
    }

    this.canvas.style.cursor = "grabbing";
};


window.%update% = function(x, y) { 

    let activeSub = this.getObj(cryPanel);

    let objects = this.scene.objects,
        viewport = this.userSave.viewport,
        par3d;

    x = (x - this.userSave.x) / this.canvas.width * 20;
    y = (y - this.userSave.y) / this.canvas.height * 20;

	let userSaveMat = objects[cryPanel].userSaveMat; // all the same, select one.
    for (let item of cryScenes) {
        activeSub = this.scene.objects[item];
        activeSub.par3d.userMatrix.load(userSaveMat);
        activeSub.par3d.userMatrix.rotate(x,  0, 1, 0);
        activeSub.par3d.userMatrix.rotate(y,  -1, 0, 0);
    }
    this.drawScene();

	// ------------------------------------------------------------

	let dpSub = dpObj.getObj(dpPanel);
	for (let item of dpScenes) {
		dpSub = dpObj.scene.objects[item];
		dpSub.par3d.userMatrix.load(userSaveMat);
		dpSub.par3d.userMatrix.rotate(x,  0, 1, 0);
		dpSub.par3d.userMatrix.rotate(y,  -1, 0, 0);
	}

	let ews_r = 37;
	let ews_pos = [0, 0, ews_r, 0];
	let ews_pos_new = rglwidgetClass.multVM(ews_pos, dpSub.par3d.userMatrix);

    let spheres = dpObj.getObj(idpoints);
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

	dpObj.drawScene();

};


window.%end% = function() {
    this.canvas.style.cursor = this.userSave.cursor;
};
