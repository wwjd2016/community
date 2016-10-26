$(function(){
		//获取会员数&右侧推荐资讯
	$.ajax({
		type:"get",
		url:"/publicbase/get",
		success:function(data){
			console.log(data)
			$(".user-count").text(data.count);
			var hot_ul = $(".hot-article-list");//热门分享
			var hot_infor = $(".hot-information");
			var li_item = "";
			var li_item2 = "";
			data.data.shareArticles.forEach(function(item,key){
				var time = new Date(item.meta.createAt);
				li_item +='<li><a href="/article/details/'+item._id+'">'+item.title.substring(0,15)+'</a></li>'
			})
			data.data.informationArticles.forEach(function(item,key){
				var time = new Date(item.meta.createAt);
				li_item2 +='<li><a href="/article/details/'+item._id+'">'+item.title.substring(0,15)+'</a></li>'
			})
			hot_ul.html(li_item)
			hot_infor.html(li_item2)
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