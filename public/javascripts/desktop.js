/* Fonction permettant d'ouvrir le color picker */
$(document).ready(function(){
	$('#input').ColorPicker({
		color: $("#color").val(),
		onShow: function (colpkr) {
			$(colpkr).ColorPickerSetColor($("#color").val())
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
		},
		onSubmit: function(hsb, hex, rgb) {
			$('#content').css('backgroundColor', '#' + hex);
			$("#color").val('#' +hex);
			colorSubmit();
		}
	});

	$("#content").height($(window).height() - $("#content").offset().top + 15);
	$("#content").css('backgroundColor', $('#color').val());


	/* permet de deleguer sur tous les thumbs d'images la propriété onclick */
	$('#thumbs').delegate('img','click', function(){
		$(".thumbSelected").removeClass("thumbSelected")
		$(this).addClass("thumbSelected");
		document.getElementById("chooseAsWP").disabled = false;
	});
	
});

/* Fonction permettant de rendre le panel d'actions draggable */
$(function (){
	$( " #panelActions ").draggable({ cursor: "move" });
})

/* Fonction permettant le submit de la nouvelle couleur */
function colorSubmit(){
	$.ajax({
		type:"GET",
		url:"savecolor/"+document.getElementById("desktop_id").innerHTML ,
		error: "Warning there is an error !",
		data : {color: $("#color").val()}
	})
}

/* Fonction permettant d'ouvrir la boite de dialogue de création du post it */
$(function() {
	$( "#dialog" ).dialog({
		autoOpen: false,
		show: "fade",
		hide: "fade",
		width: 500,
		resizable: false,
		modal: true
	});

	$( "#addPIT" ).click(function() {
		$( "#dialog" ).dialog( "open" );
		return false;
	});
});

/* Fonction permettant d'ouvrir la boite de dialogue de création de la box */
$(function() {
	$( "#dialog_box" ).dialog({
		autoOpen: false,
		show: "fade",
		hide: "fade",
		resizable: false,
		modal: true
	});

	$( "#addBx" ).click(function() {
		$( "#dialog_box" ).dialog( "open" );
		return false;
	});
});


/* Fonction permettant d'ouvrir la boite de dialogue pour la recherche de post it */
$(function() {
	$( "#dialog_search" ).dialog({
		autoOpen: false,
		show: "fade",
		hide: "fade",
		modal: false,
		resizable: false,
		close: function(event, ui) {   		
			for(i = 0; i < nums.length - 1; i++) {
				$("#postIt_" + nums[i]).css('border', 'none');	
				$("#iconePostIT_" + nums[i]).css('border', 'none');	
				$("#iconeBox_" + nums[i]).css('border', 'none');
			}
			$("#titleSearched").attr('value','');
		}
	});

	$("#searchPIT").click(function() {
		$("#dialog_search").dialog("open");
		return false;
	});
});

/* Fonction permettant d'ouvrir la boite de dialogue pour le wallpaper */
$(function() {
	$( "#dialog_wallpaper" ).dialog({
		autoOpen: false,
		show: "fade",
		hide: "fade",
		width: 900,
		resizable: false,
		modal: true
	});

	$( "#wallpaperD" ).click(function() {
		$( "#dialog_wallpaper" ).dialog( "open" );
		return false;
	});
});

/* Fonction permettant d'ouvrir la boite de dialogue pour la toolbox */
$(function() {
	$( "#toolbox_paint" ).dialog({
		autoOpen: false,
		show: "fade",
		hide: "fade",
		width: 200,
		resizable: false,
		modal: false,
		position: { my: "right", at: "right", of: window }
	});

	$( "#paintD" ).click(function() {
		$( "#toolbox_paint" ).dialog( "open" );
		return false;
	});
});



/* Fonction permettant d'ouvrir la palette de couleur pour le post it */
$(document).ready(function(){ 
	jQuery('select[name="colour"]').colourPicker({	
		ico:    '/public/images/jquery.colourPicker.gif',  
		title:    false	
	});
});

/* Fonctions récupérant les coordonnées du centre de l'écran */
$(document).ready(function getXCentre(){
	var largeur_fenetre = $(window).width();
	var taillePostIt = 200;
	var tailleBox = 700;
	var gaucheP = (largeur_fenetre - taillePostIt) / 2;
	var gaucheB = (largeur_fenetre - tailleBox) / 2;
	$("#xInput").val(gaucheP);
	$("#xInputBox").val(gaucheB);
});

$(document).ready(function getYCentre(){
	var hauteur_fenetre = $(window).height();
	var taillePostIt = 200;
	var tailleBox = 450;
	var hautP = (hauteur_fenetre - taillePostIt) / 2;
	var hautB = (hauteur_fenetre - tailleBox) / 2;
	$("#yInput").val(hautP);
	$("#yInputBox").val(hautB);
});

/* Fonctions relatives à l'upload */
function startUpload(){
	var contents = document.getElementById("uploadButton");
	var img = document.createElement("img");
	var span = document.getElementById("msgError");
	$(span).css("display","none");

	$(img).attr("id","loadingImg");
	$(img).attr("src","/public/images/loading.gif");
	$(img).attr("alt","loading");

	contents.insertBefore(img,contents.firstChild);

	$("#fileupload").submit();
}

