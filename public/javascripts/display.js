$(document).ready(function(){

	/* Postit draggable */
	$( ".postIt ").draggable({ 
		cursor: "move",
		/*ne sors pas du bureau*/
		containment :"body",
		/* se supperpose aux autres postits (incrémente le z-index) */
		stack: ".postIt,.box_content,.box" ,
		/* quand l'on arrete de bouger le postit */
		stop: function() {
			var box = "#box_"+$(this).attr("box");

			/* si on le sort d'une boite */
			if($(this).hasClass("out") && !($(this).hasClass("in")) && $(this).parent().attr("id")!="postIts"){
				$.ajax({
					type : "GET",
					url:"saveInDesktop/"+$(this).attr("id").split("_")[1]+"/"+$(this).attr("box")+"/"+ document.getElementById("desktop_id").innerHTML,
					error: "Warning there is an error !"
				})

				var left = parseFloat($(this).css("left").split("px")[0])+ parseFloat($(box).css("left").split("px")[0]) ;
				var top = parseFloat($(this).css("top").split("px")[0])+ parseFloat($(box).css("top").split("px")[0]) ;
				$(this).css("left",left+"px");
				$(this).css("top", top +"px");

				$("#box_content_"+$(this).attr("box")).remove("#"+$(this).attr("id"));
				$("#box_content_"+$(this).attr("box")).remove("#iconePostIT_"+$(this).attr("id").split("_")[1]);
				$(this).appendTo($("#postIts"));			
				$("#iconePostIT_"+$(this).attr("id").split("_")[1]).appendTo($("#postIts"));

				/* permet d'appeler la page savePosition/idPostit */
				$.ajax({
					type : "GET",
					url:"savePosition/"+$(this).attr("id").split("_")[1] ,
					error: "Warning there is an error !",
					/*avec les paramètres x,y,z */
					data : {x: $(this).css("left").split("px")[0], y: $(this).css("top").split("px")[0], z:$(this).css("z-index")}
				})

				/*si on l'ajoute dans une boite */
			}else if ($(this).hasClass("out") && $(this).hasClass("in")){
				$.ajax({
					type : "GET",
					url:"saveInBox/"+$(this).attr("id").split("_")[1]+"/"+$(this).attr("box")+"/"+document.getElementById("desktop_id").innerHTML,
					error: "Warning there is an error !"
				})

				/*this part is executed only if the post-it wasn't already in the box */
				var parent = $(this).parent().attr("id").split("_")[2];
				var parent_s = "#box_"+parent;

				$(this).parent().remove("#iconePostIT_"+$(this).attr("id").split("_")[1]);
				$(this).parent().remove("#"+$(this).attr("id"));
				$(this).appendTo($("#box_content_"+$(this).attr("box")));
				$("#iconePostIT_"+$(this).attr("id").split("_")[1]).appendTo($("#box_content_"+$(this).attr("box")));

				var left = parseFloat($(this).css("left").split("px")[0])
				+ parseFloat($(parent_s).css("left").split("px")[0]) ;
				var top = parseFloat($(this).css("top").split("px")[0])
				+ parseFloat($(parent_s).css("top").split("px")[0]) ;

				$(this).css("left",left+"px");
				$(this).css("top", top +"px");
				/* permet d'appeler la page savePosition/idPostit */
				$.ajax({
					type : "GET",
					url:"savePosition/"+$(this).attr("id").split("_")[1] ,
					error: "Warning there is an error !",
					/*avec les paramètres x,y,z */
					data : {x: $(this).css("left").split("px")[0], y: $(this).css("top").split("px")[0], z:$(this).css("z-index")}
				})
				left -= parseFloat($(box).css("left").split("px")[0]) ;
				top -= parseFloat($(box).css("top").split("px")[0]) ;

				$(this).css("left",left+"px");
				$(this).css("top", top +"px");
			}else if ($(this).hasClass("in")) {

				$.ajax({
					type : "GET",
					url:"saveInBox/"+$(this).attr("id").split("_")[1]+"/"+$(this).attr("box")+"/"+document.getElementById("desktop_id").innerHTML,
					error: "Warning there is an error !"
				})

				if($(this).parent().attr("id") == "postIts"){
					/*this part is executed only if the post-it wasn't already in the box */
					console.log("in")
					$("#postIts").remove("#"+$(this).attr("id"));
					$("#postIts").remove("#iconePostIT_"+$(this).attr("id").split("_")[1]);
					$(this).appendTo($("#box_content_"+$(this).attr("box")));
					$("#iconePostIT_"+$(this).attr("id").split("_")[1]).appendTo($("#box_content_"+$(this).attr("box")));

					/* permet d'appeler la page savePosition/idPostit */
					$.ajax({
						type : "GET",
						url:"savePosition/"+$(this).attr("id").split("_")[1] ,
						error: "Warning there is an error !",
						/*avec les paramètres x,y,z */
						data : {x: $(this).css("left").split("px")[0], y: $(this).css("top").split("px")[0], z:$(this).css("z-index")}
					})
					var left = parseFloat($(this).css("left").split("px")[0])- parseFloat($(box).css("left").split("px")[0]) ;
					var top = parseFloat($(this).css("top").split("px")[0])- parseFloat($(box).css("top").split("px")[0]) ;
					$(this).css("left",left+"px");
					$(this).css("top", top +"px");

				}else{
					/* cas où l'on bouge le PIT dans la box concernée */
					var left = parseFloat($(this).css("left").split("px")[0])+ parseFloat($(box).css("left").split("px")[0]) ;
					var top = parseFloat($(this).css("top").split("px")[0])+ parseFloat($(box).css("top").split("px")[0]) ;
					$(this).css("left",left+"px");
					$(this).css("top", top +"px");
					/* permet d'appeler la page savePosition/idPostit */
					$.ajax({
						type : "GET",
						url:"savePosition/"+$(this).attr("id").split("_")[1] ,
						error: "Warning there is an error !",
						/*avec les paramètres x,y,z */
						data : {x: $(this).css("left").split("px")[0], y: $(this).css("top").split("px")[0], z:$(this).css("z-index")}
					})
					left = parseFloat($(this).css("left").split("px")[0])- parseFloat($(box).css("left").split("px")[0]) ;
					top = parseFloat($(this).css("top").split("px")[0])- parseFloat($(box).css("top").split("px")[0]) ;
					$(this).css("left",left+"px");
					$(this).css("top", top +"px");
				}
			}else{
				/* permet d'appeler la page savePosition/idPostit */
				$.ajax({
					type : "GET",
					url:"savePosition/"+$(this).attr("id").split("_")[1] ,
					error: "Warning there is an error !",
					/*avec les paramètres x,y,z */
					data : {x: $(this).css("left").split("px")[0], y: $(this).css("top").split("px")[0], z:$(this).css("z-index")}
				})    
			}

			$(this).removeClass("in");
			$(this).removeClass("out");
			$("#box_"+$(this).attr("box")).css("overflow","auto");
			$(this).removeAttr("box");

		} });

	/* Boite draggable */
	$( ".box").draggable({ 
		handle: ".name",
		cursor: "move",
		containment :"#content",
		stack: ".box,.box_content,.postIt" ,
		/* quand l'on arrete de bouger le postit */
		stop: function() {
			$.ajax({
				type : "GET",
				url:"savePositionBox/"+$(this).attr("id").split("_")[1] ,
				error: "Warning there is an error !",
				/*avec les paramètres x,y,z */
				data : {x: $(this).css("left").split("px")[0], y: $(this).css("top").split("px")[0], z:$(this).css("z-index")}
			})
		}
	});

	/* Boite droppable */
	$( ".box").droppable({
		greedy: true,
		hoverClass: "ui-state-active",
		drop: function( event, ui ) {
			$(ui.draggable).addClass("in");
			$(ui.draggable).attr("box",$(this).attr("id").split("_")[1])
			//	$(ui.draggable).removeClass("out");
		},
		/* le postit est ajouté que si il est entierement dans la box */
		tolerance: "fit" ,
		out: function (event, ui){
			$(ui.draggable).addClass("out");
			$(ui.draggable).attr("box",$(this).attr("id").split("_")[1]);
			$("#box_"+$(this).attr("id").split("_")[1]).css("overflow","hidden");
		}
	});

	/* Ajoute la classe hover à la croix et au moins */
	$(".postIt .toolbar a").hover(function(){
		$(this).find(".deletePIT").css("border","2px inset #c0c0c0");
		$(this).find(".closePIT").css("border","2px inset #c0c0c0");
	},function(){
		$(this).find(".deletePIT").css("border","none");
		$(this).find(".closePIT").css("border","none");
	});


	/* Ajoute la classe hover à la croix, au plus et au moins */
	$(".box .toolbar a").hover(function(){
		$(this).find(".deleteBOX").css("border","2px inset #c0c0c0");
		$(this).find(".closeBOX").css("border","2px inset #c0c0c0");
		$(this).find(".maximizeBOX").css("border","2px inset #c0c0c0");
	},function(){
		$(this).find(".deleteBOX").css("border","none");
		$(this).find(".closeBOX").css("border","none");
		$(this).find(".maximizeBOX").css("border","none");
	});

	/* Ajoute la classe hover au plus */
	$(".iconeBox .iconeMotif a").hover(function(){
		$(this).find(".maximizeBOX").css("border","2px inset #c0c0c0");
	},function(){
		$(this).find(".maximizeBOX").css("border","none");
	});

	/* Icone draggable */
	$( ".iconeBox").draggable({ 
		cursor: "move",
		containment :"#content",
		stack: ".box,.box_content,.postIt" ,
		/* quand l'on arrete de bouger le postit */
		stop: function() {
			$.ajax({
				type : "GET",
				url:"savePositionBox/"+$(this).attr("id").split("_")[1] ,
				error: "Warning there is an error !",
				/*avec les paramètres x,y,z */
				data : {x: $(this).css("left").split("px")[0], y: $(this).css("top").split("px")[0], z:$(this).css("z-index")}
			})
		}
	});

	$( ".iconePostIT").draggable({ 
		cursor: "move",
		/*ne sors pas du bureau*/
		containment :"#content",
		/* se supperpose aux autres postits (incrémente le z-index) */
		stack: ".postIt,.box_content,.box" ,
		/* quand l'on arrete de bouger le postit */
		stop: function() {
			var box = "#box_"+$(this).attr("box");

			/* si on le sort d'une boite */
			if($(this).hasClass("out") && !($(this).hasClass("in"))  && $(this).parent().attr("id")!="postIts"){
				$.ajax({
					type : "GET",
					url:"saveInDesktop/"+$(this).attr("id").split("_")[1]+"/"+$(this).attr("box")+"/"+ document.getElementById("desktop_id").innerHTML,
					error: "Warning there is an error !"
				})

				var left = parseFloat($(this).css("left").split("px")[0])+ parseFloat($(box).css("left").split("px")[0]) ;
				var top = parseFloat($(this).css("top").split("px")[0])+ parseFloat($(box).css("top").split("px")[0]) ;
				$(this).css("left",left+"px");
				$(this).css("top", top +"px");

				$("#box_content_"+$(this).attr("box")).remove("#"+$(this).attr("id"));
				$("#box_content_"+$(this).attr("box")).remove("#postIt_"+$(this).attr("id").split("_")[1]);
				$(this).appendTo($("#postIts"));			
				$("#postIt_"+$(this).attr("id").split("_")[1]).appendTo($("#postIts"));			

				/* permet d'appeler la page savePosition/idPostit */
				$.ajax({
					type : "GET",
					url:"savePosition/"+$(this).attr("id").split("_")[1] ,
					error: "Warning there is an error !",
					/*avec les paramètres x,y,z */
					data : {x: $(this).css("left").split("px")[0], y: $(this).css("top").split("px")[0], z:$(this).css("z-index")}
				})

				/*si on l'ajoute dans une boite */
			}else if ($(this).hasClass("out") && $(this).hasClass("in")){
				$.ajax({
					type : "GET",
					url:"saveInBox/"+$(this).attr("id").split("_")[1]+"/"+$(this).attr("box")+"/"+document.getElementById("desktop_id").innerHTML,
					error: "Warning there is an error !"
				})

				/*this part is executed only if the post-it wasn't already in the box */
				var parent = $(this).parent().attr("id").split("_")[2];
				var parent_s = "#box_"+parent;

				$(this).parent().remove("#postIt_"+$(this).attr("id").split("_")[1]);
				$(this).parent().remove("#"+$(this).attr("id"));
				$(this).appendTo($("#box_content_"+$(this).attr("box")));
				$("#postIt_"+$(this).attr("id").split("_")[1]).appendTo($("#box_content_"+$(this).attr("box")));

				var left = parseFloat($(this).css("left").split("px")[0])
				+ parseFloat($(parent_s).css("left").split("px")[0]) ;
				var top = parseFloat($(this).css("top").split("px")[0])
				+ parseFloat($(parent_s).css("top").split("px")[0]) ;

				$(this).css("left",left+"px");
				$(this).css("top", top +"px");
				/* permet d'appeler la page savePosition/idPostit */
				$.ajax({
					type : "GET",
					url:"savePosition/"+$(this).attr("id").split("_")[1] ,
					error: "Warning there is an error !",
					/*avec les paramètres x,y,z */
					data : {x: $(this).css("left").split("px")[0], y: $(this).css("top").split("px")[0], z:$(this).css("z-index")}
				})
				left -= parseFloat($(box).css("left").split("px")[0]) ;
				top -= parseFloat($(box).css("top").split("px")[0]) ;

				$(this).css("left",left+"px");
				$(this).css("top", top +"px");
			}else if ($(this).hasClass("in")) {


				$.ajax({
					type : "GET",
					url:"saveInBox/"+$(this).attr("id").split("_")[1]+"/"+$(this).attr("box")+"/"+document.getElementById("desktop_id").innerHTML,
					error: "Warning there is an error !"
				})

				if($(this).parent().attr("id") == "postIts"){
					/*this part is executed only if the post-it wasn't already in the box */
					$("#postIts").remove("#"+$(this).attr("id"));
					$("#postIts").remove("#postIt_"+$(this).attr("id").split("_")[1]);
					$(this).appendTo($("#box_content_"+$(this).attr("box")));
					$("#postIt_"+$(this).attr("id").split("_")[1]).appendTo($("#box_content_"+$(this).attr("box")));

					/* permet d'appeler la page savePosition/idPostit */
					$.ajax({
						type : "GET",
						url:"savePosition/"+$(this).attr("id").split("_")[1] ,
						error: "Warning there is an error !",
						/*avec les paramètres x,y,z */
						data : {x: $(this).css("left").split("px")[0], y: $(this).css("top").split("px")[0], z:$(this).css("z-index")}
					})
					var left = parseFloat($(this).css("left").split("px")[0])- parseFloat($(box).css("left").split("px")[0]) ;
					var top = parseFloat($(this).css("top").split("px")[0])- parseFloat($(box).css("top").split("px")[0]) ;
					$(this).css("left",left+"px");
					$(this).css("top", top +"px");

				}else{
					/* cas où l'on bouge le PIT dans la box concernée */
					var left = parseFloat($(this).css("left").split("px")[0])+ parseFloat($(box).css("left").split("px")[0]) ;
					var top = parseFloat($(this).css("top").split("px")[0])+ parseFloat($(box).css("top").split("px")[0]) ;
					$(this).css("left",left+"px");
					$(this).css("top", top +"px");
					/* permet d'appeler la page savePosition/idPostit */
					$.ajax({
						type : "GET",
						url:"savePosition/"+$(this).attr("id").split("_")[1] ,
						error: "Warning there is an error !",
						/*avec les paramètres x,y,z */
						data : {x: $(this).css("left").split("px")[0], y: $(this).css("top").split("px")[0], z:$(this).css("z-index")}
					})
					left = parseFloat($(this).css("left").split("px")[0])- parseFloat($(box).css("left").split("px")[0]) ;
					top = parseFloat($(this).css("top").split("px")[0])- parseFloat($(box).css("top").split("px")[0]) ;
					$(this).css("left",left+"px");
					$(this).css("top", top +"px");
				}
			}else{
				/* permet d'appeler la page savePosition/idPostit */
				$.ajax({
					type : "GET",
					url:"savePosition/"+$(this).attr("id").split("_")[1] ,
					error: "Warning there is an error !",
					/*avec les paramètres x,y,z */
					data : {x: $(this).css("left").split("px")[0], y: $(this).css("top").split("px")[0], z:$(this).css("z-index")}
				})
			}

			$(this).removeClass("in");
			$(this).removeClass("out");
			$("#box_"+$(this).attr("box")).css("overflow","auto");
			$(this).removeAttr("box");
		} });
})


