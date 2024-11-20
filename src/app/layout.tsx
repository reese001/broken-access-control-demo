import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Photo Album Web App with NextJS",
    description: "Full Stack Programming Project I",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className="bg-gray-900 text-white">{children}</body>
        </html>
    );
}
