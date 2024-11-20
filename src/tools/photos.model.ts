export interface PhotosData {
    _id: string;
    id: string;
    photos: Photo[];
}

export interface Photo {
    _id: string;
    id: string;
    title: string;
    caption: string;
    source: string;
    width: string;
    height: string;
    comments: Comment[];
}

export interface Comment {
    photoId: string;
    comment: string;
    author: string;
}
