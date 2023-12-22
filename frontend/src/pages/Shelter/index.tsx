import React, { useEffect, useContext } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

const Shelter = () => {
  const { user, logout } = useAuth();
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const response = await axios.get("/pet_listings/");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <div>
      {user && <div>Welcome!</div>}
      <button onClick={logout}>Logout</button>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
};

export default Shelter;
