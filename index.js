var jligs = { protein : [], nucleic : [], hetero : [], ion : []};
// barve za barvno lestvico
var colors_bgyr = ["#0000FF", "#004080", "#008000", "#80C000", "#55AA00","#AAD500", "#FFFF00", "#FFAA00", "#FF5500", "#FF0000"];
var colors_br = ["#0000FF", "#1C00E3", "#3900C6", "#5500AA", "#71008E", "#8E0071", "#AA0055", "#C60039", "#E3001C", "#FF0000"];
var colors_wg = ["#FFFFFF", "#E3F1E3", "#C6E3C6", "#AAD5AA", "#8EC78E", "#71B871", "#55AA55", "#399C39", "#1C8E1C", "#008000"];
var colors_wb = ["#FFFFFF", "#E3E3E3", "#C6C6C6", "#AAAAAA", "#8E8E8E", "#717171", "#555555", "#393939", "#1C1C1C", "#000000"];

var aminoAcids = {
  A: "Ala", R: "Arg", N: "Asn",
  D: "Asp", C: "Cys", E: "Glu",
  Q: "Gln", G: "Gly", H: "His",
  I: "Ile", L: "Leu", K: "Lys",
  M: "Met", F: "Phe", P: "Pro",
  S: "Ser", T: "Thr", W: "Trp",
  Y: "Tyr", V: "Val"
};

