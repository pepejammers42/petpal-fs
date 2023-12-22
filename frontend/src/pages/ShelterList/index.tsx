import { useNavigate, useSearchParams } from 'react-router-dom';
import { ajax, ajax_or_login, ajax_loggedout } from '../../ajax' ;
import { useEffect, useMemo, useState } from 'react';
import ShelterListItem from '../../components/ShelterListItem'

type ShelterType = {
    "id": number,
    "email": string,
    "shelter_name": string,
    "avatar": string | null,
    "phone_number": string,
    "address": string,
    "description": string
}

const ShelterList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState<string>("");
    const [shelters, setShelters] = useState<ShelterType[]>([]);
    const navigate = useNavigate();
    const [count, setCount] = useState(0);

    const query = useMemo(() => ({
        page: parseInt(searchParams.get('page') || '1', 10)
    }), [searchParams]);

    useEffect(() => {
        const {page} = query;
        console.log(page);
        //ajax(`/applications/?page=${page}&status=${status}&sort_by=${sort_by}`, {method: "GET"})
        ajax_loggedout(`/accounts/shelter/?page=${page}`, {method: "GET"})
        .then(response => {
            if (response.ok){
                return response.json();
            }
            else{
                throw Error(response.statusText);
            }
        })
        .then(json => {setShelters(json.results); setCount(json.count);})
        .catch(error => setError(error.toString()));
    }, [query, navigate]);

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString()});
    };

    return <>
        <div className='pt-16 pb-16 '>
            <h1 className='text-center text-3xl font-bold pb-4'>Shelter List</h1>

            <div className='mx-auto lg:p-4 sm:p-2 flex flex-row justify-center gap-8 text-lg'>
                
            <div className="app-list container mx-auto lg:p-4 sm:p-2 flex flex-col items-center justify-center">
                <div className=" grid grid-cols-1 gap-6">

                    {shelters.map(shelter => (
                        <ShelterListItem key={shelter.id} shelter={shelter} />
                    ))}

                </div>
                <p>{error}</p>

                <div className='pt-8'>
                    {query.page===1? <button className="mt-4 bg-gray-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page - 1)} disabled={true}>Prev</button> :<button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page - 1)} disabled={query.page === 1}>Prev</button>}
                    <span className='px-4'> Page {query.page} </span>
                    {(query.page >= (count / 10) )?<button className="mt-4 bg-gray-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page - 1)} disabled={true}>Next</button>:<button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page + 1)}>Next</button>}
                </div>
                
            </div>
            </div>
        
        </div>
    </>

}

export default ShelterList;