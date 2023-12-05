import React, { useState, useEffect } from 'react';
import PetCard, { Pet } from '../PetCard';

interface Filter {
  breed?: string;
  size?: string;
  gender?: string;
  color?: string;
}

interface PetDatabaseProps {
  searchInput: string;
  filters: Filter; 
}

const PetDatabase: React.FC<PetDatabaseProps> = ({ searchInput, filters }) => {
  const [pets, setPets] = useState<Pet[]>([]);

  // Function to fetch pets data from the backend API
  const fetchPets = async () => {
    try {
      // Construct query parameters from filters and searchInput
      const queryParams = new URLSearchParams({
        ...filters,
        description: searchInput, // filter by description
      }).toString();

      const queryString = queryParams ? `?${queryParams}` : '';
      const response = await fetch(`/pet_listings${queryString}`);
      const data = await response.json();

      setPets(data);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
    }
  };

  // Use useEffect to fetch pets data when the component mounts and when filters or search input change
  useEffect(() => {
    fetchPets();
  }, [filters, searchInput]);

  return (
    <div className="pet-database">
      {pets.map(pet => (
        <PetCard key={pet.id} pet={pet} /> // Render a PetCard for each pet
      ))}
    </div>
  );
};

export default PetDatabase;
