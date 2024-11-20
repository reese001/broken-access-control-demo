"use client";

//  need to install react-spinners for this component to work
//  with docker - must shut down, clear volumes, and rebuild / spinup all containers
import BarLoader from "react-spinners/BarLoader";

interface LoadingOverlayProps {
    show?: boolean;
    showSpinner?: boolean;
    spinnerColor?: string;
    bgColor?: string;
}

export default function LoadingOverlay({
    show = true,
    bgColor = "#000000",
    spinnerColor = "#000000",
    showSpinner = true,
}: LoadingOverlayProps) {
    return show ? (
        <div
            className="flex justify-center items-center flex-col h-10"
            style={{ backgroundColor: "rgb(17 24 39 / 1" }}
        >
            {showSpinner ? <BarLoader color={spinnerColor} /> : <div></div>}
            <p className="mt-3">Loading...</p>
        </div>
    ) : (
        <div></div>
    );
}