/* Fonction permettant de mettre le contenu du text area sous forme de liste */
function parserTextArea(id,textArea,modif){
	var content = document.getElementById("postIt_content_"+id);
	if(textArea.length != 0 && document.getElementById('contentPList_'+id) == null){
		var listeFinale = document.createElement("ul");
		$(listeFinale).attr('id','contentPList_'+id);
		$(listeFinale).attr('ondblclick','editContent('+id+')');
		if(modif == null){
			var splited = textArea.split("&lt;br&gt;");
			for (var i = 0;i<splited.length;i++){
				var elemListe = document.createElement("li");
				elemListe.innerHTML = splited[i];
				listeFinale.appendChild(elemListe);
			}
		}
		/* Lors de la modification de contenu */
		if(modif != null){
			splited = textArea.split("<br>");
			for (var i = 0;i<splited.length;i++){
				var elemListe = document.createElement("li");
				elemListe.innerHTML = splited[i];
				listeFinale.appendChild(elemListe);
			}
		}
		content.appendChild(listeFinale);
	}
}

/* Suppression de post it */
function suppressPIT(idP,idD) {
	if (confirm('Do you want to supress this post-it ?')) {
		$.ajax({
			type : "GET",
			url : "suppressPostIt/"+ idD+"/"+ idP
		})
		$("#postIt_"+idP).remove();
		$("#iconePostIT_"+idP).remove();
	}
}

