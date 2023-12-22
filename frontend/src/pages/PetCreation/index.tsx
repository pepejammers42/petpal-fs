import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import PetForm from '../../components/PetForm';

function PetCreation(){
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

    return <>
        <div className="w-full max-w-xl mx-auto">
            <div className="p-4" style={{ backgroundColor: '#c5dcaf' }}>
                <h1 className="font-bold text-2xl">Pet Creation Page </h1>
            </div>
            <div className="p-4 bg-white">
                <PetForm submitButtonText="Update this pet!" pet={petDetails} />
            </div>
        </div>
    </>
}

export default PetCreation;