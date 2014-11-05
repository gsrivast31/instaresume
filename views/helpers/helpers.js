'use strict';

exports.daySelect = function (selected) {
    var days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 
    			21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
	var ret = "";
	for (var i=0; i < days.length; i++){
		var selectedVal = ""; 
		if(typeof(selected) == "number" && days[i] === selected){
		   selectedVal = "selected";
		} 
		ret+="<option "+"value='"+days[i]+"'" + selectedVal + ">"+days[i]+"</option>";
	}
	return ret;
};

exports.monthSelect = function (selected) {
	var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	var ret = "";
	for (var i=0; i < months.length; i++){
		var selectedVal = ""; 
		if(typeof(selected) == "number" && months[i] === selected){
		   selectedVal = "selected";
		} 
		ret+="<option "+"value='"+months[i]+"'" + selectedVal + ">"+months[i]+"</option>";
	}
	return ret;
};