/* Suppression de boites */
function suppressBox(idB,idD) {
	var suppAll = false;
	if (confirm('Do you want to suppress this box ?')) {
		if ($("#box_content_"+idB+" .postIt").size()!=0 && confirm('Do you want to supress all post-its ? (if you don\'t they will be kept on your desktop)')){
			$("#suppAll").val("true");
			suppAll = true;
		}
		$.ajax({
			type : "GET",
			url : "suppressBox/"+ idD+"/"+ idB,
			data : {suppAll:$("#suppAll").val()}
		})
		/* on réajuste les positions des postIts pr les afficher hrs de la boite */
		if(!suppAll){
			var left = $("#box_"+idB).css("left").split("px")[0];
			var top = $("#box_"+idB).css("top").split("px")[0];
			$("#box_content_"+idB+" .postIt,.iconePostIT").each(function(index,value){
				var leftP = parseFloat($(value).css("left").split("px")[0]);
				leftP += parseFloat(left);
				var topP = parseFloat($(value).css("top").split("px")[0]);
				topP += parseFloat(top);
				$(value).css("left", leftP);
				$(value).css("top", topP );
			});
			$("#box_content_"+idB+" .postIt,.iconePostIT").appendTo($("#postIts"));
		}
		$("#box_"+idB).remove();
		$("#iconeBox_"+idB).remove();
	}

};



