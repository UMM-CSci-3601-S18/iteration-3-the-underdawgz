package umm3601.database;



import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;


// Controller that manages information about people's items.
public class ResourceController {

    private final Gson gson;
    private MongoDatabase database;
    // resoureCollection is the collection that the resources data is in.
    private final MongoCollection<Document> resourceCollection;

    // Construct controller for items.
    public ResourceController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        resourceCollection = database.getCollection("resources");
    }

    // get a resource by its ObjectId, not used by client, for potential future use
    public String getResource(String id) {
        FindIterable<Document> jsonItems
            = resourceCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonItems.iterator();
        if (iterator.hasNext()) {
            Document resource = iterator.next();
            return resource.toJson();
        } else {
            // We didn't find the desired item
            return null;
        }
    }

    // Helper method which iterates through the collection, receiving all
    // documents if no query parameter is specified. If the resource parameter is
    // specified, then the collection is filtered so only documents of that
    // specified resource are found.
    public String getResources(Map<String, String[]> queryParams) {

        Document filterDoc = new Document();

        // "resource" will be a key to a string object, where the object is
        // what we get when people enter their resources as a text body.
        // "resource" is the purpose of the resource
        if (queryParams.containsKey("link")) {
            String targetContent = (queryParams.get("link")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("link", contentRegQuery);  //purpose
        }

        // category is the category of the resource, also a String


        // name is the title of the resource
        if (queryParams.containsKey("title")) {
            String targetContent = (queryParams.get("title")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetContent);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("title", contentRegQuery);      //name
        }

        /*if (queryParams.containsKey("status")) {
            boolean targetStatus = Boolean.parseBoolean(queryParams.get("status")[0]);
            filterDoc = filterDoc.append("status", targetStatus);
        }*/

        // FindIterable comes from mongo, Document comes from Gson
        FindIterable<Document> matchingResources = resourceCollection.find(filterDoc);

        return JSON.serialize(matchingResources);
    }

    /**
     * Helper method which appends received user information to the to-be added document
     *
     * @param title
     * @param link
     * @return boolean after successfully or unsuccessfully adding a user
     */
    // As of now this only adds the resource, but you can separate multiple arguments
    // by commas as we add them.
    public String addNewResource(String title, String link) {

        // makes the search Document key-pairs
        Document newResource = new Document();
        newResource.append("link", title);
        newResource.append("link", link);

        // Append new resources here

        try {
            resourceCollection.insertOne(newResource);
            ObjectId id = newResource.getObjectId("_id");

            System.err.println("Successfully added new resource [_id=" + id + ", title=" + title + ", link=" + link + ']');
            //return id.toHexString();
            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }



    public void deleteResource(String id){
        Document searchQuery = new Document().append("_id", new ObjectId(id));

        try {
            resourceCollection.deleteOne(searchQuery);
            ObjectId id1 = searchQuery.getObjectId("_id");
            System.out.println("Succesfully deleted resource " + id1);

        } catch(MongoException me) {
            me.printStackTrace();
            System.out.println("error");
        }
    }

}
