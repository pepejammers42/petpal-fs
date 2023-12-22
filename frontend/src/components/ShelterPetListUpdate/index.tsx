import { useState, useEffect, useMemo } from "react";
import axios from "../../api/axios";
import { useSearchParams } from "react-router-dom";
import { ajax } from '../../ajax' ;

type PetType = {
    id: number,
    name: number,
    status: string,
    gender: string,
    breed: string,
    avatar: string | null, // URL or path to the image
    age: number,
  };

const ShelterPetListUpdate = ({sname}:{sname:string}) => {
    const [shelterName, setShelterName] = useState("");
    const [error1, setError1] = useState("");
    const [error2, setError2] = useState("");
    const [pets, setPets] = useState<PetType[]>();
    const [count, setCount] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortField, setSortField] = useState<string>('');
    const [sortOrder, setSortOrder] = useState('asc');

    const query = useMemo(() => ({
        page: parseInt(searchParams.get('page') || '1', 10),
        status: searchParams.get('status') || '',
    }), [searchParams]);


    useEffect(() => {
        const {page, status} = query;
        console.log(sname);
        //ajax(`/applications/?page=${page}&status=${status}&sort_by=${sort_by}`, {method: "GET"})
        ajax(`/pet_listings/?shelter=${sname}&page=${page}&status=${status}`, {method: "GET"})
        .then(response => {
            if (response.ok){
                return response.json();
            }
            else{
                throw Error(response.statusText);
            }
        })
        .then(json => {setPets(json.results); setCount(json.count);})
        .catch(error => setError2(error.toString()));
    }, [query, sname]);

    const handlePageChange = (newPage: number) => {
        setSearchParams({status: query.status, page: newPage.toString()});
    };

    return (
        <>
            <div className="mx-auto max-w-5xl pt-16">
                <h1 className="text-3xl font-bold pb-4">List of pets</h1>
                <div className='status-filter flex flex-row gap-2'>
                    <p>Filter by status: </p>
                    <select
                       value={query.status}
                       onChange={(e) => {
                          setSearchParams({ page: "1", status: e.target.value});
                       }}
                    >
                       <option value="">All</option>
                       <option value="available">Available</option>
                       <option value="pending">Pending</option>
                       <option value="adopted">Adopted</option>
                       <option value="withdrawn">Withdrawn</option>
                    </select>
                </div>
                <div >
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 my-4 mr-4 ">
                    {pets?.map(pet => (
                      <a href={`/pet_listings/${pet.id}`} key={"pet" + pet.id} className="mx-auto flex w-65 flex-col justify-center bg-white rounded-2xl shadow-xl shadow-box-shadow">
                        <img className="aspect-video w-100 rounded-t-2xl object-cover object-center" src={pet.avatar ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637"} />
                        <div className="p-4">

                          <h1 className="text-2xl font-medium text-fg-accent pb-2">{pet.name}</h1>
                          <small className="text-s">{pet.age}-year-old {pet.gender} {pet.breed}</small>
                        </div>
                      </a>
                    ))}
                    <a href={`/pet_listings/`} className="flex h-52 w-65 justify-center bg-white rounded-2xl shadow-xl shadow-box-shadow align-middle relative">
                    <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="100"
                                                height="100"
                                                fill="grey"
                                                className="absolute right-16 top-12"
                                                viewBox="0 0 16 16">
                                                <path
                                                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                            </svg>
                      </a>
                    </div>
                    <div className='pt-8 flex justify-center'>
                            {query.page===1? <button className="mt-4 bg-gray-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page - 1)} disabled={true}>Prev</button> :<button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page - 1)} disabled={query.page === 1}>Prev</button>}
                            <span className='px-4 mt-6'> Page {query.page} </span>
                            {(query.page >= (count / 8) )?<button className="mt-4 bg-gray-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page - 1)} disabled={true}>Next</button>:<button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page + 1)}>Next</button>}
                    </div>
                </div>
            </div>
        </>
    )

}

export default ShelterPetListUpdate;