$(document).ready(function () {
	
	// MULTIPLE ACCORDIONS AND TABS (WITH QUERY STRING AND SCROLL OPTIONS)

  //Begin Accordion Functionality

  // hide all accordion content 
  // (the next element after the accordion header)
	$('.expand')
		.next()
		.hide();

  // Use "view" querystring parameter to determine
  // which accordion item to show on load
	var item = get_urid('view');
	item = parseInt(item);
	if(item) {
		openAccordion($('#' + item));
	}
  // End Accordion Functionality

	// MULTIPLE TABS

  // Begin Tabbed System Functionality
  // Add ID to each set of tabs
	$('.tab-system').each(function(n) {
		$(this).attr('id', "tab-system0" + (n + 1));
	});

  // get "system" querystring parameter to determine which
  // tabbed system we will be focusing on
	var system = get_urid('system');

  
	if(item) {
  	if(system) {
      var selector = '#tab-system0' + system;
      scrollToDiv($(selector));
    } else {
      var selector = '.tab-system';
    }

    $('.tab').each(function() {
     	if($(this).index() != 0) {
      	$(this).hide();
     	}
    });

    $(selector + ' .tab').each(function() {
     	if($(this).index() == item - 1) {
        $(this).show();
     	} else {
      	$(this).hide();
     	}
    });

    $('.tabs').each(function() {
      $('.tabs-nav li:first', this).addClass('current');
      $('.tabs-content-container .tab:first-child', this).show();
    });

    $(selector + ' .tabs').each(function() {
      item = item.toString();
      $('.tabs-nav li', this).removeClass('current');
      $('.tabs-nav li:nth-child(' + item + ')', this).addClass('current');
    });
  } else {
    $('.tab').each(function() {
     	if($(this).index() != 0) {
      	$(this).hide();
     	}
    });

    $('.tabs').each(function() {
      $('.tabs-nav li:first', this).addClass('current');
      $('.tabs-content-container .tab:first-child', this).show();
    });
  }

	$('.tabs-nav li').click(function (e) {
		var tabSection = $(this).closest('article').attr('id');
		$('#' + tabSection + ' .tabs-content div.tab').hide();
		$('#' + tabSection + ' .tabs-nav .current').removeClass('current');
		$(this).addClass('current');

		var tabNum = $(this).index() + 1;
		$('#' + tabSection + ' .tabs-content div.tab:nth-child(' + tabNum + ')').fadeIn('fast');
		e.preventDefault();
	});
  // End Tabbed System Functionality
  // END MULTIPLE ACCORDIONS AND TABS IN DOC READY
	
});	


// ACCORDION AND TAB FUNCTIONS
$('.expand').on('click', function () {
	var thisID = $(this).attr('id');

	if ($(this).hasClass('expanded')) {
		closeAccordion($(this));
	} else {
		openAccordion($(this));
	}
	return false;
});

function closeAccordion(item) {
	$(item)
		.next()
		.slideUp('fast');
	$(item).removeClass('expanded');
}

function openAccordion(item) {
	$('.expanded').each(function () {
		$(this)
			.next()
			.slideUp('fast');
		$(this).removeClass('expanded');
	});
	$(item)
		.next()
		.slideDown('fast', function () {
            if ($(item).hasClass('scroll-to-element')) {
			    scrollToDiv($(this));
            }
		});
	$(item).addClass('expanded');
}

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
