import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";

type UserType = {
  id: number;
  email: string;
  first_name: string;
  lastName: string;
};

const UserProfile = () => {
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
        console.log("Error fetching user data:");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <div className="flex w-full">
        <div className="grid grid-cols-10 w-full p-8">
          {/* Left nav */}
          <div className="flex flex-col col-span-3 gap-2">
            <h2>Settings</h2>
            <div className="flex flex-col">
              <Link to="/">Profile</Link>
              <Link to="/">Account Settings</Link>
            </div>
          </div>
          {/* right nav */}
          <div className="flex flex-col gap-2 col-span-7">
            <h2>User Profile</h2>
            <div className="bg-white p-6 rounded-md">
              <p>Profile Photo</p>
              <p>Basic</p>
              <p>Address</p>
            </div>
            <h2>Pet Preferences</h2>
            <div className="bg-white p-6 rounded-md">some text here</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
