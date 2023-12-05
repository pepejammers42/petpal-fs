import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ajax } from '../../ajax';

interface AppDetailProps {
  onUpdateStatus: (newStatus: string) => void;
}

interface App {
    id: number;
    pet_listing: number;
    applicant: number;
    status: string;
    creation_time: string;
    last_update_time: string;
    personal_statement: string;
}

const AppDetail: React.FC<AppDetailProps> = ({ onUpdateStatus }) => {
    const { appId } = useParams();
    const [app, setApp] = useState<App>({
        id: 0,
        pet_listing: 0,
        applicant: 0,
        status: "",
        creation_time: "",
        last_update_time: "",
        personal_statement: ""
    });
    const [newStatus, setNewStatus] = useState<string>(app?.status || '');
    const [pet, setPet] = useState({name: ""});
    const [error, setError] = useState("");

    useEffect(()=>{
        ajax(`/pet_listings/${app.pet_listing}`, {method:"GET"})
        .then(response => {
            if(response.ok){
                return response.json();
            }
            else{
                throw Error(response.statusText);
            }
        })
        .then(json => {
            setPet(json);
        })
        .catch(error => {
            setError(error.toString());
        })
    }, [])
  
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
            onUpdateStatus(newStatus);
          } else {
            throw Error(response.statusText);
          }
        })
        .catch(error => console.error('Error updating application status:', error));
    };
    
    return (
        <div className="container mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">{`Application #${app.id} Details`}</h2>
          <p>Status: {app.status}</p>
          <Link to={`/pet_listings/${app.pet_listing}`}><p>Pet: {pet.name}</p></Link>
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