import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import PetForm from '../../components/PetForm';
import axios from "../../api/axios";

const PetDetail = () => {
    const { pk } = useParams();
    const [petDetails, setPetDetails] = useState({
        name: "",
        description: "",
        status: "",
        breed: "",
        age: 0,
        size: "",
        color: "",
        gender: "",
        medical_history: "",
        behavior: "",
        special_needs: "",
        avatar: "",
    });
    

    const fetchData = async () => {
        try {
            // Not entirely sure why we have to specify this again, but it works.
            const token = localStorage.getItem('token');
            const response = await axios.get(`/pet_listings/${pk}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Data:");
            console.log(response.data);
            setPetDetails(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return <>
        <div className="w-full max-w-md mx-auto pt-8">
            <div className="p-4" style={{ backgroundColor: '#c5dcaf' }}>
                <h1 className="font-bold text-2xl">{petDetails.name} </h1>
            </div>
            <div className="p-4 bg-white">
                <img className="mx-auto w-full" alt="profile icon" src={petDetails.avatar}/>
                
                {Object.keys(petDetails).length > 0 && (
                    <PetForm submitButtonText="Update this pet!" pet={petDetails} />
                )}
            </div>
        </div>
    </>
}

export default PetDetail;