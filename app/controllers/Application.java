package controllers;

import org.apache.commons.io.FileUtils;
import play.*;
import play.libs.Codec;
import play.mvc.*;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.*;

import models.*;

@With(Secure.class)
public class Application extends Controller {

	/* Fonction d'accueil*/
	public static void index() {
		render();
	}
	
	/* Fonction appelée si javascript n'est pas activé dans le navigateur*/
	public static void noscript(){
		render();
	}

	/* Fonction permettant l'affichage du bureau*/
	public static void showDesktop(Long id){
		User user = User.find("byLogin", Security.connected()).first();
		Desktop d = Desktop.findById(id);
		if(d != null){
			if(d.user.equals(user)) {
				render("Application/desktop.html",d,user);
			}else{
				forbidden("You do not have access to an other user's desktop !");
			}
		}else{
			forbidden("You do not have access to an other user's desktop !");
		}
	}

	/* Fonction permettant de sauvegarder la couleur du bureau */
	public static void saveColor(Long id, String color){
		Desktop d = Desktop.findById(id);
		d.changeColor(color);
		showDesktop(id);
	}

	
	/* Fonction permettant d'ajouter un post it dans un bureau */
	public static void addPostIt(Long id, String colour, String contentArea, String titleInput, double xInput, double yInput, String container, String size){
		Position pos; 
		PostIt postIt; 
		double width = 0, height = 0;

		if (contentArea != null) {contentArea = contentArea.replace("\n", "<br>").replace("\r", "");}

		if (size.equals("square")) {
			width = 200;
			height = 200;
		} else if (size.equals("vertical")) {
			width = 200;
			height = 400;
		} else if (size.equals("horizontal")) {
			width = 400;
			height = 200;
		} else if (size.equals("big")) {
			width = 350;
			height = 350;
		}

		Desktop d = Desktop.findById(id);
		if (!container.equals("desktop")) {
			Box b = Box.findById(Long.parseLong(container));
			pos = new Position (xInput + b.position.x + 5, yInput + b.position.y + 25, b.position.z).save();
			postIt = new PostIt('#'+colour, pos, width, height, titleInput, contentArea, true, Long.parseLong(container),true).save();
			b.addPostIt(postIt);
		} else {

			pos = new Position (xInput,yInput,0).save();
			postIt = new PostIt('#'+colour, pos, width, height, titleInput, contentArea, false, 0,true).save();
			d.addPostIt(postIt);
		}
		User user = User.find("select d.user from Desktop d where d.id=?", id).first();
		user.addPostIt(postIt);
		showDesktop(id);
	}

	/* Fonction permettant de supprimer un post-it d'un bureau*/
	public static void suppressPostIt(Long idP, Long idD){
		PostIt pi = PostIt.findById(idP);

		if (!pi.inBox) {
			Desktop d = Desktop.findById(idD);
			d.removePostIt(pi);
		} else {
			Box b = Box.findById(pi.boxID);
			b.removePostIt(pi);
		}
		User user = User.find("byLogin", Security.connected()).first();
		user.removePostIt(pi);

		pi.delete();

	}

	/* Fonction permettant de sauvegarder la position d'un post-it*/
	public static void savePosition(Long id, double x, double y, double z){
		Position pos = new Position(x,y,z).save();
		PostIt pi = PostIt.findById(id);
		pi.changePosition(pos);
	}

	/* Fonction permettant de sauvegarder un post-it dans une boite*/
	public static void saveInBox(Long id,  Long idB, Long idD){
		PostIt pi = PostIt.findById(id);
		/* if the PIT is already in the box */
		if( pi.boxID == 0){
			Desktop d = Desktop.findById(idD);
			d.removePostIt(pi);

			Box b = Box.findById(idB);
			pi.inBox = true;
			pi.boxID = idB;
			pi.save();
			b.addPostIt(pi);
		}else if (pi.boxID!=idB){
			Box b1 = Box.findById(pi.boxID);
			b1.removePostIt(pi);

			Box b = Box.findById(idB);
			pi.inBox = true;
			pi.boxID = idB;
			pi.save();
			b.addPostIt(pi);
		}
	}

	/* Fonction permettant d'enlever un post-it d'une boîte et de le sauvegarder dans le bureau*/
	public static void saveInDesktop(Long id,  Long idB, Long idD){
		PostIt pi = PostIt.findById(id);
		pi.inBox = false;
		pi.boxID = 0;
		pi.save();
		Desktop d = Desktop.findById(idD);
		d.addPostIt(pi);
		Box b = Box.findById(idB);
		b.removePostIt(pi);
	}

