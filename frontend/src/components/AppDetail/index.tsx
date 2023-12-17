import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ajax } from '../../ajax';

interface AppDetailProps {
  onUpdateStatus: (newStatus: string) => void;
  appId: number;
}

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

const AppDetail: React.FC<AppDetailProps> = ({ appId, onUpdateStatus }) => {
    /*const [app, setApp] = useState<App>({
        id: 0,
        pet_listing: 0,
        applicant: 0,
        status: "",
        creation_time: "",
        last_update_time: "",
        personal_statement: ""
    });*/
    const [app, setApp] = useState<App>({
      id: 0,
      pet_listing: {"id": 0,
      "shelter": 0,
      "name": "",
      "description": "",
      "status": "",
      "breed": "",
      "age": 0,
      "size": "",
      "color": "",
      "gender": "",
      "avatar": "",
      "medical_history": "",
      "behavior": "",
      "special_needs": ""},
      applicant: {
      "id": 0,
      "email": "",
      "password": "",
      "first_name": "",
      "last_name": "",
      "avatar": "",
      "phone_number": "",
      "location": "",
      "preference": ""},
      status: "",
      creation_time: "",
      last_update_time: "",
      personal_statement: ""

    });
    const [newStatus, setNewStatus] = useState<string>(app?.status || '');
    /*const [pet, setPet] = useState({
      "id": 0,
      "shelter": 0,
      "name": "",
      "description": "",
      "status": "",
      "breed": "",
      "age": 0,
      "size": "",
      "color": "",
      "gender": "",
      "avatar": "",
      "medical_history": "",
      "behavior": "",
      "special_needs": ""
    });
    const [applicant, setApplicant] = useState({
      "id": 0,
      "email": "",
      "password": "",
      "first_name": "",
      "last_name": "",
      "avatar": "",
      "phone_number": "",
      "location": "",
      "preference": ""
    });
    */
    const [error, setError] = useState("");
  
    useEffect(() => {
      ajax(`/applications/${appId}/`, { method: 'GET' })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error(response.statusText);
          }
        })
        .then((json: App) => {
          setApp(json);
          setNewStatus(json.status);
          //setPet(app.pet_listing);
          //setApplicant(app.applicant);
        })
        .catch(error => console.error('Error fetching application details:', error));
    }, [appId]);
  
    const handleStatusUpdate = () => {
      // Perform the PUT request to update the status
      ajax(`/applications/${appId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
        .then(response => {
          if (response.ok) {
            onUpdateStatus(newStatus);//?
            //setNewStatus(newStatus);
            setApp({...app, status: newStatus });
          } else {
            throw Error(response.statusText);
          }
        })
        .catch(error => console.error('Error updating application status:', error));
    };
    
    return (
        <div className="container mx-auto mt-8">
          
          <p>Status: {app.status}</p>
          <Link to={`/pet_listings/${app.pet_listing.id}`}><p>Pet: {app.pet_listing.name}</p></Link>
          <p>Applicant: {app.applicant.first_name + " " + app.applicant.last_name}</p>
          <p>Creation Time: {app.creation_time}</p>
          <p>Last Update Time: {app.last_update_time}</p>
          <p>Personal Statement: {app.personal_statement}</p>
    
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">New Status:</label>
            <input
              type="text"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
    
          <button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={handleStatusUpdate}>
            Update Status
          </button>
        </div>
    );
};
    
export default AppDetail;