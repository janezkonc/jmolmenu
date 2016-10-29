//
// Globalna spremenljivka viewed, v kateri so vsi trenutno viewani frami (in njihove stevilke)
//

var Viewed = function() {
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

var viewed = new Viewed();
var viewed_mini = new Viewed();
