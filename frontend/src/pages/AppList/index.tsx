import { useNavigate, useSearchParams } from 'react-router-dom';
import { ajax, ajax_or_login } from '../../ajax' ;
import { useEffect, useMemo, useState } from 'react';
import AppListItem from 'components/AppListItem';

interface App {
    id: number;
    pet_listing: 
      {
        "id": number,
        "shelter": number,
        "name": string,
        "description": string,
        "status": string,
        "breed": string,
        "age": number,
        "size": string,
        "color": string,
        "gender": string,
        "avatar": string,
        "medical_history": string,
        "behavior": string,
        "special_needs": string
    };
    applicant: {
      "id": number,
      "email": string,
      "password": string,
      "first_name": string,
      "last_name": string,
      "avatar": string,
      "phone_number": string,
      "location": string,
      "preference": string
    };
    status: string;
    creation_time: string;
    last_update_time: string;
    personal_statement: string;
}

function AppList(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState<string>("");
    const [apps, setApps] = useState<App[]>([]);
    const navigate = useNavigate();
    const [count, setCount] = useState(0);

    const query = useMemo(() => ({
        page: parseInt(searchParams.get('page') || '1', 10),
        status: searchParams.get('status') || '',
        sort_by: searchParams.get('sort_by') || ''
    }), [searchParams]);

    useEffect(() => {
        const {page, status, sort_by} = query;
        console.log(page);
        console.log(status);
        console.log(sort_by);
        //ajax(`/applications/?page=${page}&status=${status}&sort_by=${sort_by}`, {method: "GET"})
        ajax(`/applications/?page=${page}&status=${status}&sort_by=${sort_by}`, {method: "GET"})
        .then(response => {
            if (response.ok){
                return response.json();
            }
            else{
                throw Error(response.statusText);
            }
        })
        .then(json => {setApps(json.results); setCount(json.count);})
        .catch(error => setError(error.toString()));
    }, [query, navigate]);

    const handlePageChange = (newPage: number) => {
        setSearchParams({status: query.status, sort_by: query.sort_by, page: newPage.toString()});
    };

    return <>
        <div className='pt-16 pb-16 '>
            <h1 className='text-center text-3xl font-bold pb-4'>Application List</h1>

            <div className='mx-auto lg:p-4 sm:p-2 flex flex-row justify-center gap-8 text-lg'>
                <div className='status-filter flex flex-row gap-2'>
                    <p>Filter by status: </p>
                    <select
                       value={query.status}
                       onChange={(e) => {
                          setSearchParams({ page: "1", status: e.target.value, sort_by: query.sort_by});
                       }}
                    >
                       <option value="">All</option>
                       <option value="pending">Pending</option>
                       <option value="accepted">Accepted</option>
                       <option value="denied">Denied</option>
                       <option value="withdrawn">Withdrawn</option>
                    </select>
                </div>

                <div className='sort-time flex flex-row gap-2'>
                    <p>Sort: </p>
                    <select
                       value={query.sort_by}
                       onChange={(e) => {
                          setSearchParams({ page: "1", status: query.status, sort_by: e.target.value});
                       }}
                    >
                       <option value=""></option>
                       <option value="creation_time">Creation time</option>
                       <option value="last_update_time">Last update time</option>
                    </select>
                </div>


            </div>
            <div className="app-list container mx-auto lg:p-4 sm:p-2 flex flex-col items-center justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {apps.map(app => (
                        <AppListItem key={app.id} app={app} />
                    ))}

                </div>
                <p>{error}</p>

                <div className='pt-8'>
                    {query.page===1? <button className="mt-4 bg-gray-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page - 1)} disabled={true}>Prev</button> :<button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page - 1)} disabled={query.page === 1}>Prev</button>}
                    <span className='px-4'> Page {query.page} </span>
                    {(query.page >= (count / 6) )?<button className="mt-4 bg-gray-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page - 1)} disabled={true}>Next</button>:<button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={() => handlePageChange(query.page + 1)}>Next</button>}
                </div>
                
            </div>
        
        </div>
    </>

}

export default AppList;