/* Fonction permettant de retourner le post it */
function flip(id,d){
	$("#postIt_"+id).flip({
		direction:'rl',
		content:'<div class="pitFlipped" id="flip'+id+'"> \
		<span class="edition" id="sizePost">Change post-it shape :</span><br/> \
		<input type="hidden" value="'+id+'" name="idP" id="idPIT"/> \
		<br/> \
		<input type="radio" name="shapeSelected" value="square" onClick="selectShape('+id+')"><img src="/public/images/square.png"/> \
		<input type="radio" name="shapeSelected" value="vertical" onClick="selectShape('+id+')"><img src="/public/images/vertical.png"/> \
		<input type="radio" name="shapeSelected" value="horizontal" onClick="selectShape('+id+')"><img src="/public/images/horizontal.png"/> \
		<input type="radio" name="shapeSelected" value="big" onClick="selectShape('+id+')"><img src="/public/images/big.png"/><br/> \
		<br/><br/> \
		<span class="edition" id="colorPost">Change post-it color :</span> \
		<input type="hidden" value="'+id+'" name="idP" id="idP"/> \
		<div class="squared">\
		<input type="checkbox" value="#fe996b" id="squaredO" /> \
		<label for="squaredO" id="squaredOLB" onClick="cocherCase(squaredOLB,'+id+')"></label>\
		<input type="checkbox" value="#ffffff" id="squaredW" /> \
		<label for="squaredW" id="squaredWLB" onClick="cocherCase(squaredWLB,'+id+')"></label>\
		<input type="checkbox" value="#fffe65" id="squaredY" /> \
		<label for="squaredY" id="squaredYLB" onClick="cocherCase(squaredYLB,'+id+')"></label> \
		<input type="checkbox" value="#3166ff" id="squaredB"/> \
		<label for="squaredB" id="squaredBLB" onClick="cocherCase(squaredBLB,'+id+')"></label>\
		<input type="checkbox" value="#9aff99" id="squaredG" /> \
		<label for="squaredG" id="squaredGLB" onClick="cocherCase(squaredGLB,'+id+')"></label>\
		<input type="checkbox" value="#9698ed" id="squaredP" /> \
		<label for="squaredP" id="squaredPLB" onClick="cocherCase(squaredPLB,'+id+')"></label>\
		<input type="checkbox" value="#34ff34" id="squaredFG" /> \
		<label for="squaredFG" id="squaredFGLB" onClick="cocherCase(squaredFGLB,'+id+')"></label>\
		<input type="checkbox" value="#38fff8" id="squaredFB" /> \
		<label for="squaredFB" id="squaredFBLB" onClick="cocherCase(squaredFBLB,'+id+')"></label>\
		<input type="checkbox" value="#c0c0c0" id="squaredGr" /> \
		<label for="squaredGr" id="squaredGrLB" onClick="cocherCase(squaredGrLB,'+id+')"></label>\
		<input type="checkbox" value="#fd6864" id="squaredR" /> \
		<label for="squaredR" id="squaredRLB" onClick="cocherCase(squaredRLB,'+id+')"></label>\
		<input type="checkbox" value="#ff69B4" id="squaredPi"/> \
		<label for="squaredPi" id="squaredPiLB" onClick="cocherCase(squaredPiLB,'+id+')"></label> \
		</div>\
		<input type ="button" class="buttonC" value="Change appearance" id="buttonColor'+id+'" disabled="true" \
		onclick="submitAppearance()" /> \
		</div>\</div>'
	})

	$("#postIt_"+id).css("background-image","url(/public/images/textureLinen.jpg)")
}

/* permet de sauvegarder l'apparence du postIt */
function submitAppearance(){
	/* on sauvegarde, puis on change l'apparence */
	var colorSelected = $('input[name="colorSelected"]').first().val();
	var shapeSelected = $('input[name="shapeSelected"]:checked').first().val();
	$.ajax({
		type:"GET",
		url: "/desktop/changePostItAppear/"+document.getElementById("desktop_id").innerHTML,
		data:{idP: $("#idP").val(), colorSelected:colorSelected, shapeSelected: shapeSelected }

	})

	var postit = $("#postIt_"+$("#idP").val());
	if (shapeSelected === "square") {
		$(postit).width(200);
		$(postit).height(200);
	} else if (shapeSelected === "vertical") {
		$(postit).width(200);
		$(postit).height(400);
	} else if (shapeSelected === "horizontal") {
		$(postit).width(400);
		$(postit).height(200);
	} else if (shapeSelected === "big") {
		$(postit).width(350);
		$(postit).height(350);
	}

	$("#motifIconePIT2_"+$("#idP").val()).css("background-color",colorSelected);
	$("#motifIconePIT_"+$("#idP").val()).css("background-color",colorSelected);

	$(postit).css("background-image","");
	/* flip back */
	$(postit).revertFlip();
	setTimeout(function(){$(postit).css("background-color",colorSelected)},1100)

}


/* Fonction permettant de sélectionner le radiobutton correspondant à la forme */

