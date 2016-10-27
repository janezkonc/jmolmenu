//
// Generiramo unikatno stevliko.
//

function uniqid() {
	var newDate = new Date;
	return String(newDate.getTime() % 100000);
}

//
// Poiscemo index podanega alignment_no v jdat.alignment (argument 'array' mora biti tipa jdat.alignment)
//

function get_index_info(array, alignment_no) {
	for (i in array) {
		if (array[i].scores.alignment_no == alignment_no) {
			return i;
		}
	}
	return -1;  // .. napaka
}

//
// Dobimo indeks elementa v arrayu!
//

function getindex(a, elt) {
	var len = a.length;
	var from = 0;
	from = (from < 0)
		? Math.ceil(from)
		: Math.floor(from);
	if (from < 0)
		from += len;
	for (; from < len; from++) {
		if (from in a &&
			a[from] === elt)
			return from;
	}
	return -1;
}

//
// Izracunamo razliko med dvema arrayema
//

function diff(a1, a2) {
	var a = [];
	var l = a1.length;
	var l2 = a2.length;
	var diff = true;
	for(var i=0; i<l; i++) {
		for(var j=0; j<l2; j++) {
			if (a1[i] === a2[j]) {
				diff = false;
				break;
			}
		}
		diff ? a.push(a1[i]) : diff = true;
	}
	return unique(a);
}

//
// Unija dveh arrayev
//

function union(a1, a2) {
	var a = a1.concat(a2);
	return unique(a);
}

//
// Izlocimo enake elemente iz arraya. Neobvezno lahko podamo specialno comp funkcijo za primerjavo elementov arraya.
// F-ja comp mora biti tipa: comp(a, b) { return a.nekaj === b.nekaj; }
//

function unique(a1, comp) {
	var std_comp = function(x, y) { return x === y; } 
	c = typeof(comp) == 'undefined' ?  std_comp : comp;
	//alert(typeof(comp));
	var a = [];
	var l = a1.length;
	for(var i=0; i<l; i++) {
		for(var j=i+1; j<l; j++) {
			//if (a1[i] === a1[j])
			if (c(a1[i], a1[j]))
				j = ++i;
		}
		a.push(a1[i]);
	}
	return a;
}

/*
	"""Return the index where to insert item x in list a, assuming a is sorted.

    The return value i is such that all e in a[:i] have e < x, and all e in
    a[i:] have e >= x.  So if x already appears in the list, a.insert(x) will
    insert just before the leftmost x already there.

    Optional args lo (default 0) and hi (default len(a)) bound the
    slice of a to be searched.
    """

	POMEMBNO !!!!
	elementi arraya a in element x morajo biti objekti z definirano funkcijo
	x1.compare(x2), ki vrne negativno vrednost, ce je x1 < x2
	!!!!
*/

function bisect_left(a, x, lo, hi) {
	lo = typeof(lo) != 'undefined' ? lo : 0;
	hi = typeof(hi) != 'undefined' ? hi : a.length;
//	alert("lo=" + String(lo) + " hi=" + String(hi));
//	alert("a.x=" + String(a.x) + " x.y=" + String(x.y));
	for (i=lo; i < hi; i++) {
		if (a[i].compare(x) >= 0) {
			if (a[i].compare(x) == 0) {
				return i;
			}
			else return ~i;
		}
	}
	return ~a.length;
}

/*
function bisect_left(a, x, lo, hi) {
	lo = typeof(lo) != 'undefined' ? lo : 0;
	hi = typeof(hi) != 'undefined' ? hi : a.length;
//	alert("lo=" + String(lo) + " hi=" + String(hi));
	while (lo < hi) {
		mid = Math.floor((lo+hi)/2);
		if (a[mid].compare(x) < 0) {
			lo = mid + 1;
		}
		else {
			hi = mid;
		}
	}
	return lo;
}
*/

//
// Odstranijo whitespaces od spredaj, zadaj ali z obeh strani
//

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
}

//
// Kapitaliziramo prvo crko v stringu.
//

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//if (!Array.prototype.indexOf)
//{
//  Array.prototype.indexOf = function(elt /*, from*/)
//  {
//    var len = this.length;
//
//    var from = Number(arguments[1]) || 0;
//    from = (from < 0)
//         ? Math.ceil(from)
//         : Math.floor(from);
//    if (from < 0)
//      from += len;
//
//    for (; from < len; from++)
//    {
//      if (from in this &&
//          this[from] === elt)
//        return from;
//    }
//    return -1;
//  };
//}

//
// Skrajsamo string na predpisano sirino v pikslih
//

function fitStringToSize(str,len) {
    var result = str;
    var span = document.createElement("span");
    span.style.visibility = 'hidden';
	span.style.fontSize = '0.7em';
	span.style.fontWeight = 'bold';
    span.style.padding = '0px';
    document.body.appendChild(span);

    // on first run, check if string fits into the length already.
    span.innerHTML = result;
    if(span.offsetWidth > len) {
        var posStart = 0, posMid, posEnd = str.length;
        while (true) {
            // Calculate the middle position
            posMid = posStart + Math.ceil((posEnd - posStart) / 2);
            // Break the loop if this is the last round
            if (posMid==posEnd || posMid==posStart) break;

            span.innerHTML = str.substring(0,posMid) + '&hellip;';

            // Test if the width at the middle position is
            // too wide (set new end) or too narrow (set new start).
            if ( span.offsetWidth > len ) posEnd = posMid; else posStart=posMid;
        }
        
        //Escape < and >, eliminate trailing space and a widow character if one is present.
        result = str.substring(0,posStart).replace("<","&lt;").replace(">","&gt;").replace(/(\s.)?\s*$/,'') + '&hellip;';
    }
    document.body.removeChild(span);
    return result;
}

function getShortLink(str,len,url)
{
    return '<a title="' + str.replace("\"","&#34;") + '" href="'+ url +'">' + fitStringToSize(str,len) + '<\/a>';
}

function getShortAbbr(str,len)
{
    return '<abbr title="' + str.replace("\"","&#34;") + '">' + fitStringToSize(str,len) + '<\/abbr>';
}

