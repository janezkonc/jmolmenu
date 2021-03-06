
var JmolMenu = function() {

	// Viewed contains all frames (their numbers) that are currently in jmol
	function Viewed() {
		this.current_id = 0;
		this.__viewed = new Array();
	
		this.get_viewed = function() {
			return this.__viewed;
		};
	
		this.get_unhidden = function() {
			var f = new Array();
			for (var i = 0; i < this.__viewed.length; i++) {
				if (!this.__viewed[i].hidden) {
					f.push(this.__viewed[i]);
				}
			}
			return f;
		};
	
		this.push = function(element) {
			if (this.get_index_of(element) == -1) {
				this.__viewed.push(element);
				return true;
			}
			return false;
		};
	
		this.has_element = function(element) {
			return this.get_index_of(element) > -1;
		};
	
		this.empty = function() {
			return this.__viewed.length == 0;
		};
	
		this.size = function() {
			return this.__viewed.length;
		};
	
		this.get_index_of = function(element) {
			var index = -1;
			for (var i = 0; i < this.__viewed.length; i++) {
				if (element.id == this.__viewed[i].id) {
					index = i;
					break;
				}
			}
			return index;
		};
	
		this.remove = function(element) {
			var index = this.get_index_of(element);
			var iframe = this.__viewed[index].iframe;
			this.__viewed.splice(index, 1); // remove
			return iframe; // return iframe of deleted
		};
	
		this.get_id = function() {
			if (this.current_id == 1000000) {
				this.current_id = 0;
			}
			this.current_id++;
			return this.current_id;
		}
	};
	
	this.viewed = new Viewed();

	this.draggable = 0;
	var _self = this;
	
	this.menu_html = 
		"<ul class='sf-menu'>"
		+ ""
		+ "<!-- New menu item -->"
		+ "<li class='current' style='background-color: #a4c400'> <a title='Action' href='#'>A</a>"
		+ "<ul>"
		+ ""
		+ "<li> <a class='litem action_remove_1 _query' href='#'>Remove</a> </li>"
		+ "<li class='current'> <a href='#' class='litem2'>Zoom</a>"
		+ "<ul>"
		+ "<li class='current'> <a class='litem action_zoom_+100' href='#'>In</a></li>"
		+ "<li> <a class='litem action_zoom_-100' href='#'>Out</a></li>"
		+ "</ul>"
		+ "</li>"
		+ ""
		+ "<li> <a class='litem action_center_1' href='#'>Center</a> </li>"
		+ ""
		+ "</ul>"
		+ "</li>"
		+ ""
		+ "<!-- New menu item -->"
		+ "<li> <a title='Show' href='#' style='background-color: #11BBAA' >S</a>"
		+ "<ul>"
		+ ""
		+ "<li> <a class='litem show_lines_1' href='#'>Lines</a> </li>"
		+ "<li> <a class='litem show_sticks_1' href='#'>Sticks</a> </li>"
		+ "<li> <a class='litem show_ballssticks_1' href='#'>Balls and Sticks</a> </li>"
		+ "<li> <a class='litem show_backbone_1' href='#'>Backbone</a> </li>"
		+ "<li> <a class='litem show_ribbon_1' href='#'>Ribbon</a> </li>"
		+ "<li> <a class='litem show_cartoon_1' href='#'>Cartoon</a> </li>"
		+ "<li> <a class='litem show_spheres_1' href='#'>Spheres</a> </li>"
		+ ""
		+ "</ul>"
		+ "</li>"
		+ ""
		+ "<!-- New menu item -->"
		+ "<li> <a title='Hide' href='#' style='background-color: #f472d0'>H</a>"
		+ "<ul>"
		+ ""
		+ "<li> <a class='litem show_everything_0' href='#'>Everything</a> </li>"
		+ "<li> <a class='litem show_lines_0' href='#'>Lines</a> </li>"
		+ "<li> <a class='litem show_sticks_0' href='#'>Sticks</a> </li>"
		+ "<li> <a class='litem show_ballssticks_0' href='#'>Balls and Sticks</a> </li>"
		+ "<li> <a class='litem show_backbone_0' href='#'>Backbone</a> </li>"
		+ "<li> <a class='litem show_ribbon_0' href='#'>Ribbon</a> </li>"
		+ "<li> <a class='litem show_cartoon_0' href='#'>Cartoon</a> </li>"
		+ "<li> <a class='litem show_spheres_0' href='#'>Spheres</a> </li>"
		+ ""
		+ "</ul>"
		+ "</li>"
		+ ""
		+ "<!-- New menu item -->"
		+ "<li> <a title='Label' href='#' style='background-color: #fa6800'>L</a>"
		+ "<ul>"
		+ ""
		+ "<li> <a class='litem label_clear_0' href='#'>Clear</a> </li>"
		+ "<li> <a class='litem label_atoms_1' href='#'>Atoms</a> </li>"
		+ "<li> <a class='litem label_residues_1' href='#'>Residues</a> </li>"
		+ ""
		+ "</ul>"
		+ "</li>"
		+ ""
		+ "<!-- New menu item -->"
		+ "<li> <a title='Color' href='#' style='background-color: #ffff7f'>C</a>"
		+ "<ul>"
		+ ""
		+ "<li> <a href='#' class='litem2'>Conservation</a>"
		+ "<ul>"
		+ "<li> <a class='litem color_bgyr_1' href='#'>Blue-Green-Yellow-Red</a></li>"
		+ "<li> <a class='litem color_br_1' href='#'>Blue-Red</a></li>"
		+ "<li> <a class='litem color_wg_1' href='#'>White-Green</a></li>"
		+ "<li> <a class='litem color_wb_1' href='#'>White-Black</a></li>"
		+ "</ul>"
		+ "</li>"
		+ ""
		+ "<li> <a class='litem color_cpk_1' href='#'>CPK</a> </li>"
		+ "<li> <a class='litem color_structure_1' href='#'>Structure</a> </li>"
		+ ""
		+ "<li> <a href='#' class='litem2'>Custom</a>"
		+ "<ul>"
		+ "<li> <a class='litem color_red_1' href='#'>Red</a></li>"
		+ "<li> <a class='litem color_green_1' href='#'>Green</a></li>"
		+ "<li> <a class='litem color_blue_1' href='#'>Blue</a></li>"
		+ "<li> <a class='litem color_yellow_1' href='#'>Yellow</a></li>"
		+ "<li> <a class='litem color_orange_1' href='#'>Orange</a></li>"
		+ "<li> <a class='litem color_magenta_1' href='#'>Magenta</a></li>"
		+ "<li> <a class='litem color_cyan_1' href='#'>Cyan</a></li>"
		+ "</ul>"
		+ "</li>"
		+ ""
		+ "</ul>"
		+ "</li>"
		+ ""
		+ "</ul>";
	
	/** Adds object to the menu and displays it in jmol
	 * 
	 * object that's passed into this function needs the following parameters
	 * 
	 * type : protein|nucleic|compound|ion|water
	 * hidden : true|false
	 * file : url of the PDB file
	 * name : text to display in the menu as object's name
	 * 
	 */
	this.add_item = function(obj) {

		if (obj.type == "all") {
			var base_format = {
				iframe : 0,
				format : jml.set_formatting(obj.type),
				id : obj.type + "_" + _self.viewed.get_id(),
				remove : function() {},
				type : "",
				hidden : false,
				file : "",
				name : ""
			};
	
			for (var prop in base_format) {
				if (!obj.hasOwnProperty(prop)) {
					obj[prop] = base_format[prop];
				}
			}

			_self.viewed.push(obj);
			this.update(_self.viewed.get_viewed());

		} else {
			var base_format = {
				iframe : jml.get_nframe() + 1,
				format : jml.set_formatting(obj.type),
				id : obj.type + "_" + _self.viewed.get_id(),
				remove : function() { _self.remove_item(obj); },
				type : "",
				hidden : false,
				file : "",
				name : ""
			};
	
			for (var prop in base_format) {
				if (!obj.hasOwnProperty(prop)) {
					obj[prop] = base_format[prop];
				}
			}
	
			console.log("viewed.size = " + String(_self.viewed.size()));
			var append = _self.viewed.size() > 1;
			
			if (_self.viewed.push(obj)) { // add if not already added
				jml.load(obj.file, append);
				jml.update(_self.viewed.get_unhidden());
				this.update(_self.viewed.get_viewed());
			}
		}
		return function() { _self.remove_item(obj); } // return function that can remove the object
	};


	this.remove_item = function(obj) {
		if (_self.viewed.has_element(obj)) {
			jml.zap(_self.viewed.remove(obj));
			jml.update(_self.viewed.get_unhidden());
			this.update(_self.viewed.get_viewed());
		}
	};

	this.init = function($draggable) {
		this.draggable = $draggable.draggable().resizable();
	};
	
	this.update = function(objs) {
		
		var html = this.write_html(objs);
		this.draggable.html(html);
		this.add_click_handlers(objs);

		this.draggable.find('.sf-menu').superclick({speed : 'fast'});
		this.customize_menu(objs);
		
		$(".jmolmenu_resizable").css("width","100px");
		
	};

	this.write_html = function(objs) {
		var html = "<table id='jmolmenu_table'>";
		for (var i = 0; i < objs.length; i++) {
			html += "<tr class='object_" + String(i) + "'>";
			html += "<td title='"+objs[i].name+"' class='jmolmenu_resizable'>" + objs[i].name + "</td>";
			html += "<td>" + this.menu_html + "</td>";
			html += "</tr>";
			console.log(String(objs[i].iframe));
		}
		html += "</table>";
		return html;
	};

	this.customize_menu = function(objs) {
		this.draggable.find(".litem,.litem2").each(function(index) {
			var $this = $(this);
			// get the object number i from the tr's classname object_i 
			var i = $this.closest('tr').attr('class').split("_")[1];
			console.log("object i = " + String(i) + " objs[i].type = " + objs[i].type);
			// if we click on a leaf tag
			if ($this.hasClass(objs[i].type)) {
				$this.hide();
			}
		});
	};

	this.add_click_handlers = function(objs) {
		this.draggable.unbind('click').click(function(event) {
			var $target = $(event.target);

			// get the object number i from the tr's classname object_i 
			var i = $target.closest('tr').attr('class').split("_")[1];
			console.log("object i = " + String(i) + " event.target.className = "
				+ event.target.className + " event.target.tagName = "
				+ event.target.tagName + " objs[i].type = " + objs[i].type);

			// if we click on a leaf tag
			if ($target.is('.litem')) {
				var cmds = $target.attr('class').split(' ')[1].split('_');
				var command = cmds[0];
				var what = cmds[1];
				var quantity = cmds[2];
				var sz = objs.length;
				console.log("command = " + command + " what = " + what
					+ " quantity = " + String(quantity));
				if (command == "action" && what == "remove") {
					// if we hit all->hide->everything 
					if (objs[i].type == "all") {
						for (j = 1; j < sz; j++) {
							objs[objs.length - 1].remove();
						}
					} else
						objs[i].remove();
						
				} else if (command == "show" && what == "everything" && quantity == 0) {

					// if we hit all->hide->everything
					if (objs[i].type == "all") {
						for (j = 0; j < sz; j++) {
							for (var prop in objs[j].format["show"]) {
								console.log(prop + " " + objs[j].format["show"][prop]);
								objs[j].format["show"][prop] = 0;
							}
						}
					} else {
						// if we are hiding everything, we have to set all 'show' commands to 0
						for (var prop in objs[i].format["show"]) {
							console.log(prop + " " + objs[i].format["show"][prop]);
							objs[i].format["show"][prop] = 0;
						}
					}
					
				} else if (command == "label" && what == "clear" && quantity == 0) {

					// if we hit all->label->clear
					if (objs[i].type == "all") {
						for (j = 0; j < sz; j++) {
							for (var prop in objs[j].format["label"]) {
								objs[j].format["label"][prop] = 0;
							}
						}
					} else {
						// if we are hiding everything, we have to set all 'show' commands to 0
						for (var prop in objs[i].format["label"]) {
							objs[i].format["label"][prop] = 0;
						}
					}

				} else {
					// if we hit all->zoom->in/out or all->center
					if (objs[i].type == "all") {
						for (j = 0; j < sz; j++) {
							objs[j].format[command][what] = quantity;
						}
					} else
						objs[i].format[command][what] = quantity;

				}
				
				if (typeof objs[i] !== "undefined" && objs[i].type == "all" && (what == "zoom" || what == "center")) {
					jml.update_all(_self.viewed.get_unhidden());
				} else {
					jml.update(_self.viewed.get_unhidden());
				}
				// reset all props that need reseting
				if (typeof objs[i] !== "undefined") {
					if (objs[i].type == "all") {
						for (j = 0; j < objs.length; j++) {
							objs[j].format['action']['zoom'] = 0;
							objs[j].format['action']['center'] = 0;
							for (var prop in objs[j].format["color"]) {
								objs[j].format["color"][prop] = 0;
							}
						}
					} else {
						objs[i].format['action']['zoom'] = 0;
						objs[i].format['action']['center'] = 0;
						for (var prop in objs[i].format["color"]) {
							objs[i].format["color"][prop] = 0;
						}
					}
				}
			}
			event.preventDefault(); // don't follow any links
		});
	};
};

var jmolMenu = new JmolMenu();




