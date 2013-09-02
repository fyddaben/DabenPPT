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
	
}

 

$(function(){

	var pageHeight=$(document).height();
	var editorHei=pageHeight-100;
	var width=$(document).width(); 
	var editorWid=width/2-80;
	$(".editor").css("height",editorHei);
	$(".editor").css("width",editorWid);
	var resultWid=width-editorWid-91;
	$(".page").css("height",pageHeight-50);
	$(".page").css("width",resultWid);



	var edpl=new editPanel();



});