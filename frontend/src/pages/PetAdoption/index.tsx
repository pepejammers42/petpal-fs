import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import AppForm from '../../components/AppForm';
import { ajax, ajax_or_login } from '../../ajax';
import { useAuth } from "../../hooks/useAuth";

function PetAdoption(){
    const navigate = useNavigate();
    const { petId } = useParams();
    const [ error, setError ] = useState("");
    const [userType, setUserType] = useState("");

    const [userInfoError, setUserInfoError] = useState("");
    const { user }= useAuth();
    const [ pet, setPet] = useState({
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
        })
    
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

    return <>
    <div className="mx-auto lg:px-4 sm:px-2 pt-16 pb-16">
        {userType==="seeker"?
        <>
        <h1 className="text-center text-3xl font-bold pb-4 ">Start your application here!</h1>
        <AppForm petId={petId? parseInt(petId) : 0} />
        <p className="error pb-32">{error}</p>
        </>
        :
        <p>User must be a seeker to create an application.</p>
        }
        <p>{userInfoError}</p>
    </div>

    </>
}

export default PetAdoption;