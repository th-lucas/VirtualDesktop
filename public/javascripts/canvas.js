
var clickX = new Array();
var clickY = new Array();
var clickXErase = new Array();
var clickYErase = new Array();

var clickDrag = new Array();
var clickDragErase = new Array();
var paint;

var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBlack = "#000000";
var colorRed = "#FF6666";
var colorCyan = "#00FFFF";
var colorWhite = "#FFFFFF";
var colorBlue = "#0080FF";

var curColor = colorPurple;
var clickColor = new Array();

var small = 2;
var normal = 5;
var large = 10;
var huge = 20;

var clickSize = new Array();
var clickSizeErase = new Array();
var curSize = normal;

var clickTool = new Array();
var curTool = "pen";

function activ_Paint(){
	
	
	var paint = false;
	$('#canvas').css('z-index',0);
	$('#canvas').mousedown(function(e){
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;

		paint = true;
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		redraw();
	});

	$('#canvas').mousemove(function(e){
		if(paint){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});

	$('#canvas').mouseup(function(e){
		paint = false;

		var img = new Image();
		img.src = document.getElementById("canvas").toDataURL();
		
		context.drawImage(img,0,0);
		savePainting();
		clearList();
		
	});

	var out = false;
	$('#canvas').mouseleave(function(e){
		if(paint == true){
			out = true;
		}
		paint = false;
	});

	$('#canvas').mouseenter(function(e){
		if(out==true){
			out = false;
			paint = true;
		}
	});
}

function addClick(x, y, dragging)
{	
	if(curTool == "eraser"){
		clickDragErase.push(dragging);
		clickXErase.push(x);
		clickYErase.push(y);
		clickSizeErase.push(curSize);
	}else{
		clickDrag.push(dragging);
		clickX.push(x);
		clickY.push(y);
	    clickColor.push(curColor);
	    clickSize.push(curSize);
	}
	
}

function redraw(){

	context.lineJoin = "round";

	context.globalCompositeOperation = "source-over";
	for(var i=0; i < clickX.length; i++)
	{		
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i]-1, clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		context.strokeStyle = clickColor[i];
		context.lineWidth = clickSize[i];
		context.stroke(); 
	}
	
	context.globalCompositeOperation = "destination-out";
	for(var i=0; i < clickXErase.length; i++)
	{		
		context.beginPath();
		if(clickDragErase[i] && i){
			context.moveTo(clickXErase[i-1], clickYErase[i-1]);
		}else{
			context.moveTo(clickXErase[i]-1, clickYErase[i]);
		}
		context.lineTo(clickXErase[i], clickYErase[i]);
		context.closePath();
//		context.strokeStyle = $("#content").css("background-color");

		context.lineWidth = clickSizeErase[i];
		
	}
	context.stroke();
}

function changeColor(id, color){
	$(".colorSelected").removeClass("colorSelected");
	$("#"+id).addClass("colorSelected");
	curColor = color;
}

function changeSize(id,size){
	$(".sizeSelected").removeClass("sizeSelected");
	$("#"+id).addClass("sizeSelected");
	curSize = size;
}

function changeTool(id,tool){
	$(".toolSelected").removeClass("toolSelected");
	$("#"+id).addClass("toolSelected");
	curTool = tool;
}

function clearList(){
	clickX.splice(0,clickX.length);
	clickY.splice(0,clickY.length);
	clickXErase.splice(0,clickXErase.length);
	clickYErase.splice(0,clickYErase.length);
	clickDrag.splice(0,clickDrag.length);
	clickDragErase.splice(0,clickDragErase.length);
	clickColor.splice(0,clickColor.length);
	clickSize.splice(0,clickSize.length);
	clickTool.splice(0,clickTool.length);
	clickSizeErase.splice(0,clickSizeErase.length);
}
function clearCanvas() {
	
	clearList();
	canvas.width = canvas.width;
	savePainting();
}

function savePainting(){
	$.ajax({
		type : "POST",
		url:"saveImageDesktop/"+ document.getElementById("desktop_id").innerHTML,
		error: "Warning there is an error !",
		data : {url: document.getElementById("canvas").toDataURL()}
	})
}

function endPainting(){
	$("#canvas").off();
	$("#toolbox_paint").css("display","none");
	//alert(document.getElementById("canvas").toDataURL());
	savePainting();
}

$(document).ready(function(){
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('height', $("#content").height());
	canvas.setAttribute('width', $("#content").width());
	$(canvas).css('position', 'absolute');
	$(canvas).css('top', $("#content").offset().top);
	canvas.setAttribute('id', 'canvas');
	context = canvas.getContext("2d");
	
	var img = new Image();
	img.src = $("#urlImage").val();
	img.onload = function(){
		context.drawImage(img,0,0);
	}
	
	canvasDiv.appendChild(canvas);	
	

	$("#choosePurpleSimpleColors").addClass("colorSelected");
	$("#chooseNormalSimpleSizes").addClass("sizeSelected");
	$("#choosePenTools").addClass("toolSelected");
	
	
	/* Ajoute la classe hover à la croix */
	$("#toolbox_paint a").hover(function(){
		$(this).find(".closeTBicon").css("border","2px inset #c0c0c0");
	},function(){
		$(this).find(".closeTBicon").css("border","none");
	});
})

