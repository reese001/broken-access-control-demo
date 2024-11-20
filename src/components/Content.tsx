"use client";

import { Photo } from "@/tools/photos.model";
import Image from "next/image";
import { useState, useEffect } from "react";
import Jump from "@/components/Jump";
import Comment from "@/components/Comment";

interface ContentProps {
    photos: Photo[];
}

export default function Content({ photos: initialPhotos }: ContentProps) {
    // Use useState to create a mutable state of photos
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
    // state for tracking the current photo index
    const [currentIndex, setCurrentIndex] = useState(0);
    // state to control the visibility of the jump menu
    const [showJump, setShowJump] = useState(false);
    // state to control the visibility of the comment form
    const [showCommentForm, setShowCommentForm] = useState(false);

    // get the currently selected photo based on the index
    const selected = photos[currentIndex];

    // function to go to the previous photo
    const onSelectPrevious = () => {
        setCurrentIndex((prevIndex) => prevIndex - 1);
    };

    // function to go to the next photo
    const onSelectNext = () => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    // function to select a photo from the jump menu
    const onJumpSelect = (index: number) => {
        setCurrentIndex(index);
    };

    // function to toggle the visibility of the jump menu
    const toggleJumpMenu = () => {
        setShowJump((prev) => !prev);
    };

    // function to toggle the visibility of the comment form
    const toggleCommentForm = () => {
        setShowCommentForm((prev) => !prev);
    };

    // function to update the comments of the selected photo
    const updatePhotoComments = (photoId: string, updatedComments: any[]) => {
        setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
                photo.id === photoId
                    ? { ...photo, comments: [...updatedComments] } // create a new object reference
                    : photo
            )
        );
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="mt-4 text-xl">
                {selected.title} ({currentIndex + 1} of {photos.length})
            </h2>
            <div className="mt-3 flex flex-row justify-center">
                <button
                    className="px-4 py-2 mr-2 bg-orange-400 text-white rounded"
                    onClick={onSelectPrevious}
                    disabled={currentIndex === 0}
                >
                    Previous
                </button>
                <button
                    className="px-4 py-2 ml-2 bg-orange-400 text-white rounded"
                    onClick={onSelectNext}
                    disabled={currentIndex === photos.length - 1}
                >
                    Next
                </button>
            </div>
            <button
                className="mt-4 mx-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={toggleJumpMenu}
            >
                {showJump ? "Hide Jump Menu" : "Show Jump Menu"}
            </button>{" "}
            {showJump && (
                <Jump
                    photos={photos}
                    currentIndex={currentIndex}
                    onJumpSelect={onJumpSelect}
                />
            )}
            <div className="text-center flex flex-col items-center justify-center align-middle mt-4">
                <Image
                    src={`/images/photos/${selected.source}`}
                    alt={selected.title}
                    width={parseInt(selected.width)}
                    height={parseInt(selected.height)}
                    className="object-contain"
                />
                <p>{selected.caption}</p>
            </div>
            <button
                className="px-4 py-2 mx-5 mt-2 bg-red-500 text-white rounded"
                onClick={toggleCommentForm}
            >
                Add Comment
            </button>
            <Comment
                key={selected.id} // Add key to force re-render
                selectedPhoto={selected}
                isVisible={showCommentForm}
                updatePhotoComments={updatePhotoComments}
            />
        </div>
    );
}
