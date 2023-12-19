import { useState, useEffect } from "react";
import axios from "../../api/axios";

type UserType = {
  id: number;
  email: string;
  first_name: string;
  lastName: string;
};

const Home = () => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userType = localStorage.getItem("user");
        const userId = localStorage.getItem("userID");

        if (!userType || !userId) {
          setError("User information not found in local storage.");
          return;
        }

        const url = `/accounts/${userType}/${userId}`;
        const response = await axios.get<UserType>(url);

        console.log(response);
        setUserData(response.data);
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
