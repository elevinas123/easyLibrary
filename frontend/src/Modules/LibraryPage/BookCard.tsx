import { BookOpen, Heart, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom"; // If you're using React Router v6
import { Button } from "../../components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "../../components/ui/card";
import {
    DialogClose,
    DialogDescription,
    DialogTitle,
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
    const navigate = useNavigate();

    const handleGoToBook = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/book?id=${book._id}`);
    };

    return (
        <Card key={book._id} className="flex flex-col">
            <CardHeader className="relative p-0">
                <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-96 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                    <Button
                        variant="secondary"
                        size="icon"
                        className={`rounded-full ${
                            isLiked ? "hover:bg-red-300 bg-red-400" : ""
                        }`}
                        onClick={() => setIsLiked((liked) => !liked)}
                    >
                        <Heart className={`h-4 w-4`} />
                        <span className="sr-only">Like</span>
                    </Button>

                    <DeleteDialog
                        hovered={true}
                        book={book}
                        deleteBook={deleteBook}
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-4">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <p className="text-sm text-muted-foreground">
                    Added: {book.dateAdded}
                </p>
                <p className="text-sm text-muted-foreground">
                    Genre: {book.genre}
                </p>
            </CardContent>
            <CardFooter className="p-4">
                <Button className="w-full" onClick={(e) => handleGoToBook(e)}>
                    <BookOpen className="mr-2 h-4 w-4" /> Read Book
                </Button>
                <Button className="bg-blue-500 ml-2" onClick={() => selectBook(book._id)}>Info</Button>
            </CardFooter>
        </Card>
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
