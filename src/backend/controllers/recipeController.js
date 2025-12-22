const { getDatabase } = require("../database");
const { ObjectId } = require("mongodb");

const COLLECTION_NAME = "recipes";

async function getAllRecipes(req, res) {
  try {
    const db = getDatabase();

    const recipes = await db
      .collection(COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "createdBy.user",
            foreignField: "_id",
            as: "creator",
          },
        },
        {
          $unwind: {
            path: "$creator",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            "createdBy.user": { $ifNull: ["$creator.username", "Unknown"] },
          },
        },
        {
          $project: {
            creator: 0,
          },
        },
      ])
      .toArray();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(recipes));
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

async function createRecipe(req, res, body) {
  try {
    const db = getDatabase();
    if (!body) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: "Body is required" }));
    }

    const {
      title,
      description,
      tags,
      cookingTime,
      servings,
      picture,
      ingredients,
      instructions,
      userId,
    } = body;

    const newRecipe = {
      title,
      description,
      tags,
      cookingTime,
      servings,
      picture,
      ingredients,
      instructions,
      createdBy: {
        user: new ObjectId(userId),
      },
    };

    const recipe = await db.collection(COLLECTION_NAME).insertOne(newRecipe);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Recipe posted successfully!",
        recipeTitle: body.title,
        id: recipe.insertedId,
      })
    );
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

async function getTags(req, res) {
  try {
    const db = getDatabase();
    const tags = await db.collection(COLLECTION_NAME).distinct("tags");
    // Filter out any null/undefined tags just in case
    const cleanTags = tags.filter((tag) => tag);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(cleanTags));
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

async function getRecipesById(req, res, body) {
  try {
    const db = getDatabase();
    const { idList } = body;
    
    if (!idList || !Array.isArray(idList) || idList.length === 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "idList must be a non-empty array of recipe IDs" }));
      return;
    }
    
    console.log('idList received:', idList);  // Add this debug log
    // Convert string IDs to ObjectId for MongoDB query
    const objectIds = idList.map(id => new ObjectId(id));
    console.log('Converted to ObjectIds:', objectIds);  // Add this
    
    // Query for recipes where _id is in the idList
    const recipes = await db.collection(COLLECTION_NAME).find({ _id: { $in: objectIds } }).toArray();
    console.log('Recipes found:', recipes.length, 'items');  // Add this
    
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(recipes));  // Return the array of recipes directly
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

module.exports = { getAllRecipes, getRecipesById, createRecipe, getTags };
