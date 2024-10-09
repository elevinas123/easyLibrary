import { Book } from "../../endPointTypes/types";
import BookCard from "./BookCard";
import BookCardSkeleton from "./BookCardSkeleton";

type BookCardsProps = {
    bookData: Book[] | undefined;
    booksLoading: string[];
    deleteBook: (bookId: string) => Promise<void>;
    selectBook: (bookId: string) => void;
};

export default function BookCards({
    bookData,
    booksLoading,
    deleteBook,
    selectBook,
}: BookCardsProps) {
    const bookCards = bookData?.map((book) => (
        <BookCard
            book={book}
            key={book._id}
            deleteBook={deleteBook}
            selectBook={selectBook}
        />
    ));

    const bookSkeletons = booksLoading.map((_, index) => (
        <BookCardSkeleton key={`skeleton-${index}`} />
    ));

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Your Library</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bookCards}
                {bookSkeletons}
                {bookData?.length === 0 && booksLoading.length === 0 && (
                    <p className="col-span-full text-center text-gray-400 text-lg">
                        No books available. Start by adding some books to your
                        library!
                    </p>
                )}
            </div>
        </div>
    );
}
