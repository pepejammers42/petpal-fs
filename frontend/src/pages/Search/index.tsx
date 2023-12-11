import React, { useState, useEffect, useMemo, useRef } from 'react';
import FilterDropdown from 'components/FilterDropdown';
import PetDatabase from 'components/PetDatabase';
import { useSearchParams } from "react-router-dom";
import axios from "../../api/axios";
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";

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

function create_url_params(searchParams: any) {
  var temp = {
    size: searchParams.get("size") ?? [],
    gender: searchParams.get("gender") ?? [],
    status: searchParams.get("status") ?? "available",
    shelter: searchParams.get("shelter") ?? [],
  }

  if (temp['size'] == "All") {
    temp["size"] = []
  }

  if (temp['gender'] == "All") {
    temp["gender"] = []
  }

  if (temp['status'] == "All") {
    temp["status"] = []
  }

  if (temp['shelter'] == "All") {
    temp["shelter"] = []
  }

  return temp
}

type PetType = {
  id: number,
  name: number,
  size: string,
  status: string,
  gender: string,
};

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const size = ["All", "Small", "Medium", "Large"];
  const gender = ["All", "Male", "Female"];
  const status = ["Available", "Pending", "Adopted"];
  const shelter = ["Shelter 1", "Shelter 2", "Shelter 3"];
  const [pets, setPets] = useState<PetType[]>();
  const dropdownRef = useRef(null);


  const query = useMemo(() => create_url_params(searchParams), [searchParams]);


  const fetchPets = async () => {
    // Toggle isLoading to true
    setIsLoading(true);

    try {
      const params = to_url_params(query);
      const response = await axios.get(`/pet_listings/?${params}`);
      console.log(response)

      setPets(response.data.results)
    } catch (err) {
      setError("Failed to fetch pets.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [query]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Callback function to handle filter changes
  // This will need to be updated to handle individual filters for each category
  const handleFilterChange = (filterCategory: string, value: string) => {
    setSearchParams((prevParams) => {
      prevParams.set(filterCategory, value);
      return prevParams;
    });
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


            Gender:
            <DropdownList
              data={gender}
              ref={dropdownRef}
              value={searchParams.get("gender") ?? "All"}
              onChange={value => handleFilterChange('gender', value)}
            />


            Size:
            <DropdownList
              data={size}
              ref={dropdownRef}
              value={searchParams.get("size") ?? "All"}
              onChange={value => handleFilterChange('size', value)}
            />
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
            {/* {pets?.status} {pets?.gender} */}
            {/* {pets} */}
            {pets?.map(pet => (
              <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{pet.name}</div>
                  <p className="text-gray-700 text-base">
                    {pet.size} <br/>
                    {pet.gender}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </main>
      <footer></footer>
    </div>
  );
};

export default Search;