import { useNavigate } from 'react-router-dom';
import { ajax, ajax_or_login } from '../../ajax' ;
import { useEffect, useState } from 'react';
import AppListItem from 'components/AppListItem';

interface App {
    id: number;
    pet_listing: number;
    applicant: number;
    status: string;
    creation_time: string;
    last_update_time: string;
    personal_statement: string;
}

function ShelterAppList(){
    const navigate = useNavigate();
    const [error, setError] = useState<string>("");
    const [apps, setApps] = useState<App[]>([]);

    useEffect(() => {
        //ajax_or_login("/applications/", {method: "GET"}, navigate)
        /*for debugging*/ ajax("/applications/", {method:"GET"})
        .then(response => {
            if (response.ok){
                return response.json();
            }
            else{
                throw Error(response.statusText);
            }
        })
        .then(json => setApps(json))
        .catch(error => setError(error.toString()));
    }, [navigate]);

    return <>
        <div className="app-list container mx-auto mt-8">
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {apps.map(app => (
                    <AppListItem key={app.id} app={app} />
                ))}
            </div>
            <p>{error}</p>
        </div>
    </>

}

export default ShelterAppList;