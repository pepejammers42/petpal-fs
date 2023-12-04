import React, { useState } from 'react';
import FilterDropdown from 'components/FilterDropdown';
import PetDatabase from 'components/PetDatabase';

const mockPetData = [
    {
      id: 1,
      name: 'Dog Name 1',
      description: 'Some description about the Dog 1',
      imageUrl: 'https://example.com/dog1.jpg',
      shelter: {
        name: 'Pet Shelter 1',
        profilePhotoUrl: 'https://example.com/shelter1.jpg',
      },
    },
    // Add more pet data as needed
  ];
  
  const Search: React.FC = () => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const ontario_cities = ["Toronto","Ottawa","Mississauga","Brampton","Hamilton","London","Markham","Vaughan","Kitchener","Windsor"];
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
              <FilterDropdown title="Age" options={["Baby", "Young", "Adult", "Senior"]} onFilterChange={handleFilterChange} dropdownId="agedd" enableSearch={false} />
              <FilterDropdown title="City" options={ontario_cities} onFilterChange={handleFilterChange} dropdownId="citydd" enableSearch={true} />
              {/* Add other filter dropdowns similarly */}
            </div>
            <div className="w-3/4 p-4">
              {/* Search and sort section */}
              <div>
                <input type="text" placeholder="Search..." className="input-search" />
                {/* Sort container */}
              </div>
  
              {/* Display filtered pet cards */}
              <PetDatabase pets={mockPetData} filters={{}} />
            </div>
          </div>
        </main>
        <footer></footer>
      </div>
    );
  };
  
  export default Search;
  