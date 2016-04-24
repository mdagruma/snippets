$(document).ready(function () {

  // get querystring parameters and set variables
  var view = get_urid('view');
  var system = get_urid('system');

	// MULTIPLE ACCORDIONS AND TABS (WITH QUERY STRING AND SCROLL OPTIONS)

  //Begin Accordion Functionality

  // hide all accordion content 
  // (the next element after the accordion header)
	// $('.expand')
	// 	.next()
	// 	.hide();

  // Use "view" querystring parameter to determine
  // which accordion view to show on load
	// if(view) {
	// 	openAccordion($('#' + view));
	// }
  // End Accordion Functionality

	// MULTIPLE TABS

  // Begin Tabbed System Functionality
  // Add ID to each set of tabs
	$('.tab-system').each(function(n) {
		$(this).attr('id', "tab-system" + (n + 1));
	});

	if(view) {

  	if(system) {
      //if "system" querystring is set, go to that div using scrollToDiv
      var selector = '#tab-system' + system;
      scrollToDiv($(selector));
    } else {
      //if no "system" querystring, assume 1st tab system, and no scroll on-load
      var selector = '.tab-system';
    }

    //show 1st tab by default, hide all other tabs
    $('.tab').each(function() {
     	if($(this).index() != 0) {
      	$(this).hide();
     	}
    });

    //set tab of proper tabbed system to show the tab specified in the view parameter, hide other tabs
    $(selector + ' .tab').each(function() {
     	if($(this).index() == view - 1) {
        $(this).show();
     	} else {
      	$(this).hide();
     	}
    });

    //add "current" class to first tab in each system 
    $('.tabs').each(function() {
      $('.tabs-nav li:first', this).addClass('current');
      $('.tabs-content-container .tab:first-child', this).show();
    });

    //add "current" class to specified tab based on what was put in the "view" querystring parameter
    $(selector + ' .tabs').each(function() {
      view = view.toString();
      $('.tabs-nav li', this).removeClass('current');
      $('.tabs-nav li:nth-child(' + view + ')', this).addClass('current');
    });

  // if no "view" querystring parameter
  } else {

    //show 1st tab by default, hide all other tabs
    $('.tab').each(function() {
     	if($(this).index() != 0) {
      	$(this).hide();
     	}
    });

    //add "current" class to first tab in each system 
    $('.tabs').each(function() {
      $('.tabs-nav li:first', this).addClass('current');
      $('.tabs-content-container .tab:first-child', this).show();
    });
  }

  //Tab navigation functionality
	$('.tabs-nav li').click(function () {

    //find which article we are in and get its ID
		var tabSection = $(this).closest('article').attr('id');

    //hide all tabs for that tab system (that you clicked within)
		$('#' + tabSection + ' .tabs-content div.tab').hide();

    //remove "current" class from associated tabbed system
		$('#' + tabSection + ' .tabs-nav .current').removeClass('current');

    //add "current" class to the tab clicked
		$(this).addClass('current');

    //find tab number clicked
		var tabNum = $(this).index() + 1;

    //fade in content of tab number clicked
		$('#' + tabSection + ' .tabs-content div.tab:nth-child(' + tabNum + ')').fadeIn('fast');

		return false;
	});
  // End Tabbed System Functionality
  // END MULTIPLE ACCORDIONS AND TABS IN DOC READY
	
});	// End Doc Ready


// ACCORDION AND TAB FUNCTIONS
// $('.expand').on('click', function () {
// 	var thisID = $(this).attr('id');

// 	if ($(this).hasClass('expanded')) {
// 		closeAccordion($(this));
// 	} else {
// 		openAccordion($(this));
// 	}
// 	return false;
// });

// function closeAccordion(view) {
// 	$(view)
// 		.next()
// 		.slideUp('fast');
// 	$(view).removeClass('expanded');
// }

// function openAccordion(view) {
// 	$('.expanded').each(function () {
// 		$(this)
// 			.next()
// 			.slideUp('fast');
// 		$(this).removeClass('expanded');
// 	});
// 	$(view)
// 		.next()
// 		.slideDown('fast', function () {
//             if ($(view).hasClass('scroll-to-element')) {
// 			    scrollToDiv($(this));
//             }
// 		});
// 	$(view).addClass('expanded');
// }

function scrollToDiv(element) {
	var offset = element.offset();
	var offsetTop = offset.top - 80;
	$('body, html').animate({
		scrollTop: offsetTop
	}, 500);
}

function get_urid(name) {
   name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
   var regexS = "[\\?&]" + name + "=([^&#]*)";
   var regex = new RegExp(regexS);
   var results = regex.exec(window.location.href);
   if (results == null)
   return "";
   else
   return results[1];
}
// END ACCORDION AND TAB FUNCTIONS