var jmol_info = {
	width: "100%",
	height: "100%",
	debug: false,
	color: "0xFFFFFF",
	addSelectionOptions: false,
	//serverURL: __bin_address +"/" + __jmol + "/php/jsmol.php",
	use: "HTML5 JAVA",
	j2sPath: __jmol + "/j2s",
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

//	//
//	// Inicializiramo in resizamo stran.
//	//
//	$(document).ready(function() {
//		init_results_page();	
//		
//	});
//	
//	
//	//
//	// F-ja, ki inicialzira CELOTNO results page (vkljucno z ligandi in frames)
//	//
//	var init_results_page = function() {
//		// results page - init standarndnega dela probisa
//		warn_jdat_empty();
//		init_jmol();
//		init_pdb_chain_id();
//		// handlerji za tabs-e
//		init_tabs();
//		// jqgrid tabela podobnih proteinov
//		init_simprot();
//		init_ligands(jml.type._ligand.protein);
//		init_ligands(jml.type._ligand.nucleic);
//		init_ligands(jml.type._ligand.hetero);
//		init_ligands(jml.type._ligand.ion);
//		set_view_control(jml.type._ligand.protein);
//		set_view_control(jml.type._ligand.nucleic);
//		set_view_control(jml.type._ligand.hetero);
//		set_view_control(jml.type._ligand.ion);
//		$(window).resize();
//		legend.init($( "#draggable"));
//		set_color_range("colors_bgyr", "");
//	};
//	
//	//
//	// Inicializiramo tabs-e in subtitle v probis bannerju.
//	//
//	var init_tabs = function() {
//		$('#tabs').tabs();
//		$('#ligands-tab').tabs(); // the following doesn't work anymore:	$('#ligands-tab').tabs('destroy').tabs();
//		// if pairwise select the Similar Proteins tab
//		if (__pairwise)
//			$('#tabs').tabs("option", "active", 1);
//	};
//	
//	//
//	// Inicializiramo PDB/Chain ID-je na strani
//	//
//	var init_pdb_chain_id = function() {
//		$('#__NALI').html(jdat.length);
//		$('.__QPDB').html(__qpdb);
//		$('#__QCID1').html(convert_chain_id(__qcid));
//		$('#__QCID2').html(__qcid);
//		$('#title-bar .__QPDB').html(converter.to_url(__qpdb.toUpperCase(), "pdb"));
//	};
//	
//	
//	//
//	// change from align number dropdown selection
//	//
//	var change_alignment = function(rank) {
//	
//		var selectedAlignment = $("#alignment_num_"+rank ).val();
//		var z_score = jdat[rank].alignment[selectedAlignment].scores.z_score;
//		$("#z_score_span_"+rank).text(Number(z_score).toFixed(2));
//	
//		var legendObject = viewed.get_viewed();
//		var bool3D = false;
//		$.each( legendObject, function( index, object ){
//			if (object.type == "_aligned" && object.index == rank && object.alignment_no == selectedAlignment) {
//				bool3D = true;
//			}
//		});
//	
//		var cl = "href " + String(rank) + "#" + String(0);
//		var btn = document.getElementsByClassName(cl)[0];
//		
//		if (btn.innerHTML == "Remove" && bool3D == false) {
//			$btn = $(document.getElementsByClassName(String(rank) + "#" + String(0))[0]);
//			$btn.html("View 3D");
//		}
//		else if (btn.innerHTML == "View 3D" && bool3D) {
//			$btn = $(document.getElementsByClassName(String(rank) + "#" + String(0))[0]);
//			$btn.html("Remove");
//		}
//	
//	
//		if ($('.alignment_ozadje').is(":visible") == true ) {
//			$('#alignment_close').click();
//		}
//		
//	}
//	
//	
//	//
//	// Inicializiramo jqgrid z listo podobnih proteinov.
//	//
//	var init_simprot = function() {
//		jQuery("#list4").jqGrid({ 
//			datatype: "local", 
//			colNames:['Rank', 'Align #', 'Alignments', 'Chain', 'Name', 'Pfam', 'SCOP', 'UniProt', 'Z-Score'], 
//			colModel:[ 
//				{name:'rank',index:'rank', width:15, align:"center", sorttype:"int", sortable:true},
//				{name:'alignment_num',index:'alignment_num', width:13, align:"center", sortable:false, title:false},
//				{name:'alignments',index:'alignments', width:26, align:"center", sortable:false, title:false},
//				{name:'pdb_id',index:'pdb_id', width:15, align:"center", sortable:true},
//				{name:'name',index:'name', align:"right", width:70, sortable:true},
//				{name:'pfam',index:'pfam', align:"center", width:20, sortable:true},
//				{name:'scop',index:'scop', align:"center", width:20, sortable:true,hidden:false},
//				{name:'uniprot',index:'uniprot', align:"center", width:20, sortable:true,hidden:false},
//				{name:'z_score',index:'z_score', align:"center", width:20, sortable:false}
//				], 
//			rowNum:100000,
//	//		rowList:[10,20,30],
//			pager: '#pager9',
//			forceFit : true,
//	//		loadonce: true,
//	//		autowidth : true,
//			pginput: false,
//			pgbuttons: false,
//			altRows: true,
//			altclass: 'even',
//			multiselect: false,
//			caption: "<a id='download_csv_table' title='Download Table as CSV File' href='#'><img style='border:none' src='slike/fileicons/csv.png'></img> Download Table</a>",
//			viewsortcols: [true,'vertical',true],
//			gridComplete: function () {
//				// na zacetku in po vsakem sortiranju re-buildamo handlerje za click na 'View'
//				
//				$('#list4').find("[class*=\\#]").unbind('click').click(view3d_alignment_button);
//				console.log("pairwise = " + __pairwise);
//				// click on the first view if in pairwise mode
//				if (__pairwise) {
//					$('#list4').find("[class*=\\#]").first().click();
//				}
//					
//				$('#download_csv_table').unbind('click').click(function() { 
//					var rows = jQuery("#list4").getRowData();
//					var data='{"selected_ranks":[';  // selectane stevilke vrstic v json format
//					for (i = 0; i < rows.length; i++)
//						data += String(rows[i]['rank']) + (i==rows.length-1?'':',');
//					data +='],';
//					data += '"results_dir": "' + __results_dir + '",';
//					data += '"qprotein": "' + __qpdb + __qcid + '"}'
//					download("export_simprot_table.php", data);
//	
//				});
//			} 
//	//		caption: "Manipulating Array Data" 
//		}); 
//		var row = new Array();
//		for(var i=0;i<jdat.length;i++) { 
//			var z_score = jdat[i].alignment[0].scores.z_score;
//	
//			if (jdat[i].alignment.length > 1) {
//				var alignmentHtml = "<div><select id='alignment_num_"+i+"' \
//									onchange='change_alignment("+i+")' \
//									class='dropdown_alignments'> \
//									<option value='0' selected>0</option>";
//				for (var j = 1; j < jdat[i].alignment.length; j++) {
//					alignmentHtml += "<option value='"+j+"'>"+j+"</option>";
//				}
//				alignmentHtml += "</select></div>";
//			}
//			else {
//				var alignmentHtml = "<div><span>0</span></div>";
//			}
//	
//	
//			row.push({"rank":i+1, 
//					"alignments": "<span class='span_align' align='center' style='vertical-align:middle; display: table-cell; float:left;'> \
//								<button id='button' class='href " + String(i) + "#" + String(0) + "' style = 'float:left;' title='View 3D' \
//								 >View 3D</button> \
//								<img src='slike/table.png' alt='Tabular View' class='table_image' title='View in table' id='table_"+String(i) + "_" + String(0)+"'> \
//								</span>",
//					"alignment_num": alignmentHtml,
//					"pdb_id":converter.to_url(jdat[i].pdb_id+"."+jdat[i].chain_id, "probis"),
//					"name": jdat[i].name.toLowerCase().capitalize(),
//					"pfam":converter.to_url(jdat[i].pfam_id, "pfam"),
//					"scop":converter.to_url(jdat[i].scop_id, "scop"),
//					"uniprot":converter.to_url(jdat[i].uniprot_id, "uniprot"),
//					"z_score":"<span id='z_score_span_"+i+"' style='background:"+(z_score>2?"lightgreen":(z_score<1?"red":"yellow"))+" \
//									'>"+Number(z_score).toFixed(2)+"</span>"
//				});
//	
//		}
//		jQuery("#list4").jqGrid('addRowData', row.rank, row);
//		// za searchanje in Column Chooser	
//		jQuery("#list4").jqGrid('navGrid','#pager9',{add:false,edit:false,del:false,search:true,refresh:false});
//		jQuery("#list4").jqGrid('navButtonAdd','#pager9',{
//			caption: "Columns",
//			title: "Reorder Columns",
//			onClickButton : function (){
//				jQuery("#list4").jqGrid('columnChooser');
//			}
//		});
//	
//		if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
//			$(".span_align").css({"margin":"-15px 0 0 0"});
//		}
//	};
//	
//	//
//	// Get ligand object from ligand string
//	//
//	var ligand_obj = function(str) {
//		var tok = str.split(':');
//		var c = String(tok[1]) + ':' + String(tok[2]) + ':' + String(tok[3]) 
//			+ ':' + String(tok[4]) + ':' + String(tok[5]) + ':' + String(tok[6]) 
//			+ ':' + String(tok[7]); // without cluster_id in front
//		var f = c.replace(/ /g, "_");
//		var url = window.location.protocol + "//" + window.location.host 
//			+ window.location.pathname.split(/\/[^\/]*$/)[0] + "/" + __results_dir;
//		return {
//			cluster_id      : tok[0],
//			resn            : String(tok[1]),
//			resi            : tok[2],
//			chain_id        : String(tok[3]),
//			model_number    : tok[4],
//			assembly_number : tok[5],
//			molecule_name   : String(tok[6]),
//			mols_name       : String(tok[7]),
//			name            : String(tok[8]),
//			spec            : String(tok[9]),
//			z_score         : String(tok[10]),
//			code            : c,
//			cmplxfile       : 'cmplx_' + f + '.pdb',
//			ligfile         : f + '.pdb',
//			bsifile         : 'bs3d_' + f + '.pdb',
//			//~ bscharmm        : 'charmm_' + f + '.json',
//			results_dir     : __results_dir,
//			query_file		: __qpdb + ".cons.pdb",
//			qcid			: __qcid,
//			results_url		: url
//			//~ pdb_url			: window.location.protocol + "//" + window.location.host + window.location.pathname.split(/\/[^\/]*$/)[0] + "/" + __results_dir + "/" + 'cmplx_' + f + '.pdb'
//			//~ pdb_url			: results_url + "/" + 'cmplx_' + f + '.pdb'
//			//~ ligand_mol2		: results_url + "/" + 'ideal_' + f + '.pdb'
//		};
//	};
//	
//	//
//	// Prikazemo ligand(e) v jmol-u.
//	//
//	var v3dl = function() {
//		var $this = $(this);
//		$this.parents("tr").addClass("ui-state-highlight");
//		var arr = $this.attr('class').split(" ")[1].split("_"); // e.g., v3dl_protein_1_2
//		var ligand_type = String(arr[1]);
//		var cluster_id = Number(arr[2]);
//		var index = Number(arr[3]);
//		var ligand = JSON.parse(JSON.stringify(jligs[ligand_type][cluster_id][index])); // copy object
//		ligand['id'] = "ligand_"+viewed.get_id();
//		$this.html("Remove");
//		var f_remove = function() {
//			jml.zap(viewed.remove(ligand));
//			jml.update(viewed.get_unhidden());
//			legend.update(viewed.get_viewed());
//			$this.html("View 3D");
//			var $row = $this.parents("tr");
//			if ($row.find("[class^=v3dl]").html() == "View 3D") {
//				$row.removeClass("ui-state-highlight");
//			}
//			$this.unbind('click').click(v3dl);
//		};
//		$this.unbind('click').click(f_remove);
//		var $loading = $('#loading');
//		$loading.removeClass('ui-helper-hidden');
//		$.post('v3dl.php', ligand, 
//			function(data) {
//				// dodamo ligand, stevilko frame-a, in zadnji frame v jsmol v viewed
//				ligand["remove"] = f_remove; // add new property to ligand object
//				ligand["iframe"] = jml.get_nframe() + 1; // add new property to ligand object
//				ligand["type"] = ligand_type; // add new property to ligand object
//				ligand["file"] = __results_dir + "/" + ligand.ligfile; // add new property to ligand object
//				ligand["hidden"] = false;
//				ligand["format"] = new Format(jml.frm[ligand_type]);
//				ligand["name"] = ligand.name.toLowerCase().capitalize();
//				console.log("format of cartoon[" + ligand_type + "] = " + ligand.format.show.cartoon
//					+ " " + jml.frm.protein.show.cartoon + " " + jml.type._query);
//				viewed.push(ligand);
//				console.log(ligand.file);
//				jml.load(ligand.file, true);
//				jml.update(viewed.get_unhidden());
//				legend.update(viewed.get_viewed());
//			});
//	};
//	
//	//
//	// Resizamo zavihek z listo podobnih proteinov.
//	//
//	var resize_tabs = function(table_id) {
//		var $lst = $('#tabs');
//		var w = $lst.width();
//		var h = $lst.height();
//		jQuery(table_id).jqGrid('setGridWidth', w-2)
//				.jqGrid('setGridHeight', h-81-28);
//	};
//	
//	//
//	// Dobimo ligande, posortirane po cluster_id iz jdat.
//	//
//	var get_ligand_clusters = function(ligand_type) {
//		for(var i=0;i<jdat.length;i++) { 
//			if (jdat[i][ligand_type]) {
//				for (var j=0; j<jdat[i][ligand_type].length; j++) {
//					var ligand = ligand_obj(jdat[i][ligand_type][j] 
//								+ ":" + jdat[i]["alignment"][0]["scores"]["z_score"]
//								); // make object
//					while (ligand.cluster_id >= jligs[ligand_type].length) jligs[ligand_type].push(new Array());
//					jligs[ligand_type][ligand.cluster_id].push(ligand);
//					//~ if (ligand.cluster_id == 0) alert("is zero");
//				}
//			}
//		}
//	};
//	
//	//
//	// pogled bsites tabs
//	//
//	var set_view_control = function(ligand_type) {
//		
//		var tmpSize = jligs[ligand_type].length-1;
//		if ($('.right-floated').width() < eval(tmpSize*116)) {
//			
//			if (tmpSize < 10) {
//				$("#pogled-tabs-"+ligand_type).css("width",tmpSize*116+5);		
//			}
//			else {
//				$("#pogled-tabs-"+ligand_type).css("width",tmpSize*125+5);
//			}
//			
//			$("#bsite-tabs-"+ligand_type).bind("mousemove", function (e) {
//				var tmp =(-1)*(e.pageX-$('.right-floated').offset().left-20)/$('.right-floated').width();
//				$('#pogled-tabs-'+ligand_type).css('left',tmp*($('#pogled-tabs-'+ligand_type).width()-$('.right-floated').width()));
//			});
//		}
//			
//	};
//	
//	
//	//
//	// Inicializiramo jqgrid z ligandi.
//	//
//	var init_ligands = function(ligand_type) {
//		// format the specific / non-specific column
//	 	var spec_formatter = function(cellvalue, options, rowObject) { 
//			return (cellvalue == "N" ? "Non-specific" : "Specific"); 
//		};
//		var $lig_tab = jQuery("#tab-" + ligand_type);
//		get_ligand_clusters(ligand_type); // fill the jligs
//		var clusters = jligs[ligand_type];
//		console.log(ligand_type + "-" + String(clusters.length));
//	
//		if (clusters.length == 0) { $lig_tab.html("Nothing was found!"); return; }
//		
//		// create the tabs for predicted ligand clusters
//		var html = "<div id='clusters-tab-" + ligand_type + "'>";
//		html += "<div id='bsite-tabs-"+ligand_type+"' class='bsite-tabs'><div id='pogled-tabs-"+ligand_type+"' class='pogled-tabs'><ul>";
//	
//		for(var i=1; i < clusters.length; i++) { // referee 1 FIX
//			if (typeof clusters[i] !== 'undefined') {
//				var nm = ligand_type + "-" + String(i);
//				html += "<li><a href='#tab-" + nm + "'><span>Binding Site " + String(i) + "</span></a></li>";
//			}
//		}
//		html += "</ul></div></div>";
//		// create containers for the tabs where the actual data will be
//		for(var i=1; i < clusters.length; i++) { // referee 1 FIX
//			if (typeof clusters[i] !== 'undefined') {
//				var nm = ligand_type + "-" + String(i);
//				html += "<div id='tab-" + nm + "'><table id='table-" + nm 
//					+ "'></table><div id='pager-" + nm +"'></div></div>";
//			}
//		}
//		html += "</div>"; // -- end clusters-tab
//		$lig_tab.append(html);
//	
//		// initialize binding site tabs
//		$("#clusters-tab-" + ligand_type).tabs();
//	
//		// fill the tables with ligands data
//		for(var i=1; i < clusters.length; i++) { // referee 1 FIX
//			if (typeof clusters[i] !== 'undefined') {
//				var nm = ligand_type + "-" + String(i);
//				var $lig_table = jQuery("#table-" + nm);
//				$lig_table.jqGrid({ 
//					datatype: "local", 
//					colNames:['Structure', 'Name', 'Source', 'Confidence', 'Binder', 'Ligand'], 
//					colModel:[ 
//						{name:'structure',index:'structure', width:50, align:"center", sortable:false},
//						{name:'name',index:'name', align:"right", width:70, sortable:true},
//						{name:'pdb_id',index:'pdb_id', width:15, align:"center", sortable:true},
//						{name:'z_score',index:'z_score', align:"center", width:20, sortable:false, sorttype:"float"},
//						{name:'spec',index:'spec', align:"center", width:20, sortable:false, hidden:false, formatter:spec_formatter},
//						{name:'view3d',index:'view3d', align:"center", width:20, sortable:true}
//						], 
//					rowNum:100000,
//			//		rowList:[10,20,30],
//					pager: '#pager-' + nm,
//					forceFit : true,
//			//		loadonce: true,
//					//~ autowidth : true,
//					pginput: false,
//					pgbuttons: false,
//					altRows: true,
//					altclass: 'even',
//					multiselect: false,
//					caption: "<a id='download_csv_table_"+nm+"' title='Download Predicted Ligands as CSV File' href='#'><img style='border:none' src='slike/fileicons/csv.png'></img> Download Table</a>",
//					viewsortcols: [true,'vertical',true],
//					gridComplete: function () {
//						// na zacetku in po vsakem sortiranju re-buildamo handlerje za click na 'View 3D'
//						console.log("firing ligand gridComplete");
//						$lig_table.find("[class*=v3dl]").unbind('click')
//						.click(v3dl);
//						$('#download_csv_table_'+nm).unbind('click').click(function() { 
//							
//							var array = [ jligs.hetero, jligs.protein, jligs.nucleic, jligs.ion ];
//							var names = [ "small molecules", "proteins", "nucleic", "ion"];
//							
//							var csvContent = "Type\tMolecule Name\tResidue Name\tSource\tConfidence\tBinder\n";
//							for (var k = 0; k < array.length; k++) {
//	
//								var dataLig = array[k];
//								csvContent += "\n"+names[k]+"\n";
//	
//								for(var i = 1; i < dataLig.length; i++) {
//									csvContent += "Binding Site "+i+"\n";
//									for(var j=0; j < dataLig[i].length; j++) {
//										if (k  == 0 || k == 3) {
//											dataString = "\t"+dataLig[i][j].name+"\t"+dataLig[i][j].resn+"\t"+dataLig[i][j].molecule_name.substr(0, 4)+"\t"+dataLig[i][j].z_score+"\t";	
//										}
//										else 
//											dataString = "\t"+dataLig[i][j].name+"\t\t"+dataLig[i][j].molecule_name.substr(0, 4)+"\t"+dataLig[i][j].z_score+"\t";
//										if (dataLig[i][j].spec == "S")
//											dataString += "Specific";
//										else if (dataLig[i][j].spec == "N")
//											dataString += "Non-specific";
//										else
//											dataString += dataLig[i][j].spec;
//								   		csvContent += dataString+ "\n";
//									}
//								}
//							}
//	
//							downloadTable("downloadTable.php", "predlig_"+ __qpdb + __qcid +".csv", csvContent);
//						});
//					},
//					//~ viewrecords:true,
//					sortname: 'z_score',
//					sortorder: 'desc'
//				});
//				var row = new Array();
//				var row_id = 1;
//				for(var j=0; j < clusters[i].length; j++) {
//					var ligand = clusters[i][j];
//					var id = ligand_type + "_" + String(i) + "_" + String(j);
//					row.push({
//							"rank":row_id++, 
//							"structure":"<img style='width:50px;height:50px;padding:5px' src='data/lig/" + 
//										(ligand_type == "protein" ? "protimages/" + ligand.molecule_name.substr(0, 4) + ligand.chain_id + ".100.png'></img>" :
//										(ligand_type == "nucleic" ? "nuclimages/" + ligand.molecule_name.substr(0, 4) + ligand.chain_id + ".100.png'></img>" :
//										"images/" + ligand.resn + "_100.gif'></img>")),
//							"name": ligand.name.toLowerCase().capitalize(),
//							"pdb_id": converter.to_url(ligand.molecule_name.substr(0, 4), "pdb"), 
//							"z_score": ligand.z_score,
//							"spec": ligand.spec,
//							"view3d": "<button id='button' class='href v3dl_" + id + "'>" + "View 3D" + "</button> "
//						});
//				}
//				$lig_table.jqGrid('addRowData', row.rank, row);
//				$lig_table.trigger("reloadGrid");
//			}
//		}
//	};
//	
//	//
//	// Dobimo pozicijo objekta in njegovo visino ter sirino.
//	//
//	var get_position_size = function($obj) {
//		var startPos = $obj.offset();
//		startPos.width = $obj.width();
//		startPos.height = $obj.height();
//		return startPos;
//	};
//	
//	//
//	// F-ja za submitanje podatkov php skriptu.
//	//
//	var download = function(phpscript, data) {
//	
//	    /*
//	    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
//	       $.ajax({
//	           url: phpscript,
//		   type: "POST",
//		   data: encodeURIComponent(data),
//		   dataType: "HTML",
//		   success: function(csvdata){
//			  downloadTable("downloadTable.php", "simProtTable_"+__qpdb+__qcid+".csv", csvdata);
//			  }
//		      });
//	    }
//	    else {
//		var $body = $('body');
//		$body.append('<a target="_blank" id="dnl" href="' + phpscript + '?data=' 
//			     + encodeURIComponent(data) + '"></a>');
//		var $dnl = $('#dnl');
//		$dnl[0].click();
//		$dnl.remove();
//		}
//		*/
//	    var $body = $('body');
//	    $body.append('<a target="_blank" id="dnl" href="' + phpscript + '?data=' 
//			 + encodeURIComponent(data) + '"></a>');
//	    var $dnl = $('#dnl');
//	    $dnl[0].click();
//	    $dnl.remove();
//	    
//	};
//	
//	var downloadTable = function(phpscript, filename, data) {
//	
//		$.ajax({
//			url: phpscript,
//			type: "POST",
//			data: {data : data, filename: filename, dir : __results_dir},
//			success: function(fileLoc){
//				//document.location.href = fileLoaction;
//	
//			    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
//				window.location.href = fileLoc; // i guess its better then nothing
//			    }
//			    else {
//				window.open(fileLoc);
//			    }
//			    /*
//				if ("probis_align_residues.csv" == filename || 
//				    ( navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome')) == -1) {
//					window.open(fileLoc, "_blank");
//				}
//				else {
//					setTimeout(function(){
//						document.location.href = fileLoc;}
//					,250);
//				}
//				*/
//			}
//		});
//	}
//	
//	//
//	// Inicializiramo jmol kontrole.
//	//
//	var init_jmol = function() {
//		// inicializiramo seznam z bioloskimi uniti
//		var $bu = $('#bio-units');
//		$bu.html('');
//		for (i in __biof) {
//			if (i == 0)
//				$bu.append('<option>Asymmetric Unit</option>');
//			else
//				$bu.append('<option>Biological Unit ' + String(i) + '</option>');
//		}
//		// nalozimo izbrani bioloski unit v jmol oknu
//		$bu.unbind().change(function() {
//			var i = $(this).prop('selectedIndex');
//			query(i);
//		});
//		//	inicializiramo download gumb
//		$('.download').unbind('click').click(function() {
//			var data = '{"filenames":';
//			data += '[';
//			//~ var v = viewed.get_viewed_objects();
//			var v = viewed.get_unhidden();
//			for (var i = 0; i < v.length; i++) {
//				data += '"' + v[i].file + '"' + (i == v.length - 1 ? '' : ',');
//			}
//			data += ']';
//			data += ',';
//			data += '"qpdb":"' +  __qpdb + '",';
//			data += '"qcid":"' +  __qcid + '"';
//			data += '}';
//			download('download.php', data);
//		});
//		//	inicializiramo download slike
//		$('.dwnpng').unbind('click').click(function() {
//			jml.write_png();
//		});
//		//	inicializiramo background gumb
//		$('.bckgrnd').unbind('click').click(function() {
//			var $butt = $(this);
//			if ($butt.html() == "Black Background") {
//				if ($(".right-floated").is(':hidden')) {	
//					$("#tab_btns").css("background-color","white");		
//				}
//				jml.background("black");
//				$butt.html("White Background");
//			}
//			else {
//				if ($(".right-floated").is(':hidden')) {	
//					$("#tab_btns").css("background-color","transparent");		
//				}
//				jml.background("white");
//				$butt.html("Black Background");
//			}
//		});
//		
//		//	inicializiramo spin gumb
//		$('.spin').unbind('click').click(function() {
//			var $butt = $(this);
//			if ($butt.html() == "Spin") {
//				jml.script("spin");
//				$butt.html("Spin Off");
//			}
//			else {
//				jml.script("spin off");
//				$butt.html("Spin");
//			}
//		});
//	};
//	
//	//
//	// Query protein oz. biounit prikazemo v jmol-u.
//	//
//	var query = function(assembly_number) {
//	
//		var $loading = $('#loading');
//		$loading.removeClass('ui-helper-hidden');
//		var queryobj = {
//			assembly_number : assembly_number,
//			hidden : false,
//			iframe : jml.get_nframe() + 1, 
//			type : jml.type._query,
//			file : __results_dir + "/" + __biof[assembly_number],
//			format : new Format(jml.frm._query),
//			name : __qpdb + "." + __qcid,
//			id: "protein_"+viewed.get_id()
//		};
//		if (viewed.push(queryobj)) {
//			jml.load_query(queryobj.file, __qcid);
//			jml.update(viewed.get_unhidden());
//			legend.update(viewed.get_viewed());
//		}
//	};
//	
//	//
//	// Alignamo in prikazemo v jmol-u.
//	//
//	
//	var view3d_alignment_button = function() {
//	
//		var $this = $(this);
//		console.log($this);
//		var str = $(this).attr('class').match(/[0-9]*#[0-9]*/);
//	
//		var nam = str[0].split('#');
//		var index = Number(nam[0]);
//	
//		var alignment_no = $("#alignment_num_"+index).val();
//		if (!alignment_no) {
//			var alignment_no = 0;
//		}
//	
//		var alignobj = {
//			index : index,
//			type : jml.type._aligned,
//			alignment_no : alignment_no,
//			hidden : false,
//			id: "align_"+index+"_"+jml.type._aligned+"_"+alignment_no
//		};
//	
//	
//		if ($this.text() == "View 3D") {
//			$this.html("Remove");
//			var $loading = $('#loading');
//			$loading.removeClass('ui-helper-hidden');
//	
//			var f_remove = function() {
//				jml.zap(viewed.remove(alignobj));
//				jml.update(viewed.get_unhidden());
//				legend.update(viewed.get_viewed());
//				if (jdat[index].alignment.length == 1 || $("#alignment_num_"+index ).val() == alignment_no) {
//					$this.html("View 3D");
//				}
//			};
//	
//			$.post('align.php', {
//					pdb_id1 : __qpdb, 
//					chain_id1 : __qcid,
//					pdb_id2 : jdat[index].pdb_id, 
//					chain_id2 : jdat[index].chain_id,
//					results_dir : __results_dir, 
//					alignment_no : String(alignment_no)
//				},
//			function(data) {
//				// naloadamo query protein v jmol
//				var aligned_file = __qpdb + __qcid + '_' + jdat[index].pdb_id 
//					+ jdat[index].chain_id + '.' + String(alignment_no) + '.rota.pdb';
//				var residues_file = 'res.' + aligned_file;
//				// dodamo v table-frames alignan protein
//				alignobj["remove"] = f_remove;
//				alignobj["iframe"] = jml.get_nframe() + 1;
//				alignobj["file"] = __results_dir + '/' + aligned_file;
//				alignobj["residues_file"] = __results_dir + '/' + residues_file;
//				alignobj["format"] = new Format(jml.frm._aligned);
//				alignobj["name"] = __qpdb + "." + __qcid + '/' 
//					+ jdat[index].pdb_id + "." + jdat[index].chain_id + '/' 
//					+ String(alignment_no);
//	
//				viewed.push(alignobj);
//				jml.load(alignobj.file, true);
//				jml.update(viewed.get_unhidden());
//				legend.update(viewed.get_viewed());
//			});
//		}
//		else {
//	
//			console.log(alignobj);
//			jml.zap(viewed.remove(alignobj));
//			$this.html("View 3D");
//			jml.update(viewed.get_unhidden());
//			legend.update(viewed.get_viewed());
//	
//		}
//	
//	
//	}
//	
//	
//	
//	$(document).ready(function() {
//	
//		//
//		// result page
//		//
//		var fsButton = $('#gofull')[0];
//		var fsElement = $('.fullscreen')[0];
//		
//		if (window.fullScreenApi.supportsFullScreen) {
//		
//		// bsite
//		fsButton.addEventListener('click', function() {
//			window.fullScreenApi.requestFullScreen(fsElement);
//		}, true);
//		
//		fsElement.addEventListener(fullScreenApi.fullScreenEventName, function() {
//			if (fullScreenApi.isFullScreen()) {
//				var h = $(window).height();
//				if ($("#color_range").css('display') == "none") {
//					$("#jmlfun").css({ 'height': eval(h-50)+"px" });
//				}
//				else {
//					$("#jmlfun").css({ 'height': eval(h-70)+"px" });
//				}
//				$(".right-floated").css({ 'height': eval(h-60)+"px" });
//				$("#gofull").hide();
//				//$("#tabela").jqGrid('setGridHeight', h-81-28);
//			} else {
//				$("#gofull").show();
//				if ($("#color_range").css('display') == "none") {
//					$("#jmlfun").css({ 'height': "862px" });
//				}
//				else {
//					$("#jmlfun").css({ 'height': "842px" });
//				}
//				$(".right-floated").css({ 'height': "862px" });
//				//$("#tabela").jqGrid('setGridHeight', 900-81-28);
//			}
//		}, true);
//		//mozilla
//		document.addEventListener(fullScreenApi.fullScreenEventName, function() {
//			if (fullScreenApi.isFullScreen()) {
//				var h = window.screen.height;
//				if ($("#color_range").css('display') == "none") {
//					$("#jmlfun").css({ 'height': eval(h-50)+"px" });
//				}
//				else {
//					$("#jmlfun").css({ 'height': eval(h-70)+"px" });
//				}
//				$(".right-floated").css({ 'height': eval(h-60)+"px" });
//				$("#gofull").hide();
//				//$("#tabela").jqGrid('setGridHeight', h-81-28);
//			} else {
//				$("#gofull").show();
//				if ($("#color_range").css('display') == "none") {
//					$("#jmlfun").css({ 'height': "862px" });
//				}
//				else {
//					$("#jmlfun").css({ 'height': "842px" });
//				}
//				$(".right-floated").css({ 'height': "862px" });
//				//$("#tabela").jqGrid('setGridHeight', 900-81-28);
//			}
//		}, true);
//		
//	
//	
//		
//		} 
//		else {
//			//alert('SORRY: Your browser does not support FullScreen');
//		}
//	
//	})


