import userAvatar from "../../assets/default.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import React, { useState, useEffect } from "react";
import {SeekerUser, ShelterUser} from "../../context/AuthContext"
import SettingsNav from "../../components/SettingsNav";
import { isButtonElement } from "react-router-dom/dist/dom";

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userType, setUserType] = useState("seeker");
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    first_name: "",
    last_name: "",
    location: "",
    preference: "",
    shelter_name: "",
    address: "",
    description: "",
  });

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
      setFormData((prevFormData) => ({
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
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: user?.email || "",
        phone_number: user?.phone_number || "",
        shelter_name: (user as ShelterUser)?.shelter_name || "",
        address: (user as ShelterUser)?.address || "",
        description: (user as ShelterUser)?.description || "",
      }));
    }

  }, [user, updateUserProfile]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    await updateUserProfile(formData);
    setIsEditing(false);
  }

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
          value={formData.first_name}
          onChange={(e) => setFormData({...formData, first_name: e.target.value})}
          disabled={!isEditing}
        />
        <br/>
        <label htmlFor="seeker2">Last Name: </label>
        <input
          id="seeker2"
          type="text"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
          disabled={!isEditing}
        />
        <br/>
        <label htmlFor="seeker3">Email: </label>
        <input
          id="seeker3"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          disabled={!isEditing}
        />
        <br/>
        <label htmlFor="seeker4">Phone Number: </label>
        <input
            id="seeker4"
            type="text"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
            disabled={!isEditing}
        />
        <br/>
        <label htmlFor="seeker5">Location: </label>
        <input
          id="seeker5"
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          disabled={!isEditing}
        />
        <br/>
        <br/>
        <h2>Pet Preferences</h2>
          <textarea
            placeholder="Pet Preferences"
            value={formData.preference}
            onChange={(e) => setFormData({...formData, preference: e.target.value})}
            disabled={!isEditing}
          />
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
            value={formData.shelter_name}
            onChange={(e) => setFormData({...formData, shelter_name: e.target.value})}
            disabled={!isEditing}
          />
          <br/>
          <label htmlFor="shelter2" >Email: </label>
          <input
          id="shelter2"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          disabled={!isEditing}
          />
          <br/>
          <label htmlFor="shelter3">Phone Number: </label>
          <input
            id="shelter3"
            type="text"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
            disabled={!isEditing}
          />
          <br/>
          <label htmlFor="shelter4">Adderss: </label>
          <input
            id="shelter4"
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            disabled={!isEditing}
          />
          <br/>
          <br/>
          <h2>Shelter Description</h2>
          <textarea
            placeholder="Shelter Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            disabled={!isEditing}
          />
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