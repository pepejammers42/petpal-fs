import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ajax_or_login } from "../../ajax";
import { ajax } from '../../ajax';


interface Pet {
    id: number;
    shelter: number;
    name: string;
    description: string;
    status: string;
    breed: string;
    age: number;
    size: string;
    color: string;
    gender: string;
    avatar: string;
    medical_history: string;
    behavior: string;
    special_needs: string;
}

function AppForm({pet, petId}: {pet: Pet, petId:number}) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [ app , setApp ] = useState({
        pet_listing: { "id": 0,
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
                    },
        creation_time: "",
        personal_statement: "",
    });

    useEffect(()=> {
        ajax(`/pet_listings/${petId}/`, { method: 'GET' })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error(response.statusText);
          }
        })
        .then((json: Pet) => {
          setApp(prevState => ({
            ...prevState,
            pet_listting:json
          }));
        })
        .catch(error => console.error('Error fetching application details:', error));
    }, [petId]);

    function handle_submit(event: React.ChangeEvent<HTMLFormElement>){
        event.preventDefault();
        
        let data = new FormData(event.target);
        data.append("pet_listing", JSON.stringify(app.pet_listing));

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
            </div>
            <div className="container p-4"> 
            <form onSubmit={handle_submit}>
                <div className="row">
                    <div className="mb-3 flex flex-col">
                        <label className="form-label"
                            >Personal Statement</label>
                        <textarea
                            name="personal_statement"
                            className="border"
                            id="ps"
                            rows={8}
                            value={app.personal_statement}
                            onChange={(e)=>
                                setApp({...app, personal_statement:e.target.value})
                            }
                            placeholder="Tell the shelter why you are interested in this pet and what you can provide to it!">

                        </textarea>
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