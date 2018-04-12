package umm3601.database;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

public class CrisisControllerBasicSpec {
    private CrisisController crisisController;
    private ObjectId floraId;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> crisisDocument = db.getCollection("crisis");
        crisisDocument.drop();
        List<Document> testCrisis = new ArrayList<>();
        testCrisis.add(Document.parse("{\n" +
            "                    name: \"Robert Ward\",\n" +
            "                    email: \"Ladonna@ Benson.com\",\n" +
            "                    phone: \"(891) 411-3124\",\n" +
            "                }"));
        testCrisis.add(Document.parse("{\n" +
            "                    name: \"Thomas Franco\",\n" +
            "                    email: \"Lila@ Browning.com\",\n" +
            "                    phone: \"(803) 525-2495\",\n" +
            "                }"));
        testCrisis.add(Document.parse("{\n" +
            "                    name: \"Wood Aguirre\",\n" +
            "                    email: \"Alford@ Beard.com\",\n" +
            "                    phone: \"(862) 433-3136\",\n" +
            "                }"));

        floraId = new ObjectId();
        BasicDBObject flora = new BasicDBObject("_id", floraId);
        flora = flora.append("name", "Flora Hull")
            .append("email", "Daniel@ Bass.com")
            .append("phone", "(922) 486-2948");



        crisisDocument.insertMany(testCrisis);
        crisisDocument.insertOne(Document.parse(flora.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        crisisController = new CrisisController(db);
    }

    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getName(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("name")).getValue();
    }

    @Test
    public void getAllCrisis() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = crisisController.getCrisis(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 resources", 4, docs.size());
        List<String> names = docs
            .stream()
            .map(CrisisControllerBasicSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Flora Hull", "Robert Ward", "Thomas Franco", "Wood Aguirre");
        assertEquals("Names should match", expectedNames, names);
    }

    @Test
    public void getCrisisById() {
        String jsonResult = crisisController.getCrisis(floraId.toHexString());
        System.out.println(jsonResult);
        Document flora = Document.parse(jsonResult);

        assertEquals("Name should match", "Flora Hull", flora.getString("name"));
        String noJsonResult = crisisController.getCrisis(new ObjectId().toString());
        assertNull("No name should match",noJsonResult);

    }

    @Test
    public void addCrisisTest(){
        String newId = crisisController.addNewCrisis("5ab2bc37e194ff1f2434eb65","Flora Hull2","Daniel@ Bass.com","(922) 486-2948");

        assertNotNull("Add new crisisNumber should return true when an crisisNumber is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("name", new String[] { "Flora Hull2" });
        String jsonResult = crisisController.getCrisis(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> name = docs
            .stream()
            .map(CrisisControllerBasicSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        /*assertEquals("Should return the owner of the new resource", "Flora Hull2", name.get(1));
    */}

   /* Future iteration test for filtering resources by name if so desired.
     //@Test
    public void getResourcesByName(){
        Map<String, String[]> argMap = new HashMap<>();
        //This will search for resources owned by Kyle
        argMap.put("name", new String[] { "Hayden Cain" });
        String jsonResult = resourceController.getResources(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be one resource entry", 1, docs.size());
        List<String> name = docs
            .stream()
            .map(ResourcesControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedName = Arrays.asList("Hayden Cain");
        assertEquals("Names should match", expectedName, name);

    }*/

}
