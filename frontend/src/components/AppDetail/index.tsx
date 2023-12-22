import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ajax, ajax_or_login } from '../../ajax';
import { useAuth } from "../../hooks/useAuth";

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
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [updateError, setUpdateError] = useState("");
    const [userInfoError, setUserInfoError] = useState("");
    const [userType, setUserType] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const { user }= useAuth();
  
    useEffect(() => {
      ajax_or_login(`/applications/${appId}/`, { method: 'GET' }, navigate)
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
        .catch(error => setError(error));
    }, [appId]);

    useEffect(() => {
      try {
        let usertype = localStorage.getItem("user");
        if (!usertype){
          return ;
        }
        setUserType(usertype);
      } catch (error) {
        setUserInfoError("failed to get user information: " + error);
      }
    }, [user]);

    const handleEditClick = () => {
      setIsEditing(true);
    };
  
    const handleStatusUpdate = () => {
      // Perform the PUT request to update the status
      ajax_or_login(`/applications/${appId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      }, navigate)
        .then(response => {
          if (response.ok) {
            onUpdateStatus(newStatus);//?
            //setNewStatus(newStatus);
            setApp({...app, status: newStatus });
          } else {
            throw Error(response.statusText);
          }
        })
        .catch(error => setUpdateError(error));
    };
    
    return (
        <div className="container mx-auto max-w-3xl mt-8 p-4 rounded overflow-hidden shadow-lg bg-white">
          
          <Link to={`/pet_listings/${app.pet_listing.id}`}><p className=' text-blue-700 font-bold underline'>Pet: {app.pet_listing.name}</p></Link>
          <p>Applicant: {app.applicant.first_name + " " + app.applicant.last_name}</p>
          <p>Creation Time: {(new Date(app.creation_time)).toLocaleString()}</p>
          <p>Last Update Time: {(new Date(app.last_update_time)).toLocaleString()}</p>
          <p>Personal Statement: {app.personal_statement}</p>
          <p>Status: {app.status}</p>
          <p className='text-red-500'>{error}</p>
          

          {isEditing ? 
          (userType==="seeker"?
          <>
              <br/>
              <p>Pet seeker can only update the status of an appilcation from pending or accepted to withdrawn.</p>
              <label>New Status: </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={!isEditing || (newStatus !== "pending" && newStatus !== "accepted")}
              >
                <option value="withdrawn">withdrawn</option>
              </select>
              
              <br/>
          </>
          :
          <>
          <br/>
          <p>Shelter can only update the status of an application from pending to accepted or denied.</p>
              <label>New Status: </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={!isEditing || (newStatus !== "pending")}
              >
                <option value="accepted">accepted</option>
                <option value="denied">denied</option>
              </select>
              <br/>
          </>
          )
          :
          ''
          }

          {isEditing ? (
              <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleStatusUpdate}>
                Submit
              </button>
            ) : ((userType==="seeker" && (newStatus==="pending" || newStatus==="accepted")) || (userType==="shelter" && newStatus==="pending") ?
              <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleEditClick}>
                Update Status
              </button>
              :
              ''
            )}
    
          <p>{updateError}</p>
        </div>
    );
};
    
export default AppDetail;