	/* Fonction permettant d'ajouter une boîte à un bureau*/
	public static void addBox(Long id, String colour, String nameInput, double xInputBox, double yInputBox){
		Desktop d = Desktop.findById(id);
		Position pos = new Position (xInputBox,yInputBox,0).save();
		Box box = new Box(pos, '#'+colour,  nameInput, true, false).save();
		d.addBox(box);
		showDesktop(id);
	}

	/* Fonction permettant de supprimer une boîte d'un bureau*/
	public static void suppressBox(Long idB, Long idD, boolean suppAll){
		Desktop d = Desktop.findById(idD);
		Box b = Box.findById(idB);
		if(!suppAll){
			List<PostIt> PIT = b.postIts;
			for(PostIt pi : PIT){
				pi.inBox = false;
				pi.boxID = 0;
				pi.save();
				d.addPostIt(pi);
			}
		}
		d.removeBox(b);
		b.delete();
	}

	/* Fonction permettant de changer le titre du post-it*/
	public static void changePostItTitle(Long id,Long idP,String titleEdited){
		PostIt pi = PostIt.findById(idP);
		pi.changeTitle(titleEdited);
	}

	/* Fonction permettant de changer le contenu du post-it*/
	public static void changePostItContent(Long id,Long idP,String contentEdited){
		PostIt pi = PostIt.findById(idP);
		contentEdited = contentEdited.replace("\n", "<br>").replace("\r", "");
		pi.changeContent(contentEdited);
		
		renderJSON(pi);
	}

	/* Fonction permettant de modifier la forme et la couleur du post-it*/
	public static void changePostItAppear(Long idP, String shapeSelected,String colorSelected){
		PostIt pi = PostIt.findById(idP);
		pi.changeSize(shapeSelected);
		pi.changeColor(colorSelected);
	}  

	/* Fonction permettant de changer le nom de la boîte*/
	public static void changeBoxName(Long id,Long idB,String nameEdited){
		Box b = Box.findById(idB);
		b.changeName(nameEdited);
	}

	/* Fonction permettant de sauver l'état d'une boîte (ouverte ou fermée)*/
	public static void saveState(Long id, boolean openORclose){
		Box b = Box.findById(id);
		b.changeState(openORclose);
	}

	/* Fonction permettant de sauver l'état d'un post-it (ouvert ou fermé)*/
	public static void saveStatePIT(Long id, boolean openORclose){
		PostIt p = PostIt.findById(id);
		p.changeState(openORclose);
	}

	/* Fonction permettant de sauver la position d'une boîte au sein d'un bureau*/
	public static void savePositionBox(Long id, double x, double y, double z){
		Position pos = new Position(x,y,z).save();
		Box b = Box.findById(id);
		double diffX = x - b.position.x;
		double diffY = y - b.position.y;
		double diffZ = z - b.position.z;
		b.changePosition(pos);

		for (PostIt pi :b.postIts){
			pos = new Position(pi.position.x+diffX,pi.position.y+diffY,pi.position.z+diffZ).save();
			pi.changePosition(pos);
		}

	}

	/* Fonction permettant de sauver la taille de la boîte (maximisée ou normale)*/
	public static void saveStateMax(Long id, boolean maxORnot){
		Box b = Box.findById(id);
		b.changeMax(maxORnot);
	}

	/* Fonction permettant de sauver les dessins faits sur le bureau*/
	public static void saveImageDesktop(Long id, String url){
		Desktop d = Desktop.findById(id);
		d.changeImageDesktop(url);
	}
	
