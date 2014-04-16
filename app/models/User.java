package models;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import play.db.jpa.Model;

/* Classe représentant la table User */
@Entity
public class User extends Model {
	public String login;
	public String password;
	public String email;
	public String name;
	public String firstname;
	public boolean admin;
	public Date first;
	public Date last;
	
	@ElementCollection
	@OneToMany
	public List<PostIt> postIts;
	
	@OneToMany
	public List<UploadResult> images;
	
	/* Argument utilisé pour le fond d'écran, la première case correspond à l'url du fond d'écran
	 * et la deuxième à la facon d'afficher l'écran (centrer, mosaique, etirer)
	 */
	public String[] wallpaper;
	
	public int totalPostItNum;
	
	/* Constructeurs */
	public User(String login, String password, String email, String name, String firstname) {
		super();
		this.login = login;
		this.password = password;
		this.email = email;
		this.name = name;
		this.firstname = firstname;
		this.admin = false;
		java.util.Date today = new java.util.Date();
		this.first = new Date(today.getTime());
		this.postIts = new ArrayList<PostIt>();
		this.images = new ArrayList<UploadResult>();
		this.totalPostItNum = 0;
		this.wallpaper = null;
	}
	
	/* Méthodes utilisées pour des actions simples (ajout, suppression, modifications de nom,...) */
	public boolean equals(User user) {
		if(user != null){
			return this.id == user.id;
		}else{
			return false;
		}
	}
	
	public User changeLastConnexion(){
		java.util.Date today = new java.util.Date();
		this.last = new Date(today.getTime());
		this.save();
		return this;
	}
	
	public User addPostIt(PostIt pi){
		postIts.add(pi);
		totalPostItNum += 1;
		this.save();
		return this;
	}
	
	public User removePostIt(PostIt pi){
		postIts.remove(pi);
		this.save();
		return this;
	}

	@Override
	public String toString() {
		return "User [" + login + "]";
	}
	
	public User addImage(UploadResult ur){
		ur.save();
		this.images.add(ur);
		this.save();
		return this;
	}
	
	public User saveWP(Long imageId, String type){
		if (wallpaper == null){
			wallpaper = new String[2];
		}
		wallpaper[0] = imageId.toString();
		wallpaper[1] = type;
		this.save();
		return this;
	}
	
	public void deleteWP(){
		wallpaper = null;
		this.save();
	}
	
}
