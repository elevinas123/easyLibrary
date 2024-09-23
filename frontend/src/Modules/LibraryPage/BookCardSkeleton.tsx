import { FaRegHeart } from "react-icons/fa";

export default function BookCardSkeleton() {
    return (
        <div className="bg-zinc-700 rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300 m-4 w-80">
            <div className="relative">
                {/* Skeleton Image Placeholder */}
                <div className="w-full h-96 bg-zinc-600 animate-pulse"></div>

                {/* Skeleton Like Button Placeholder */}
                <button
                    className="absolute top-2 right-2 text-gray-100 text-2xl hover:text-red-500 transition-colors"
                    aria-label="Loading Like Button"
                    disabled
                >
                    <FaRegHeart className="text-gray-400 animate-pulse" />
                </button>
            </div>

            <div className="p-4">
                {/* Skeleton Title Placeholder */}
                <div className="w-3/4 h-6 bg-zinc-600 animate-pulse mb-2 rounded"></div>

                {/* Skeleton Author Placeholder */}
                <div className="w-1/2 h-4 bg-zinc-600 animate-pulse mb-2 rounded"></div>

                {/* Skeleton Genres Placeholder */}
                <div className="w-full h-4 bg-zinc-600 animate-pulse mb-2 rounded"></div>

                {/* Skeleton Date Placeholder */}
                <div className="w-1/3 h-4 bg-zinc-600 animate-pulse mb-4 rounded"></div>

                {/* Skeleton Button Placeholder */}
                <button
                    className="w-full bg-zinc-600 py-2 px-4 rounded-lg animate-pulse"
                    disabled
                >
                    &nbsp;
                </button>
            </div>
        </div>
    );
}
