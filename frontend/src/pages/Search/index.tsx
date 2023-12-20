import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "../../api/axios";
import { DropDown, DropdownProvider } from 'components/DropDown';
import { Icon } from '@iconify/react';
import carbonSortAscending from '@iconify/icons-carbon/sort-ascending';
import carbonSortDescending from '@iconify/icons-carbon/sort-descending';
import SearchPagination from "../../components/SearchPagination";

function to_url_params(object: { [x: string]: any; size?: string | never[]; gender?: string | never[]; status?: string; shelter?: string | never[]; }) {
  var result = [];
  for (const key in object) {
    if (Array.isArray(object[key])) {
      for (const value of object[key]) {
        result.push(`${key}[]=${value.toString().toLowerCase()}`);
      }
    }
    else {
      let value = object[key];
      result.push(`${key}=${value.toString().toLowerCase()}`);
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
    page: searchParams.get("page") ?? 1
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
  breed: string,
  avatar: string | null, // URL or path to the image
  age: number,
};

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [maxCount, setMaxCount] = useState(0);
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
      let sortParam = '';
      if (sortField && sortField !== 'none') {
        sortParam = `${sortOrder === 'asc' ? '' : '-'}${sortField}`;
      }
      const response = await axios.get(`/pet_listings/?${params}${sortParam ? `&sort_by=${sortParam}` : ''}`);
      console.log(response)

      setPets(response.data.results)
      setMaxCount(response.data.count)
    } catch (err) {
      setError("Failed to fetch pets.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [query, sortField, sortOrder]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };
  const handleSortSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedField = event.target.value;
    setSortField(selectedField);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    fetchPets(); // Refetch pets with new sort order
  };

  const handleFilterChange = (filterCategory: string, value: string) => {
    setSearchParams((prevParams) => {
      prevParams.set(filterCategory, value);
      return prevParams;
    });

    // If the filterCategory isn't page, set page back to 1
    if (filterCategory !== "page") {
      setSearchParams((prevParams) => {
        prevParams.set("page", "1");
        return prevParams;
      });
    }
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
            <div className="flex justify-between items-center">

              <form className="flex-grow pr-2">
                <label id="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="search"
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="What kind of pet you are looking for? Try 'cat' or 'dog'"
                    required
                  // value={searchTerm}
                  // onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>

              {/* Sort container */}

              <div className="flex justify-end text-fg-primary items-center space-x-2 px-4">
                <select onChange={(e) => setSortField(e.target.value)} value={sortField}>
                  <option key="sort-0" value="none">No Sort</option>
                  <option key="sort-1" value="name">Name</option>
                  <option key="sort-2" value="age">Age</option>
                </select>
                {sortField && sortField !== 'none' && (
                  <button onClick={toggleSortOrder}>
                    {/* {sortOrder === 'asc' ? 'Desc' : 'Asc'} */}
                    <Icon icon={sortOrder === 'asc' ? carbonSortAscending : carbonSortDescending} />
                  </button>
                )}
              </div>
            </div>


            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-4 m-4">
              {pets?.map(pet => (
                <div className="mx-auto flex w-65 flex-col justify-center bg-white rounded-2xl shadow-xl shadow-slate-300/60">
                  <img className="aspect-video w-100 rounded-t-2xl object-cover object-center" src="https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                  <div className="p-4">
                    <h1 className="text-2xl font-medium text-slate-600 pb-2">{pet.name}</h1>
                    <small className="capitalize text-s">Breed: {pet.breed}<br />Gender: {pet.gender}<br />Age: {pet.age}</small>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {/* <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mb-16">
              <div className="flex flex-1 justify-between sm:hidden">
                <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing
                    <span className="font-medium"> 1 </span> 
                    to 
                    <span className="font-medium"> 10 </span> 
                    of 
                    <span className="font-medium"> 21 </span> 
                    results 
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">Previous</a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">Next</a>
                  </nav>
                </div>
              </div>
            </div> */}
            <SearchPagination 
              page={searchParams.get("page") ? Number(searchParams.get("page")) : 1 } 
              pageSize={searchParams.get("page_size") ? Number(searchParams.get("page_size")) : 10} 
              maxCount={maxCount}
              onChange={(value) => handleFilterChange("page", value.toString())} />

          </div>
        </div>
      </main>
      <footer></footer>
    </div>
  );
};

export default Search;