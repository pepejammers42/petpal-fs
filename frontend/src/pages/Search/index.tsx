import React, { useState } from 'react';
import FilterDropdown from 'components/FilterDropdown';


const Search: React.FC = () => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const ontario_cities = ["Toronto","Ottawa","Mississauga","Brampton","Hamilton","London","Markham","Vaughan","Kitchener","Windsor"]
    // Callback function to handle filter changes
    const handleFilterChange = (filters: string[]) => {
        setSelectedFilters(filters);
    };
    return (
        <div className="page-scroll-container">
            <header></header>
            <main>
                <div className="flex">
                    <div className="w-1/4 p-5">
                        {/* Repeated for each filter type */}
                        <FilterDropdown title="Age" options={["Baby", "Young", "Adult", "Senior"]} onFilterChange={handleFilterChange} />
                        <FilterDropdown title="Location" options={ontario_cities} onFilterChange={handleFilterChange} />
                        {/* Add other filter dropdowns similarly */}
                    </div>
                    <div className="w-3/4 p-4">
                        {/* Search and sort section */}
                       
                        <div>
                            <input type="text" placeholder="Search..." className="input-search" />
                            {/* Sort container */}
                        </div>
                    </div>

                </div>
            </main>
            <footer></footer>
        </div>
    );
};

export default Search;
