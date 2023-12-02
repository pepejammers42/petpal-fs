import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import AppForm from '../../components/AppForm';
import { ajax_or_login } from '../../ajax';

function PetAdoption(){
    const navigate = useNavigate();
    const { petId } = useParams();
    const [ error, setError ] = useState("");
    const [ pet, setPet] = useState({
        name: "pet name", 
        breed: "breed", 
        age: 0, 
        shelter: {
         shelter_name: "shelter",
         address: "address"
        }
    })
    

    useEffect(() => {
        ajax_or_login(`/pet_listings/${petId}/`, {method:"GET"}, navigate)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw Error(response.statusText);
            }
        })
        .then(json => setPet(json))
        .catch(error => setError(error.toString()));
    }, [navigate, petId]);

    return <>
    <div className="w-full max-w-md mx-auto pt-8 ">
        <h1 className="font-bold text-2xl ">Start your application here!</h1>
   

        <AppForm pet={pet} petId={petId? parseInt(petId) : 0} />
        <p className="error pb-32">{error}</p>
    </div>

    </>
}

export default PetAdoption;