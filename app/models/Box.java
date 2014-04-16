package models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import play.db.jpa.Model;

/* Classe représentant la table  Box */
@Entity
public class Box extends Model {
	@OneToOne
	public Position position;
	public String color;
	public String name;
	public double width;
	public double height;
	public boolean open;
	public boolean max;
	@OneToMany
	public List<PostIt> postIts;

	/* Constructeur */
	public Box(Position position, String color, String name, Boolean open, Boolean max){
		this.position = position;
		this.color = color;
		this.name = name;
		this.width = 700;
		this.height = 450;
		this.open = open;
		this.max = max;
		this.postIts = new ArrayList<PostIt>();
	}
	
	/* Méthodes utilisées pour des actions simples (ajout, suppression, modifications de nom,...) */
	public Box changeState(Boolean openORclose){
		this.open = openORclose;
		this.save();
		return this;
	}

	public Box addPostIt(PostIt postIt) {
		postIts.add(postIt);
		this.save();
		return this;
	}
	
	public Box removePostIt(PostIt postIt) {
		postIts.remove(postIt);
		this.save();
		return this;
	}
	
	
	public Box changeName(String newName) {
		this.name = newName;
		this.save();
		return this;
	}

	public Box changePosition(Position pos) {
		this.position = pos;
		this.save();
		return this;
	}
	
	public Box changeMax(Boolean maxORnot){
		this.max = maxORnot;
		this.save();
		return this;
	}
}
