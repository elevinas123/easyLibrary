import { Book } from "./LibraryPage";
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
    // Generate actual book cards if bookData is available
    const bookCards = bookData?.map((book, index) => (
        <BookCard
            book={book}
            key={index}
            deleteBook={deleteBook}
            selectBook={selectBook}
        />
    ));

    // Generate skeletons for loading state
    const bookSkeletons = booksLoading.map((_, index) => (
        <BookCardSkeleton key={`skeleton-${index}`} />
    ));

    return (
        <div className="bg-zinc-800 min-h-screen p-8">
            <h1 className="text-3xl font-bold text-gray-100 mb-8">Library</h1>
            <div className="flex flex-wrap justify-center">
                {/* Render skeletons first if loading */}

                {/* Render book cards if available */}
                {bookCards && bookCards.length > 0
                    ? bookCards
                    : booksLoading.length === 0 && (
                          <p className="text-gray-400">No books available.</p>
                      )}
                {bookSkeletons}
            </div>
        </div>
    );
}
