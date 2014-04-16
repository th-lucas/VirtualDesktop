import org.junit.*;

import java.util.*;
import play.test.*;
import models.*;

public class BasicTest extends UnitTest {
	@SuppressWarnings("deprecation")
	@Before
    public void setup() {
        Fixtures.deleteAll();
    }
 
    @Test
    public void createAndRetrieveUser() {
        // Create a new user and save it
        new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
        new User("mike", "mdp", "mike@gmail.com", "Mike", "Candy").save();

        // Retrieve the user with bob username
        User bob = User.find("byEmail", "bob@gmail.com").first();
        User mike = User.find("byPassword", "mdp").first();
        
        // Test 
        assertNotNull(bob);
        assertEquals("bob", bob.login);
        assertEquals("Bob", bob.name);
        assertEquals("secret", bob.password);
        assertEquals("bob@gmail.com", bob.email);
        assertNotNull(mike);
        assertEquals("Mike", mike.name);
    }
    
        
    @Test
    public void createPostIt() {
        // Create a new user and save it
        User bob = new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
        User mike = new User("mike", "mdp", "mike@gmail.com", "Mike", "Candy").save();

        //Create new desktop
        Desktop dBob = new Desktop(bob).save();
        Desktop dMike = new Desktop(mike).save();
        
        assertNotNull(dBob);
    	assertNotNull(dMike);
    	
        Position pos1 = new Position(100, 100, 100).save();
        
        // Create new post its 
    	PostIt postit1 = new PostIt(pos1, 200, 200, "title", "content",true).save();
    	PostIt postit2 = new PostIt("#ABCDEF", pos1, 200, 200, "title2", "content2", false, 0,true).save();
    	PostIt postit3 = new PostIt("#FEDACB", pos1, 200, 200, "titre", "contenu", false, 0,true).save();
    	
    	assertNotNull(postit1);
    	assertNotNull(postit2);
    	assertNotNull(postit3);

    	//Assign post it to desktops
    	dBob.addPostIt(postit1);
    	dMike.addPostIt(postit2);
    	dMike.addPostIt(postit3);
    	
        // Test that the post has been created
        assertEquals(3, PostIt.count());

        // Test that the contents and titles are correct
        assertEquals("title", postit1.title);
        assertEquals("content", postit1.content);
        assertEquals("title2", postit2.title);
        assertEquals("content2", postit2.content);
        assertEquals("titre", postit3.title);
        assertEquals("contenu", postit3.content);
    }
    
    
    @Test
    public void createBox() {
        // Create a new user and save it
        User bob = new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();

        //Create new desktop
        Desktop dBob = new Desktop(bob).save();
        
        assertNotNull(dBob);
    	
        Position pos1 = new Position(100, 100, 100).save();
        
        // Create new post its 
    	Box box1 = new Box(pos1,"#ABCDEF", "boite1",true, false).save();
    	Box box2 = new Box(pos1,"#FEDCBA", "boite2",true, false).save();
    	
    	assertNotNull(box1);
    	assertNotNull(box2);

    	//Assign post it to desktops
    	dBob.addBox(box1);
    	dBob.addBox(box2);
    	
        // Test that the post has been created
        assertEquals(2, Box.count());

        // Test that the contents and titles are correct
        assertEquals(pos1, box1.position);
        assertEquals("#ABCDEF", box1.color);
        assertEquals("boite1", box1.name);
        assertEquals(pos1, box2.position);
        assertEquals("#FEDCBA", box2.color);
        assertEquals("boite2", box2.name);
        List<Box> boxesbob = dBob.boxes;
        assertEquals(pos1, boxesbob.get(0).position);
        assertEquals("#ABCDEF", boxesbob.get(0).color);
        assertEquals("boite1", boxesbob.get(0).name);
        assertEquals(pos1, boxesbob.get(1).position);
        assertEquals("#FEDCBA", boxesbob.get(1).color);
        assertEquals("boite2", boxesbob.get(1).name);
    }
    
