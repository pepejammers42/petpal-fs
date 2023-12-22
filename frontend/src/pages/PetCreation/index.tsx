import { useState } from 'react';
import PetForm from '../../components/PetForm';

function PetCreation(){
    const [petDetails, setPetDetails] = useState({
        name: "",
        description: "",
        status: "available",
        breed: "",
        age: 0,
        size: "small",
        color: "",
        gender: "male",
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
                <PetForm submit_button_text="Create a pet!" read_only={false} method={"post"} endpoint_add={"/"} onFormSubmit={() => {}} pet={petDetails} />
            </div>
        </div>
    </>
}

export default PetCreation;