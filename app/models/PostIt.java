package models;

import java.util.Date;

import javax.persistence.*;

import play.db.jpa.Model;

/* Classe représentant la table PostIt */
@Entity
public class PostIt extends Model {
	
	public String color;
	@OneToOne
	public Position position;
	public double width;
	public double height;
	public String title;
	@Lob
	public String content;
	public boolean inBox;
	public long boxID;
	public boolean open;
	public Date dateCreation;
	
	/* Constructeurs */
	public PostIt(Position position, double width, double height, String title, String content, boolean open) {
		super();
		this.color = "#FFFF80";
		this.position = position;
		this.width = width;
		this.height = height;
		this.title = title;
		this.content = content;
		this.inBox = false;
		this.boxID = 0;
		this.open = open;
		this.dateCreation = new Date();
	}
	
	public PostIt(String color, Position position, double width, double height,
			String title, String content, boolean inBox, long boxID, boolean open) {
		super();
		this.color = color;
		this.position = position;
		this.width = width;
		this.height = height;
		this.title = title;
		this.content = content;
		this.inBox = inBox;
		this.boxID = boxID;
		this.open = open;
		this.dateCreation = new Date();
	}
	
	/* Méthodes utilisées pour des actions simples (ajout, suppression, modifications de nom,...) */
	public PostIt changeColor(String newColor) {
		this.color = newColor;
		this.save();
		return this;
	}
	
	public PostIt changeTitle(String newTitle) {
		this.title = newTitle;
		this.save();
		return this;
	}
	
	public PostIt changeContent(String newContent) {
		this.content = newContent;
		this.save();
		return this;
	}
	
	public PostIt changePosition(Position pos){
		this.position = pos;
		this.save();
		return this;
	}
	
	public PostIt changeState(Boolean openORclose){
		this.open = openORclose;
		this.save();
		return this;
	}
	
	public PostIt changeSize(String shape){
		if (shape == null){
			return this;
		}
		
		if (shape.equals("square")) {
			this.width = 200;
			this.height = 200;
		} else if (shape.equals("vertical")) {
			this.width = 200;
			this.height = 400;
		} else if (shape.equals("horizontal")) {
		    this.width = 400;
			this.height = 200;
		} else if (shape.equals("big")) {
			this.width = 350;
			this.height = 350;
		}
		
		this.save();
		return this;
	}
}