    @Test
    public void boxChangeStateBox() {
    	 // Create a new user and save it
        User bob = new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
        //Create new desktop
        Desktop dBob = new Desktop(bob).save();
        assertNotNull(dBob);
        Position pos1 = new Position(100, 100, 100).save();
    	Box box1 = new Box(pos1,"#ABCDEF", "boite1",true, false).save();
    	assertNotNull(box1);
    	dBob.addBox(box1);
    	box1.changeState(false);
        assertEquals(1, Box.count());
        assertFalse(box1.open);
    }
    
    @Test
    public void boxChangeMaxBox() {
    	 // Create a new user and save it
        User bob = new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
        //Create new desktop
        Desktop dBob = new Desktop(bob).save();
        assertNotNull(dBob);
        Position pos1 = new Position(100, 100, 100).save();
    	Box box1 = new Box(pos1,"#ABCDEF", "boite1",true, false).save();
    	assertNotNull(box1);
    	dBob.addBox(box1);
    	box1.changeMax(true);
        assertEquals(1, Box.count());
        assertTrue(box1.open);
    }
    
    @Test
    public void boxAddPostIt() {
    	 // Create a new user and save it
        User bob = new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
        //Create new desktop
        Desktop dBob = new Desktop(bob).save();
        assertNotNull(dBob);
        Position pos1 = new Position(100, 100, 100).save();
    	Box box1 = new Box(pos1,"#ABCDEF", "boite1",true, false).save();
    	PostIt p1 = new PostIt(pos1,200,200,"Post-it 1","",true).save();
    	assertNotNull(box1);
    	assertNotNull(p1);
    	dBob.addBox(box1);
    	box1.addPostIt(p1);
    	box1.changeMax(true);
        assertEquals(1, Box.count());
        assertEquals(1, box1.postIts.size());
        assertEquals(p1, box1.postIts.get(0));
    }
    
    @Test
    public void boxRemovePostIt() {
    	 // Create a new user and save it
        User bob = new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
        //Create new desktop
        Desktop dBob = new Desktop(bob).save();
        assertNotNull(dBob);
        Position pos1 = new Position(100, 100, 100).save();
    	Box box1 = new Box(pos1,"#ABCDEF", "boite1",true, false).save();
    	PostIt p1 = new PostIt(pos1,200,200,"Post-it 1","",true).save();
    	assertNotNull(box1);
    	assertNotNull(p1);
    	dBob.addBox(box1);
    	box1.addPostIt(p1);
    	box1.changeMax(true);
        assertEquals(1, Box.count());
        assertEquals(1, box1.postIts.size());
        assertEquals(p1, box1.postIts.get(0));
        box1.removePostIt(p1);
        assertEquals(0, box1.postIts.size());
    }
    
    @Test
    public void boxChangeName() {
    	 // Create a new user and save it
        User bob = new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
        //Create new desktop
        Desktop dBob = new Desktop(bob).save();
        assertNotNull(dBob);
        Position pos1 = new Position(100, 100, 100).save();
    	Box box1 = new Box(pos1,"#ABCDEF", "boite1",true, false).save();
    	assertNotNull(box1);
    	dBob.addBox(box1);
    	box1.changeName("test");
        assertEquals(1, Box.count());
        assertEquals("test",box1.name);
    }
    
    @Test
    public void boxChangePosition() {
    	 // Create a new user and save it
        User bob = new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
        //Create new desktop
        Desktop dBob = new Desktop(bob).save();
        assertNotNull(dBob);
        Position pos1 = new Position(100, 100, 100).save();
        Position pos2 = new Position(200, 200, 200).save();
    	Box box1 = new Box(pos1,"#ABCDEF", "boite1",true, false).save();
    	assertNotNull(box1);
    	dBob.addBox(box1);
    	box1.changePosition(pos2);
        assertEquals(pos2, box1.position);
    }
    
