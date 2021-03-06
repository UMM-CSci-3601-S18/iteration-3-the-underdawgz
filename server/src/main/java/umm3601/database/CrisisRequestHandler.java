package umm3601.database;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;

public class CrisisRequestHandler {
    private final CrisisController crisisController;
    public CrisisRequestHandler(CrisisController crisisController){
        this.crisisController = crisisController;
    }

    /**Method called from Server when the 'api/crisis' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of users in JSON formatted String
     */

    // Gets the goals from the DB given the query parameters
    public String getCrisisJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String crisis;
        try {
            crisis = crisisController.getCrisis(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested crisisNumber id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (crisis != null) {
            return crisis;
        } else {
            res.status(404);
            res.body("The requested crisis with id " + id + " was not found");
            return "";
        }
    }



    /**Method called from Server when the 'api/resources' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of resourcess in JSON formatted String
     */
    public String getCrisis(Request req, Response res)
    {
        res.type("application/json");
        return crisisController.getCrisis(req.queryMap().toMap());
    }


    /**Method called from Server when the 'api/resources/new'endpoint is recieved.
     * Gets specified resources info from request and calls addNewResources helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the resources was added successfully or not
     */
    public String addNewCrisis(Request req, Response res)
    {
        System.out.println("Received a request to add a new crisis");
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;
                    String id = dbO.getString("_id");
                    String name = dbO.getString("name");
                    String email = dbO.getString("email");
                    String phone = dbO.getString("phone");


//
//                    System.err.println("Adding new resource [id=" + id + ", name=" + name + " phonenumber=" + phonenumber + "email" + email  + ']');
                    return crisisController.addNewCrisis( id, name, email, phone).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new crisisNumber request failed.");
                    return null;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }

    public String editCrisis(Request req, Response res)
    {
        System.out.println("Right here");
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String id = dbO.getString("_id");
                    String name = dbO.getString("name");
                    String email = dbO.getString("email");
                    String phone = dbO.getString("phone");



                    System.err.println("Editing crisis [ id=" + id + ", name=" + name + ", email=" + email + ",phone=" + phone + ']');
                    return crisisController.editCrisis(id, name, email, phone).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new crisis request failed.");
                    return null;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }

}
