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

function ShelterAppList(){
    const [searchParams, _setSearchParams] = useSearchParams();
    const [error, setError] = useState<string>("");
    const [apps, setApps] = useState<App[]>([]);
    const navigate = useNavigate();

    const query = useMemo(() => ({
        page: parseInt(searchParams.get('page') || '1', 10),
        status: searchParams.get('status') || '',
        sort_by: searchParams.get('sort_by') || ''
    }), [searchParams]);

    useEffect(() => {
        const {page, status, sort_by} = query;
        ajax_or_login(`/applications/?page=${page}&status=${status}&sort_by=${sort_by}`, {method: "GET"}, navigate)
        .then(response => {
            if (response.ok){
                return response.json();
            }
            else{
                throw Error(response.statusText);
            }
        })
        .then(json => setApps(json.results))
        .catch(error => setError("Error fetching application list: "+ error.toString()));
    }, [query, navigate]);

    return <>
        <div>
            <h1>Shelter Application List</h1>
        <div className="app-list container mx-auto mt-8">
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {apps.map(app => (
                    <AppListItem key={app.id} app={app} />
                ))}
            </div>
            <p>{error}</p>
        </div>
        </div>
    </>

}

export default ShelterAppList;