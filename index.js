var jligs = { protein : [], nucleic : [], hetero : [], ion : []};
// barve za barvno lestvico
var colors_bgyr = ["#0000FF", "#004080", "#008000", "#80C000", "#55AA00","#AAD500", "#FFFF00", "#FFAA00", "#FF5500", "#FF0000"];
var colors_br = ["#0000FF", "#1C00E3", "#3900C6", "#5500AA", "#71008E", "#8E0071", "#AA0055", "#C60039", "#E3001C", "#FF0000"];
var colors_wg = ["#FFFFFF", "#E3F1E3", "#C6E3C6", "#AAD5AA", "#8EC78E", "#71B871", "#55AA55", "#399C39", "#1C8E1C", "#008000"];
var colors_wb = ["#FFFFFF", "#E3E3E3", "#C6C6C6", "#AAAAAA", "#8E8E8E", "#717171", "#555555", "#393939", "#1C1C1C", "#000000"];

var jmol_info = {
	width: "100%",
	height: "100%",
	debug: false,
	color: "0xFFFFFF",
	addSelectionOptions: false,
	//serverURL: __bin_address +"/" + __jmol + "/php/jsmol.php",
	use: "HTML5 JAVA",
	j2sPath: "jsmol-14.6.1_2016.07.11/j2s",
	readyFunction: applet_loaded,
	script: 'script jmol.txt' + '?' + uniqid() + '; set loadstructcallback "jmol_load"; set messagecallback "jmol_message";',
	//jarPath: "java",
	//jarFile: (useSignedApplet ? "JmolAppletSigned.jar" : "JmolApplet.jar"),
	//isSigned: useSignedApplet,
	disableJ2SLoadMonitor: true,
	disableInitialConsole: true,
	allowJavaScript: true
	//defaultModel: "$dopamine",
	//console: "none", // default will be jmolApplet0_infodiv
};


// init jsmol 
$(document).ready(function() {
	setTimeout(function() {
		// dolocis width okna za applet - nujno zaradi 100% v jmolApplet!
		Jmol.setDocument(0);
		jml.set_applet_id(0);
		var local_jmolApplet=Jmol.getApplet("jmolApplet0", jmol_info);
		$('#jmlfun').html(Jmol.getAppletHtml(local_jmolApplet));
	}, 0);
});

//
// Inicializiramo in resizamo stran.
//
$(document).ready(function() {

	legend.init($( "#draggable"));
	
});


//
// Get ligand object from ligand string
//
var ligand_obj = function(str) {
	var tok = str.split(':');
	var c = String(tok[1]) + ':' + String(tok[2]) + ':' + String(tok[3]) 
		+ ':' + String(tok[4]) + ':' + String(tok[5]) + ':' + String(tok[6]) 
		+ ':' + String(tok[7]); // without cluster_id in front
	var f = c.replace(/ /g, "_");
	var url = window.location.protocol + "//" + window.location.host 
		+ window.location.pathname.split(/\/[^\/]*$/)[0] + "/" + __results_dir;
	return {
		cluster_id      : tok[0],
		resn            : String(tok[1]),
		resi            : tok[2],
		chain_id        : String(tok[3]),
		model_number    : tok[4],
		assembly_number : tok[5],
		molecule_name   : String(tok[6]),
		mols_name       : String(tok[7]),
		name            : String(tok[8]),
		spec            : String(tok[9]),
		z_score         : String(tok[10]),
		code            : c,
		cmplxfile       : 'cmplx_' + f + '.pdb',
		ligfile         : f + '.pdb',
		bsifile         : 'bs3d_' + f + '.pdb',
		//~ bscharmm        : 'charmm_' + f + '.json',
		results_dir     : __results_dir,
		query_file		: __qpdb + ".cons.pdb",
		qcid			: __qcid,
		results_url		: url
		//~ pdb_url			: window.location.protocol + "//" + window.location.host + window.location.pathname.split(/\/[^\/]*$/)[0] + "/" + __results_dir + "/" + 'cmplx_' + f + '.pdb'
		//~ pdb_url			: results_url + "/" + 'cmplx_' + f + '.pdb'
		//~ ligand_mol2		: results_url + "/" + 'ideal_' + f + '.pdb'
	};
};

//
// Prikazemo ligand(e) v jmol-u.
//
var v3dl = function() {
	var $this = $(this);
	$this.parents("tr").addClass("ui-state-highlight");
	var arr = $this.attr('class').split(" ")[1].split("_"); // e.g., v3dl_protein_1_2
	var ligand_type = String(arr[1]);
	var cluster_id = Number(arr[2]);
	var index = Number(arr[3]);
	var ligand = JSON.parse(JSON.stringify(jligs[ligand_type][cluster_id][index])); // copy object
	ligand['id'] = "ligand_"+viewed.get_id();
	$this.html("Remove");
	var f_remove = function() {
		jml.zap(viewed.remove(ligand));
		jml.update(viewed.get_unhidden());
		legend.update(viewed.get_viewed());
		$this.html("View 3D");
		var $row = $this.parents("tr");
		if ($row.find("[class^=v3dl]").html() == "View 3D") {
			$row.removeClass("ui-state-highlight");
		}
		$this.unbind('click').click(v3dl);
	};
	$this.unbind('click').click(f_remove);
	var $loading = $('#loading');
	$loading.removeClass('ui-helper-hidden');
	$.post('v3dl.php', ligand, 
		function(data) {
			// dodamo ligand, stevilko frame-a, in zadnji frame v jsmol v viewed
			ligand["remove"] = f_remove; // add new property to ligand object
			ligand["iframe"] = jml.get_nframe() + 1; // add new property to ligand object
			ligand["type"] = ligand_type; // add new property to ligand object
			ligand["file"] = __results_dir + "/" + ligand.ligfile; // add new property to ligand object
			ligand["hidden"] = false;
			ligand["format"] = new Format(jml.frm[ligand_type]);
			ligand["name"] = ligand.name.toLowerCase().capitalize();
			console.log("format of cartoon[" + ligand_type + "] = " + ligand.format.show.cartoon
				+ " " + jml.frm.protein.show.cartoon + " " + jml.type._query);
			viewed.push(ligand);
			console.log(ligand.file);
			jml.load(ligand.file, true);
			jml.update(viewed.get_unhidden());
			legend.update(viewed.get_viewed());
		});
};


//
// Query protein oz. biounit prikazemo v jmol-u.
//
var query = function(assembly_number) {

	var queryobj = {
		assembly_number : assembly_number,
		hidden : false,
		iframe : jml.get_nframe() + 1, 
		type : jml.type._query,
		file : 'files/1sup.pdb',
		format : new Format(jml.frm._query),
		name : '1sup',
		id: "protein_"+viewed.get_id()
	};
	if (viewed.push(queryobj)) {
		jml.load_query(queryobj.file, 'A');
		jml.update(viewed.get_unhidden());
		legend.update(viewed.get_viewed());
	}
};


