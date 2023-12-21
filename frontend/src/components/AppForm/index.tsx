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

function AppForm({petId}: {petId:number}) {
    const navigate = useNavigate();
    const [fetchError, setFetchError] = useState("");
    const [createError, setCreateError] = useState("");
    const [success, setSuccess] = useState(false);
    const [personalStmt, setPersonalStmt] = useState("");
    const [ pet , setPet ] = useState({
        "id": 0,
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
    });

    useEffect(()=> {
        setCreateError("");
        ajax_or_login(`/pet_listings/${petId}/`, { method: 'GET' }, navigate)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error(response.statusText);
          }
        })
        .then((json: Pet) => {
          setPet(json)
        })
        .catch(error => setFetchError(error));
    }, [petId]);


    const handle_submit  = (e: React.FormEvent) => {
        e.preventDefault();
        ajax_or_login(`/applications/pets/${petId}/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({personal_statement: personalStmt}),
        }, navigate)
        .then(async response => {
            if (response.ok) {
                return response.json();
            } else {
                const errorData = await response.json();
                setCreateError(errorData.detail.toString());
                console.log(errorData.detail.toString());
                console.log(createError);
                throw new Error(response.statusText);
            }
        })
        .then(json => {setPersonalStmt(json.personal_statement); setSuccess(true);})
        .catch((error) => {
             // Check if the error is a JSON response with a detail message
            ;
              
        });

    }

    return <>
        <div className="mx-auto max-w-3xl mt-8 p-4 rounded overflow-hidden shadow-lg bg-white">
            <div className="px-6 py-4">
            <Link
                to={`pet_listings/${petId}/`}
                className="font-bold text-xl mb-2">
                <h1>
                    {pet.name},
                    <span className="text-gray-700 text-base">
                        {" " + pet.age + "yr old " + pet.breed }
                    </span>
                    <span
                        className="iconify"
                        data-icon="akar-icons:circle-chevron-right-fill"></span>
                </h1>
                <p className="error text-red-500">{fetchError.toString()}</p>
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
                            value={personalStmt}
                            onChange={(e)=>
                                setPersonalStmt(e.target.value)
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
                    type="submit"
                    >
                    Confirm My Information and Submit
                    Application
                </button>
                <p className="error text-red-500">{createError}</p>
            </form>
            </div>
            {success ? 
            <p>Your application is submitted!</p>: 
            ''}
        </div>
    </>
}

export default AppForm;