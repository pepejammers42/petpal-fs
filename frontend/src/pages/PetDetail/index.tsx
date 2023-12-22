import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import PetForm from '../../components/PetForm';
import axios from "../../api/axios";

const PetDetail = () => {
    const { pk } = useParams();
    const emptypet = { shelter:0, name: "", description: "", status: "", breed: "", age: 0, size: "", color: "", gender: "", medical_history: "", behavior: "", special_needs: "", avatar: "" };
    const [petDetails, setPetDetails] = useState(emptypet);
    

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/pet_listings/${pk}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPetDetails(response.data);
        } catch (error) {
            console.log("Error Fetching Pet Listing: "+error);
        }
    };

    const handleFormSubmit = async () => {
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    return <>
        <div className="w-full max-w-xl mx-auto">
            <div className="p-4" style={{ backgroundColor: '#c5dcaf' }}>
                <h1 className="font-bold text-2xl">{petDetails.name} </h1>
            </div>
            <div className="p-4 bg-white">
                <img className="mx-auto w-full rounded-lg border-2 border-green-500 mb-2" alt="profile icon" src={petDetails.avatar ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637" }/>
                
                {/* Shelter that is the owner */}
                {Object.keys(petDetails).length > 0 && localStorage.getItem("user") === "shelter" && localStorage.getItem("userID") === ""+petDetails.shelter && (
                    <PetForm submit_button_text="Update this pet!" read_only={false} method={'put'} endpoint_add={"/"+pk+"/"} onFormSubmit={handleFormSubmit} pet={petDetails} />
                )}

                {/* Shelter that isn't the owner */}
                {Object.keys(petDetails).length > 0 && localStorage.getItem("user") === "shelter" && localStorage.getItem("userID") !== ""+petDetails.shelter && (
                    <PetForm submit_button_text="" read_only={true} method={'put'} endpoint_add={"/"+pk+"/"} onFormSubmit={handleFormSubmit} pet={petDetails} />
                )}
                
                {/* Seeker */}
                {Object.keys(petDetails).length > 0 && localStorage.getItem("user") === "seeker" && (
                    <PetForm submit_button_text="" read_only={true} method={'put'} endpoint_add={"/"+pk+"/"} onFormSubmit={handleFormSubmit} pet={petDetails} />
                )}
            </div>
        </div>
    </>
}

export default PetDetail;