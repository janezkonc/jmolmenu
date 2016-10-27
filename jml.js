//
// Callback funkcija, ki se izvede, ko je loadanje jmol appleta končano!
//
var applet_loaded = function() {
	// add-query izvedemo sele, ko je DOM ready (oba, applet in DOM, morata biti ready)
	setTimeout(function() {
		query(0);
	}, 0);	
};

//
// Callback funkcija, ki se izvede, kadar nalozimo ali zapamo file v jmol appletu!
//
var jmol_load = function(a,b,c,d,e,f,g,h) {
	var hh = '' + h;
	// updatamo jml.nframe ! 
	f = Number(String(hh).split('.')[0]);
	jml.set_nframe(f);
	jml.set_active_frame(f);
};

//
// Callback funkcija, ki se izvede, kadar je uporabljena message komanda (ko je koncano load appendanje vseh file-ov!
//
var jmol_message = function(a,b,c,d,e,f,g,h) {
	var bb = '' + b;
	if (bb == 'loaded') {
		// skrijemo Loading... okence
		$('#loading').addClass('ui-helper-hidden')
	}
};

//
// Element arraya za selekcijo motif.
//
function MotifEl(RESNO, CHAIN) { 
	this.resno = RESNO;
	this.chain = CHAIN; 
}

var Format = function(blueprint) {
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


function Jml () {
	this.nframe = 0;
	this.active_frame = 0;
	this.applet_id = 0;
	this.query_loaded = false;
	this.query_chain = '';
	this.frm = {
		_query : {show : {cartoon : 1}, color : { bgyr : 1}},
		_aligned : {action : {center :1}, show : {ribbon : 1}, color : { br : 1}},
		_alignedresidues : {show : {ballssticks : 1}, color : { alrc : 1}},
		protein : {show : {cartoon : 1}, color : {structure : 1}},
		nucleic : {show : {cartoon : 1}, color : {structure : 1}},
		hetero : {show : {sticks : 1}, color : {cpk : 1}},
		ion : {show : {spheres : 1}, color : {cpk : 1}},
		_mini : {show : {ballssticks : 1}, color : {cpk : 1}},
		_bsite : {show : {sticks : 1}, color : {br : 1}}
	};
	this.type = {_query : "_query", 
		_aligned : "_aligned", 
		_alignedresidues : "_alignedresidues", 
		_ligand : {
			protein : "protein", 
			nucleic : "nucleic", 
			hetero : "hetero", 
			ion : "ion"
		}, 
		_mini : "_mini", 
		_bsite : "_bsite"
	};

	//
	// Update and render the unhidden objects in jsmol viewer.
	//
	this.update = function(objs) {
		for (var i = 0; i < objs.length; i++) {
			this.format(objs[i]);
		}
		this.display(objs);
	};

	//
	// Show object frames
	//
	this.display = function(objs) {
		var cmd = 'frames all;display ';
		for (var i = 0; i < objs.length; i++) {
			cmd += 'file=' + String(objs[i].iframe) 
				+ (i < objs.length - 1 ? ',' : ';');
		}
		console.log(cmd);
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), cmd);
	};
	//
	// Format according to object type.
	//
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
		//~ cmd += (label.atoms == 1 ? "select (protein and *.CA or not protein and not water) and file=" + String(obj.iframe) + ";font label 15;label %m%R;" + ss : "label off;")
		cmd += (label.atoms == 1 ? "select (protein and *.CA or not protein and not water) and file=" + String(obj.iframe) + ";font label 15;label %a;" 
			+ ss : (label.residues == 1 ? "" : "label off;"))
			+ (label.residues == 1 ? "select (protein and *.CA or not protein and not water) and file=" + String(obj.iframe) + ";font label 15;label %n%R;" 
			+ ss : (label.atoms == 1 ? "" : "label off;"));
			//~ + (label.residues == 1 ? "" : "");
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
	
	//
	//  Pretvorimo iz formata ABC v format :A or :B or :C.
	//
	this.convert_chain_id = function(chain_id) {
		var c=":" + chain_id.charAt(0);
		for (i=1;i<chain_id.length;i++) {
			c+=" or :" + chain_id.charAt(i);      
		}
		//c+=")";
		return c;
	};

	//
	// Load pdb file.
	//
	this.load = function(file, app) {
		var cmd = 'load ' + (app ? 'append' : '') + ' ' + file 
			+ '?' + uniqid() + ';' + 'message \"loaded\";';
		console.log(cmd);
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), cmd);
	};

	//
	// Zapamo ligand.
	//
	this.zap = function(iframe) {
		var off = 'zap file=' + String(iframe) + ';';
		Jmol.scriptWait(eval("jmolApplet" + String(this.applet_id)), off);
	};

	//
	// Preberemo id appleta
	//
	this.get_applet_id = function() {
		return String(this.applet_id);
	};

	//
	// Nastavimo target_suffix appleta
	//
	this.set_applet_id = function(applet_id) {
		this.applet_id = applet_id;
	};

	// Nastavimo active frame, ki je trenutno izbrani query ali aligned.
	//
	this.set_active_frame = function(active_frame) {
		this.active_frame = active_frame;
	};

	//
	// Nastavimo stevilo frame-ov
	//

	this.set_nframe = function(nframe) {
		this.nframe = nframe;
	};

	//
	// Preberemo stevilo frame-ov
	//
	this.get_nframe = function() {
		return Number(this.nframe);
	};

	//
	// Prikazemo atome, ki so < d angstremov od selektiranega atoma. Zraven odznacimo prejsnje selekcije.
	//
	this.highlight = function(sele, d) {
		var selector = "none";
		if (sele != null) {
			var s = sele.split(" ");
			selector = "protein and file=" + String(this.active_frame) 
				+ " and within(group, within(" + String(d) + ", " + s[0] + "))";
		}	
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), 'highlight("' 
			+ selector + '");');
	};

	//
	// Prikazemo atome, ki so < d angstremov od selektiranega atoma. Zraven odznacimo prejsnje selekcije.
	//
	this.bs = function(sele, d, cid) {
		var chain_id = this.convert_chain_id(cid);
		var selector = "none";
		if (sele != null) {
			selector = "protein  and (" + chain_id + ") and file=" 
				+ String(this.active_frame) + " and within(group, within(" 
				+ String(d) + ", " + sele + "))";
		}	
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), 'highlight("' 
			+ selector + '");');
	};

	//
	// Prikazemo atome, ki so < d angstremov od selektiranega atoma. Zraven odznacimo prejsnje selekcije.
	//
	this.residue_numbers = function(sele) {
		var selector = sele + ' and protein';
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), 'highlight("' + selector + '");');
	};

	//
	// Spacefill za trenutno vidni query protein.
	//
	this.spacefill = function(frame, c, on) {
		color = '0.' + String(c);
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), 'sfill(' + color + ',"' + String(on) + '","' + String(frame) + '", "' + this.query_chain + '");');
		//~ Jmol.script(eval("jmolApplet" + String(this.applet_id)), 'sfill(' + color + ',"' + String(on) + '","' + String(this.active_frame) + '", "' + this.query_chain + '");');
	};

	//
	// Vklopimo/izklopimo hetero!
	//
	this.hetero = function(on, iframe) {
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), 'hetero(' + String(on) + ',' + String(iframe) + ');');
	};

	//
	// Downloadamo PNG sliko
	//
	this.write_png = function(file) {
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), 'antialiasDisplay=true;write PNG "picture_' 
			+ __qpdb + __qcid + '_' + uniqid() + '.png";antialiasDisplay=false;');
	};

	//
	// Background
	//
	this.background = function(how) {
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), 'background=' + how + ';');
	};
	
	

	//
	// Pozenemo direktno karkoli
	//
	this.script = function(script) {
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), script);
	};

	//
	// Load query protein
	//
	this.load_query = function(pdb_file, chain_id) {
		this.query_chain = this.convert_chain_id(chain_id);
		this.load(pdb_file, this.query_loaded ? true : false);
		this.query_loaded = true;
	};


	//
	// select temperature range
	//

	this.select_temp_range = function(selectedCommand) {
		var jsmolCommand = "select all; \
							spacefill off; \
							"+selectedCommand+"; \
							spacefill; \
							select none;";
		Jmol.script(eval("jmolApplet" + String(this.applet_id)), jsmolCommand);
	}
}

var jml = new Jml();

