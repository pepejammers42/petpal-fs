import React, { useState } from 'react';
import FilterDropdown from 'components/FilterDropdown';
import PetDatabase from 'components/PetDatabase';

interface Filter {
  breed?: string;
  size?: string;
  gender?: string;
  color?: string;
}

const Search: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<Filter>({});
  const [searchInput, setSearchInput] = useState<string>('');
  const SIZE = ["Small", "Medium", "Large"];
  const GENDER = ["Male","Female"];
  const COLOR = ["Black", "White", "Brown", "Grey", "Yellow", "Orange"];
  const BREED = ["Dog", "Cat"];

  // Callback function to handle filter changes
  // This will need to be updated to handle individual filters for each category
  const handleFilterChange = (filterCategory: string, filters: string[]) => {
    setSelectedFilters(prevFilters => ({ ...prevFilters, [filterCategory]: filters[0] }));
  };

  return (
    <div className="page-scroll-container">
      <header></header>
      <main>
        <div className="flex">
          <div className="w-1/4 p-5">
            {/* Each FilterDropdown now calls handleFilterChange with a specific category */}
            <FilterDropdown title="Breed" options={BREED} onFilterChange={(filters) => handleFilterChange('breed', filters)} dropdownId="breed-dd" enableSearch={false} />
            <FilterDropdown title="Size" options={SIZE} onFilterChange={(filters) => handleFilterChange('size', filters)} dropdownId="size-dd" enableSearch={false} />
            <FilterDropdown title="Gender" options={GENDER} onFilterChange={(filters) => handleFilterChange('gender', filters)} dropdownId="gender-dd" enableSearch={false} />
            <FilterDropdown title="Color" options={COLOR} onFilterChange={(filters) => handleFilterChange('color', filters)} dropdownId="color-dd" enableSearch={false} />
          </div>
          <div className="w-3/4 p-4">
            {/* Search and sort section */}
            <div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="input-search" 
                value={searchInput} 
                onChange={(e) => setSearchInput(e.target.value)} 
              />
              {/* Sort container */}
              {/* ... */}
            </div>
            {/* Render the PetDatabase component, passing in the searchInput and selectedFilters */}
            {/* <PetDatabase searchInput={searchInput} filters={selectedFilters} /> */}
          </div>
        </div>
      </main>
      <footer></footer>
    </div>
  );
};

export default Search;
