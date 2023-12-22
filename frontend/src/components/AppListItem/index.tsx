import { ajax } from 'ajax';
import {useState, useEffect} from 'react';
import {Link} from "react-router-dom";

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

const AppListItem = ({app}:{app:App}) => {
    const [error, setError] = useState("");
    const [pet, setPet] = useState(app.pet_listing);
    const [seeker, setSeeker] = useState({});

    return (
        <Link to={`/applications/${app.id}/`}>
        <div key={app.id} className="app-list-item flex flex-col bg-slate-50 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
            <h3 className="text-lg font-bold mb-2">{`Application #${app.id}`}</h3>
            <p>Status: {app.status}</p>
            <p>Applicant: {app.applicant.first_name +" " + app.applicant.last_name}</p>
            <p>Pet: {pet.name}</p>
            <p>Creation Time: {(new Date(app.creation_time).toLocaleString()) }</p>
            <p>Last Update Time: {(new Date(app.last_update_time).toLocaleString())}</p>
            <p>Personal Statement: {app.personal_statement}</p>
            <p>{error}</p>
        </div>
        </Link>
    );
};

export default AppListItem;