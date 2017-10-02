/*
 * touchevents v0.2
 * http://github.com/romanmz/touchevents
 * By Roman Martinez - http://romanmz.com
 */

;( function( $, window, document, undefined ){
	
	
	$.fn.addTouchEvents = function() {
		return this.each(function(){
			
			
			// --- Setup only once
			var $this = $(this);
			if( $this.data( 'touchdata' ) ) {
				return false;
			}
			
			
			// --- Init data
			var data = {};
			$this.data( 'touchdata', data );
			
			
			// --- Touchstart
			$this.on( 'touchstart.touchevents', function(e){
				var touch = e.originalEvent.touches[0];
				
				// Start data
				data.startX = touch.pageX;
				data.startY = touch.pageY;
				data.startTime = +new Date;
				data.areaWidth = $this.outerWidth();
				data.areaHeight = $this.outerHeight();
				var offset = $this.offset();
				data.areaLeft = offset.left;
				data.areaTop  = offset.top;
				
				// Reset movement data
				data.movedX = 0;
				data.movedY = 0;
				data.movedRelX = 0;
				data.movedRelY = 0;
				data.relPositionX = 0;
				data.relPositionY = 0;
				data.directionX = 0;
				data.directionY = 0;
				data.initDir = '';
				
			});
			
			
			// --- Touchmove
			$this.on( 'touchmove.touchevents', function(e){
				var scale = e.originalEvent.scale;
				var touches = e.originalEvent.touches;
				var touch = touches[0];
				
				// Exit if user is pinching
				if( touches.length > 1 || scale && scale !== 1 ) {
					return;
				}
				
				// Update movement data
				data.movedX = touch.pageX - data.startX;
				data.movedY = touch.pageY - data.startY;
				data.movedRelX = data.movedX / data.areaWidth;
				data.movedRelY = data.movedY / data.areaHeight;
				data.relPositionX = ( touch.pageX - data.areaLeft ) / data.areaWidth;
				data.relPositionY = ( touch.pageY - data.areaTop ) / data.areaHeight;
				data.directionX = ( data.movedX >= 0 ) ? 1 : -1;
				data.directionY = ( data.movedY >= 0 ) ? 1 : -1;
				if( !data.initDir ) {
					data.initDir = Math.abs( data.movedY ) > Math.abs( data.movedX ) ? 'y' : 'x';
				}
				
			});
			
			
			// --- Touchend
			$this.on( 'touchend.touchevents', function(e){
				
				// Detect quick swipes
				var testTime   = +new Date - data.startTime;
				var testLength = ( data.initDir == 'x' ) ? data.movedX : data.movedY;
				var quickSwipe = ( testTime < 250 && Math.abs( testLength ) > 20 );
				if( quickSwipe ) {
					$this.trigger( 'quickswipe' );
					$this.trigger( 'swipe' );
					
					if( data.initDir == 'x' && testLength > 0 ) {
						$this.trigger( 'quickswiperight' );
						$this.trigger( 'swiperight' );
					} else if( data.initDir == 'x' ) {
						$this.trigger( 'quickswipeleft' );
						$this.trigger( 'swipeleft' );
					} else if( testLength > 0 ) {
						$this.trigger( 'quickswipeup' );
						$this.trigger( 'swipeup' );
					} else {
						$this.trigger( 'quickswipedown' );
						$this.trigger( 'swipedown' );
					}
				}
				
				// Detect long swipes
				else {
					var testRel   = ( data.initDir == 'x' ) ? data.movedRelX : data.movedRelY;
					var longSwipe = ( Math.abs( testRel ) > .5 );
					if( longSwipe ) {
						$this.trigger( 'longswipe' );
						$this.trigger( 'swipe' );
						
						if( data.initDir == 'x' && testRel > 0 ) {
							$this.trigger( 'longswiperight' );
							$this.trigger( 'swiperight' );
						} else if( data.initDir == 'x' ) {
							$this.trigger( 'longswipeleft' );
							$this.trigger( 'swipeleft' );
						} else if( testRel > 0 ) {
							$this.trigger( 'longswipeup' );
							$this.trigger( 'swipeup' );
						} else {
							$this.trigger( 'longswipedown' );
							$this.trigger( 'swipedown' );
						}
					}
					
					// Detect failed swiping
					else {
						$this.trigger( 'swipefail' );
					}
				}
				
				
			});
			
		});
	};
	
	
} )( jQuery, window, document );
