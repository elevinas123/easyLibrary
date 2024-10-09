


export default function BookCardSkeleton() {
    return (
        <div  className="flex flex-col animate-pulse">
            <div className="relative p-0">
                <div className="w-full h-96 bg-gray-200 rounded-t-lg"></div>
                <div className="absolute top-2 right-2 flex space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
            </div>
            <div className="flex-1 p-4">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="p-4">
                <div className="w-full h-10 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
}
