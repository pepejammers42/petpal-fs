import axios from "../../api/axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ShelterBasicInfo from "../../components/ShelterBasicInfo"
import ShelterPetListUpdate from "../../components/ShelterPetListUpdate";
import ShelterReview from "../../components/ShelterReview";




const ShelterManagement = () => {
    const { shelterId } = useParams();
    const [shelterID, setShelterID] = useState(parseInt(shelterId || "0", 10));
    const [shelterName, setShelterName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setShelterID(parseInt(shelterId || "0", 10));
        fetchShelterName();
    }, [shelterId]);


    const fetchShelterName = async () => {
        try {
            
            const response = await axios.get(`/accounts/shelter/${shelterID}/`);
            setShelterName(response.data.shelter_name);
            //console.log(response.data.shelter_name);
            

        } catch (errors) {
            setError("Error fetching shelter information: " + errors);
        }
    }
    
    return (
        <>
            <div className="mx-auto pt-16 pb-16 flex flex-col">
            <ShelterBasicInfo sid={shelterID}/>
            <div className="flex justify-center">
            <Link to="/profile" ><button className="mt-4 mx-auto  bg-blue-500 text-white p-2 rounded">Edit basic information in profile page</button></Link>
            </div>
            <ShelterPetListUpdate sname={shelterName} />
            <ShelterReview/>
            
            <p>{error}</p>
            </div>
        </>
    )



}

export default ShelterManagement;