$(function(){
	var cons = $(".content-item");
	cons.each(function(){
		var text = $(this).text().substring(0,10);
		$(this).text(text)
	})

	$(".look-more").on("click",function(){
		if ($(this).hasClass("m-active")) {
			$(this).text("查看全部");
			$(this).removeClass("m-active").parents(".history-list").css("height","400px");
		}else{
			$(this).text("收起");
			$(this).addClass("m-active").parents(".history-list").css("height","auto");
		}
	})
})