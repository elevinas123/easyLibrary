import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { BookType } from "./api/book/schema/book.schema";

type BookInfoPageProps = {
    infoOpen: boolean;
    selectedBook: BookType | null;
    setInfoOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function BookInfoPage({
    infoOpen,
    selectedBook,
    setInfoOpen,
}: BookInfoPageProps) {
    return (
        <aside
            className={` transform transition-all duration-300 ease-in-out bg-card text-card-foreground border-l ${
                infoOpen ? "w-64 translate-x-0" : "w-16 translate-x-0"
            }`}
        >
            <div className="px-4 py-2 h-full flex flex-col">
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-full "
                    onClick={() => setInfoOpen(!infoOpen)}
                >
                    {infoOpen ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
                {infoOpen ? (
                    selectedBook ? (
                        <>
                            <h2 className="text-2xl font-bold mb-4">
                                {selectedBook.title}
                            </h2>
                            <img
                                src={selectedBook.imageUrl}
                                alt={selectedBook.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <p className="mb-2">
                                <strong>Author:</strong> {selectedBook.author}
                            </p>
                            <p className="mb-2">
                                <strong>Genre:</strong> {selectedBook.genre}
                            </p>
                            <p className="mb-4">
                                <strong>Added:</strong> {selectedBook.dateAdded}
                            </p>
                            <Button className="w-full mt-auto">
                                <BookOpen className="mr-2 h-4 w-4" /> Start
                                Reading
                            </Button>
                        </>
                    ) : (
                        <p>Select a book to view details</p>
                    )
                ) : (
                    <div className="flex flex-col items-center space-y-4"></div>
                )}
            </div>
        </aside>
    );
}
