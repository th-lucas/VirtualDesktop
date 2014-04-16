package models;

import javax.persistence.Entity;

import play.db.jpa.Model;

/* Classe représentant la table UploadResult, représentant les upload */
@Entity
public class UploadResult extends Model{
	// url du fichier
	public String url;
	// url de la miniature
	public String thumbnail_url;
	public String name;
	public String type;
	public Long size;
	public String delete_url;
	public String delete_type;
	public String ref;
}
