import {
    MongoClient,
    Db,
    Collection,
    FindCursor,
    InsertOneResult,
    ObjectId,
    UpdateResult,
    DeleteResult,
} from "mongodb";
import { Photo, PhotosData } from "./photos.model";
import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";

const MONGO_URL: string = "mongodb://mongo:27017";
const MONGO_DB_NAME: string = "dbPhotoAlbum";
const MONGO_COLLECTION_PHOTOS: string = "photos";

export async function getPhotoData() {
    let mongoClient: MongoClient = new MongoClient(MONGO_URL);
    let photosArray: Photo[] = [];

    try {
        await mongoClient.connect();

        let db: Db = mongoClient.db(MONGO_DB_NAME);
        let collection: Collection = db.collection(MONGO_COLLECTION_PHOTOS);

        let cursor: FindCursor = collection.find();

        let data = await cursor.toArray();

        if (data.length > 0 && data[0].photos) {
            photosArray = data[0].photos;
            photosArray.forEach((photo: Photo) => {
                if (photo._id) {
                    photo._id = photo._id.toString();
                }
            });
        }
    } catch (error: any) {
        console.error(`Error fetching data: ${error.message}`);
        throw error;
    } finally {
        await mongoClient.close();
    }

    return photosArray;
}

export async function addComment(request: NextRequest) {
    const mongoClient = new MongoClient(MONGO_URL);

    try {
        await mongoClient.connect();

        // sanitize the request body
        let body: any = await request.json();
        let sanitizedComment = sanitizeHtml(body.comment);
        let sanitizedAuthor = sanitizeHtml(body.author);
        let photoId = sanitizeHtml(body.photoId);

        // construct the new comment object
        const newComment = {
            photoId: photoId,
            comment: sanitizedComment,
            author: sanitizedAuthor,
        };

        // update the photos document by pushing the new comment into the comments array
        let result: UpdateResult = await mongoClient
            .db(MONGO_DB_NAME)
            .collection<PhotosData>(MONGO_COLLECTION_PHOTOS)
            .updateOne(
                { "photos.id": photoId },
                {
                    $push: {
                        "photos.$.comments": {
                            $each: [newComment],
                            $position: 0,
                        },
                    },
                }
            );

        if (result.modifiedCount > 0) {
            // fetch the updated photo data including comments
            let updatedPhotoData = await mongoClient
                .db(MONGO_DB_NAME)
                .collection<PhotosData>(MONGO_COLLECTION_PHOTOS)
                .findOne({ "photos.id": photoId });

            if (updatedPhotoData) {
                // find the photo and its updated comments
                let updatedComments = updatedPhotoData.photos.find(
                    (photo: Photo) => photo.id === photoId
                )?.comments;

                // return the updated comments in the response
                return NextResponse.json(
                    {
                        message: "Comment added successfully",
                        comments: updatedComments,
                    },
                    { status: 200 }
                );
            }

            // if no photo is found after update
            return NextResponse.json(
                { message: "No photo found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "No photo found" },
            { status: 404 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await mongoClient.close();
    }
}
