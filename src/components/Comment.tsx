"use client";

// import necessary modules and components
import { Photo } from "@/tools/photos.model";
import { useState } from "react";
import { sendJSONData } from "@/tools/Toolkit";
import LoadingOverlay from "@/components/LoadingOverlay";
import type { Comment } from "@/tools/photos.model";

interface CommentProps {
    selectedPhoto: Photo; // the photo for which the comments are being added
    isVisible: boolean; // flag to control the visibility of the comment form
    updatePhotoComments: (photoId: string, comments: Comment[]) => void; // function to update the comments in the parent component
}

export default function Comment({
    selectedPhoto,
    isVisible,
    updatePhotoComments,
}: CommentProps) {
    // state for storing the comment text input
    const [commentText, setCommentText] = useState("");
    // state for storing the author's name
    const [author, setAuthor] = useState("");
    // state to manage loading status
    const [isLoading, setIsLoading] = useState(false);

    // handle form submission
    const onSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const newComment: Comment = {
            photoId: selectedPhoto.id,
            comment: commentText,
            author: author,
        };

        // update the comment section by adding the new comment at the top
        updatePhotoComments(
            selectedPhoto.id,
            [newComment].concat(selectedPhoto.comments)
        );

        try {
            const sendURL: string = "/api/comments";

            // create the object with the necessary data to send to the server
            const sendJSON = {
                photoId: selectedPhoto.id,
                comment: newComment.comment,
                author: newComment.author,
            };

            // send the comment data to the server with an api request
            const response: Response = await sendJSONData(
                sendURL,
                sendJSON,
                true
            );

            // if the response is successful, update the comment section with the new list of comments
            if (response && response.ok) {
                let data = await response.json(); // parse the json response from the server
                updatePhotoComments(selectedPhoto.id, data.comments); // update the comment section with the fresh comments
            } else {
                console.error("Failed to add comment");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            // clear the comment text and author input fields, and stop the loading state
            setCommentText("");
            setAuthor("");
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6 w-full max-w-md">
            {isLoading && (
                <LoadingOverlay
                    show={isLoading}
                    bgColor="rgba(0, 0, 0, 0.8)"
                    spinnerColor="#60a5fa"
                    showSpinner
                />
            )}

            {isVisible && !isLoading && (
                <form onSubmit={onSubmit} className="mb-4" method="post">
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        className="border rounded p-2 w-full mb-2 text-black"
                    />
                    <textarea
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                        className="border rounded p-2 w-full mb-2 text-black"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded px-4 py-2"
                    >
                        Submit
                    </button>
                </form>
            )}

            {!isLoading && (
                <>
                    <h3 className="text-lg font-semibold">Comments:</h3>
                    <div className="border p-4 rounded mt-2">
                        {selectedPhoto.comments &&
                        selectedPhoto.comments.length > 0 ? (
                            selectedPhoto.comments.map((comment, index) => (
                                <div key={index} className="mb-2">
                                    <strong className="text-base mr-2 text-blue-400">
                                        {comment.author}:
                                    </strong>
                                    {comment.comment}
                                </div>
                            ))
                        ) : (
                            <p>No comments yet.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
