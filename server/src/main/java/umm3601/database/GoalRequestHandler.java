package umm3601.database;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import jdk.net.SocketFlow;
import spark.Request;
import spark.Response;

public class GoalRequestHandler {
    private final GoalController goalController;
    public GoalRequestHandler(GoalController goalController){
        this.goalController = goalController;
    }
    /**Method called from Server when the 'api/goals/:id' endpoint is received.
     * Get a JSON response with a list of all the users in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one user in JSON formatted string and if it fails it will return text with a different HTTP status code
     */

    // gets one goal using its ObjectId--didn't use, just for potential future functionality
    public String getGoalJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String goal;
        try {
            goal = goalController.getGoal(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested goal id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (goal != null) {
            return goal;
        } else {
            res.status(404);
            res.body("The requested goal with id " + id + " was not found");
            return "";
        }
    }



    /**Method called from Server when the 'api/goals' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of users in JSON formatted String
     */

    // Gets the goals from the DB given the query parameters
    public String getGoals(Request req, Response res)
    {
        res.type("application/json");
        return goalController.getGoals(req.queryMap().toMap());
    }

    /**Method called from Server when the 'api/users/new'endpoint is recieved.
     * Gets specified user info from request and calls addNewUser helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the user was added successfully or not
     */
    public String addNewGoal(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            // if the object that is the JSON representation of the request body's class is the class BasicDBObject
            // then try to add the goal with goalController's addNewGoal method
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String name = dbO.getString("goal");
                    String category = dbO.getString("category");
                    String goal = dbO.getString("name");
                    Boolean status = dbO.getBoolean("status");

                    System.err.println("Adding new goal [goal=" + goal + ", category=" + category + " name=" + name + "status" + status + ']');
                    return goalController.addNewGoal(goal, category, name, status)/*.toString()*/;
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new goal request failed.");
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

    public String editGoal(Request req, Response res)
    {
	System.out.println("it went into GoalRequestHandler::editGoal");
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if (o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String id = dbO.getString("_id");
                    String name = dbO.getString("goal");
                    String category = dbO.getString("category");
                    String goal = dbO.getString("name");
                    System.err.println("Editing goal [_id=" + id + ", goal=" + goal + ", category=" + category + " name=" + name + ']');
                    return goalController.editGoal(id, goal, category, name);
                }
                catch (NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new journal request failed.");
                    return null;
                }
            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        }
        catch (RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }

    public String completeGoal(Request req, Response res)
    {
        System.out.println("it went into GoalRequestHandler::completeGoal");
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            // if the object that is the JSON representation of the request body's class is the class BasicDBObject
            // then try to add the item with itemController's completeGoal method
            if(o.getClass().equals(BasicDBObject.class)) {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String id = dbO.getString("_id");
                    String goal = dbO.getString("goal");
                    String category = dbO.getString("category");
                    String name = dbO.getString("name");
                    Boolean status = dbO.getBoolean("status");

                    System.out.println("Completing goal [goal: " + goal + ", category: " + category + ", name: " + name + ", status: " + status + ']');
                    return goalController.completeGoal(id, goal, category, name, status).toString();
                } catch (NullPointerException e) {
                    System.err.println("A value was malformed or omitted, new item request failed.");
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
