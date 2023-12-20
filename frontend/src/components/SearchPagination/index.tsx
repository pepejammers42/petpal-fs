import React from "react";

type SearchPaginationProps = {
    page: number,
    pageSize: number,
    maxCount: number,
    onChange: (value: number) => void;
};

const SearchPagination: React.FC<SearchPaginationProps> = ({ page, pageSize, maxCount, onChange }) => {

    function getFromCount(){
        return (page - 1) * pageSize + 1
    }

    function getToCount(){
        return Math.min((page) * pageSize, maxCount)
    }

    const handleItemClick = (item: string) => {
        if (item === "increment") {
            onChange(page + 1);
        } else {
            onChange(page - 1);
        }
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mb-16">
            <div className="flex flex-1 justify-between sm:hidden">
                <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing
                        <span className="font-medium"> {getFromCount()} </span>
                        to
                        <span className="font-medium"> {getToCount()} </span>
                        of
                        <span className="font-medium"> {maxCount} </span>
                        results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            onClick={() => handleItemClick("decrement")}
                            disabled={page == 1}
                        >Previous</button>
                        <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            onClick={() => handleItemClick("increment")}
                            disabled={getToCount() == maxCount}
                        >Next</button>
                    </nav>
                </div>
            </div>
        </div >
    );
};

export default SearchPagination;