function selectShapeV(id){
	$("#buttonColor"+id).removeAttr('disabled');
	$("#idPIT").attr('name','idP');	
	$("#flip"+id).css('height',$("#postIt_"+id).css('height'));

}

/* Fonction permettant de sélectionner le radiobutton correspondant à la forme */

function selectShape(id){
	$("#buttonColor"+id).removeAttr('disabled');
//	$("#idPIT").attr('name','idP');	
}


/* Fonction permettant d'ajouter une classe au lien */
function cocherCase(param,id){
	$('.pitFlipped .squared input').removeAttr('name');
	$('.pitFlipped .squared input').removeAttr('checked');
//	$("#idP").attr('name','idP');
	$("#buttonColor"+id).removeAttr('disabled');
	if(param.id == "squaredYLB"){
		$("#squaredY").attr('name','colorSelected');
		$("#squaredY").attr('checked');
	}else if(param.id == "squaredBLB"){
		$("#squaredB").attr('name','colorSelected');
		$("#squaredB").attr('checked');
	}else if(param.id == "squaredGLB"){
		$("#squaredG").attr('name','colorSelected');
		$("#squaredG").attr('checked');
	}else if(param.id == "squaredPLB"){
		$("#squaredP").attr('name','colorSelected');
		$("#squaredP").attr('checked');
	}else if(param.id == "squaredWLB"){
		$("#squaredW").attr('name','colorSelected');
		$("#squaredW").attr('checked');
	}else if(param.id == "squaredOLB"){
		$("#squaredO").attr('name','colorSelected');
		$("#squaredO").attr('checked');
	}else if(param.id == "squaredFGLB"){
		$("#squaredFG").attr('name','colorSelected');
		$("#squaredFG").attr('checked');
	}else if(param.id == "squaredFBLB"){
		$("#squaredFB").attr('name','colorSelected');
		$("#squaredFB").attr('checked');
	}else if(param.id == "squaredGrLB"){
		$("#squaredGr").attr('name','colorSelected');
		$("#squaredGr").attr('checked');
	}else if(param.id == "squaredRLB"){
		$("#squaredR").attr('name','colorSelected');
		$("#squaredR").attr('checked');
	}else if(param.id == "squaredPiLB"){
		$("#squaredPi").attr('name','colorSelected');
		$("#squaredPi").attr('checked');
	}
}

/* Fonction permettant l'édition du titre */
function editTitle(id){
	$("#titlePSpan_"+id).css("display","none");
	$("#pencil_"+id).css("display","none");
	$("#titleP_"+id).css("display","block");
	$("#checkedTitle_"+id).css("display","block");
	$("#titleP_"+id).attr('name','titleEdited');
}

/* Fonction validant l'édition du titre */
function submitEditionTitle(id,idD){
	$("#titleP_"+id).css("display","none");
	
	$("#checkedTitle_"+id).css("display","none");
	if($("#titleP_"+id).val() != ""){
		$("#titlePSpan_"+id).css("display","block");
		$("#pencil_"+id).css("display","none");
	}else{
		$("#titlePSpan_"+id).css("display","none");
		$("#pencil_"+id).css("display","block");
	}
	$("#titlePSpan_"+id).css("display","block");
	$("#titlePSpan_"+id).text($("#titleP_"+id).val());
	$("#labelIconePIT_"+id).text($("#titleP_"+id).val().slice(0,4));
	$.ajax({
		type : "GET",
		url : "changePostItTitle/"+idD+"/"+id,
		data : {titleEdited:$("#titleP_"+id).val()}
	})

}

/* Fonction permettant l'édition du contenu */
function editContent(id){
	$("#contentPList_"+id).css("display","none");
	$("#pencilContent_"+id).css("display","none");
	replaceBR(id);
	$("#contentP_"+id).css("display","block");
	$("#checkedContent_"+id).css("display","block");
	$("#contentP_"+id).attr('name','contentEdited');
}

/* Fonction validant l'édition du contenu */
function submitEditionContent(id,idD){
	$("#contentP_"+id).css("display","none");
	$("#checkedContent_"+id).css("display","none");
	$("#contentPList_"+id).css("display","block");

	$("#contentPList_"+id).remove("ul");
	var string = document.getElementById("contentP_"+id).value;
	string = string.replace("\n", "<br>");
	string = string.replace("\r", "");

	$.ajax({
		type : "POST",
		url : "changePostItContent/"+idD+"/"+id,
		data : {contentEdited:$("#contentP_"+id).val()},
		success: function(data){parserTextArea(id,data.content,"edit")}
	});
}