	/* Fonction permettant d'uploader un fichier */
	/* Cette fonction prend en entrer soit un fichier local, soit une string correspondant à l'URL d'un fichier*/
	public static void upload(File uploadFile, String uploadFileURL) {
		User user = User.find("byLogin", Security.connected()).first();
		String userLogin = user.login ;
		
		/* Si le fichier est nul, on renvoie un message d'erreur dans le JSON */
		if (uploadFile == null && uploadFileURL == null){
			renderJSON("Error ! You have forgotten to choose a file !");
		}
		
		/* On construit une liste des extension possibles */
		ArrayList<String> extPossibles = new ArrayList<String>(); 
		extPossibles.add(".jpg");
		extPossibles.add(".jpeg");
		extPossibles.add(".png");
		extPossibles.add(".tiff");
		extPossibles.add(".bmp");
		extPossibles.add(".JPG");
		extPossibles.add(".JPEG");
		extPossibles.add(".PNG");
		extPossibles.add(".TIFF");
		extPossibles.add(".BMP");

		
		/* Creation d'un répertoire dans le dossier uploads au nom de l'utilisateur */
		UploadResult uploadResult = new UploadResult();
		File uploadDir = new File(Play.applicationPath, "/public/uploads/" + userLogin);
		if (!uploadDir.exists()){
			uploadDir.mkdirs();
		}
		
		/* Cas du fichier local */
		if(uploadFile != null){	
			/* On récupère l'extension du fichier */
			String extension = uploadFile.toString().substring(uploadFile.toString().lastIndexOf("." )); 

			/* On vérifie que le format du fichier est bien pris en charge */
			/* Sinon on renvoie un message d'erreur dans le JSON */
			if(!(extPossibles.contains(extension))){
				renderJSON("Error ! File format not recognized !");
			}
			
			/* Si il n'y a pas d'erreur, on crée un nouveau fichier */
			File uploadedFile = new File(uploadDir, uploadFile.getName());
			try {
				/* On vérifie si le fichier existe et on le déplace dans le dossier d'upload */
				FileUtils.moveFile(uploadFile, uploadedFile);
			} catch (IOException e) {
				/* Si oui on avertit l'utilisateur */
				renderJSON("Error ! File already exits !");
			}
			/* Creation de la miniature du fichier */
			File thumbnail = new File(uploadDir, "thumb__" + uploadFile.getName());
			/* On resize l'image pour la miniature */
			play.libs.Images.resize(uploadedFile, thumbnail, 100, 50);	
			/* Creation de l'objet uploadResult */
			uploadResult.name = uploadFile.getName();
			uploadResult.type = "text/plain";
			uploadResult.ref = userLogin;
			uploadResult.url = "public/uploads/" + userLogin + "/" + uploadFile.getName();
			uploadResult.thumbnail_url = "public/uploads/" + userLogin + "/" + thumbnail.getName();
			uploadResult.size = FileUtils.sizeOf(uploadedFile);
		}
		/* Cas du fichier local */
		else if (uploadFileURL != null){
			/* On récupère l'extension du fichier */
			String extension = uploadFileURL.toString().substring(uploadFileURL.toString().lastIndexOf("." )); 

			/* On vérifie que le format du fichier est bien pris en charge */
			/* Sinon on renvoie un message d'erreur dans le JSON */
			if(!(extPossibles.contains(extension))){
				renderJSON("Error ! File format not recognized !");
			}
			
			/* Si il n'y a pas d'erreur, on crée un nouveau fichier */
			String[] url = uploadFileURL.split("/");
			String name = url[url.length - 1];
			File uploadedFile = new File(uploadDir, name);
			try {
				/* On vérifie si le fichier existe et on le déplace dans le dossier d'upload */
				FileUtils.copyURLToFile(new URL(uploadFileURL), uploadedFile);
			} catch (IOException e) {
				/* Si il existe on averti l'utilisateur */
				renderJSON("Error ! File already exits !");
			}
			/* Creation de la miniature du fichier */
			File thumbnail = new File(uploadDir, "thumb__" + name);
			/* On resize l'image pour la miniature */
			play.libs.Images.resize(uploadedFile, thumbnail, 100, 50);	
			/* Creation de l'objet uploadResult */
			uploadResult.name = name;
			uploadResult.type = "text/plain";
			uploadResult.ref = userLogin;
			uploadResult.url = "public/uploads/" + userLogin + "/" + name;
			uploadResult.thumbnail_url = "public/uploads/" + userLogin + "/" + thumbnail.getName();
			uploadResult.size = FileUtils.sizeOf(uploadedFile);
		}
		/* Tout s'est bien passé, on ajoute l'upload result a la liste d'images de l'utilisateur */
		user.addImage(uploadResult);
		/* On renvoie le bon JSON */
		renderJSON(uploadResult);
	}

	/* Fonction permettant de sauvegarder le fond d'écran d'un bureau*/
	public static void saveWP(Long id,String type) {
		User user = User.find("byLogin", Security.connected()).first();
		user.saveWP(id, type);
	}
	
	/* Fonction permettant de supprimer le fond d'écran d'un bureau*/
	public static void deleteWP(){
		User user = User.find("byLogin", Security.connected()).first();
		user.deleteWP();
	}
}