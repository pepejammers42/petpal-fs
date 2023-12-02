import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ajax_or_login } from "../../ajax";

interface Pet {
    name: string;
    breed: string;
    age: number;
    shelter: {
        shelter_name: string;
        address: string;
    }
}

function AppForm({pet, petId}: {pet: Pet, petId:number}) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [ app , setApp ] = useState({
        pet_listing: { name: pet.name, 
                       breed: pet.breed, 
                       age: pet.age, 
                       shelter: {
                        shelter_name: pet.shelter.shelter_name,
                        address: pet.shelter.address,
                       }
                    },
        creation_time: "",
        personal_statement: "",
    });

    function handle_submit(event: React.ChangeEvent<HTMLFormElement>){
        let data = new FormData(event.target);

        ajax_or_login(`/applications/pets/${petId}/`, {
            method: "POST",
            body: data,
        }, navigate)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else{
                throw Error(response.statusText);
            }
        })
        .then(json => setApp(json))
        .catch(error => {
            setError(error.toString());
        });

        event.preventDefault();
    }

    return <>
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <div className="px-6 py-4">
            <Link
                to={`pet_listings/${petId}/`}
                className="font-bold text-xl mb-2">
                <h1>
                    {app.pet_listing.name},
                    <span className="text-gray-700 text-base">
                        {" " + app.pet_listing.age + "yr old " + app.pet_listing.breed }
                    </span>
                    <span
                        className="iconify"
                        data-icon="akar-icons:circle-chevron-right-fill"></span>
                </h1>
            </Link>
            <Link
                to="/src/pages/notification.html"
                className="text-gray-700 text-base flex flex-col items-end">
                <div>
                <span
                    className="iconify"
                    data-icon="akar-icons:chat-dots"></span>
                Chat with
                <span className="user-name">{" "+app.pet_listing.shelter.shelter_name}</span>
                </div>
            </Link>
            </div>
            <div className="container p-4"> 
            <form>
                <div className="row">
                    <div className="mb-3 flex flex-col">
                        <label className="form-label"
                            >Personal Statement</label>
                        <textarea
                            name=""
                            className="border"
                            id="ps"
                            rows={8}
                            placeholder="Tell the shelter why you are interested in this pet and what you can provide to it!"></textarea>
                    </div>
                </div>
                <div className="form-check m-auto">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="confirm"
                        required
                         />
                    <label
                        className="form-check-label"
                        >
                        I confirm all the information I provide
                        is authentic
                    </label>
                </div>
                
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  rounded"
                    type="submit">
                    Confirm My Information and Submit
                    Application
                </button>
                <p className="error">{error}</p>
            </form>
            </div>
        </div>
    </>
}

export default AppForm;