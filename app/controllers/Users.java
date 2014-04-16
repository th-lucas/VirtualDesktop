package controllers;

import java.util.List;

import models.Desktop;
import models.User;
import controllers.CRUD.ObjectType;
import play.*;
import play.data.binding.Binder;
import play.db.Model;
import play.exceptions.TemplateNotFoundException;
import play.mvc.*;

@Check("administrator")
@With(Secure.class)
public class Users extends CRUD { 

	public static void delete(String id) throws Exception {
		ObjectType type = ObjectType.get(getControllerClass());
		notFoundIfNull(type);
		Desktop d = Desktop.find("select d from Desktop d where d.user.id=?", Long.parseLong(id)).first();
		User object = (User) type.findById(id);
		notFoundIfNull(object);
		if(!object.login.equals(Security.connected())){
			try {
				d.delete();
				object._delete();
			} catch (Exception e) {
				flash.error(play.i18n.Messages.get("crud.delete.error", type.modelName));
				redirect(request.controller + ".show", object._key());
			}
			flash.success(play.i18n.Messages.get("crud.deleted", type.modelName));
		}else{
			flash.error("You can't delete your own profile", id);
		}
		redirect(request.controller + ".list");
	}

	public static void index(){
		if (getControllerClass() == CRUD.class) {
			forbidden();
		}
		User user = User.find("byLogin",Security.connected()).first();
		Desktop d = Desktop.find("byUser", user).first();
		render("CRUD/index.html",d);
	}
	
	public static void list(int page, String search, String searchFields, String orderBy, String order) {
		User user = User.find("byLogin",Security.connected()).first();
		Desktop d = Desktop.find("byUser", user).first();
        ObjectType type = ObjectType.get(getControllerClass());
        notFoundIfNull(type);
        if (page < 1) {
            page = 1;
        }
        List<Model> objects = type.findPage(page, search, searchFields, orderBy, order, (String) request.args.get("where"));
        Long count = type.count(search, searchFields, (String) request.args.get("where"));
        Long totalCount = type.count(null, null, (String) request.args.get("where"));
        try {
            render(type, objects, count, totalCount, page, orderBy, order, d);
        } catch (TemplateNotFoundException e) {
            render("CRUD/list.html", type, objects, count, totalCount, page, orderBy, order, d);
        }
    }
	
    public static void show(String id) throws Exception {
    	User user = User.find("byLogin",Security.connected()).first();
		Desktop d = Desktop.find("byUser", user).first();
        ObjectType type = ObjectType.get(getControllerClass());
        notFoundIfNull(type);
        Model object = type.findById(id);
        notFoundIfNull(object);
        try {
            render(type, object,d);
        } catch (TemplateNotFoundException e) {
            render("CRUD/show.html", type, object,d);
        }
    }
}