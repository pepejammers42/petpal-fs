import userAvatar from "../../assets/default.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import React, { useState, useEffect } from "react";
import {SeekerUser, ShelterUser} from "../../context/AuthContext"
import SettingsNav from "../../components/SettingsNav";
import { isButtonElement } from "react-router-dom/dist/dom";
import axios from "../../api/axios";

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [changed, setChanged] = useState(false);
  const [userType, setUserType] = useState("seeker");
  const [seekerFormData, setSeekerFormData] = useState({
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    first_name: "",
    last_name: "",
    location: "",
    preference: "",
    password: "",
    confirm_password: ""
    
  });
  const [shelterFormData, setShelterFormData] = useState({
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    shelter_name: "",
    address: "",
    description: "",
    password: "",
    confirm_password: ""
  })
  

  useEffect(() => {
    let userType = localStorage.getItem("user");
    const userID = localStorage.getItem("userID");

    if (!userType || !userID) {
      // Handle the case where userType or userID is not available
      console.log("user profile: no user");
      return;
    }

    setUserType(userType);
 
    if (userType === "seeker"){
      setSeekerFormData((prevFormData) => ({
        ...prevFormData,
        email: user?.email || "",
        phone_number: user?.phone_number || "",
        first_name: (user as SeekerUser)?.first_name || "",
        last_name: (user as SeekerUser)?.last_name || "",
        location: (user as SeekerUser)?.location || "",
        preference: (user as SeekerUser)?.preference || "",
      }));
    }

    else if (userType === "shelter"){
      setShelterFormData((prevFormData) => ({
        ...prevFormData,
        email: user?.email || "",
        phone_number: user?.phone_number || "",
        shelter_name: (user as ShelterUser)?.shelter_name || "",
        address: (user as ShelterUser)?.address || "",
        description: (user as ShelterUser)?.description || "",
      }));
    }

  }, [user]);

  useEffect(() => {
    (userType==="seeker"?renderSeekerSection():renderShelterSection());
  }, [changed])

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async () => {
      try {
        let userType = localStorage.getItem("user");
        const userID = localStorage.getItem("userID");
  
        if (!userType || !userID) {
          // Handle the case where userType or userID is not available

          return;
        }
  
        const response = await axios.put(`/accounts/${userType}/${userID}/`, (userType==="seeker"? seekerFormData : shelterFormData));
        if (response.status === 200){
          setIsEditing(false);
          setChanged(true);
        } else {
          console.error("Error updating user profile:", response.statusText);
        }
      } catch (error){
        console.error("Error updating user profile2:", error);
      }
    };
    


  const renderSeekerSection = () => {
    return (<>
    <div className="bg-white p-6 rounded-md">
      <h2>Profile Photo</h2>
      <img className="h-10 md:h-14" alt="profile icon" src={user?.avatar || userAvatar} />
      
      <br/>
      <h2>Basic Information</h2>
      <form>
        <label htmlFor="seeker1" >First Name: </label>
        <input
          id="seeker1"
          type="text"
          placeholder="First Name"
          value={seekerFormData.first_name}
          onChange={(e) => setSeekerFormData({...seekerFormData, first_name: e.target.value})}
          disabled={!isEditing}
        />
        <br/>
        <label htmlFor="seeker2">Last Name: </label>
        <input
          id="seeker2"
          type="text"
          placeholder="Last Name"
          value={seekerFormData.last_name}
          onChange={(e) => setSeekerFormData({...seekerFormData, last_name: e.target.value})}
          disabled={!isEditing}
        />
        <br/>
        <label htmlFor="seeker3">Email: </label>
        <input
          id="seeker3"
          type="email"
          placeholder="Email"
          value={seekerFormData.email}
          onChange={(e) => setSeekerFormData({...seekerFormData, email: e.target.value})}
          disabled={!isEditing}
        />
        <br/>
        <label htmlFor="seeker4">Phone Number: </label>
        <input
            id="seeker4"
            type="text"
            placeholder="Phone Number"
            value={seekerFormData.phone_number}
            onChange={(e) => setSeekerFormData({...seekerFormData, phone_number: e.target.value})}
            disabled={!isEditing}
        />
        <br/>
        <label htmlFor="seeker5">Location: </label>
        <input
          id="seeker5"
          type="text"
          placeholder="Location"
          value={seekerFormData.location}
          onChange={(e) => setSeekerFormData({...seekerFormData, location: e.target.value})}
          disabled={!isEditing}
        />
        <br/>
        <br/>
        <h2>Pet Preferences</h2>
          <textarea
            placeholder="Pet Preferences"
            value={seekerFormData.preference}
            onChange={(e) => setSeekerFormData({...seekerFormData, preference: e.target.value})}
            disabled={!isEditing}
          />
        <br/>
        {isEditing ? 
          <label>Type your password: 
          <input onChange={(e)=>setSeekerFormData({...seekerFormData, password:e.target.value, confirm_password:e.target.value})} required/>
          </label>
          :
          ''}
      </form>
      {isEditing ? (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick = {handleSubmit}>Change Profile</button>
      ) : (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick = {handleEditClick}>Edit</button>
      )}
    </div>
    </>)
  }

  const renderShelterSection = () => {
    return (<>
      <div className="bg-white p-6 rounded-md">
        <h2>Profile Photo</h2>
        <img className="h-10 md:h-14" alt="profile icon" src={user?.avatar || userAvatar}/>
        <h2>Basic Information</h2>
        <form>
          <label htmlFor="shelter1" >Shelter Name: </label>
          <input
            id="shelter1"
            type="text"
            placeholder="Shelter Name"
            value={shelterFormData.shelter_name}
            onChange={(e) => setShelterFormData({...shelterFormData, shelter_name: e.target.value})}
            disabled={!isEditing}
          />
          <br/>
          <label htmlFor="shelter2" >Email: </label>
          <input
          id="shelter2"
          type="email"
          placeholder="Email"
          value={shelterFormData.email}
          onChange={(e) => setShelterFormData({...shelterFormData, email: e.target.value})}
          disabled={!isEditing}
          />
          <br/>
          <label htmlFor="shelter3">Phone Number: </label>
          <input
            id="shelter3"
            type="text"
            placeholder="Phone Number"
            value={shelterFormData.phone_number}
            onChange={(e) => setShelterFormData({...shelterFormData, phone_number: e.target.value})}
            disabled={!isEditing}
          />
          <br/>
          <label htmlFor="shelter4">Adderss: </label>
          <input
            id="shelter4"
            type="text"
            placeholder="Address"
            value={shelterFormData.address}
            onChange={(e) => setShelterFormData({...shelterFormData, address: e.target.value})}
            disabled={!isEditing}
          />
          <br/>
          <br/>
          <h2>Shelter Description</h2>
          <textarea
            placeholder="Shelter Description"
            value={shelterFormData.description}
            onChange={(e) => setShelterFormData({...shelterFormData, description: e.target.value})}
            disabled={!isEditing}
          />
          <br/>
          {isEditing ? 
          <label>Type your password: 
          <input onChange={(e)=>setShelterFormData({...shelterFormData, password:e.target.value, confirm_password:e.target.value})} required/>
          </label>
          :
          ''}
        </form>
        {isEditing ? (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Change Profile</button>
        ) : (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleEditClick}>Edit</button>
        )}
      </div>
    </>);
  };


  return (
    <>
      <div className="flex w-full">
        <div className="grid grid-cols-10 w-full p-8">
          {/* Left nav */}
          <SettingsNav />
          {/* right nav */}
          <div className="flex flex-col gap-2 col-span-7">
            <h1>User Profile</h1>
            {userType === "seeker" ? renderSeekerSection() : renderShelterSection()}
          </div>
        </div>
      </div>
    </>

  );
};

export default UserProfile;


/*previous code for right section */

/*
<div className="flex flex-col gap-2 col-span-7">
            <h2>User Profile</h2>
            <div className="bg-white p-6 rounded-md">
              <p>Profile Photo</p>
              {user && user.avatar !== null ? (
                <img
                  className="h-10 md:h-14"
                  alt="profile icon"
                  src={user.avatar}
                />
              ) : (
                <img
                  className="h-10 md:h-14"
                  alt="profile icon"
                  src={userAvatar}
                />
              )}
              <p>Basic</p>

              <p>Address</p>
            </div>
            <h2>Pet Preferences</h2>
            <div className="bg-white p-6 rounded-md">some text here</div>
          </div>

*/