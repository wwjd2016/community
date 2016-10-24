$(function(){
		//获取会员数&右侧推荐资讯
	$.ajax({
		type:"get",
		url:"/publics/get",
		success:function(data){
			$(".user-count").text(data.count);
			var hot_ul = $(".hot-article-list");
			var li_item = "";
			data.article.forEach(function(item,key){
				var time = new Date(item.meta.createAt);
				li_item +='<li><a href="/article/details/'+item._id+'">'+item.title.substring(0,10)+'</a><span class="pull-right">'
				+ time.getFullYear()+'/'+time.getMonth()+'/'+time.getDay()+'</span></li>'
			})
			hot_ul.html(li_item)
		}
	});
	//未读消息
	if ($(".unread").length == 0) {
		return false;
	}else{
		var user = $(".unread").attr("us-id");
		$.ajax({
			type:"POST",
			url:"/user/messages",
			data:{user:user},
			success:function(data){
				var temp = 0;
				if (data.messages.length==0)
					return $(".unread .badge").text(data.messages.length)
				for(i=0;i<data.messages.length;i++){
					if (data.messages[i].staus == 0) {
						temp += 1;
					}
				}
				$(".unread .badge").text(temp)
			}
		})
	}

})