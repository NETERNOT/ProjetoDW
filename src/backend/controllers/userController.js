const { getDatabase } = require("../database");
const { ObjectId } = require("mongodb");

const COLLECTION_NAME = "users";

async function getAllUsers(req, res) {
  try {
    const db = getDatabase();
    const users = await db.collection(COLLECTION_NAME).find({}).toArray();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

async function getUser(req, res, body) {
  try {
    const db = getDatabase();
    const { id } = body;
    console.log("Requested user id:", id);
    const user = await db
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    if (user) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          user: {
            email: user.email,
            username: user.username,
            savedRecipes: user.savedRecipes,
          },
        })
      );
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: " Internal Server Error" }));
  }
}

async function checkEmailAvailability(req, res, body) {
  try {
    const db = getDatabase();
    const { email } = body;
    if (email === undefined) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ available: true }));
      return;
    }
    const user = await db.collection(COLLECTION_NAME).findOne({ email });
    const available = !user;

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ available }));
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

async function checkUsernameAvailability(req, res, body) {
  try {
    const db = getDatabase();
    const { username } = body;
    if (username === undefined) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ available: true }));
      return;
    }
    const user = await db
      .collection(COLLECTION_NAME)
      .findOne({ username: username });
    const available = !user;

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ available }));
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

async function signup(req, res, body) {
  try {
    const db = getDatabase();
    const { email, username, password } = body;

    const emailUser = await db.collection(COLLECTION_NAME).findOne({ email });
    const usernameUser = await db
      .collection(COLLECTION_NAME)
      .findOne({ username: username });

    if (emailUser || usernameUser) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Email or username already taken" }));
      return;
    }

    const user = await db
      .collection(COLLECTION_NAME)
      .insertOne({ username: username, email, password, savedRecipes: [] });

    console.log('User created with id:', user.insertedId.toString());

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "User created successfully",
        user: {
          id: user.insertedId,
        },
      })
    );
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

async function login(req, res, body) {
  try {
    const db = getDatabase();
    const { email, password } = body;

    const user = await db
      .collection(COLLECTION_NAME)
      .findOne({ email, password });

    if (!user) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid credentials" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      })
    );
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

async function toggleSavedRecipe(req, res, body) {
  try {
    const db = getDatabase();
    const { userId, recipeId } = body;

    if (!userId || !recipeId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "userId and recipeId are required" }));
      return;
    }

    const user = await db
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
      return;
    }

    const index = user.savedRecipes.indexOf(recipeId);

    if (index === -1) {
      user.savedRecipes.push(recipeId);
    } else {
      user.savedRecipes.splice(index, 1);
    }

    await db
      .collection(COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { savedRecipes: user.savedRecipes } }
      );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Saved recipes updated",
        savedRecipes: user.savedRecipes,
      })
    );
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

module.exports = {
  getUser,
  getAllUsers,
  checkEmailAvailability,
  checkUsernameAvailability,
  signup,
  login,
  toggleSavedRecipe,
};
