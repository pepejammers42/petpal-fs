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
    const [pet, setPet] = useState({name: ""});
    const [seeker, setSeeker] = useState({});

    return (
        <div key={app.id} className="app-list-item bg-gray-200 p-4 mb-4 rounded">
            <h3 className="text-lg font-bold mb-2">{`Application #${app.id}`}</h3>
            <p>Status: {app.status}</p>
            <p>Applicant: {app.applicant.first_name +" " + app.applicant.last_name}</p>
            <Link to={`/pet_listings/${app.pet_listing}`}><p>Pet: {pet.name}</p></Link>
            <p>Creation Time: {app.creation_time}</p>
            <p>Last Update Time: {app.last_update_time}</p>
            <p>Personal Statement: {app.personal_statement}</p>
            <p>{error}</p>
        </div>
    );
};

export default AppListItem;