import {
  Double,
  MongoClient,
  ObjectId,
  PushOperator,
  ServerApiVersion,
} from "mongodb";
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@calico.sgvrk.mongodb.net/?retryWrites=true&w=majority&appName=calico`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function doesUsernameExist(userData: string) {
  // Needs to be done when social auth is setup- Joey
  if (userData.includes("google")) {
  }
}

export async function editTransaction(
  userId: string,
  name: string,
  cost: number,
  date: Date,
  transactionID: string,
  description?: string
) {
  // Add search and edit feature (See if it is possible to search via document id instead)
  const dataBase = client.db("calico_user_data"); // Connects to database
  const collections = dataBase.collection("user"); // Connect to collection
  const transactionResult = {
    user_id: userId,
    "transactions._id": new ObjectId(transactionID),
  };
  const updateDoc = {
    $set: {
      "transactions.$.name": name,
      "transactions.$.cost": new Double(cost),
      "transactions.$.date": date,
      "transactions.$.description": description,
    },
  };
  const result = await collections.updateOne(transactionResult, updateDoc);
  console.log(result);
  if (result.matchedCount === 0) {
    console.log("No matching transaction found.");
  } else if (result.modifiedCount === 0) {
    console.log("Transaction found, but no changes were made.");
  } else {
    console.log("Transaction updated successfully.");
  }
}

export async function getRecentTransactions(userId: string) {
  // Gets last 5 transactions
  const dataBase = client.db("calico_user_data"); // Connects to database
  const collections = dataBase.collection("user"); // Connect to collection
  const clientExistResult = await collections.findOne({
    user_id: userId, // first username is the mongoDB field second userName is current userName
  });
  return clientExistResult;
}

export async function insertTransaction(
  userId: string,
  name: string,
  cost?: number,
  date?: Date,
  description?: string
) {
  const dataBase = client.db("calico_user_data"); // Connects to database
  const collections = dataBase.collection("user"); // Connect to collection
  const doc = {
    _id: new ObjectId(),
    name: name,
    cost: new Double(cost!),
    date: date,
    description: description,
  };
  await collections.updateOne(
    { user_id: userId },
    { $push: { transactions: doc } as PushOperator<Document> }
  );
}

export async function doesUserExist(
  userId: string,
  userName: string,
  emailAddress: string
) {
  await client.connect(); // Connects to collection
  const dataBase = client.db("calico_user_data"); // Connects to database
  const collection = dataBase.collection("user"); // Connect to collection
  const clientExistResult = await collection.findOne({
    user_id: userId, // first username is the mongoDB field second userName is current userName
  });
  if (clientExistResult == null) {
    const doc = {
      user_id: userId,
      user_name: userName,
      email: emailAddress,
      spending: new Double(0),
      savings: new Double(0),
      transactions: [],
    };

    await collection.insertOne(doc);
  }
}
export async function loadConnection() {
  // Connect the client to the server	(optional starting in v4.7)
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("calico_user_data").command({ ping: 1 });
}

loadConnection().catch(console.dir);
