import axios from "../../api/axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ShelterBasicInfo from "../../components/ShelterBasicInfo";
import ShelterPetList from "../../components/ShelterPetList";
import ShelterReview from "../../components/ShelterReview";

const ShelterDetail = () => {
  const { shelterId } = useParams();
  const [shelterID, setShelterID] = useState(parseInt(shelterId || "0", 10));
  const [shelterName, setShelterName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setShelterID(parseInt(shelterId || "0", 10));
    fetchShelterName();
  }, [shelterId]);

  const fetchShelterName = async () => {
    try {
      const response = await axios.get(`/accounts/shelter/${shelterID}/`);
      setShelterName(response.data.shelter_name);
      //console.log(response.data.shelter_name);
    } catch (errors) {
      setError("Error fetching shelter information: " + errors);
    }
  };

  return (
    <>
      <div className="mx-auto pt-16 pb-16 flex flex-col">
        <ShelterBasicInfo sid={shelterID} />

        <ShelterPetList sname={shelterName} />
        <ShelterReview />

        <p>{error.toString()}</p>
      </div>
    </>
  );
};

export default ShelterDetail;
