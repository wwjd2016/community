$(function(){
    //头像提交
	$(".upload").on("click",function(){
		$("#portrait").click();
	})
	$("#portrait").change(function(){
		var src = getUrl("portrait");
		var fileName = $('#portrait').val();
        var extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
        if (extension == ".jpg" || extension == ".png" || extension == ".gif") {
                var data = new FormData();
                data.append('upload', $('#portrait')[0].files[0]);
                $.ajax({
                    url: '/user/headPortrait',
                    type: 'POST',
                    data: data,
                    cache: false,
                    contentType: false, //不可缺参数
                    processData: false, //不可缺参数
                    success: function(data) {
                    	if (data.error) {
                    		return alert(data.message+data.error)
                    	}
                        alert(data.message);
                        $(".preview-img").attr("src",src);
                    },
                    error: function(err) {
                        alert(err)
                    }
                });
                
        }
		else{
			return alert("文件格式不正确!")
		}	
	})

    // 个人信息管理提交
    $(".person-submit").click(function(){
        var personManage = {
            signature:$("#signature").val(),
            personUrl:$("#personUrl").val(),
            sex:$("#sex").val(),
            age:$("#age").val(),
            city:$("#city").val(),
            profession:$("#profession").val()
        }
        $.ajax({
            type:"POST",
            url:"/user/userCenter",
            data:personManage,
            success:function(data){
                if (data.message == 2)
                    alert("提交失败！");
                window.location.href="/";
            },
            error:function(){
                alert("提交失败！")
            }
        })
    })
})
//获取上传图片的地址函数
function getUrl(sourceId) {
    var url;
    if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE
        url = document.getElementById(sourceId).value;
    } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
    } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
    }
    return url;
}