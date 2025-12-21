const { getDatabase } = require('../database');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'comments';

async function getAllComments(req, res) {
    try {
        const db = getDatabase();

        const comments = await db.collection(COLLECTION_NAME).aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'commenter'
                }
            },
            {
                $unwind: {
                    path: '$commenter',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    'user': { $ifNull: ['$commenter.username', 'Unknown'] }
                }
            },
            {
                $project: {
                    commenter: 0
                }
            }
        ]).toArray();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(comments));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

async function createComment(req, res, body) {
    try {
        const db = getDatabase();
        if (!body) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: 'Body is required' }));
        }

        const { userId, recipeId, text } = body;

        const newComment = {
            user: new ObjectId(userId),
            recipe: new ObjectId(recipeId),
            text
        };

        const comment = await db.collection(COLLECTION_NAME).insertOne(newComment);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Comment posted successfully!' }));
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

module.exports = { getAllComments, createComment };