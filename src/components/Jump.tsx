"use client";

import { Photo } from "@/tools/photos.model";
import Image from "next/image";

interface JumpProps {
    photos: Photo[];
    currentIndex: number;
    onJumpSelect: (index: number) => void; // function to handle jumping to a selected photo
}

export default function Jump({
    photos,
    currentIndex,
    onJumpSelect,
}: JumpProps) {
    return (
        <div className="flex flex-wrap justify-center space-x-4 mt-4">
            {photos.map((photo: Photo, index: number) => (
                <div
                    key={index}
                    onClick={() => onJumpSelect(index)} // click event to jump to selected photo
                    className={`cursor-pointer ${
                        index === currentIndex ? "" : "opacity-30"
                    } `}
                >
                    <Image
                        src={`/images/photos/${photo.source}`}
                        alt={photo.title}
                        width={60}
                        height={60}
                        className="object-cover w-full h-full rounded pt-1"
                    />
                </div>
            ))}
        </div>
    );
}
