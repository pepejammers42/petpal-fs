import { useState, useEffect } from "react";
import axios from "../../api/axios";
import userAvatar from "../../assets/default.png";
import "./style.css";


const ShelterBasicInfo = ({sid}:{sid:number}) => {
    const [shelterInfo, setShelterInfo] = useState({
        email: "",
        phone_number: "",
        avatar: "",
        shelter_name: "",
        address: "",
        description: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        fetchShelterInfo();
    
    }, [sid]);

    const fetchShelterInfo = async () => {
        try {
            
            const response = await axios.get(`/accounts/shelter/${sid}/`);
            const data = response.data;

            setShelterInfo({
                email: data.email,
                phone_number: data.phone_number,
                avatar: data.avatar,
                shelter_name: data.shelter_name,
                address: data.address,
                description: data.description,
            });


            
        } catch (errors) {
            setError("Error fetching shelter information: " + errors);
        }
    }

    return (
        <>
        <div id="basic-info-container" className="flex flex-col gap-16 ">
            <div className="flex flex-row gap-20 mx-auto max-w-5xl justify-end">
                <div id="circle-container-sbi">
                    <img id="profile-pic-sbi"  alt="profile icon" src={shelterInfo.avatar || userAvatar}/>
                </div>
                <div id="info-details" className="rounded overflow-hidden shadow-lg bg-white py-4 pl-8 pr-48">
                    <div>Shelter Name: {shelterInfo.shelter_name}</div>
                    <div>Phone Number: {shelterInfo.phone_number}</div>
                    <div>Email: {shelterInfo.email}</div>
                    <div>Address: {shelterInfo.address}</div>
                </div>
            </div>
            <div className="text-center py-8 bg-slate-600 text-white">
                {shelterInfo.description}
            </div>

        </div>
        </>
    )

}

export default ShelterBasicInfo;