/*
	在光标位置插入数据
*/
function AddOnPos(FieldId, myValue)

{

	 var myField = document.getElementById(FieldId);

	//IE support

	if (document.selection){

		 myField.focus();

		 sel = document.selection.createRange();

		 sel.text = myValue;

		 sel.select();

	} else if (myField.selectionStart || myField.selectionStart == '0'){

		 //MOZILLA/NETSCAPE support

		 var startPos = myField.selectionStart;

		 var endPos = myField.selectionEnd;

		 // save scrollTop before insert

		 var restoreTop = myField.scrollTop;

		 myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos,myField.value.length);

		 if (restoreTop > 0) {

		 // restore previous scrollTop

		 myField.scrollTop = restoreTop;

	 	}

		 myField.focus();

		 myField.selectionStart = startPos + myValue.length;

		 myField.selectionEnd = startPos + myValue.length;

	} else {

		 myField.value += myValue;

		 myField.focus();

	}

}
var keydown=function(e){
		var e=e||event;
		
		if(e.keyCode==9){//增加全局预览
			AddOnPos("textinput", "    ");
			return false;
		}
}
document.onkeydown=keydown;

var editPanel=function(){

	$(".editor").keyup($.proxy(this.keyup,this));
	this.editFlag=true;
	this.init();


}
editPanel.prototype.keyup=function(e){

	var text=$(".editor").val();
	var text2=text.replace(/\s/ig,'');
	if(text2===""){
		return;
	}
	if(this.editFlag){

		this.editFlag=false;
		var _this=this;
		$.post("/mark",{content:text},function(data){

			$(".page").html(data);
			
			_this.editFlag=true;

		});
	}
	
};
editPanel.prototype.init=function(){
		
		this.event();

		this.layout();

		

}
//定义页面的布局
editPanel.prototype.layout=function(){
		var pageHeight=$(document).height();
		var editorHei=pageHeight-100;
		var width=$(document).width(); 
		var editorWid=width/2-80;
		$(".editor").css("height",editorHei);
		$(".editor").css("width",editorWid);
		var resultWid=width-editorWid-91;
		$(".page").css("height",pageHeight-50);
		$(".page").css("width",resultWid);
}
//所有关于event的触发
editPanel.prototype.event=function(){
	 var _this=this;
	 $("#funkStyle").click(function(){

			$(".mask").show();
			$(".config").show();
			_this.initPanel();

	 });
	 $(".close").click(function(){
			
			$(".mask").hide();
			$(".board").hide();
	 });
	 $("#sure").click(function(){
	 		_this.changeSql();
	 		$(".mask").hide();
			$(".board").hide();
	 });

	 $("#cancel").click(function(){
	 		

	 		$(".mask").hide();
			$(".board").hide();
	 });
	 $("#attention").click(function(){
	 		$(".result").show();
	 		$(".mask").show();
	 });

	 $("#nextPage").click($.proxy(this.nextPage,this));

	 $("#lastPage").click($.proxy(this.lastPage,this));

	 $("#finish").click($.proxy(this.save,this));

	 $("#hello").click(function(){
	 	window.location.href="/demo";
	 });

}
editPanel.prototype.initPanel=function(){

	var sql=$("#hid_panelVal").val();

	var obj =jQuery.parseJSON(sql);

	$("#curpage").val(obj.curpage);

	if(parseInt(obj.backNeed)===1){
		$("#no").removeAttr("checked");
		$("#yes").attr("checked", "checked");

	}else{
		$("#yes").removeAttr("checked");
		$("#no").attr("checked",true);
	}
	
	 $("#scale").val(obj.scale);

	 $("#coordX").val(obj.coord.x);
	
	 $("#coordY").val(obj.coord.y);

	 $("#coordZ").val(obj.coord.z);

	 $("#TwodDeg").val(obj.TwodDeg);

	 $("#ThrdXDeg").val(obj.ThrdXDeg);

	 $("#ThrdYDeg").val(obj.ThrdYDeg);

}

editPanel.prototype.changeSql=function(){

	var sql={
		coord:{
			x:0,
			y:0,
			z:0
		}

	};

	sql.curpage=$("#curpage").val().length===0?0:$("#curpage").val();

	sql.backNeed = $(".zuobiao").find('input[name="background"]').filter(':checked').val();

	sql.scale=$("#scale").val().length===0?1:$("#scale").val();

	sql.coord.x=$("#coordX").val().length===0?0:$("#coordX").val();

	sql.coord.y=$("#coordY").val().length===0?0:$("#coordY").val();

	sql.coord.z=$("#coordZ").val().length===0?0:$("#coordZ").val();

	sql.TwodDeg=$("#TwodDeg").val().length===0?0:$("#TwodDeg").val();

	sql.ThrdXDeg=$("#ThrdXDeg").val().length===0?0:$("#ThrdXDeg").val();

	sql.ThrdYDeg=$("#ThrdYDeg").val().length===0?0:$("#ThrdYDeg").val();

	var val=JSON.stringify(sql);

	


	$("#hid_panelVal").val(val);

}
//点击下一页，提交所有配置要求
editPanel.prototype.nextPage=function(){

		var val=$("#hid_panelVal").val();
		
		var content=$("#textinput").val();

		if(content.length==0){
			return;
		}
		var markCon=$(".page").html();


		var pptID=$("#hid_pptId").val();

		$.post("/ppt",{content:content,sql:val,id:pptID,markCon:markCon},function(data){

	  	 	var code=data.code;
	  	 	console.log(data);
	  	 	if(code==400){

	  	 		var val=JSON.stringify(data.info);

		  	 	$("#hid_panelVal").val(val);

		  	 	$("#textinput").val("");

		  	 	$(".page").html("");

	  	 	}else{
	  	 		var val=JSON.stringify(data.info);

		  	 	$("#hid_panelVal").val(val);

		  	 	$("#textinput").val(data.con);

		  	 	$(".page").html(data.ppcon);



	  	 	}

	  	 	

		 });

}
//点击上一页，返回上一页的所有内容极其配置
editPanel.prototype.lastPage=function(){

	var obj=$("#hid_panelVal").val();

	var curpage=JSON.parse(obj).curpage;

	var id=$("#hid_pptId").val();

	var lastPage=parseInt(curpage)-1;

	if(lastPage<1){

		return;

	}

	$.get("/ppt/post/"+id+"/"+lastPage,function(data){

		var con1=data.con;
		
		var con2=data.ppCon;

		var spec=data.spec;

		$("#hid_panelVal").val(spec);

  	 	$("#textinput").val(con1);

  	 	$(".page").html(con2);


	})

}
//点击完成，保存ppt内容
editPanel.prototype.save=function(){

	var val=$("#hid_panelVal").val();
		
	var content=$("#textinput").val();

	if(content.length==0){
		return;
	}
	var markCon=$(".page").html();

	var pptID=$("#hid_pptId").val();

	$.post("/pts",{content:content,sql:val,id:pptID,markCon:markCon},function(data){
 			
		alert(data);


 	});
}
 

$(function(){

	var edpl=new editPanel();

});