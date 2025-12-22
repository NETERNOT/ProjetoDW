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
    
    const objectIds = idList.map(id => new ObjectId(id));
    
    const recipes = await db.collection(COLLECTION_NAME).find({ _id: { $in: objectIds } }).toArray();
    
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(recipes));
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
}

async function getRecipesByCreator(req, res, body){
    try{
        const db = getDatabase()
        const { creatorId } = body

        if (!creatorId) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "creatorId is required" }));
            return;
        }

        const recipes = await db.collection(COLLECTION_NAME).find({ "createdBy.user": new ObjectId(creatorId) }).toArray()

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(recipes))
    }   catch(error){
        console.error(error)
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({error: "Internal Server Error."}))
    }
}

module.exports = { getAllRecipes, getRecipesById, getRecipesByCreator, createRecipe, getTags };