    @Test
    public void desktopRemovePostIt() {
   	 // Create a new user and save it
       User bob = new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
       //Create new desktop
       Desktop dBob = new Desktop(bob).save();
       assertNotNull(dBob);
       Position pos1 = new Position(100, 100, 100).save();
   	   PostIt p1 = new PostIt(pos1,200,200,"Post-it 1","",true).save();
   	   assertNotNull(p1);
   	   dBob.addPostIt(p1);
   	   assertEquals(1,dBob.postIts.size());
   	   dBob.removePostIt(p1);
   	   assertEquals(0,dBob.postIts.size());
   }
    
    @Test
    public void desktopChangeColor() {
   	 // Create a new user and save it
       User bob = new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
       //Create new desktop
       Desktop dBob = new Desktop(bob).save();
       assertNotNull(dBob);
       dBob.changeColor("#ABCDEF");
   	   assertEquals("#ABCDEF",dBob.color);
   }
    
    @Test
    public void desktopRemoveBox() {
    	// Create a new user and save it
        User bob = new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
        //Create new desktop
        Desktop dBob = new Desktop(bob).save();
        assertNotNull(dBob);
        Position pos1 = new Position(100, 100, 100).save();
    	Box b1 = new Box(pos1,"#ABCDEF", "boite1",true, false).save();
        assertNotNull(b1);
        dBob.addBox(b1);
        assertEquals(1,dBob.boxes.size());
        dBob.removeBox(b1);
        assertEquals(0,dBob.boxes.size());
    }
    
    
    @Test
    public void desktopChangeImage() {
   	 // Create a new user and save it
       User bob = new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
       //Create new desktop
       Desktop dBob = new Desktop(bob).save();
       assertNotNull(dBob);
       dBob.changeImageDesktop("@image");
   	   assertEquals("@image",dBob.url);
   }
    
    @Test
    public void postItChangeTitle() {
        Position pos1 = new Position(100, 100, 100).save();
    	PostIt p1 = new PostIt(pos1,200,200,"Post-it 1","",true).save();
    	assertNotNull(p1);
    	p1.changeTitle("test");
        assertEquals("test",p1.title);
    }
    
    @Test
    public void postItChangeContent() {
        Position pos1 = new Position(100, 100, 100).save();
    	PostIt p1 = new PostIt(pos1,200,200,"Post-it 1","",true).save();
    	assertNotNull(p1);
    	p1.changeContent("testContent");
        assertEquals("testContent",p1.content);
    }
    
    @Test
    public void postItChangePosition() {
        Position pos1 = new Position(100, 100, 100).save();
        Position pos2 = new Position(200, 200, 200).save();
    	PostIt p1 = new PostIt(pos1,200,200,"Post-it 1","",true).save();
    	assertNotNull(p1);
    	p1.changePosition(pos2);
        assertEquals(pos2, p1.position);
    }
    
    @Test
    public void postItChangeColor() {
        Position pos1 = new Position(100, 100, 100).save();
    	PostIt p1 = new PostIt(pos1,200,200,"Post-it 1","",true).save();
    	assertNotNull(p1);
    	p1.changeColor("#ABCDEF");
        assertEquals("#ABCDEF", p1.color);
    }
    
    @Test
    public void postItChangeState() {
        Position pos1 = new Position(100, 100, 100).save();
    	PostIt p1 = new PostIt(pos1,200,200,"Post-it 1","",true).save();
    	assertNotNull(p1);
    	p1.changeState(false);
        assertFalse(p1.open);
    }
    
