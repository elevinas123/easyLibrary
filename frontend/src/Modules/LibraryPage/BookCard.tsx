import {
    DialogClose,
    DialogDescription,
    DialogTitle,
} from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom"; // If you're using React Router v6
import { Button } from "../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Book } from "../../endPointTypes/types";
type BookCardProps = {
    book: Book;
    deleteBook: (bookId: string) => Promise<void>;
    selectBook: (bookId: string) => void;
};

export default function BookCard({
    book,
    deleteBook,
    selectBook,
}: BookCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate(); // For navigation
    const [hovered, setHovered] = useState(false);
    const handleGoToBook = () => {
        // Navigate to the book's detail page
        navigate(`/book?id=${book._id}`);
    };

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => selectBook(book._id)}
            className="bg-zinc-700 rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300 m-4 w-80"
        >
            <div className="relative">
                <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-96 object-cover"
                />
                <div className="absolute top-2 right-2 flex flex-row">
                    <DeleteDialog
                        hovered={hovered}
                        book={book}
                        deleteBook={deleteBook}
                    />
                    <button
                        className=" text-gray-100 text-2xl hover:text-red-500 transition-colors"
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

                {/* Go to Book Button */}
                <button
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    onClick={handleGoToBook}
                >
                    Read Book
                </button>
            </div>
        </div>
    );
}
type DeleteDialogProps = {
    hovered: boolean;
    book: Book;
    deleteBook: (bookId: string) => void;
};

export function DeleteDialog({ hovered, book, deleteBook }: DeleteDialogProps) {
    const closeRefButton = useRef(null);
    const handleBookDelete = () => {
        deleteBook(book._id);
        if (closeRefButton.current) {
            closeRefButton.current?.click();
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className={`mr-2 text-gray-400 text-2xl p-1 transition-opacity duration-200 ${
                        hovered ? "opacity-100" : "opacity-0"
                    } hover:text-red-500`}
                >
                    <RxCross2 />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-800 text-gray-100 shadow-xl rounded-lg max-w-md mx-auto p-6">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        <span className="text-red-500">Delete</span> "
                        {book.title}"?
                    </DialogTitle>
                    <DialogDescription className="mt-4 text-sm text-gray-300">
                        Are you sure you want to{" "}
                        <span className="text-red-500">delete</span> this book?
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex justify-end space-x-3">
                    <DialogClose asChild ref={closeRefButton}>
                        <Button className="px-4 py-2 text-gray-300 bg-gray-700  rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleBookDelete}
                        className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
