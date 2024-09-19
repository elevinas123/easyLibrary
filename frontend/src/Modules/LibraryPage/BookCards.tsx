import { Book } from "./LibraryPage";
import { FiHeart } from "react-icons/fi"; // Icons for liked status
import { useState } from "react";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import BookCard from "./BookCard";

type BookCardsProps = {
    bookData: Book[] | undefined;
};

export default function BookCards({ bookData }: BookCardsProps) {
    const bookCards = bookData?.map((book, index) => {
        return <BookCard book={book} />;
    });

    return (
        <div className="bg-zinc-800 min-h-screen p-8">
            <h1 className="text-3xl font-bold text-gray-100 mb-8">Library</h1>
            <div className="flex flex-wrap justify-center">
                {bookCards && bookCards.length > 0 ? (
                    bookCards
                ) : (
                    <p className="text-gray-400">No books available.</p>
                )}
            </div>
        </div>
    );
}