	@Test
    public void postItChangeSize() {
        Position pos1 = new Position(100, 100, 100).save();
    	PostIt p1 = new PostIt(pos1,200,200,"Post-it 1","",true).save();
    	assertNotNull(p1);
    	p1.changeSize("vertical");
        assertEquals(200,p1.width,0.001);
        assertEquals(400,p1.height,0.001);
    	p1.changeSize(null);
        assertEquals(200,p1.width,0.001);
        assertEquals(400,p1.height,0.001);
    	p1.changeSize("square");
        assertEquals(200,p1.width,0.001);
        assertEquals(200,p1.height,0.001);
    	p1.changeSize("horizontal");
        assertEquals(400,p1.width,0.001);
        assertEquals(200,p1.height,0.001);
    	p1.changeSize("big");
        assertEquals(350,p1.width,0.001);
        assertEquals(350,p1.height,0.001);
    	p1.changeSize("nothing");
        assertEquals(350,p1.width,0.001);
        assertEquals(350,p1.height,0.001);
    }
	
	@Test
	 public void userEquals() {
	        // Create a new user and save it
	        new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
	        new User("mike", "mdp", "mike@gmail.com", "Mike", "Candy").save();

	        // Retrieve the user with bob username
	        User bob = User.find("byEmail", "bob@gmail.com").first();
	        User mike = User.find("byPassword", "mdp").first();
	        
	        assertFalse(bob.equals(mike));
	        assertTrue(bob.equals(bob));
	        mike = null;
	        assertFalse(bob.equals(mike));
	        
	 }
	 
	@Test
	 public void userChangeLastConnexion() {
	        new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
	        User bob = User.find("byEmail", "bob@gmail.com").first();
	        java.util.Date today = new java.util.Date();
	        bob.last = new java.sql.Date(today.getTime());
	        java.sql.Date date = bob.last;
	        bob.changeLastConnexion();
	        assertTrue(bob.last.equals(date));
	        assertFalse(bob.last.before(date));
	        assertFalse(bob.last.after(date));
	 }
	 
	@Test
	 public void userAddPostIt() {
	        new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
	        User bob = User.find("byEmail", "bob@gmail.com").first();
	        Position pos1 = new Position(100, 100, 100).save();
	    	PostIt p1 = new PostIt(pos1,200,200,"Post-it 1","",true).save();
	        bob.addPostIt(p1);
	        assertEquals(p1,bob.postIts.get(0));
	 }
	 
	
	@Test
	 public void userRemovePostIt() {
	        new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
	        User bob = User.find("byEmail", "bob@gmail.com").first();
	        Position pos1 = new Position(100, 100, 100).save();
	    	PostIt p1 = new PostIt(pos1,200,200,"Post-it 1","",true).save();
	        bob.addPostIt(p1);
	        assertEquals(1, bob.postIts.size());
	        assertEquals(p1,bob.postIts.get(0));
	        bob.removePostIt(p1);
	        assertEquals(0, bob.postIts.size());
	        
	 }
	
	@Test
	 public void userToString() {
	        new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
	        User bob = User.find("byEmail", "bob@gmail.com").first();
	        assertEquals("User [bob]",bob.toString());
	        
	 }
	
	@Test
	 public void userAddImage() {
	        new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
	        User bob = User.find("byEmail", "bob@gmail.com").first();
	        UploadResult ur = new UploadResult();
	        bob.addImage(ur);
	        assertEquals(1,bob.images.size());
	        assertEquals(ur,bob.images.get(0));
	        
	        
	 }
	 
	@Test
	 public void userAndDeleteSaveWP() {
	        new User("bob", "secret", "bob@gmail.com", "Bob", "Damon").save();
	        User bob = User.find("byEmail", "bob@gmail.com").first();
	        UploadResult ur = new UploadResult();
	        bob.addImage(ur);
	        Long a = Long.parseLong("1");
	        bob.wallpaper = null;
	        bob.saveWP(a, "type");
	        bob.saveWP(a, "type");
	        assertEquals(bob.wallpaper[1],"type");
	        assertEquals(bob.wallpaper[0],a.toString());
	        bob.deleteWP();
	        assertNull(bob.wallpaper);
	        
	 }
    
}