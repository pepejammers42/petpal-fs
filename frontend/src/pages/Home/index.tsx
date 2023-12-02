import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

type UserType = {
  // Define the user data structure according to your backend
  id: number;
  email: string;
  first_name: string;
  lastName: string;
  // Add other relevant fields
};

const Home = () => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserType>("/accounts/seeker/1/");
        console.log(response);
        setUserData(response.data);
        console.log("yo");
        console.log(userData);
      } catch (err) {
        setError("Failed to fetch user data.");
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {userData ? (
        <div>
          <h1>Welcome, {userData.first_name}!</h1>
          <p>Email: {userData.email}</p>
          {/* Render other user details as needed */}
        </div>
      ) : (
        <div>You are not logged in.</div>
      )}
    </div>
  );
};

export default Home;
