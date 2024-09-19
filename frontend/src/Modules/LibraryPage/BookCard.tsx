import { useState } from "react";
import { Book } from "./LibraryPage";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // If you're using React Router v6

type BookCardProps = {
    book: Book;
};

export default function BookCard({ book }: BookCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate(); // For navigation

    const handleGoToBook = () => {
        // Navigate to the book's detail page
        navigate(`/book?id=${book._id}`);
    };

    return (
        <div
            className="bg-zinc-700 rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300 m-4 w-80"
        >
            <div className="relative">
                <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-96 object-cover"
                />
                <button
                    className="absolute top-2 right-2 text-gray-100 text-2xl hover:text-red-500 transition-colors"
                    onClick={() => setIsLiked((liked) => !liked)}
                    aria-label={isLiked ? "Unlike" : "Like"}
                >
                    {isLiked ? (
                        <FaHeart className="text-red-500" />
                    ) : (
                        <FaRegHeart />
                    )}
                </button>
            </div>
            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-100 truncate">
                    {book.title}
                </h2>
                <p className="text-sm text-gray-400 mt-1">by {book.author}</p>
                <p className="text-sm text-gray-400 mt-1">
                    Genres: {book.genre.join(", ")}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                    Added on: {new Date(book.dateAdded).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-300 mt-4 line-clamp-3">
                    {book.description}
                </p>
                {/* Go to Book Button */}
                <button
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    onClick={handleGoToBook}
                >
                    Go to Book
                </button>
            </div>
        </div>
    );
}
