$(document).ready(function () {
	//menu pop up
	var menu = $('#mini-menu');	
	var menuTimeout;
	$(window).on('mousemove',mouseMoveHandler);
	
	function showMenu(){
		menu.show("slide", { direction: "left" }, 300);
	}
	function hideMenu(){
		
		if (menu.css("left") == "0px") {
      	menu.hide("slide", { direction: "left" }, 300);
      }
      else {
      	menu.css({top: 20+"px", left: 0});
      	menu.hide();
      }
		
	}
	function mouseMoveHandler(e) {
  		if (e.pageX < 20 || menu.is(':hover')) {
    		clearTimeout(menuTimeout);
    		menuTimeout = null;
    		if ($(".mm_all").length) {
    			showMenu();
    		}
  		}
  		else if (!menuTimeout) {
  			if (menu.css("left") == "0px") {
      		menuTimeout = setTimeout(hideMenu, 300);
      	}
  		}
  	}
	
	$(function() {
   	menu.draggable();
 	});
    
    $('#mm_bottom').click(function () {
       hideMenu();
    });  

});

function legend_mini_update (array) {
		$("#mm_add").empty();
		
		for (i=0; i<array.length; i++){
			var yes_no = 1;
			
			if (i!=0) {
				for (j=i-1; j>=0; j--) {
					if (array[i].check == array[j].check) {
						yes_no = 0;	
					}
				}
			}
			if (yes_no==1) {
				$("#mm_add").append(array[i].name_mini);	
			}		
		}
		if (array.length) {
			$( "#mini-menu" ).show();	
		}
		else {
			if ($( "#mini-menu" ).css("left") == "0px") {
      		$( "#mini-menu" ).hide("slide", { direction: "left" }, 300);
      	}
      	else {
      		$( "#mini-menu" ).css({top: 20+"px", left: 0});
      		$( "#mini-menu" ).hide();
     		}
		}		
}

function toggle_content (id) {
		
		$("#mm_content_"+id).slideToggle();
}


