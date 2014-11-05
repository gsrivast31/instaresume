//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

// jQuery stuff
jQuery(document).ready(function($) {
	$('#signin').click(function(){
		console.log("signin click");
		$('#loginForm').attr("method", "post");
		$('#loginForm').attr("action", "/login");
		$('#loginForm').submit();
	});

	$('#signup').click(function(){
		console.log("signup click");
		$('#loginForm').attr("method", "post");
		$('#loginForm').attr("action", "/signup");
		$('#loginForm').submit();
	});

});