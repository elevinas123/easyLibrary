import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "../LibraryPage/Sidebar";

export default function Dashboard() {
    const {toggleCollapse, isCollapsed, setBooksLoading} = useSidebar()
    return (
        <div className="flex h-screen bg-background">
            <Sidebar
                toggleCollapse={toggleCollapse}
                isCollapsed={isCollapsed}
                setBooksLoading={setBooksLoading}
            />
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Dashboard
                    </h1>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        Refresh Data
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Books Uploaded */}
                    <div className="p-6 bg-white shadow-md rounded-lg flex flex-col justify-between">
                        <h2 className="text-lg font-medium text-gray-600">
                            Books Uploaded
                        </h2>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            24
                        </p>
                    </div>

                    {/* Books Read */}
                    <div className="p-6 bg-white shadow-md rounded-lg flex flex-col justify-between">
                        <h2 className="text-lg font-medium text-gray-600">
                            Books Read
                        </h2>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            12
                        </p>
                    </div>

                    {/* Reading Streak */}
                    <div className="p-6 bg-white shadow-md rounded-lg flex flex-col justify-between">
                        <h2 className="text-lg font-medium text-gray-600">
                            Reading Streak
                        </h2>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            5 Days
                        </p>
                    </div>

                    {/* Average Reading Time */}
                    <div className="p-6 bg-white shadow-md rounded-lg flex flex-col justify-between">
                        <h2 className="text-lg font-medium text-gray-600">
                            Avg. Reading Time
                        </h2>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            45 mins
                        </p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-600">
                        Recent Activity
                    </h2>
                    <div className="mt-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-800">
                                Finished reading "Book Title 1"
                            </p>
                            <span className="text-sm text-gray-500">
                                2 days ago
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-800">
                                Uploaded "Book Title 2"
                            </p>
                            <span className="text-sm text-gray-500">
                                4 days ago
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-800">
                                Started reading "Book Title 3"
                            </p>
                            <span className="text-sm text-gray-500">
                                5 days ago
                            </span>
                        </div>
                    </div>
                </div>

                {/* Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-6 h-64">
                        <h2 className="text-lg font-medium text-gray-600">
                            Reading Progress
                        </h2>
                        <div className="mt-4 h-full flex items-center justify-center text-gray-400">
                            {/* Replace with a chart component */}
                            <p>Chart Placeholder</p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6 h-64">
                        <h2 className="text-lg font-medium text-gray-600">
                            Genre Distribution
                        </h2>
                        <div className="mt-4 h-full flex items-center justify-center text-gray-400">
                            {/* Replace with a chart component */}
                            <p>Chart Placeholder</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
