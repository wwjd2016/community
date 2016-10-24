$(function(){
	$(".switch-input").on("focus",function(){
		$(this).animate({
			width:"200px"
		},300).val("功能正在开发中...")
	})
	$(document).on("click",function(e){
		var _this = $(e.target);
		if (_this.parents(".nav-search").length == 0)
			$(".switch-input").animate({width:"72px"},500).val("");	
	})
	
})