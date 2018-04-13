package umm3601.database;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

public class CrisisController {
    private final Gson gson;
    private MongoDatabase database;
    // goalCollection is the collection that the resources data is in.
    private final MongoCollection<Document> crisisCollection;

    // Construct controller for resources.
    public CrisisController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        crisisCollection = database.getCollection("crisis");
    }

    // Helper method which iterates through the collection, receiving all
    // documents if no query parameter is specified.
    public String getCrisis(String id) {

        FindIterable<Document> jsonCrisis
            = crisisCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonCrisis.iterator();
        if (iterator.hasNext()) {
            Document crisisNumber = iterator.next();
            return crisisNumber.toJson();
        } else {
            // We didn't find the desired Resource
            return null;
        }
    }


    public String getCrisis(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("name")) {
            String targetName = (queryParams.get("name")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetName);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", targetName);
        }

        FindIterable<Document> matchingCrisis = crisisCollection.find(filterDoc);


        return JSON.serialize(matchingCrisis);
    }

    public String editCrisis(String id, String name, String email, String phone){
        System.out.println("Right here again");
        Document newCrisis = new Document();
        newCrisis.append("name", name);
        newCrisis.append("email", email);
        newCrisis.append("phone", phone);
        Document setQuery = new Document();
        setQuery.append("$set", newCrisis);

        Document searchQuery = new Document().append("_id", new ObjectId(id));

        System.out.println(id);



        try {
            crisisCollection.updateOne(searchQuery, setQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
            System.err.println("Successfully updated journal [_id=" + id1 + ", name=" + name + ", email=" + email + ",phone=" + phone + ']');
            return JSON.serialize(id1);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }


    public String addNewCrisis(String id, String name, String email, String phone) {
        System.out.println("Adding new crisis " + name);

        Document newCrisis = new Document();
        newCrisis.append("name", name);
        newCrisis.append("email", email);
        newCrisis.append("phone", phone);




        try {
            crisisCollection.insertOne(newCrisis);

            ObjectId Id = newCrisis.getObjectId("_id");
            System.err.println("Successfully added new crisisNumber [_id=" + id + ", name=" + name + ", email=" + email + " phone=" + phone + ']');

            return JSON.serialize(Id);
        } catch (MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
