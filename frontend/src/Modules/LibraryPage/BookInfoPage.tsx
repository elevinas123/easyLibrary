import { useState } from "react";
import { Book } from "./LibraryPage";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { DeleteDialog } from "./BookCard";

type BookInfoPageProps = {
    book: Book;
    deleteBook: (bookId: string) => void;
    updateBook: (updatedBook: Book) => void;
};

export default function BookInfoPage({
    book,
    deleteBook,
    updateBook,
}: BookInfoPageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedBook, setEditedBook] = useState<Book>(book);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setEditedBook({ ...editedBook, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateBook(editedBook);
        setIsEditing(false);
    };

    return (
        <aside className="w-80 bg-zinc-900 text-gray-100 p-6 overflow-y-auto">
            {isEditing ? (
                <div>
                    <div className="mb-4">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={editedBook.title}
                            onChange={handleChange}
                            className="bg-zinc-800 text-gray-100 mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="author">Author</Label>
                        <Input
                            id="author"
                            name="author"
                            value={editedBook.author}
                            onChange={handleChange}
                            className="bg-zinc-800 text-gray-100 mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={editedBook.description}
                            onChange={handleChange}
                            className="bg-zinc-800 text-gray-100 mt-1"
                            rows={4}
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setEditedBook(book);
                                setIsEditing(false);
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-gray-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    <img
                        src={book.imageUrl}
                        alt={`${book.title} cover`}
                        className="w-full rounded-lg mb-4"
                    />
                    <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
                    <p className="text-lg text-gray-400 mb-4">
                        by {book.author}
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        {book.description}
                    </p>
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditing(true)}
                            className="bg-gray-700 hover:bg-gray-600 text-gray-200"
                        >
                            Edit
                        </Button>
                        <DeleteDialog
                            book={book}
                            hovered={true}
                            deleteBook={deleteBook}
                        />
                    </div>
                </div>
            )}
        </aside>
    );
}
