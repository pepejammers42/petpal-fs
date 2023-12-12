import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "../../api/axios";
import { DropDown, DropdownProvider } from 'components/DropDown';

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
  avatar: string | null, // URL or path to the image
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
  // const dropdownRef = useRef(null);


  const query = useMemo(
    () => create_url_params(searchParams),
    [searchParams]);


  const fetchPets = async () => {
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
  const handleFilterChange = (filterCategory: string, value: string) => {
    setSearchParams((prevParams) => {
      prevParams.set(filterCategory, value);
      return prevParams;
    });
  };


  return (
    <div className="page-scroll-container" >
      <header></header>
      <main>
        <div className="flex">
        <DropdownProvider>
          <div className="w-1/4 p-5">
        
            {/* Filter section */}
            
            <div className="mb-4">
            <DropDown
              data={size}
              category="size"
              enableSearch={true}
              value={searchParams.get("size") ?? "All"}
              onChange={(value) => handleFilterChange("size", value)}
            />
            </div>
            <div className="mb-4">
            <DropDown
              data={status}
              category="status"
              enableSearch={true}
              value={searchParams.get("status") ?? "All"}
              onChange={(value) => handleFilterChange("status", value)}
            />
            </div>
            <div className="mb-4">
            <DropDown
              data={gender}
              category="gender"
              enableSearch={true}
              value={searchParams.get("gender") ?? "All"}
              onChange={(value) => handleFilterChange("gender", value)}
            />
            </div>
          </div>
          </DropdownProvider>
          <div className="w-3/4 p-4">
            {/* Search and sort section */}
            <div>
              
              <form>   
                  <label id="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                  <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                          </svg>
                      </div>
                      <input
                        type="search"
                        id="search"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search by pet descriptions..."
                        required
                        // value={searchTerm}
                        // onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
              </form>

              {/* Sort container */}
              {/* ... */}
            </div>
            <div className="flex flex-wrap -mx-4 mb-4">
              <div className="md:w-1/4">
              {pets?.map(pet => (
                <div className="max-w-sm rounded overflow-hidden shadow-lg">
                  <div className="px-6 py-4">
                    {pet.avatar && <img src={"pet.avatar"}/>}
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
          </div>
        </div>
      </main>
      <footer></footer>
    </div>
  );
};

export default Search;