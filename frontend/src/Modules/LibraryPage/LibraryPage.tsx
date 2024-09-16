import BookCards from "./BookCards";
import Sidebar from "./Sidebar";


type LibraryPageProps = {
    // Define your prop types here
};

export default function LibraryPage({  }: LibraryPageProps) {
    return (
        <div className="bg-zinc-800 flex flex-row">
            <Sidebar />
            <BookCards />
        </div>
    );
}