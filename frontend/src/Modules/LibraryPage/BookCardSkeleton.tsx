import { FaRegHeart } from "react-icons/fa";

export default function BookCardSkeleton() {
    return (
        <div className="bg-zinc-800 rounded-lg overflow-hidden shadow-lg">
            <div className="relative aspect-[2/3]">
                <div className="w-full h-full bg-zinc-700 animate-pulse"></div>
                <button
                    className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white"
                    aria-label="Loading Like Button"
                    disabled
                >
                    <FaRegHeart className="text-gray-400" />
                </button>
            </div>
            <div className="p-4">
                <div className="w-3/4 h-6 bg-zinc-700 animate-pulse mb-2 rounded"></div>
                <div className="w-1/2 h-4 bg-zinc-700 animate-pulse mb-2 rounded"></div>
                <div className="w-full h-4 bg-zinc-700 animate-pulse mb-2 rounded"></div>
                <div className="w-1/3 h-4 bg-zinc-700 animate-pulse mb-4 rounded"></div>
                <div className="w-full h-10 bg-zinc-700 animate-pulse rounded-lg"></div>
            </div>
        </div>
    );
}
