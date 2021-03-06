(function($){
  /* code here runs instantly as opposed to $(function(){ ... }); which waits for DOM making ready function unness */	
  var debug = true;
  var toggleActive = true;
	var activeMQ;  // Stores the screen size
	var currentMQ = "unknown"; // set the default screen size
	var front = false;
	var front_banner_height = 520;
	var vcardiced = false;
	var processed = false;
	
	$(document).ready(function() {
		
		// JQuery version
		if(debug) {
			if(typeof window.console !== "undefined") {
				window.console.log("JQuery version:  " + $.fn.jquery);
			}
		}
		
		// Misc. Fixes
		var apply_fixes = function () {
			var msViewportStyle = null;
			/// SNAP MODE FIXES
			
			// MS Surface snap fix
			// See http://www.mobilexweb.com/blog/windows-8-surface-ie10-html5
			if (navigator.userAgent.match(/Windows NT 6.2; ARM(.+)Touch/)) {
		    msViewportStyle = document.createElement("style");
		    msViewportStyle.appendChild(
		      document.createTextNode(
		          "@-ms-viewport{width:device-width}"
		      )
		    );
		    document.getElementsByTagName("head")[0].
		    	appendChild(msViewportStyle);
			}
			
			// Lumia 820 and HTC 8X fix
			// See http://timkadlec.com/2013/01/windows-phone-8-and-device-width/
			if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
		    msViewportStyle = document.createElement("style");
		    msViewportStyle.appendChild(
	        document.createTextNode(
	            "@-ms-viewport{width:auto!important}"
	        )
		    );
		    document.getElementsByTagName("head")[0].
		    	appendChild(msViewportStyle);
			}
			
		};
		
		apply_fixes();
		
		// foundation top-bar support. 
		// Note: Add after any JavaScript constructed markup that relies on foundation
		$(document).foundation(); 
		
		// BOOTSTRAPIFY //////////////////////////////////////////////////
		// Process .portlet for bootstrap collapse
		var bootstrapify = function (mq) {
			
			// Sidebar-right ...
			if($('.sidebar-right .portlet').length !== 0) {
				var i = 20;
				var contentClassName = '.portlet-content';
				
				$('.sidebar-right').wrapInner('<div id="accordion-sr" class="panel-group"></div>');
				
	      $('.sidebar-right .portlet').each(function () {
				
					var mobile = ((mq === "XS") || (mq === "S")) ? true : false;
					var el = $(this);
					//var id = ('accordion'+i);
					var aid = ('acont'+i);
					var pid = ('panel'+i);
					
					//el.addClass('panel-group');
					//el.attr('id',('accordion'+i));
					//el.wrapInner('<div id="'+pid+'" class="panel panel-default" />');
				
					el.addClass('panel panel-default');
					el.attr('id',pid);
										
					var titleEl = el.find('h3');
					// TODO: Handle cases where h3 heading not available
					titleEl.wrap('<div class="panel-heading" />');
					titleEl.addClass("panel-title");
					titleEl.wrapInner('<a data-parent="#accordion-sr" data-target="#'+aid+'" data-toggle="collapse"></div>');
				
					var bodyEl = el.find(contentClassName);
					bodyEl.addClass('panel-body');
					//if(mobile) {
						// Mobile (closed)
						bodyEl.wrap('<div class="collapsible panel-collapse collapse" id="'+aid+'"></div>');
						//} else {
						// Desktop / tablet (open)
						//bodyEl.wrap('<div class="collapsible panel-collapse collapse in" id="'+aid+'"></div>');
						//}
					
					if(typeof window.console !== "undefined") {
            window.console.log("ActiveMQ: " + activeMQ + ", Mobile: "+ mobile);
					}
					++i;
	      });
			}		
			processed = true;
		};
		
		// PLUGIN CANDIDATES /////////////////////////////////////////////
		// Process .picture into figure/figcaption
		// TODO: Plugin
		if($('.picture').length !== 0) {
      $('.picture img').each(function () {
				var title = $(this).attr('title');
				$(this).wrap('<figure class="picture-processed" />');
				$(this).parent().append("<figcaption>"+title+"</figcaption>");
      });
		}		
		
		// Process download file icons
		// TODO: Plugin ... with option to add id's which should be checked for file type icon placement
		if($('#downloads').length !== 0) {
      $('#downloads li').each(function () {
				// Method using href
				var a = $(this).find('a');
				var c = a.attr('href').split(".");
				if( c.length === 1 || ( c[0] === "" && c.length === 2 ) ) {
				    // handle errors
				} else {
					a.addClass(c.pop()+'-icon icon-processed');
				}
				// Method using filetype class in cases where PDF or other extension not available
				/*if($(this).has('span.pdf-filetype')) {
					$(this).find('a').addClass('pdf-icon icon-processed');
				}*/
      });
		}		
		
    // Add Events Cross-browser
    var event = {
	    add: function (elem, type, fn) {
        if (elem.attachEvent) {
	        elem['e' + type + fn] = fn;
	        elem[type + fn] = function () {
	        	elem['e' + type + fn](window.event);
	        };
	        elem.attachEvent('on' + type, elem[type + fn]);
        } else {
        	elem.addEventListener(type, fn, false);
				}
	    }
    };

		
		// WAI level-1 compliancy - Bypass Blocks 2.4.1
		// Nic Zakas "skip to content" next focus fix
		// See http://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
		// TEST Checkpoint: https://code.google.com/p/chromium/issues/detail?id=37721
		window.addEventListener("hashchange", function(event) {
	    var element = document.getElementById(location.hash.substring(1));
	    if (element) {
	      if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
	      	element.tabIndex = -1;
	      }
	      element.focus();
	    }
		}, false);
   

    // Check CSS value in active media query and sync Javascript functionality
    var mqSync = function () {
        // Fix for Opera issue when using font-family to store value
        if (window.opera) {
					// TODO: Check that content-main is available after changing this from class to id
           activeMQ = window.getComputedStyle(document.body, ':after').getPropertyValue('content-main');
        }
        // For all other modern browsers
        else if (window.getComputedStyle) {
           activeMQ = window.getComputedStyle(document.head, null).getPropertyValue('font-family');
        }
        // For oldIE
        else {
            // Use .getCompStyle instead of .getComputedStyle so above check for window.getComputedStyle never fires true for old browsers
            window.getCompStyle = function (el, pseudo) {
							this.pseudo = pseudo;
                this.el = el;
                this.getPropertyValue = function (prop) {
                    var re = /(\-([a-z]){1})/g;
                    if (prop === 'float') {
											prop = 'styleFloat';
										}
                    if (re.test(prop)) {
                        prop = prop.replace(re, function () {
                            return arguments[2].toUpperCase();
                        });
                    }
                    return el.currentStyle[prop] ? el.currentStyle[prop] : null;
                };
                return this;
            };
            var compStyle = window.getCompStyle(document.getElementsByTagName('head')[0], "");
            activeMQ = compStyle.getPropertyValue("font-family");
        }
        activeMQ = activeMQ.replace(/"/g, "");
        activeMQ = activeMQ.replace(/'/g, "");
    }; // End mqSync
		
		var bend = function () {
			if(($('#footer #vcard').length !== 0) && !vcardiced) {
				$('#footer #vcard').insertBefore($('#footer #copyright'));
				vcardiced = true;
			}
		};
		
		var unbend = function () {
			if(vcardiced) {
				$('#footer #vcard').insertAfter($('#footer #foot-social'));
				vcardiced = false;
			}
		};
		
		var expand = function () {

      // Conditions for each breakpoint
      if (activeMQ !== currentMQ) {

					// If the detected screen size is Mobile Extra Small 0px-449px
          if (activeMQ === 'XS') {
              currentMQ = activeMQ;
							utilStack();
              collapsedView();
							
							bend();

          }
					// If the detected screen size is Mobile 450px-599px
          if (activeMQ === 'S') {
              currentMQ = activeMQ;
							$('body.home #top-panel-row').height("auto");
							utilStack();
						 
							collapsedView();					
							
							bend();
							
          }
					// If the detected screen size is Tablet 600px-959px
          if (activeMQ === 'M') {
              currentMQ = activeMQ;
							if  ( ($("body.ourpeople").length !== 0) || ($("body.home").length !== 0) ) {
								$('body.home #top-panel-row').height(front_banner_height);
								 
							}
							expandedView(); // was previously in conditional above
							/*
							else if($("body.ourpeople").length !== 0){
							collapsedView();	
							rmvStack();
							
							}
							*/
							bend();
          }
					// If the detected screen size is Desktop 960px and up
          if (activeMQ === 'L') {
              currentMQ = activeMQ;
							rmvStack();
							$('body.home #top-panel-row').height(front_banner_height);
              expandedView();
							
							unbend();
          }
      }
		};

		
		function myResize() {

			
      mqSync();
			if(!processed) {
				bootstrapify(activeMQ);
			}
			expand();
			
			
		}
				
    if (toggleActive) {
				myResize();
        // Run on resize
        event.add(window, "resize", myResize);
    }

		// Activate home page happy boxes
		if ((activeMQ === 'L') || (activeMQ === 'M')) {
			if($('body.home #top-panel-row').length !== 0) {
				$('body.home #top-panel-row').happybox(
					{
						'type': '.panel', // element type to make happy
						'action_element_class': '.action-element',
						'canvas_element_class': '.narrow-col',
						'button_class': ".btn-primary",
						'height': front_banner_height // total height of the happy viewport
					}
				);
				front = true;
			}
		}
		
    if (debug) {
        $(window).resize(function () {
					if(typeof window.console !== "undefined") {
            window.console.log($(this).width());
						window.console.log('Screen size: ' + currentMQ);
					}
        });
    }
		
    function expandedView() {
       	// Index page
			  //$(".ls-content").removeClass("tab-content");
       // $(".landscape div").removeClass("tab-pane");
        //$(".nav-tabs").hide();
				
        /* If Bio Page */
				if ($("body.bio").length !== 0) {
            // Remove the panel effects and then show the headers
						$("#about-bio").removeClass("panel panel-default");
            $(".content-bio-container").removeClass(".panel-group");
            $(".btn-more").show(); 
						$("#about-bio div").removeClass("panel panel-default");
						$("#about-bio h3").show();
						
						// hide the extra text until the show more button is clicked                                    
            $("#contC,#contB").addClass("more_text");
						
           
        }
				// Remove the panel body effect 
				//$(".collapsible").children().removeClass("panel-body");
				
        // Remove the data-toggle attribute to allow the links to work in desktop
				$(".panel-title a").removeAttr('data-toggle');
				$(".nav > li a").removeAttr('data-toggle');
				
				// drop-on class added to element to manage desktop/mobile hover/no-hover
				$(".nav > li").addClass("drop-on");
				
				// Prevent the sidebars from behaving like panels when in desktop view
				//$(".sidebar .panel").removeClass("panel-collapse collapse in"); // NOTE: Changed from .sidebar-panel					
				$(".sidebar .panel-group").children().removeClass("panel panel-default"); // deactivates acc behavior. TODO: Possibly make global, so .panel-group

				// Fix for panel-collapse height not being reset to auto	
				$(".collapsible").css("height", "auto");
				
				$("#content-main div").children().removeClass("panel-collapse collapse active");
				$("#content-main .panel-heading").hide(); // TODO: Home page needs this
				
				$(".panel-group .collapsible").addClass("in"); // New: Open panels 
				
        $(".more_text").hide();
				
				// Remove the open class from an open dropdown list to prevent an open dropdown list on desktop view
				$(".nav li").removeClass("open");
	   }

    function collapsedView() {
				// Index page
        //$(".ls-content").addClass("tab-content");
        //$(".landscape div").addClass("tab-pane");
        //$(".landscape").removeClass("tab-content");
        $("#contA", ".panel .panel-collapse").addClass("active"); // TODO: Are we using this?
       // $(".nav-tabs").show();
							  			     
			 // TODO: Update the bio conditional; we really don't want a conditional for only a page type
        if ($("body.bio").length === 0) {		
						// Add accordion effects to sidebar			  
            $(".sidebar .panel-group").children().addClass("panel panel-default"); // activates acc behavior
						$(".panel-group").children().addClass("panel panel-default");
            //$(".sidebar .panel").addClass("panel-collapse collapse"); // Note: Changed from .sidebar-panel
            //$(".collapse div").addClass("panel-body"); // TODO: Do we need this?

        }
				/* If Bio Page */
				else if ($("body.bio").length !== 0) {
						// Add accordion effects to sidebar			  
            $(".content-bio-container").addClass("panel-group");
						$("#about-bio > div").addClass("panel panel-default");
						$("#sidebar-bio-right > div").addClass("panel panel-default");
						$(".btn-bio").hide();
						$("#about-bio h3").hide();
        }
				
				
				// NOTE: Following changes are global
				
				// Add the collapse on toggle attribute to the panel headers
				//$(".panel-title a").attr("data-toggle","collapse");
				$(".panel-group .collapsible").addClass("panel-collapse collapse"); // Note: global
				$(".panel-group .collapsible").removeClass("in"); // New: Close panels
        $(".collapse > div").addClass("panel-body");
				
				// Remove the dropdown on hover effect from the navbar parent items
				$(".nav > li").removeClass("drop-on");
				//$(".panel-heading").show();
        $(".more_text").hide();			
				// Add the dropdown on toggle attribute to the panel headers	
				$(".par > a").attr("data-toggle","dropdown");
   		
				// Prevent the panel-title headers from redirecting the page and shows .panel-body content
        $(".panel-title a").click(function (e) {
            e.preventDefault();
            $($(this).data("target")).show();			
				});	
       
			 // Work around to allow the menu dropdown links to work
			 // TODO: This is a temporary workaround
			 //$('ul.nav li').find('a').on('click', function() {
				//		window.location = $(this).attr('href');
				//});
				
    }
		/* footer utility menu stack */
		function utilStack(){
			// Stack the menu vertically
		  $("#utility nav ul li").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3");				
		}
		function rmvStack(){
			// Line the menu horizontally
			$("#utility nav ul li").removeClass("col-xs-3 col-sm-3 col-md-3 col-lg-3");					
		}
		
	});
})(jQuery);