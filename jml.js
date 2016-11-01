
function Jml () {

	this.nframe = 0;
	this.active_frame = 0;
	this.applet_id = 0;


	function Format(blueprint) {
		var base_format = {
			action : {zoom : 0, center : 0},
			show : {lines : 0, sticks : 0, backbone : 0, ribbon : 0, cartoon : 0, spheres : 0},
			label : {atoms : 0, residues : 0},
			color : {conservation : 0, cpk : 0, structure : 0, red : 0, green : 0, blue : 0, yellow : 0, orange : 0, magenta : 0, cyan : 0},
		};
		for (var prop1 in base_format) {
			this[prop1] = new Object();
			for (var prop2 in base_format[prop1]) {
				this[prop1][prop2] = base_format[prop1][prop2];
			}
		}
		for (var prop1 in blueprint) {
			for (var prop2 in blueprint[prop1]) {
				this[prop1][prop2] = blueprint[prop1][prop2];
			}
		}
	};
	
	// Sets how the objects will look like initially
	this.set_formatting = function(type) {
		var frm = {
			all : {show : {cartoon : 1}, color : {structure : 1}},
			protein : {show : {cartoon : 1}, color : {structure : 1}},
			nucleic : {show : {cartoon : 1}, color : {structure : 1}},
			compound : {show : {sticks : 1}, color : {cpk : 1}},
			ion : {show : {spheres : 1}, color : {cpk : 1}},
			//~ water : {show : {ballsticks : 1}, color : {cpk : 1}},
			water : {show : {spheres : 1}, color : {cpk : 1}},
		};
		return new Format(frm[type]);
	};
	
	// Update and render the unhidden objects in jsmol viewer.
	this.update = function(objs) {
		for (var i = 1; i < objs.length; i++) { // starting from 1 to skip the "all" object
			this.format(objs[i]);
		}
		this.display(objs);
	};

	// Update and render the all object in jsmol viewer.
	this.update_all = function(objs) {
		this.format_all(objs); // 0-th objs is the "all" object
		this.display(objs);
	};

	// Show object frames
	this.display = function(objs) {
		var cmd = 'frames all;display ';
		for (var i = 1; i < objs.length; i++) { // starting from 1 to skip the "all" object
			cmd += 'file=' + String(objs[i].iframe) 
				+ (i < objs.length - 1 ? ',' : ';');
		}
		console.log(cmd);
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), cmd);
	};

	// Format according to object type.
	this.format = function(obj) {

		var ss = "select file=" + String(obj.iframe) + ";";
		var show = obj.format.show;
		console.log("show spheres = " + String(show.spheres));

		var cmd = "color \"blue_green_yellow_red=[x0000FF] [x0060FF] [x00E0FF] [x00FFA0] [x00FF20] [x60FF00] [xE0FF00] [xFFE000] [xFF6000] [xFF0000]\";"
			+ ss
			+ "wireframe off;cpk off;"
			+ (show.lines == 1 ? "wireframe 2;" : (show.sticks == 1 ? "" : "wireframe off;"))
			+ (show.sticks == 1 ? "wireframe 50;" : (show.lines == 1 ? "" : "wireframe off;"))
			+ (show.ballssticks == 1 ? "wireframe 30;cpk 60;" : (show.lines == 1 || show.sticks == 1 || show.spheres == 1 ? "" : "wireframe off;cpk off;"))
			+ (show.backbone == 1 ? "backbone;" : "backbone off;")
			+ (show.ribbon == 1 ? "trace;" : "trace off;")
			+ (show.cartoon == 1 ? "cartoon;" : "cartoon off;")
			+ (show.spheres == 1 ? "spacefill;" : (show.ballssticks == 1 ? "" : "spacefill off;"));

		var label = obj.format.label;
		cmd += (label.atoms == 1 ? "select (protein and *.CA or not protein and not water) and file=" + String(obj.iframe) + ";font label 15;label %a;" 
			+ ss : (label.residues == 1 ? "" : "label off;"))
			+ (label.residues == 1 ? "select (protein and *.CA or not protein and not water) and file=" + String(obj.iframe) + ";font label 15;label %n%R;" 
			+ ss : (label.atoms == 1 ? "" : "label off;"));

		var color = obj.format.color;
		cmd += (color.bgyr == 1 ? "color cartoon property relativetemperature \"blue_green_yellow_red\" range 0.0 0.9;" 
			+ "color atom property relativetemperature \"blue_green_yellow_red\" range 0.0 0.9;": "")
			+ (color.br == 1 ? "color cartoon property relativetemperature \"blue_red\" range 0.0 0.9;" 
			+ "color atom property relativetemperature \"blue_red\" range 0.0 0.9;": "")
			+ (color.wg == 1 ? "color cartoon property relativetemperature \"white_green\" range 0.0 0.9;" 
			+ "color atom property relativetemperature \"white_green\" range 0.0 0.9;": "")
			+ (color.wb == 1 ? "color cartoon property relativetemperature \"white_black\" range 0.0 0.9;" 
			+ "color atom property relativetemperature \"white_black\" range 0.0 0.9;": "")
			+ (color.cpk ? "color cartoon cpk;color atom cpk;" : "")
			+ (color.structure ? "color cartoon structure;color atom structure;" : "")
			+ (color.red == 1 ? "color cartoon red;color atom red;" : "")
			+ (color.green == 1 ? "color cartoon green;color atom green;" : "")
			+ (color.blue == 1 ? "color cartoon blue;color atom blue;" : "")
			+ (color.yellow == 1 ? "color cartoon yellow;color atom yellow;" : "")
			+ (color.orange == 1 ? "color cartoon orange;color atom orange;" : "")
			+ (color.magenta == 1 ? "color cartoon magenta;color atom magenta;" : "")
			+ (color.cyan == 1 ? "color cartoon cyan;color atom cyan;" : "")
			+ (color.alrc == 1 ? "select model=1 and file=" + String(obj.iframe) + ";color cartoon red;color atom red;select model=2 and file=" + String(obj.iframe) + ";color cartoon cyan;color atom cyan;" 
			+ ss : "")
			+ (color.algb == 1 ? "select model=1 and file=" + String(obj.iframe) + ";color cartoon green;color atom green;select model=2 and file=" + String(obj.iframe) + ";color cartoon blue;color atom blue;" 
			+ ss : "");

		var action = obj.format.action;
		cmd += ss
			+ (action.zoom != 0 ? "zoom " + String(action.zoom) + ";" : "")
			+ (action.center ? "center file=" + String(obj.iframe) + ";" : "");

		console.log(cmd);	
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), cmd);
	};

	// Format ALL just for zoom and center
	this.format_all = function(objs) {

		var obj = objs[0];
		var ss = "select ";
		var sele = "(";
		
		for (var i = 1; i < objs.length; i++) {
			sele += "file=" + String(objs[i].iframe) + (i < objs.length - 1 ? "," : ""); 
		}
		
		sele += ")";
		ss += sele + ";";
		
		var action = obj.format.action;
		var cmd = ss
			+ (action.zoom != 0 ? "zoom " + String(action.zoom) + ";" : "")
			+ (action.center ? "center " + sele + ";" : "");

		console.log(cmd);	
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), cmd);
	};

	// Load pdb file.
	this.load = function(file, app) {

		if (typeof(app)==='undefined') app = true; // default

		var cmd = 'load ' + (app ? 'append' : '') + ' ' + file 
			+ '?' + uniqid() + ';' + 'message \"loaded\";';
			
		console.log(cmd);
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), cmd);
	};

	// Remove pdb file
	this.zap = function(iframe) {
		var off = 'zap file=' + String(iframe) + ';';
		Jmol.scriptWait(eval("jmolApplet" + String(this.applet_id)), off);
	};

	// Get applet id
	this.get_applet_id = function() {
		return String(this.applet_id);
	};

	// Set applet id
	this.set_applet_id = function(applet_id) {
		this.applet_id = applet_id;
	};

	// Set active frame - currently select frame
	this.set_active_frame = function(active_frame) {
		this.active_frame = active_frame;
	};

	// Set number of frames
	this.set_nframe = function(nframe) {
		this.nframe = nframe;
	};

	// Get number of frames
	this.get_nframe = function() {
		return Number(this.nframe);
	};

	// Download PNG picture of jsmol content
	this.write_png = function(file) {
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), 'antialiasDisplay=true;write PNG "picture_' 
			+ __qpdb + __qcid + '_' + uniqid() + '.png";antialiasDisplay=false;');
	};

	// set background
	this.set_background = function(how) {
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), 'background=' + how + ';');
	};

	// Run directly any command
	this.script = function(script) {
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), script);
	};

}

var jml = new Jml();