function endUpload(){
	$("#loadingImg").remove();
	var sContent = window.frames['uploadFrame'].document.body.innerHTML;
	sContent = sContent.substring(5, sContent.length - 6);
	while(sContent === ""){
		sContent = window.frames['uploadFrame'].document.body.innerHTML;
		sContent = sContent.substring(5, sContent.length - 6);
	}
	
	if(sContent.indexOf("Error") != -1){
		var span = document.getElementById("msgError");
		$(span).css("display","inline");
		$(span).css("color","red");
		$(span).css("font-weight","bold");
		span.innerHTML = sContent;
		return;
	}
	
	var json = $.parseJSON(sContent);
	var img = document.createElement("img");
	$(img).attr("src","/"+json.thumbnail_url);
	$(img).attr("id","loadedImg_"+json.id);
	$(img).attr("class","thumb_loaded");

	var div = $("#thumbs");
	div.append($(img));
}

/* Fonction permettant de definir le WallPaper de l'user */
function defineWP(){
	var id = $(".thumbSelected").attr("id").split("_")[1];
	$.ajax({
		type:"GET",
		url: "saveWP/"+id,
		data : {type : $("#optionWP option:selected").val()}
	})
	
	var image = $(".thumbSelected").attr("src").split("thumb__");
	var imageTailleReelle = image[0] + image[1];
	$("#content").css("background-image",'url('+imageTailleReelle+')');

	if($('#optionWP option:selected').val() === "Centered"){
		$("#content").css("background-size",'');
		$("#content").css("background-position",'center,center');
		$("#content").css("background-repeat",'no-repeat');
	}else if($('#optionWP option:selected').val() === "Strech"){
		$("#content").css("background-position",'');
		$("#content").css("background-size",'100% 100%');
		$("#content").css("background-repeat",'no-repeat');
	}else if($('#optionWP option:selected').val() === "Mosaic"){
		$("#content").css("background-position",'');
		$("#content").css("background-size",'');
		$("#content").css("background-repeat",'repeat');
	}
	
	document.getElementById("deleteWP").disabled = false;
}

/* Fonction permettant de changer les champs activés */
function changeButton(param){
	if(param === 'url'){
		document.getElementById("radioLocal").checked = false;
		document.getElementById("radioUrl").checked = true;
		document.getElementById("inputLocal").disabled = true;
		document.getElementById("inputUrl").disabled = false;
	}else if(param === 'local'){
		document.getElementById("radioLocal").checked = true;
		document.getElementById("radioUrl").checked = false;
		document.getElementById("inputLocal").disabled = false;
		document.getElementById("inputUrl").disabled = true;
	}
}

/* Disable le button d'upload si il y a rien a uploader */
function disableButton(){
	if(($("#inputLocal").val() === '') && ($("#inputUrl").val() === '')){
		document.getElementById("uploadSubmit").disabled = true;
	}else{
		document.getElementById("uploadSubmit").disabled = false;
	}
}

/* efface le WP */
function deleteWP(){
	$.ajax({
		type:"GET",
		url: "deleteWP/"+document.getElementById("desktop_id").innerHTML
	})
	$("#content").css("background-image",'');
	
}

/* permet de gerer la postion du postit si il est ajouté dans une boite ou en dehors */
$(document).ready(function(){
	$("#containerChoice").on("change", function(){
		if($("#containerChoice").val() != "desktop"){
			$("#xInput").attr("disabled", "disabled");
			$("#yInput").attr("disabled", "disabled");
			$("#xInput").val($("#box_"+ $("#containerChoice").val()).css("left").split("px")[0]);
			$("#yInput").val($("#box_"+ $("#containerChoice").val()).css("top").split("px")[0]);
		}else{
			$("#xInput").removeAttr("disabled");
			$("#yInput").removeAttr("disabled");
			var hauteur_fenetre = $(window).height();
			var taillePostIt = 200;
			var hautP = (hauteur_fenetre - taillePostIt) / 2;
			$("#yInput").val(hautP);
			var largeur_fenetre = $(window).width();
			var gaucheP = (largeur_fenetre - taillePostIt) / 2;
			$("#xInput").val(gaucheP);
		}
	})
})

/* Afficher couleur selectionnee */
function displaySearchColor(){
	var color = $("#colorS input").val()
	$('#colorSelectedSearch').css('background-color','#'+color);
	$('#colorSelectedSearch').css('width',30);
	$('#colorSelectedSearch').css('height',30);
	$('#colorSelectedSearch').css('border','1px solid black');
}

/* Afficher couleur selectionnee */
function displayPITColor(){
	var color = $("#colorContainPIT input").val()
	$('#colorChoosePIT').css('background-color','#'+color);
	$('#colorChoosePIT').css('width',15);
	$('#colorChoosePIT').css('height',15);
	$('#colorChoosePIT').css('border','1px solid black');
	$('#colorChoosePIT a').css('margin-left','25px');
}

/* Afficher couleur selectionnee */
function displayBoxColor(){
	var color = $("#colorBox input").val()
	$('#colorChooseBox').css('background-color','#'+color);
	$('#colorChooseBox').css('width',15);
	$('#colorChooseBox').css('height',15);
	$('#colorChooseBox').css('border','1px solid black');
	$('#colorBox a').css('margin-left','25px');
}



