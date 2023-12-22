import { ajax } from 'ajax';
import {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import userAvatar from "../../assets/default.png";
import "./style.css"

type ShelterType = {
    "id": number,
    "email": string,
    "shelter_name": string,
    "avatar": string | null,
    "phone_number": string,
    "address": string,
    "description": string
}

const ShelterListItem = ({shelter}:{shelter:ShelterType}) => {
    const [error, setError] = useState("");

    return (
        <Link to={`/shelter-detail/${shelter.id}/`}>
        <div key={"shelter " + shelter.id} className="app-list-item flex flex-col mx-auto max-w-3xl bg-slate-50 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
            <h3 className="text-lg font-bold mb-2">{shelter.shelter_name}</h3>
            
            <div className='flex flex-row gap-8'>
            <div id="circle-container-sli">
                 <img id="profile-pic-sli"  alt="profile icon" src={shelter.avatar || userAvatar}/>
            </div>
            
            <div>
            <p>Address: {shelter.address}</p>
            <p>Description: {shelter.description}</p>
            <p>Email: {shelter.email}</p>
            <p>{error}</p>
            </div>
            </div>
        </div>
        </Link>
    );
};

export default ShelterListItem;