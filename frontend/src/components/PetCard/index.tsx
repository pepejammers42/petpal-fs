import React from 'react';
import { Url } from 'url';

interface Pet {
    id: number;
    name: string;
    description: string;
    avatar: string; 
  }

const PetCard: React.FC<{ pet: Pet }> = ({ pet }) => {
return (
    <div className="pet-component">   
    <img src={pet.avatar} className="pet-avatar" />
    <h3>{pet.name}</h3>
    <p>{pet.description}</p>
    </div>
);
};

export default PetCard;
export type { Pet };
  
