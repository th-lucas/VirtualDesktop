package models;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.*;

import play.db.jpa.Model;

/* Classe représentant la table Desktop */
@Entity
public class Desktop extends Model {
	@OneToOne
	public User user;
	public String color;
	@OneToMany
	public List<PostIt> postIts;
	@OneToMany
	public List<Box> boxes;
	@Lob
	public String url;
	
	/* Constructeur */
	public Desktop(User user) {
		this.color = "#FFFFFF";
		this.user = user;
		postIts = new ArrayList<PostIt>();
		boxes = new ArrayList<Box>();
	}
	
	/* Méthodes utilisées pour des actions simples (ajout, suppression, modifications de nom,...) */
	public Desktop addPostIt(PostIt postIt) {
		postIts.add(postIt);
		this.save();
		return this;
	}
	
	public Desktop removePostIt(PostIt postIt) {
		postIts.remove(postIt);
		this.save();
		return this;
	}
	
	public Desktop changeColor(String newColor) {
		this.color = newColor;
		this.save();
		return this;
	}
	
	public Desktop addBox(Box box) {
		boxes.add(box);
		this.save();
		return this;
	}
	
	public Desktop removeBox(Box box) {
		boxes.remove(box);
		this.save();
		return this;
	}
	
	public Desktop changeImageDesktop(String url){
		this.url = url;
		this.save();
		return this;
	}
}
