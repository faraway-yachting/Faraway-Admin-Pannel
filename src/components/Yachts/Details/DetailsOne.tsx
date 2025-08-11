"use client"

import Image from "next/image";
import { useSelector } from "react-redux";
import type { RootState } from '@/lib/Store/store';
import { IoEyeOutline } from "react-icons/io5";


function getEmbedUrl(url?: string) {
    if (!url) return '';
    const youtubeMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/);
    if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    const youtuBeMatch = url.match(/(?:https?:\/\/)?youtu\.be\/([\w-]+)/);
    if (youtuBeMatch) {
        return `https://www.youtube.com/embed/${youtuBeMatch[1]}`;
    }
    return url;
}

const Yachts: React.FC = () => {

    const { yachts } = useSelector((state: RootState) => state.yachts);

    return (
        <div className="flex flex-col gap-3">
            <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full">
                <p className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
                    Primary Image
                </p>
                <div className="border border-[#CCCCCC] p-1.5 rounded-lg flex justify-center">
                    {yachts?.primaryImage ? (
                        <Image src={yachts.primaryImage} alt="img" width={296} height={158} className="rounded-lg" />
                    ) : <p className="text-gray-500 p-4">No featured image</p>}
                </div>
            </div>
            <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full">
                <p className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
                    Gallery Images
                </p>
                <div className="border border-[#CCCCCC] p-1.5 rounded-lg flex justify-center">
                    {Array.isArray(yachts?.galleryImages) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {yachts?.galleryImages.map((url: string, index: number) => (
                                <div key={index} className="w-full h-auto">
                                    <Image
                                        key={index}
                                        src={url}
                                        alt={`Vehicle Image ${index + 1}`}
                                        width={400}
                                        height={250}
                                        className="rounded-lg w-full h-[70px] 2xl:h-[90px] object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        className="rounded-full px-[16px] py-[7px] bg-[#001B48] flex items-center gap-2 hover:bg-[#222222] text-white text-center cursor-pointer font-medium"
                        onClick={() => {
                            if (
                                yachts?.galleryImages &&
                                Array.isArray(yachts.galleryImages)
                            ) {
                                const html = `
                                <html>
                                  <head>
                                    <style>
                                      body {
                                        font-family: sans-serif;
                                        padding: 20px;
                                        display: grid;
                                        grid-template-columns: repeat(3, 1fr);
                                        gap: 10px;
                                        background: #f9f9f9;
                                      }
                                      img {
                                        width: 100%;
                                        height: 300px;
                                        object-fit: cover;
                                        border-radius: 8px;
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    ${yachts.galleryImages
                                        .map((url) => `<img src="${url}" alt="Vehicle Image" />`)
                                        .join("")}
                                  </body>
                                </html>
                              `;
                                const newWindow = window.open();
                                if (newWindow) {
                                    newWindow.document.write(html);
                                    newWindow.document.close();
                                }
                            }
                        }}
                    >
                        See All <IoEyeOutline />
                    </button>
                </div>
            </div>
            {yachts?.videoLink && yachts.videoLink.length > 0 && (
                <div className="bg-white shadow-xs rounded-lg px-2 py-2 w-full">
                    <p className="text-[#001B48] font-bold text-[18px] mb-2 pb-2 border-b border-[#CCCCCC]">
                        Video URL
                    </p>
                    <div className="border border-[#CCCCCC] p-1.5 rounded-lg flex justify-center">
                        {yachts?.videoLink ? (
                            <iframe
                                src={getEmbedUrl(yachts.videoLink)}
                                width="296"
                                height="158"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                                className="rounded-lg w-full"
                                title="Yacht Video"
                            />
                        ) : (
                            <p className="text-gray-500 p-4">No featured video</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Yachts;