/* Fonction remplacant les <br> par des \n */
function replaceBR(id){
	var newTA = $("#contentP_"+id).text().replace(/<br>/g,"\n").replace(/"/g,"");;
	$("#contentP_"+id).text(newTA);
}


/* Convertir code couleur hexa en code couleur RGB et ajuste la taille */
function convertColor(color,id){
	R = hexToR(color);
	G = hexToG(color);
	B = hexToB(color);
	$("#box_content_"+id).css('background','rgba('+R+','+G+','+B+',0.5)');

	calculateSize(id);
}

/* Fonctions permetttant de convertir de l'hexa vers du rgb pour les couleurs */
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

/* Fonction permettant de transformer du rgb vers de l'hexa */
function RGBToHex(val){
	if (val.indexOf("rgb") >= 0) {
		var rgb_string = val.slice(val.indexOf('(') + 1,val.indexOf(')'));
		var rgb_val = rgb_string.split(",");
		val = "#";
		var hexChars = "0123456789abcdef";
		for (var i = 0; i < 3; i++) {
			var v = rgb_val[i].valueOf();
			val += hexChars.charAt(v/16) + hexChars.charAt(v%16);
		}
	}
	return val;
}

/* Calcule la taille du contenu de la boite */
function calculateSize(id){
	var tailleBox = $("#box_"+id).css('height').split("px");
	var tailleTitre = $("#box_name_"+id).css('height').split("px");
	var tailleContenu = tailleBox[0] - tailleTitre[0] - 2;
	$("#box_content_"+id).css('height',tailleContenu);
}

/* Fonction permettant l'édition du nom de la boite */
function editName(id){
	$("#nameBoxSpan_"+id).css("display","none");
	$("#pencilBox_"+id).css("display","none");
	$("#nameBox_"+id).css("display","block");
	$("#checkedName_"+id).css("display","block");
	$("#nameBox_"+id).attr('name','nameEdited');
	$("#iconeMenu_"+id).hide();
}

/* Fonction validant l'édition du nom de la boite*/
function submitEditionName(idB,id){
	$("#nameBox_"+idB).css("display","none");
	$("#checkedName_"+idB).css("display","none");
	


	if($("#nameBox_"+idB).val() != ""){
		$("#nameBoxSpan_"+idB).css("display","block");
		$("#pencilBox_"+idB).css("display","none");
	}else{
		$("#nameBoxSpan_"+idB).css("display","none");
		$("#pencilBox_"+idB).css("display","block");
	}
	$("#nameBoxSpan_"+idB).text($("#nameBox_"+idB).val());
	$("#labelIcone_"+idB).text($("#nameBox_"+idB).val().slice(0,4));
	$("#iconeMenu_"+idB).css("display","");
	$.ajax({
		type : "GET",
		url : "changeBoxName/"+id+"/"+idB,
		data : {nameEdited:$("#nameBox_"+idB).val()}
	})


}

/* Fonction permettant de reduire la boite sous forme d'icone */
function reduceBox(id){
	$("#box_"+id).css("display","none");
	$("#iconeBox_"+id).css("display","block");
	$("#iconeBox_"+id).css("top",$("#box_"+id).css("top"));
	$("#iconeBox_"+id).css("left",$("#box_"+id).css("left"));
	saveBoxState(id,false,false);
}

/* Fonction permettant de sauver l'état de la boite  */
function saveBoxState(id,bool1,bool2) {
	$.ajax({
		type : "GET",
		url:"saveState/"+id,
		error: "Warning there is an error !",
		data : {openORclose: bool1,maximized: bool2}
	})
}

/* Fonction permettant d'ouvrir une boite */
function openBox(id){
	$("#box_"+id).css("display","block");
	$("#iconeBox_"+id).css("display","none");
	var abs = $("#box_"+id).css("position");
	if(abs == "absolute"){
		$("#box_"+id).css("top",$("#iconeBox_"+id).css("top"));
		$("#box_"+id).css("left",$("#iconeBox_"+id).css("left"));	
	}else{
		var largeurFenetre = $(window).width();
		var hauteurFenetre = $(window).height();
		var largeurDock = $('#menu').width();
		var hauteurBandeau = $('#content').offset().top;

		var largeurBox = largeurFenetre - 1.2*largeurDock;
		var hauteurBox = hauteurFenetre - hauteurBandeau - 6;

		var anciennePosX = $("#box_"+id).css("left");
		var anciennePosY = $("#box_"+id).css("top");

		$("#boutonMax_"+id ).on("click", function(){maximizeBox(id,anciennePosX,anciennePosY)});

		$("#box_"+id).css("position","relative");
		$("#box_"+id).css("left",0);
		$("#box_"+id).css("top", -23);
		$("#box_"+id).css("float","right");
		$("#box_"+id).css("width",largeurBox);
		$("#box_"+id).css("height",hauteurBox);
	}
	calculateSize(id);
	saveBoxState(id,true,false);
}


/* Fonction permettant de reduire la boite sous forme d'icone */
function reducePostIT(id){
	$("#postIt_"+id).css("display","none");
	$("#iconePostIT_"+id).css("display","block");
	$("#iconePostIT_"+id).css("top",$("#postIt_"+id).css("top"));
	$("#iconePostIT_"+id).css("left",$("#postIt_"+id).css("left"));
	savePostItState(id,false);
}

/* Fonction permettant de sauver l'état du post-it */
function savePostItState(id,bool) {
	$.ajax({
		type : "GET",
		url:"saveStatePIT/"+id,
		error: "Warning there is an error !",
		data : {openORclose: bool}
	})
}

/* Fonction permettant d'ouvrir un post-it */
function openPostIT(id){
	$("#postIt_"+id).css("display","block");
	$("#iconePostIT_"+id).css("display","none");
	$("#postIt_"+id).css("top",$("#iconePostIT_"+id).css("top"));
	$("#postIt_"+id).css("left",$("#iconePostIT_"+id).css("left"));
	savePostItState(id,true);
}




/* Fonction permettant de chercher un (ou plusieurs) post it à partir de son titre ou de sa couleur 
   (critères mutuellement exclusifs) */
$(function() {
	$("#buttonOKSearch").click(function() {
		var i;
		var j;
		var k;
		var tmp = "";
		var idPITs = new Array();
		var idIconeBox;

		//On supprime les résultats de recherche précédents
		for(i = 0; i < nums.length - 1; i++) {
			$("#postIt_" + nums[i]).css('border', 'none');	
			$("#iconePostIT_" + nums[i]).css('border', 'none');	
			$("#iconeBox_" + nums[i]).css('border', 'none');
		}

		//Nombre de résultats de la recherche
		var nbRes = 0;

		//Titre cherché
		var searched = $("#titleSearched").val();

		//Couleur recherchée
		var searchedColor = "#" + $("#colorS input").attr('value');

		if (searched != "") {
			//On cherche les id de post it qui correspondent à la recherche par titre
			for (i = 0; i < titles.length - 1; i++) {
				if (titles[i] == searched) {
					nbRes++;
					idPITs[i] = nums[i];	
				}
			}
			document.getElementById("txtSearched").innerHTML = "(title = \'" + searched +"\') :";
			document.getElementById("colSearched").innerHTML = "";

		} else if (searchedColor != "#none") {
			//On cherche les id de post it qui correspondent à la recherche par couleur
			for (i = 0; i < colors.length - 1; i++) {
				if (colors[i] == searchedColor) {
					nbRes++;
					idPITs[i] = nums[i];	
				}
			}
			document.getElementById("colSearched").innerHTML = "...";
			var R = hexToR(searchedColor);
			var G = hexToG(searchedColor);
			var B = hexToB(searchedColor);
			$("#colSearched").css('color', 'rgb('+R+','+G+','+B+')');
			$("#colSearched").css('background', 'rgb('+R+','+G+','+B+')');
			$("#colSearched").css('border', '1px solid rgb(0,0,0)');
			document.getElementById("txtSearched").innerHTML = "";
		}

		//Parcours des boîtes minimisées
		for (i = 0; i < $(".iconeBox").size(); i++) {
			tmp = document.getElementsByClassName("iconeBox");
			var tmp2 = tmp[i].id.split("_");

			//On récupère l'id de la boîte minimisée
			idIconeBox = tmp2[1];

			//On compte le nombre de post it de la boite correspondante		
			var nbPIT = $("#box_content_" + idIconeBox + " .postIt").size();

			for(j = 0; j<nbPIT; j++) {
				//On sélectionne la boîte courante
				var box = document.getElementById("box_content_"+ idIconeBox);

				//On trouve les différents postIts contenus dans la boîte
				var pitsInBox = box.getElementsByClassName("postIt");

				//On trouve l'id du post it courant
				tmp = pitsInBox[j].id.split("_");
				var idPITCourant = tmp[1];

				for (k = 0; k < idPITs.length; k++) {
					if (idPITs[k] == idPITCourant) {
						//Animation de l'icone d'une boite contenant un post it résultat
						animateIconeBox(idIconeBox);
					}
				}
			}
		}

		for (i = 0; i < idPITs.length; i++) {
			//Animation des résultats
			animatePITOrIconePIT(idPITs[i]);
		}

		//Affichage du nombre de résultats
		document.getElementById("nbResults").innerHTML = nbRes;

		$("#titleSearched").attr('value','');
		$("#colorS input").attr('value', 'none');
		$("#colorS input").css('background-color', 'rgb(255,255,255)');
	});
});


/* Fonction permettant d'animer un post it ou l'icone d'un post it résultat d'une recherche */
function animatePITOrIconePIT(i){
	$("#postIt_"+i).animate({left: "+=3em"},1000);
	$("#postIt_"+i).animate({left: "-=3em"},1000);	

	$("#iconePostIT_"+i).animate({left: "+=3em"},1000);
	$("#iconePostIT_"+i).animate({left: "-=3em"},1000);

	$("#postIt_"+i).css('border-style', 'double');
	$("#postIt_"+i).css('border-color', 'black');
	$("#postIt_"+i).css('border-width', '5px');

	$("#iconePostIT_"+i).css('border-style', 'double');
	$("#iconePostIT_"+i).css('border-color', 'black');
	$("#iconePostIT_"+i).css('border-width', '5px');	
}

/* Fonction permettant d'animer l'icone d'une boite lorsqu'un post it résultat d'une recherche
   est dans une boite minimisée */
function animateIconeBox(i) {
	$("#iconeBox_"+i).animate({left: "+=3em"},1000);
	$("#iconeBox_"+i).animate({left: "-=3em"},1000);	

	$("#iconeBox_"+i).css('border-style', 'double');
	$("#iconeBox_"+i).css('border-color', 'black');
	$("#iconeBox_"+i).css('border-width', '5px');	
}


/* ********* Maximisation ********* */

/* trouver le plus grand z-index de la page */

function maxZIndex(){
	var highest_index = 0;
	$('.postIt,.box').each(function() {
		var z = $(this).css("z-index");
		if (z > highest_index) {
			highest_index = z;
		}
	});
	return highest_index;
}

/* Fonction permettant d'ajouter l'action maximizeBox sur le bouton "+" */
/* Utilise la méthode jQuery "on" pour pouvoir utiliser "off" par la suite */
function maximizeBoxIcone(id,x,y,z){
	$("#boutonMax_"+id ).on("click", function(){maximizeBox(id,x,y,z)});
}

/* Fonction permettant de maximiser une boite */
function maximizeBox(id,left,top,z){
	if(! $("#box_"+id).hasClass("max")){
		var largeurFenetre = $(window).width();
		var hauteurFenetre = $(window).height();
		var hauteurBandeau = $('#content').offset().top;

		var largeurBox = largeurFenetre - $("#box_"+id).css("left").split("px")[0] - 5;
		var hauteurBox = hauteurFenetre - $("#box_"+id).css("top").split("px")[0] - 5;

		var anciennePosX = $("#box_"+id).css("left");
		var anciennePosY = $("#box_"+id).css("top");
		var ancienZ = $("#box_"+id).css("z-index");

		$("#box_"+id).addClass("max");
		$("#box_"+id).css("width",largeurBox);
		$("#box_"+id).css("height",hauteurBox);
		$("#box_"+id).css("z-index", maxZIndex()+1);

		$("#boutonMax_"+id ).off("click");
		$("#boutonMax_"+id ).on("click", function(){maximizeBox(id,anciennePosX,anciennePosY,ancienZ)});
		calculateSize(id);
		$("#box_"+id).draggable( "disable" );
		saveBoxStateMax(id,true);
	}else{
		$("#box_"+id).removeClass("max");
		$("#box_"+id).css("left",left);
		$("#box_"+id).css("top",top);
		$("#box_"+id).css("width",700);
		$("#box_"+id).css("height",450);
		$("#box_"+id).css("z-index",z)
		calculateSize(id);
		$("#box_"+id).draggable("enable");
		saveBoxStateMax(id,false);
	}
}

/* Fonction permettant de maximiser une boite */
function maximizeBoxLoading(id){
	$(document).ready(function(){
		$("#box_"+id).addClass("max");

		var largeurFenetre = $(window).width();
		var hauteurFenetre = $(window).height();
		var hauteurBandeau = $('#content').offset().top;
		var largeurBox = largeurFenetre - $("#box_"+id).css("left").split("px")[0] - 5;
		var hauteurBox = hauteurFenetre - $("#box_"+id).css("top").split("px")[0] - 5;


		$("#box_"+id).css("position","absolute");

		$("#box_"+id).css("width",largeurBox);
		$("#box_"+id).css("height",hauteurBox);
		$("#box_"+id).css("z-index",maxZIndex()+1);
		$("#box_"+id).draggable("disable");
		calculateSize(id);
	})

}

/* Fonction permettant de sauver l'état de la boite maximisee ou non */
function saveBoxStateMax(id,bool) {
	$.ajax({
		type : "GET",
		url:"saveStateMax/"+id,
		error: "Warning there is an error !",
		data : {maxORnot: bool}
	})
}

/* Fonction permettant d'ouvrir la boite directement maximisée */
function openBoxMax(id){
	$("#box_"+id).css("display","block");
	$("#iconeBox_"+id).css("display","none");

	var largeurFenetre = $(window).width();
	var hauteurFenetre = $(window).height();
	var hauteurBandeau = $('#content').offset().top;

	var largeurBox = largeurFenetre - $("#box_"+id).css("left").split("px")[0] - 5;
	var hauteurBox = hauteurFenetre - $("#box_"+id).css("top").split("px")[0] - 5;


	var anciennePosX = $("#box_"+id).css("left");
	var anciennePosY = $("#box_"+id).css("top");
	var ancienZ = $("#box_"+id).css("z-index");
	$("#box_"+id).addClass("max");

	$("#box_"+id).css("width",largeurBox);
	$("#box_"+id).css("height",hauteurBox);
	$("#box_"+id).css("z-index",maxZIndex()+1);
	$("#box_"+id).draggable("disable");

	$("#boutonMax_"+id ).off("click");
	$("#boutonMax_"+id ).on("click", function(){maximizeBox(id,anciennePosX,anciennePosY,ancienZ)});
	calculateSize(id);
	saveBoxState(id,true);
	saveBoxStateMax(id,true);
}

/*Fonction permettant de dérouler le menu déroulant attaché à la boite id*/
function deroule(id) {
	//trouve la bonne position pour afficher le menu (dépend de la position du bouton déroulant)
	var posIcone = $("#iconeMenu_"+id).css("left");

	$('#drop_down_menu_'+id).css("margin-left", posIcone);   

	//déroule le menu
	$('#drop_down_menu_'+id).slideToggle('medium');

	//ajoute des effets lorsque la souris passe au dessus d'un item du menu
	$('#drop_down_menu_' + id + ' li a').mouseover(function () {
		$(this).animate({ fontSize: "13px", paddingLeft: "20px" }, 50 );
	});

	//ajoute des effets lorsque la souris pars d'un item du menu
	$('#drop_down_menu_' + id + ' li a').mouseout(function () {
		$(this).animate({ fontSize: "12px", paddingLeft: "10px" }, 50 );
	});
}


/*Tri le contenu d'une boîte à partir d'un critère sur les post its*/
/* type = 1 => tri sur les titres */
/* type = 2 => tri sur les couleurs */
/* type = 3 => tri sur les dates */
function sortBox (id, type) {
	//On compte le nombre de post it de la boite correspondante		
	var nbPIT = $("#box_content_" + id + " .postIt").size();
	var tabTitles = new Array();

	//On sélectionne la boîte courante
	var box = document.getElementById("box_content_"+ id);

	//On trouve les différents postIts contenus dans la boîte
	var pitsInBox = box.getElementsByClassName("postIt");

	for(j = 0; j<nbPIT; j++) {
		//On trouve l'id du post it courant
		tmp = pitsInBox[j].id.split("_");
		idPIT = tmp[1];

		if (type == 1) {
			//On trouve le titre du post it
			title = $('#titlePSpan_'+idPIT).text().toLowerCase();
			tabTitles[j] = {c: title, i:idPIT};

		} else if (type == 2) {
			//On trouve la couleur du post it
			color = RGBToHex($('#postIt_' + idPIT).css("background-color")).toLowerCase();
			tabTitles[j] = {c: color, i:idPIT};

		} else if (type ==3) {
			//On trouve la date de création du post it
			date = $('#date_'+idPIT).text();   
			tabTitles[j] = {c: date, i:idPIT};
		}	
	}

	// Tri sur le critère (titre, couleur ou date) de manière alphabétique 
	// (si on veut inverser l'order il faudra inverser a.c et b.c)
	tabTitles.sort(function (a,b){
		if (a.c < b.c) return -1;
		else if (a.c == b.c) return 0;
		else return 1;}); 	

	var boxSize = $("#box_content_" + id).css('width').split('px');
	var posTopBox = $("#box_" + id).css('top').split('px');
	var posLeftBox = $("#box_" + id).css('left').split('px');
	var largeurIcone = $('#iconePostIT_' + tabTitles[0].i).css('width').split('px');
	var hauteurIcone = $('#iconePostIT_' + tabTitles[0].i).css('height').split('px');;
	var bSize = parseInt(boxSize[0]);
	var posTopB = parseInt(posTopBox[0]);
	var posLeftB = parseInt(posLeftBox[0]);
	var lIcone = parseInt(largeurIcone[0]);
	var hIcone = parseInt(hauteurIcone[0]);
	if ($('#titlePSpan_'+tabTitles[0].i).text() == "") {
		hIcone += 18;	
	}
	var pitPerLine = Math.floor(bSize / lIcone);
	var numLine;

	//Représentation des PIT dans la boite
	for (j = 0; j<tabTitles.length; j++) {
		numLine = Math.floor(j / pitPerLine);
		idPIT = tabTitles[j].i;

		//Si le post it n'est pas une icone il en devient une
		if ($('#iconePostIT_' + tabTitles[j].i).css('display') == "none") {
			//le post it est une icone
			$('#iconePostIT_' + idPIT).css('display', 'block');
			$('#postIt_' + idPIT).css('display', 'none');
		} 

		$('#iconePostIT_' + idPIT).css('top', ((numLine * hIcone) + 24) + 'px');	
		$('#iconePostIT_' + idPIT).css('left', ((j % pitPerLine) * lIcone) + 'px');

		//Persitence : Sauve les pit sous forme d'icone
		savePostItState(idPIT, false);

		$.ajax({
			type : "GET",
			url:"savePosition/"+ idPIT,
			error: "Warning there is an error !",
			/*avec les paramètres x,y,z */
			data : {x: (((j % pitPerLine) * lIcone) + posLeftB), y: ((numLine * hIcone) + 24) + posTopB , z: $('#iconePostIT_' + idPIT).css("z-index")}
		})
	}
	if (type == 1) {
		alert("Sort by title finished !")
	} else if (type == 2) {
		alert("Sort by color finished !")

	} else if (type ==3) {
		alert("Sort by date finished !")
	}
	
}

