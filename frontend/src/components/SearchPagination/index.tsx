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
        <div className="flex items-center justify-between border-t border-fg-dimmed px-4 py-3 sm:px-6 mb-16">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                <p className="text-sm text-gray-700">
                    Showing
                    <span className="font-medium"> {maxCount > 0 ? getFromCount() : 0} </span>
                    to
                    <span className="font-medium"> {maxCount > 0 ? (getToCount() > getFromCount() ? getToCount() : getFromCount()) : 0} </span>
                    of
                    <span className="font-medium"> {maxCount} </span>
                    results
                </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {page>1 ?  <button className="relative inline-flex rounded-s-lg items-center px-2 py-2 text-sm font-semibold text-fg-primary ring-1 ring-inset ring-fg-dimmed hover:bg-bg-accent focus:z-20 focus:outline-offset-0"
                            onClick={() => handleItemClick("decrement")}
                            >
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 11H9.414l2.293-2.293a.999.999 0 1 0-1.414-1.414L5.586 12l4.707 4.707a.997.997 0 0 0 1.414 0a.999.999 0 0 0 0-1.414L9.414 13H17a1 1 0 0 0 0-2"/></svg>
                            Previous</button>: <></>
                        }
                        {/* disabled={page == 1} */}
                        {getToCount() <maxCount?
                        <button className="relative inline-flex items-center px-2 rounded-e-lg py-2 text-sm font-semibold text-fg-primary ring-1 ring-inset ring-fg-dimmed hover:bg-bg-accent focus:z-20 focus:outline-offset-0"
                            onClick={() => handleItemClick("increment")}
                            // disabled={getToCount() == maxCount}                                                
                        >Next 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13.293 7.293a.999.999 0 0 0 0 1.414L15.586 11H8a1 1 0 0 0 0 2h7.586l-2.293 2.293a.999.999 0 1 0 1.414 1.414L19.414 12l-4.707-4.707a.999.999 0 0 0-1.414 0"/></svg>
                        </button>
                        : <></>
                        }
                    </nav>
                </div>
            </div>
        </div >
    );
};

export default SearchPagination;

