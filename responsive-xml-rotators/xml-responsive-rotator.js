// XML RESPONSIVE ROTATOR CUSTOM OPTIONS

var startSlide = 1; // Determines which slide the rotator starts on
var randomSlide = false; // Set to 'true' to have the rotator start on a random slide

var effectRotate = true; // Set to 'true' to have slides rotate
var effectFade = false; // Set to 'true' to have slides fade 

var autoRotate = false; // Set to 'true' to have slides auto rotate
var autoRotateSeconds = 8; // Determines how many seconds between auto rotations if autoRotate is set to 'true'
var rotate;

// END CUSTOM OPTIONS

$(document).ready(function() {	
	$.ajax({
		type: 'GET',
		url: 'gallery.xml', // Change this to the URL of the XML file that is being used on the site. 
		dataType: 'xml',
		success: parseXML
	});
});

function parseXML(xml) {
	$(xml).find('slide').each(function() {
		var slide = $(this);
		var imgURL = slide.find('image').text();
		var imgAlt = slide.find('alt').text();
		var slideHeader = '<h2>' + slide.find('title').text() + '</h2>';
		var slideSubhead = '<h3>' + slide.find('desc').text() + '</h3>';
		
		$('.gallery-inner').append('<div class="slide"><img src="' + imgURL + '"' + '"alt="' + imgAlt + '" />' + '<div class="gallery-content-container"><div class="gallery-content">' + slideHeader + slideSubhead + '</div></div>' + '</div>');
	});
	gallerySetup();
}

function gallerySetup() {
	var numSlides = $('.slide').length;
	
	if (randomSlide == true) {
		var randomMultiplier = Math.random();
		var randomNumber = Math.floor(randomMultiplier * numSlides) + 1;
		startSlide = randomNumber;
	}
	
	if (startSlide > numSlides) { 
		startSlide = 1;	
	}
	
	var navLinks;
	$('.slide.active').removeClass('active');
	$('.slide').show();
	$('.slide-content').hide();
	$('.gallery-nav').show();
	if(navLinks == false) {
		$('.next').hide();
		$('.prev').hide();
	}

	if(effectRotate) {
		buildSlider(numSlides, startSlide);
		$('.gallery').addClass('gallery-rotate');
		runRotateSlides();
	} else {
		$('.gallery').addClass('gallery-fade');
		buildFader();
	}
}

function buildFader() {
}

function buildSlider(numSlides, startSlide) {	
			
	$('.gallery-inner').css('width', 100 * numSlides + '%');
	$('.slide').css('width', 100 / numSlides + '%');
	
	var currentPos = $('.gallery-inner').position().left;
	var newPos = currentPos - 100;
	$('.gallery-inner').animate({
		left: newPos + '%'
	});
	
	$('.slide').each(function(e) {
		if (e == startSlide - 1) {
			$(this).addClass('active');
		}
		$(this).attr({
			id: 'slide' + e,
			title: ''
		});
	});
	
	if (startSlide == 1) {
		var lastItem = $('.slide').last();
		lastItem.remove();
		$('.gallery-inner').prepend(lastItem);
	} else if (startSlide > 2) {
		for (i = 1; i < startSlide - 1; i++) {
			var firstItem = $('.slide').first();
			firstItem.remove();
			$('.gallery-inner').append(firstItem);
		}
	}
	$('.gallery-inner').css('left', 0);
	
	
	$('.gallery-indication').prepend('<div class="slide-indicator"></div>');
	
	for (i = 1; i <= numSlides; i++) {
		$('.slide-indicator').append('<a class="indicator icon-indication" id="indicate-' + i + '" href="#"></a>');
	}
	
	$('#indicate-' + startSlide).addClass('active');	

} 
// End buildSlider function


$(window).load(function() {
	var activeHeight = $('.active').height();
	$('.gallery').animate({
		height: activeHeight
	});
});

var rtime = new Date(1, 1, 2000, 12,00,00);
var timeout = false;
var delta = 200;
$(window).resize(function() {
	rtime = new Date();
	if (timeout === false) {
		timeout = true;
		setTimeout(resizeend, delta);
	}
});

function resizeend() {
	if (new Date() - rtime < delta) {
		setTimeout(resizeend, delta);
	} else {
		timeout = false;
		resizeGallery();
	}               
}		

var startX, curX, swipeDistance, origPos, currentPos, newPos, deviceWidth;
var startY, curY, yDistance, bodyPos, yScrolled, firstItems, lastItems, yDistAbs, swipeDistAbs, scrollPosOnTouch, scrollPosOnEnd;
var targetHref;

var swipeThreshold = 30;
var galleryInner = document.getElementById('gallery-inner');
var touchstart = function(event) {  
	if (event.originalEvent.touches.length == 1) {
			startX = event.originalEvent.touches[0].pageX;
			startY = event.originalEvent.touches[0].pageY;
			origPos = - 100; 
	} else {
		touchcancel(event);	
	}
	
	deviceWidth = $(window).width();
	if ($(event.target).parent().attr('href')) {
		targetHref = $(event.target).parent().attr('href');
	}
	
	scrollPosOnTouch = $(document).scrollTop();
};  

var touchmove = function(event) {  
	curX = event.originalEvent.touches[0].pageX;
	swipeDistance = curX - startX;
	swipeDistAbs = Math.abs(swipeDistance);
	curY = event.originalEvent.touches[0].pageY;
	yDistance = curY - startY;
	yDistAbs = Math.abs(yDistance);
	
	if(swipeDistAbs > yDistAbs) {
		if (event.originalEvent.touches.length == 1) {
			$('.active').removeClass('active');
			newPos = parseInt(origPos) + ((swipeDistance/deviceWidth) * 100);
			$('.gallery-inner').css('left', newPos + '%');
		} else {
			touchcancel(event);
		}
		return false;
	} 
};  

