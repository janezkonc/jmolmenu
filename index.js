
/** Callback function executed when jmol applet is loaded
 * 
 */

var applet_loaded = function() {
	
	setTimeout(function() {
		
		// add click handlers for buttons to load different molecules to jmol
		jmolMenu.add_item({type:"all", name:"All"});
		$(":button").eq(0).click(function() {
			jmolMenu.add_item({type:"protein", file:"files/1sup.pdb", name:"Protein"});
		});
		$(":button").eq(1).click(function() {
			jmolMenu.add_item({type:"compound", file:"files/pms.pdb", name:"Compound"});
		});
		$(":button").eq(2).click(function() {
			jmolMenu.add_item({type:"ion", file:"files/ions.pdb", name:"Ions"});
		});
		$(":button").eq(3).click(function() {
			jmolMenu.add_item({type:"water", file:"files/h2o.pdb", name:"H2O"});
		});
	}, 0);	
};

/** Callback function, executed when we load or remove (zap) a file in jmol applet
 * 
 */
var jmol_load = function(a,b,c,d,e,f,g,h) {
	var hh = '' + h;
	// update jml.nframe ! 
	f = Number(String(hh).split('.')[0]);
	jml.set_nframe(f);
	jml.set_active_frame(f);
};

/** Callback that gets executed when message command is issued (when load append of files has finished
 * 
 */
var jmol_message = function(a,b,c,d,e,f,g,h) {
	var bb = '' + b;
	if (bb == 'loaded') {
		// notify user that loading has finished
		$('#loading').addClass('ui-helper-hidden')
	}
};


/** Init jsmol 
 * 
 */
$(document).ready(function() {
	setTimeout(function() {

		Jmol.setDocument(0);
		jml.set_applet_id(0);

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
			script: 'set loadstructcallback "jmol_load"; set messagecallback "jmol_message";',
			//jarPath: "java",
			//jarFile: (useSignedApplet ? "JmolAppletSigned.jar" : "JmolApplet.jar"),
			//isSigned: useSignedApplet,
			disableJ2SLoadMonitor: true,
			disableInitialConsole: true,
			allowJavaScript: true
			//defaultModel: "$dopamine",
			//console: "none", // default will be jmolApplet0_infodiv
		};
	
		var local_jmolApplet=Jmol.getApplet("jmolApplet0", jmol_info);
		$('#jmlfun').html(Jmol.getAppletHtml(local_jmolApplet));

	}, 0);
});

/** Init jmolMenu
 * 
 */
$(document).ready(function() {

	jmolMenu.init($("#draggable"));
	$("#info-to-users").fadeOut("slow");
});


