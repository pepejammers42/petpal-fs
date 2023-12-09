import React, { useState , useEffect, useMemo } from 'react';
import FilterDropdown from 'components/FilterDropdown';
import PetDatabase from 'components/PetDatabase';
import { useSearchParams } from "react-router-dom";
import axios from "../../api/axios";


function to_url_params(object: { [x: string]: any; size?: string | never[]; gender?: string | never[]; status?: string; shelter?: string | never[]; }) {
  var result = [];
  for (const key in object) {
      if (Array.isArray(object[key])) {
          for (const value of object[key]) {
              result.push(`${key}[]=${value.toLowerCase()}`);
          }
      }
      else {
          let value = object[key];
          result.push(`${key}=${value.toLowerCase()}`);
      }
  }
  return result.join('&');
}

const Search: React.FC = () => {
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [searchInput, setSearchInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const size = ["Small", "Medium", "Large"];
  const gender = ["Male","Female"];
  const status = ["Available", "Pending", "Adopted"];
  const shelter = ["Shelter 1", "Shelter 2", "Shelter 3"];
  const [ pets, setPets ] = useState([]);

    const query = useMemo(() => ({
        size : searchParams.get("size") ?? [],
        gender : searchParams.get("gender") ?? [],
        status : searchParams.get("status") ?? "available",
        shelter : searchParams.get("shelter") ?? [],
    }), [searchParams]);
    
     useEffect(() => {
      const fetchPets = async() => {
        try{
        const params = to_url_params(query);
        const response = await axios.get(`/pet_listings/?${params}`);
        setPets(response.data);
        }catch(err){
          setError("Failed to fetch pets.");
          console.error(err);
        }finally {
          setIsLoading(false);
        }
      };
      fetchPets();
    }, [ query ]);

    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }

  // Callback function to handle filter changes
  // This will need to be updated to handle individual filters for each category
  const handleFilterChange = (filterCategory: string, filter: string) => {
    setSearchParams(prevFilters => ({ ...prevFilters, [filterCategory]: filter }));
};


  return (
    <div className="page-scroll-container">
      <header></header>
      <main>
        <div className="flex">
          <div className="w-1/4 p-5">
            {/* Each FilterDropdown now calls handleFilterChange with a specific category */}
            {/* {/* <FilterDropdown title="Breed" options={BREED} onFilterChange={(filters) => handleFilterChange('breed', filters)} dropdownId="breed-dd" enableSearch={false} /> */}
    
            {/* <FilterDropdown title="Status" options={status} dropdownId="status-dd" enableSearch={false} onFilterChange={(filters) => handleFilterChange('status', filters)} /> 
            <FilterDropdown title="Gender" options={gender} onFilterChange={(filters) => handleFilterChange('gender', filters)} dropdownId="gender-dd" enableSearch={false} /> */}
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
           {pets}
          </div>
        </div>
      </main>
      <footer></footer>
    </div>
  );
};

export default Search;