var touchend = function(event) {  
	scrollPosOnEnd = $(document).scrollTop();
	if (swipeDistAbs + 10 > yDistAbs && scrollPosOnTouch == scrollPosOnEnd) {
		if (swipeDistance <= -swipeThreshold) {
			goToNextSlide(origPos);
		} else if (swipeDistance >= swipeThreshold) {
			goToPrevSlide(origPos);
		} else { 
			returnToCurrentSlide(origPos);
		}
	} else {
		if ($('.gallery-inner').position().left == origPos) {
			// do nothing
		} else {
		returnToCurrentSlide(origPos);
		}
	}
	touchcancel(event);
};  

var touchcancel = function(event) {  
	swipeDistance = 0;
	yDistance = 0;
	swipeDistAbs = 0;
	yDistAbs = 0;
};  

$('.gallery-inner')
	.bind('touchstart', touchstart)
	.bind('touchmove', touchmove)
	.bind('touchend', touchend)
	.bind('touchcancel', touchcancel);  	

// Begin Gallery Rotate Navigation
$(document).on('click', '.gallery-rotate .indicator', function() {
	var slideNumberClicked = $(this).attr('id');
	slideNumberClicked = slideNumberClicked.split('indicate-');
	slideNumberClicked = parseInt(slideNumberClicked[1]);
	var activeSlide = $('.slide.active').attr('id');
	if (activeSlide != undefined) {
		var slideNum = activeSlide.split('slide');
		slideNum = parseInt(slideNum[1]) + 1;
		var difference = slideNumberClicked - slideNum;
		if (difference != undefined && difference != 0) {
			$('.active').removeClass('active');
			jumpToSpecificSlide(difference);
			clearTimeout(rotate);
			runRotateSlides();
		}
	}
	return false;
});

$(document).on('click', '.gallery-rotate + .gallery-nav .next', function() {
	$('.active').removeClass('active');
	goToNextSlide();
	clearTimeout(rotate);
	runRotateSlides();
});

$(document).on('click', '.gallery-rotate + .gallery-nav .prev', function() {
	$('.active').removeClass('active');
	goToPrevSlide();
	clearTimeout(rotate);
	runRotateSlides();
});

// End Gallery Rotate Navigation



function goToNextSlide() {
	newPos = - 100 * 2;		
	$('.gallery-inner').animate({
		left: newPos + '%'
	}, function() {
		nextSlide();
	});
}

function goToPrevSlide() {
	newPos = 0;

	$('.gallery-inner').animate({
		left: newPos + '%'
	}, function() {
		prevSlide();
	});
}

function nextSlide() {
	newPos = -100;
	$('.gallery-inner').css('left', newPos + '%');
	
	var firstItem = $('.slide').first();
	firstItem.remove();
	$('.gallery-inner').append(firstItem);
	
	$('.slide').each(function(e) {
		if(e == 1) {
			$(this).addClass('active');
		}
	});
	updateIndicator();
	resizeGallery();
}

function prevSlide() {
	newPos = -100; 
	$('.gallery-inner').css('left', newPos + '%');
	
	var lastItem = $('.slide').last();
	lastItem.remove();
	$('.gallery-inner').prepend(lastItem);

	$('.slide').each(function(e) {
		if (e == 1) {
			$(this).addClass('active');				
		}
	});
	updateIndicator();
	resizeGallery();
}

function jumpToSpecificSlide(slidesToMove) {
	if (slidesToMove != undefined && slidesToMove > 0) {
		if (slidesToMove > 1) { 
			for (i=0; i<slidesToMove; i++) {
				var firstItem = $('.slide').first();
				firstItem.remove();
				$('.gallery-inner').append(firstItem);
			}
			newPos = - 100 * (slidesToMove + 1);
			$('.gallery-inner').animate({
				left: newPos + '%'
			}, 200, function() {
				newSlide(slidesToMove);
			});
		} else {
			goToNextSlide();
		}
	} else if (slidesToMove != undefined && slidesToMove < 0) {
		if (slidesToMove < -1) {
			for (i=0; i>slidesToMove; i--) {
				var lastItem = $('.slide').last();
				lastItem.remove();
				$('.gallery-inner').prepend(lastItem);
			}
			newPos = 0;
			$('.gallery-inner').animate({
				left: newPos + '%'
			}, 200, function() {
				newSlide(slidesToMove);
			});
		} else {
			goToPrevSlide();
		}
	}
}
			
function newSlide(slidesToMove) {
	newPos = -100;
	$('.gallery-inner').css('left', newPos + '%');

	$('.slide').each(function(e) {
		if(e == 1) {
			$(this).addClass('active');
		}
	});
	updateIndicator();
	resizeGallery();
}
			
function returnToCurrentSlide(position) {
	$('.gallery-inner').animate({
		left: position + '%'
	}, function() {
		$('.slide').each(function(e) {
			if(e == 1) {
				$(this).addClass('active');
			}
		});
		updateIndicator();
	});
}

function rotateSlides() {
	$('.active').removeClass('active');
	goToNextSlide();
}

function runRotateSlides() {
	if (autoRotate == true) {
		rotate = setInterval('rotateSlides()', autoRotateSeconds * 1000);
	} else {
		// do nothing
	}
}

function updateIndicator() {
	var activeSlide = $('.slide.active').attr('id');
	var slideNum = activeSlide.split('slide');
	slideNum = parseInt(slideNum[1]) + 1;
	$('#indicate-' + slideNum).addClass('active');
}

function resizeGallery() {
	var activeHeight = $('.active').height();
	$('.gallery').animate({
		height: activeHeight
	});
}