import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import axios from "../../api/axios";
import { DropDown, DropdownProvider } from '../../components/DropDown';
import { Icon } from '@iconify/react';
import carbonSortAscending from '@iconify/icons-carbon/sort-ascending';
import carbonSortDescending from '@iconify/icons-carbon/sort-descending';
import SearchPagination from "../../components/SearchPagination";
import to_url_params from "../../api/urls"

function create_url_params(searchParams: any) {

  var temp = {
    breed: searchParams.get("breed") ?? [],
    gender: searchParams.get("gender") ?? [],
    status: searchParams.get("status") ?? "available",
    shelter: searchParams.get("shelter") ?? [],
    page: searchParams.get("page") ?? 1
  }

  if (temp['breed'] == "All") {
    temp["breed"] = []
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
  const gender = ["All", "Male", "Female"];
  const status = ["All", "Available", "Pending", "Adopted"];
  const breed = ["All","Cat", "Dog"]
  const [shelter, setShelter] = useState<string[]>([]);
  const [pets, setPets] = useState<PetType[]>();
  // const dropdownRef = useRef(null);


  const query = useMemo(
    () => create_url_params(searchParams),
    [searchParams]);


  const fetchPets = async () => {
    setIsLoading(true);

    try {
      const params = to_url_params(query, true);
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

  useEffect(() => {
    axios.get('/accounts/shelter/')
      .then(response => {
        const shelterNames = response.data.results.map((shelter: { shelter_name: string }) => shelter.shelter_name);
        setShelter(shelterNames);
        console.log(shelter);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
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
    <div className="page-scroll-container bg-bg-primary" >
      <header></header>
      <main>
        <div className="flex">
          <DropdownProvider>
            <div className="w-1/4 p-5 text-center">
              {/* <div className="sticky top-1/3 transform -translate-y-1/3"> */}
              {/* <div className="sticky top-1/2 transform -translate-y-1/2 self-center"> */}
                  {/* Sort container */}

                <h1 className="mb-2 mt-2 text-2xl">Sort</h1>
                <div className=" flex justify-center text-fg-primary items-center space-x-2 px-4 ">
                  <select onChange={(e) => setSortField(e.target.value)} value={sortField} className="p-2 text-fg-primary rounded-md font-medium text-fg-primary ring-1 ring-inset ring-fg-dimmed bg-bg-accent focus:z-20 focus:outline-offset-0">
                    <option key="sort-0" value="none">None</option>
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
            

              {/* Filter section */}
                <h1 className="mb-2 mt-4 text-2xl">Filter</h1>
                <DropDown
                    data={shelter}
                    category="shelter"
                    enableSearch={true}
                    value={searchParams.get("shelter") ?? "All"}
                    onChange={(value) => handleFilterChange("shelter", value)}
                  />
                <DropDown
                  data={breed}
                  category="breed"
                  enableSearch={false}
                  value={searchParams.get("breed") ?? "All"}
                  onChange={(value) => handleFilterChange("breed", value)}
                />
                <DropDown
                  data={status}
                  category="status"
                  enableSearch={false}
                  value={searchParams.get("status") ?? "Available"}
                  onChange={(value) => handleFilterChange("status", value)}
                />
                <DropDown
                  data={gender}
                  category="gender"
                  enableSearch={false}
                  value={searchParams.get("gender") ?? "All"}
                  onChange={(value) => handleFilterChange("gender", value)}
                />

              
             {/* </div> */}
            </div>
          </DropdownProvider>
          <div className="w-3/4 p-4 mr-4">
            {/* Search and sort section */}
            <div className="flex justify-between items-center">

            
            </div>


            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 my-4 mr-4">
              {pets?.map(pet => (
                <Link to={`/pet_listings/${pet.id}`} className="mx-auto flex w-65 flex-col justify-center bg-white rounded-2xl shadow-xl shadow-box-shadow">
                  <img className="aspect-video w-100 rounded-t-2xl object-cover object-center" src={pet.avatar ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637"} />
                  <div className="p-4">
                    
                    <h1 className="text-2xl font-medium text-fg-accent pb-2">{pet.name}</h1>
                    <small>{pet.age}-year-old {pet.gender} {pet.breed}</small> <br/>
                    <small className="capitalize">{pet.status}</small>
                  </div>
                </Link>
              ))}
            </div>

    
            <SearchPagination 
              page={searchParams.get("page") ? Number(searchParams.get("page")) : 1 } 
              pageSize={searchParams.get("page_size") ? Number(searchParams.get("page_size")) : 8} 
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