package controllers;

import java.io.File;

import play.*;
import play.jobs.*;
import play.test.*;
 
import models.User;
 
@OnApplicationStart
public class Bootstrap extends Job {
 
    public void doJob() {
        // Check if the database is empty
        if(User.count() == 0) {
            Fixtures.loadModels("initial-data.yml");
        }
        
        File myDir = new File(Play.applicationPath,"/public/uploads");
        emptyDirectory(myDir);

    }
    
    public void emptyDirectory(File folder){
    	   for(File file : folder.listFiles()){
    	      if(file.isDirectory()){
    	          emptyDirectory(file);
    	      }
    	       file.delete();
    	   }
    	}
 
}