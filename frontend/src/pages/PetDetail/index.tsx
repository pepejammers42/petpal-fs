import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import AppForm from '../../components/PetForm';
import { ajax_or_login } from '../../ajax';
import PetForm from '../../components/PetForm';
import axios from "../../api/axios";

const PetDetail = () => {
    const { pk } = useParams();
    const [petDetails, setPetDetails] = useState({
        name: "", 
        breed: "", 
        age: "", 
        avatar: "",
        shelter: {
            shelter_name: "",
            address: "",
        }
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
                {/* <form className="bg-gray-100 font-medium text-lg flex flex-col gap-2 bg-footer-bg p-4 rounded-lg">
                    <div>
                        <label className="text-green-500 font-cinzel">Name</label>
                        <input className="" type="text" readOnly value={petDetails.name}></input>
                    </div>       

                </form> */}
                <PetForm />
            </div>
        </div>
    </>
}

export default PetDetail;