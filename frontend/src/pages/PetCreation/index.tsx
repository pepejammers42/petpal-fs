import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import AppForm from '../../components/PetForm';
import { ajax_or_login } from '../../ajax';
import PetForm from '../../components/PetForm';

function PetCreation(){

    return <>
    <div className="w-full max-w-md mx-auto pt-8">
        <h1 className="font-bold text-2xl">Create A Pet Listing Here!</h1>

        <PetForm />
    </div>
    </>
}

export default PetCreation;