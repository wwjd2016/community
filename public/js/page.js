//默认值显示5个页码，当前页在中间
//pageIndex 当前页
//pageCount 总页数
//pageEle 页码存放父元素
function page(pageIndex,pageCount,category,pageEle) {
	var pageIndex = parseInt(pageIndex),
		pageCount = parseInt(pageCount);
		if (pageIndex > pageCount) {
			return false;
		}
		if (pageIndex<=0) {
			pageIndex == 1;
		}
		//首页按钮
		if (pageIndex <= 1) {
			$(pageEle).prepend('<li class="disabled"><a href="javescript:void(0)">&laquo;</a></li>');
			$(pageEle).prepend('<li><a href="/?tab='+category+'&page='+pageIndex+'">首页</a></li>');
		}else{
			$(pageEle).prepend('<li><a href="/?tab='+category+'&page='+(pageIndex-1)+'">&laquo;</a></li>');
			$(pageEle).prepend('<li><a href="/?tab='+category+'&page='+1+'">首页</a></li>');
		}
		//判断页码少于5页时
		if (pageCount <= 5) {
			//页码
			for(i=1;i<= pageCount;i++){
				//判断是否为当前页
				if (i == pageIndex) {
					$(pageEle).append('<li class="active"><a href="/?tab='+category+'&page='+i+'">'+i+'</a></li>')
				}else{
					$(pageEle).append('<li><a href="/?tab='+category+'&page='+i+'">'+i+'</a></li>')
				}	
			}
		}
		//页码大于5页时
		else if(pageCount > 5){
			//判断是否小于第三页
			if (pageIndex < 3) {
				for(i=1;i<= 5;i++){
				//判断是否为当前页
				if (i == pageIndex) {
					$(pageEle).append('<li class="active"><a href="/?tab='+category+'&page='+i+'">'+i+'</a></li>')
				}else{
					$(pageEle).append('<li><a href="/?tab='+category+'&page='+i+'">'+i+'</a></li>')
				}	
			}
			}
			//判断是否是倒数第三页
			else if((pageCount-pageIndex)<2){
				for(i=(pageCount-4);i<=pageCount;i++){
				//判断是否为当前页
				if (i == pageIndex) {
					$(pageEle).append('<li class="active"><a href="/?tab='+category+'&page='+i+'">'+i+'</a></li>')
				}else{
					$(pageEle).append('<li><a href="/?tab='+category+'&page='+i+'">'+i+'</a></li>')
				}	
			}
			}
			else{
				for(i=(pageIndex-2);i<=(pageIndex+2);i++){
				//判断是否为当前页
				if (i == pageIndex) {
					$(pageEle).append('<li class="active"><a href="/?tab='+category+'&page='+i+'">'+i+'</a></li>')
				}else{
					$(pageEle).append('<li><a href="/?tab='+category+'&page='+i+'">'+i+'</a></li>')
				}	
			}
			}
		}	
		//尾页按钮
		if (pageIndex >= pageCount) {
			$(pageEle).append('<li class="disabled"><a href="javescript:void(0)">&raquo;</a></li>');
			$(pageEle).append('<li><a href="/?tab='+category+'&page='+pageCount+'">尾页</a></li>');
		}else{
			$(pageEle).append('<li><a href="/?tab='+category+'&page='+(pageIndex+1)+'">&raquo;</a></li>');
			$(pageEle).append('<li><a href="/?tab='+category+'&page='+pageCount+'">尾页</a></li>');
		}
}
