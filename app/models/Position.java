package models;

import javax.persistence.*;

import play.db.jpa.Model;

/* Classe représentant la table Position */
@Entity
public class Position extends Model{
	public double x;
	public double y;
	public double z;
	
	/* Constructeurs */
	public Position() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
	
	public Position(double x, double y, double z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}
