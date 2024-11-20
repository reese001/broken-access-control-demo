import { getPhotoData } from "@/tools/DataManager";
import { Photo } from "@/tools/photos.model";
import Content from "@/components/Content";

export default async function Home() {
    const photosData: Photo[] = await getPhotoData();

    return (
        <div className="flex justify-center align-middle">
            {/* if there is data, dislpay content, else display no photos available */}
            {photosData.length > 0 ? (
                <Content photos={photosData} />
            ) : (
                <h1 className="text-xl">No photos available</h1>
            )}
        </div>
    );
}
