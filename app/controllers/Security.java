package controllers;

import java.security.MessageDigest;
import java.lang.reflect.InvocationTargetException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;


import play.Play;
import play.data.validation.Email;
import play.data.validation.Required;
import play.libs.Crypto;
import play.libs.Time;
import play.mvc.Before;
import play.mvc.Http;
import play.utils.Java;
import models.Desktop;
import models.User;

public class Security extends Secure.Security{

	public static void authenticate(@Required String username, @Required String password, boolean remember) throws Throwable {
		if(validation.hasErrors() ) {
			flash.error("secure.error");
			params.flash();
			login();
		}
		User user = User.find("byLoginAndPassword", username, crypterMDP(password)).first();

		if(user != null){
			if(remember) {
				Date expiration = new Date();
				String duration = "30d";  // maybe make this override-able 
				expiration.setTime(expiration.getTime() + Time.parseDuration(duration));
				response.setCookie("rememberme", Crypto.sign(username + "-" + expiration.getTime()) + "-" + username + "-" + expiration.getTime(), duration);
			}
			session.put("username", username);
			invoke("onAuthenticated");
		}else{
			flash.error("secure.error");
			params.flash();
			login();
		}

	}

	public static void login() throws Throwable {
		Http.Cookie remember = request.cookies.get("rememberme");
		if(remember != null) {
			int firstIndex = remember.value.indexOf("-");
			int lastIndex = remember.value.lastIndexOf("-");
			if (lastIndex > firstIndex) {
				String sign = remember.value.substring(0, firstIndex);
				String restOfCookie = remember.value.substring(firstIndex + 1);
				String username = remember.value.substring(firstIndex + 1, lastIndex);
				String time = remember.value.substring(lastIndex + 1);
				Date expirationDate = new Date(Long.parseLong(time)); // surround with try/catch?
				Date now = new Date();
				if (expirationDate == null || expirationDate.before(now)) {
					logout();
				}
				if(Crypto.sign(restOfCookie).equals(sign)) {
					session.put("username", username);
					onAuthenticated();
				}
			}
		}else if(Security.connected() != null){
			onAuthenticated();
		}
		
		render("Secure/login.html");
	}

	public static void logout() throws Throwable {		
		Security.invoke("onDisconnect");
		session.clear();
		response.removeCookie("rememberme");
		Security.invoke("onDisconnected");
		flash.success("secure.logout");
		login();
	}

	static void onDisconnected() {
		flash.success("secure.logout");
		try {
			login();
		} catch (Throwable e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	static void onAuthenticated() {
		String name = session.get("username");
		User user = User.find("byLogin", name).first();
		Desktop desk = Desktop.find("byUser", user).first();
		user.changeLastConnexion();
		Application.showDesktop(desk.id);
	}

	public static void createAccount(){
		render("Secure/createAccount.html");
	}

	public static void newAccount(@Required String lastname, @Required String firstname, @Email @Required String email,
			@Required String usernameCA, @Required String passwordCA, @Required String passwordConfirm) throws NoSuchAlgorithmException{

		if(!(passwordCA.equals(passwordConfirm))){
			validation.addError("passwordConfirmError", "Warning ! The password you enter should be identical to the first password entered.",passwordConfirm);
		}

		if(!(User.find("byLogin", usernameCA).fetch().isEmpty())){
			validation.addError("loginAlreadyInUse", "Warning ! The login you enter is not available.",usernameCA);
		}

		if(passwordCA.length() < 8){
			validation.addError("passwordTooShort", "Warning ! The password you enter should have at least 8 characters.",passwordCA);
		}

		if(validation.hasErrors()){
			params.flash();
			validation.keep(); 
			createAccount();
		}else{	
			User user = new User(usernameCA, crypterMDP(passwordCA), email, lastname, firstname).save();
			Desktop d = new Desktop(user).save();
			session.put("username", usernameCA);
			Application.showDesktop(d.id);
		}
	}

	
    static boolean check(String profile) {
    	 User user = User.find("byLogin", connected()).first();
         if ("administrator".equals(profile)) {
             return user.admin;
         }
         else {
             return false;
         }

    }
    
	public static String crypterMDP(String pwd) throws NoSuchAlgorithmException{
		MessageDigest md = MessageDigest.getInstance("SHA-256");
		md.update(pwd.getBytes());

		byte byteData[] = md.digest();

		//convert the byte to hex format method 1
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < byteData.length; i++) {
			sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
		}
		
		return sb.toString();
	}

	static Object invoke(String m, Object... args) throws Throwable {

        try {
            return Java.invokeChildOrStatic(Security.class, m, args);       
        } catch(InvocationTargetException e) {
            throw e.getTargetException();
        }
    }
	
}