$(function(){
	//回复某人
	$(document).on("click",".replay-btn",function(){
		$(".comment-type").text("回复："+$(this).parent().find(".comment-user").text());
		$(".replay-to").val($(this).parent().find(".comment-user").attr("data-id"));
		$(".replay-comment").val($(this).parent().attr("comment-id"));
		var distance = $(".comment-post").offset().top;
		$("html,body").animate({scrollTop:distance},500)
	})

	//富文本编辑器
	   var ue = UE.getEditor('content',{
	  	iframeCssUrl: '/ueditor/themes/iframe.css',// 引入css
	  	toolbars:[['FullScreen', 'Source','insertcode', 'Undo', 'Redo','bold','italic','test','link','unlink','emotion','simpleupload','blockquote','insertorderedlist','insertunorderedlist','preview']]
	  });
})