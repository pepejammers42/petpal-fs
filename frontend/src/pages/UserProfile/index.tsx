import userAvatar from "../../assets/default.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import React, { useState, useEffect } from "react";
import {SeekerUser, ShelterUser} from "../../context/AuthContext"
import { isButtonElement } from "react-router-dom/dist/dom";
import axios from "../../api/axios";
import "./style.css";

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [changed, setChanged] = useState(false);
  const [userType, setUserType] = useState("seeker");
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [pwError, setPwError] = useState("");
  const [seekerFormData, setSeekerFormData] = useState({
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    avatar: user?.avatar || "",
    first_name: "",
    last_name: "",
    location: "",
    preference: "",
    password: "",
    confirm_password: "",
    
  });
  const [shelterFormData, setShelterFormData] = useState({
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    avatar: user?.avatar || "",
    shelter_name: "",
    address: "",
    description: "",
    password: "",
    confirm_password: "",
  });
  const [uploadedImage, setUploadedImage] = useState<string | ArrayBuffer | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | string>(user?.avatar || "");
  const [isUploaded, setIsUploaded] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [dltError, setDltError] = useState("");

  useEffect(() => {
    let userType = localStorage.getItem("user");
    const userID = localStorage.getItem("userID");

    if (!userType || !userID) {
      
      console.log("user profile: no user");
      return;
    }

    setUserType(userType);
 
    if (userType === "seeker"){
      setSeekerFormData((prevFormData) => ({
        ...prevFormData,
        email: user?.email || "" ,
        phone_number: user?.phone_number || "",
        avatar: user?.avatar || "",
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
        avatar: user?.avatar || "",
        shelter_name: (user as ShelterUser)?.shelter_name || "",
        address: (user as ShelterUser)?.address || "",
        description: (user as ShelterUser)?.description || "",
      }));
    }


  }, [user]);

  useEffect(() => {
    (userType==="seeker" ? renderSeekerSection() : renderShelterSection());
  }, [user, changed,seekerFormData, shelterFormData]);

  useEffect(() => { 
    if (userType==="seeker"){
      setSeekerFormData({...seekerFormData, password:passwordData.password, confirm_password:passwordData.confirmPassword});
    }
    else if (userType==="shelter"){
      setShelterFormData({...shelterFormData, password:passwordData.password, confirm_password:passwordData.confirmPassword});
    }
  }, [passwordData]);

  const handleTogglePasswordEdit = () => {
    setIsEditingPassword((prev) => !prev);
  };


  const handlePasswordSubmit = async () => {
    
    try {
      // Add password validation logic if needed
      const userID = localStorage.getItem("userID");

      if (!userID) {
        // Handle the case where userType or userID is not available
        return;
      }

      const formData = new FormData();

        if (userType === "seeker") {
          Object.entries(seekerFormData).forEach(([key, value]) => {
            if (key !== 'avatar'){
              formData.append(key, value);
            }
          });
        } else if (userType === "shelter") {
          Object.entries(shelterFormData).forEach(([key, value]) => {
            if (key !== 'avatar'){
              formData.append(key, value);
            }
          });
        }

      //const data = (userType==="seeker"? seekerFormData : shelterFormData);
      const response = await axios.put(`/accounts/${userType}/${userID}/`, formData);
      if(response.status === 200){
        setIsEditingPassword(false);
      } else {
        setPwError("Error updating user password 1: "+ response.statusText);
      }
    } catch (errors) {
      setPwError("Error updating password 2:"+ errors);
      
    }
  };

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

        const formData = new FormData();

        if (userType === "seeker") {
          Object.entries(seekerFormData).forEach(([key, value]) => {
            if (key === 'avatar' && isUploaded ){
              formData.append(key, uploadedFile || user?.avatar || "" );
            } else if (key !== 'avatar' && key !== 'password' && key !== 'confirm_password'){
              formData.append(key, value);
            }
          });
        } else if (userType === "shelter") {
          Object.entries(shelterFormData).forEach(([key, value]) => {
            if (key === 'avatar' && isUploaded){
              formData.append(key, uploadedFile || user?.avatar || "" );
            } else if (key !== 'avatar' && key !== 'password' && key !== 'confirm_password'){
              formData.append(key, value);
            }
          });
        }
        console.log("Type of uploadedFile:", typeof uploadedFile);
      console.log("uploadedFile:", uploadedFile);
        //formData.append("avatar", null);

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

  
        const response = await axios.put(`/accounts/${userType}/${userID}/`, formData, config);
        if (response.status === 200){
          setIsEditing(false);
          setChanged(true);
          setIsUploaded(false);
        } else {
          console.error("Error updating user profile:", response.statusText);
        }
      } catch (error){
        console.error("Error updating user profile2:", error);
      }
    };
    
  const renderSeekerSection = () => {
    return (<>
      <div className="bg-white p-6 rounded-md ">
      <form className="flex flex-col gap-8" encType="multipart/form-data" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="flex flex-row justify-around">
        <div id="profile-photo" className="flex flex-col gap-2">
          <h2 className="text-xl font-bold pb-2">Profile Photo</h2>
          <div id="circle-container-up">
            <img id="profile-pic-up"  alt="profile icon" src={uploadedImage?.toString() || user?.avatar || userAvatar}/>       
          </div>
          
          {isEditing ?
            <div className="flex flex-col pt-2"> 
              <input
                type="file"
                onChange={(e) => {setUploadedFile(e.target.files?.[0] || ""); setUploadedImage( e.target.files?.[0] ? URL.createObjectURL( e.target.files?.[0]) : ""); setIsUploaded(true);}}
                accept="image/*"/>
              <small
                className="form-text text-muted"
                >Supported formats: .jpg,
                .jpeg, .png.</small>
            </div>
          :
          ''
          }
        </div>
        
        <div id="basic-information" className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Basic Information</h2>
        
          <div className="flex flex-row gap-2">
          <label htmlFor="seeker1" >First Name: </label>
          <input
            id="seeker1"
            type="text"
            placeholder="First Name"
            value={seekerFormData.first_name}
            onChange={(e) => setSeekerFormData({...seekerFormData, first_name: e.target.value})}
            disabled={!isEditing}
            required
          />
          </div>
          <div className="flex flex-row gap-2">
            <label htmlFor="seeker2" >Last Name: </label>
            <input
              id="seeker2"
              type="text"
              placeholder="Last Name"
              value={seekerFormData.last_name}
              onChange={(e) => setSeekerFormData({...seekerFormData, last_name: e.target.value})}
              disabled={!isEditing}
              required
            />
            </div>
          <div className="flex flex-row gap-2">
          <label htmlFor="seeker3" >Email: </label>
          <input
          id="seeker3"
          type="email"
          placeholder="Email"
          value={seekerFormData.email}
          onChange={(e) => setSeekerFormData({...seekerFormData, email: e.target.value})}
          disabled={!isEditing}
          required
          />
          </div>
          <div className="flex flex-row gap-2">
          <label htmlFor="seeker4">Phone Number: </label>
          <input
            id="seeker4"
            type="text"
            placeholder="Phone Number"
            value={seekerFormData.phone_number}
            onChange={(e) => setSeekerFormData({...seekerFormData, phone_number: e.target.value})}
            disabled={!isEditing}
          />
          </div>
          <div className="flex flex-row gap-2">
          <label htmlFor="seeker5">Location: </label>
          <input
            id="seeker5"
            type="text"
            placeholder="Location"
            value={seekerFormData.location}
            onChange={(e) => setSeekerFormData({...seekerFormData, location: e.target.value})}
            disabled={!isEditing}
          />
          </div>
          <div className="flex flex-col gap-2 pt-4">
          <h2>Pet Preferences</h2>
          <textarea
            placeholder="Pet Preferences"
            value={seekerFormData.preference}
            onChange={(e) => setSeekerFormData({...seekerFormData, preference: e.target.value})}
            disabled={!isEditing}
          />
          </div>

        </div>
        </div>

        {isEditing ? 
          <div className="pt-8 flex flex-row gap-2 justify-center">
          <label >Confirm change: </label>
          <input type="checkbox" required/>
          
          </div>
          :
          ''}
        
        
        {isEditing ? (
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >Change Profile</button>        ) : (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleEditClick}>Edit Profile</button>
        )}
        </form>
      </div>
    </>);
  };

  const renderShelterSection = () => {
    return (
    <>
      <div className="bg-white p-6 rounded-md ">
      <form className="flex flex-col gap-8" encType="multipart/form-data" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="flex flex-row justify-around">
        <div id="profile-photo" className="flex flex-col gap-2">
          <h2 className="text-xl font-bold pb-2">Profile Photo</h2>
          <div id="circle-container-up">
            <img id="profile-pic-up"  alt="profile icon" src={uploadedImage?.toString() || user?.avatar || userAvatar}/>       
          </div>
          
          {isEditing ?
            <div className="flex flex-col pt-2"> 
              <input
                type="file"
                onChange={(e) => {setUploadedFile(e.target.files?.[0] || ""); setUploadedImage( e.target.files?.[0] ? URL.createObjectURL( e.target.files?.[0]) : ""); setIsUploaded(true);}}
                accept="image/*"/>
              <small
                className="form-text text-muted"
                >Supported formats: .jpg,
                .jpeg, .png.</small>
            </div>
          :
          ''
          }
        </div>
        
        <div id="basic-information" className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Basic Information</h2>
        
          <div className="flex flex-row gap-2">
          <label htmlFor="shelter1" >Shelter Name: </label>
          <input
            id="shelter1"
            type="text"
            placeholder="Shelter Name"
            value={shelterFormData.shelter_name}
            onChange={(e) => setShelterFormData({...shelterFormData, shelter_name: e.target.value})}
            disabled={!isEditing}
            required
          />
          </div>
          <div className="flex flex-row gap-2">
          <label htmlFor="shelter2" >Email: </label>
          <input
          id="shelter2"
          type="email"
          placeholder="Email"
          value={shelterFormData.email}
          onChange={(e) => setShelterFormData({...shelterFormData, email: e.target.value})}
          disabled={!isEditing}
          required
          />
          </div>
          <div className="flex flex-row gap-2">
          <label htmlFor="shelter3">Phone Number: </label>
          <input
            id="shelter3"
            type="text"
            placeholder="Phone Number"
            value={shelterFormData.phone_number}
            onChange={(e) => setShelterFormData({...shelterFormData, phone_number: e.target.value})}
            disabled={!isEditing}
          />
          </div>
          <div className="flex flex-row gap-2">
          <label htmlFor="shelter4">Adderss: </label>
          <input
            id="shelter4"
            type="text"
            placeholder="Address"
            value={shelterFormData.address}
            onChange={(e) => setShelterFormData({...shelterFormData, address: e.target.value})}
            disabled={!isEditing}
            required
          />
          </div>
          <div className="flex flex-col gap-2 pt-4">
          <h2>Shelter Description</h2>
          <textarea
            placeholder="Shelter Description"
            value={shelterFormData.description}
            onChange={(e) => setShelterFormData({...shelterFormData, description: e.target.value})}
            disabled={!isEditing}
          />
          </div>

        </div>
        </div>

          {isEditing ? 
          <div className="pt-8 flex flex-row gap-2 justify-center">
          <label >Confirm change: </label>
          <input type="checkbox" required/>
          
          </div>
          :
          ''}
        
        
        {isEditing ? (
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >Change Profile</button>        ) : (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleEditClick}>Edit Profile</button>
        )}
        </form>
      </div>
    </>
    );
  };

  const handleDelete = async () => {
    try {
      let userType = localStorage.getItem("user");
      const userID = localStorage.getItem("userID");

      if (!userType || !userID) {
        // Handle the case where userType or userID is not available

        return;
      }


      const response = await axios.delete(`/accounts/${userType}/${userID}/`);
      if (response.status === 204){
        setIsDeletingAccount(false);
        setIsDeleted(true);
        
      } else {
        console.error("Error deleting user profile:", response.statusText);
        setDltError("Error deleting user profile1:" + response.statusText);
      }
    } catch (error){
      console.error("Error deleting user profile2:", error);
      setDltError("Error deleting user profile2:" + error);
    }
  };


  return (
    <>
      <div className="py-16 ">
        <div className="flex flex-col gap-4 mx-auto max-w-3xl lg:px-4 sm:px-2">
          <h1 className="text-3xl font-bold">User Profile</h1>
          {/* Left nav */}
          {/*<SettingsNav />*/}
          {/* right nav */}
          <div className="flex flex-col gap-2 col-span-7">
            
            {userType === "seeker" ? renderSeekerSection() : renderShelterSection()}
          </div>
          <div className="flex flex-col gap-4 col-span-7 bg-white p-6 rounded-md">
          <h2 className="text-xl font-bold ">Update Password</h2>
            <form className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 ">
              <label htmlFor="password">New Password: </label>
              <input
                id="password"
                type="password"
                placeholder="New Password"
                value={passwordData.password}
                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                disabled={!isEditingPassword}
              />
              </div>
              <div className="flex flex-row gap-2">
              <label htmlFor="confirmPassword">Confirm Password: </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                disabled={!isEditingPassword}
              />
              </div>
            </form>
            {isEditingPassword ? (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handlePasswordSubmit}>
                Change Password
              </button>
            ) : (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleTogglePasswordEdit}>
                Edit Password
              </button>
            )}
            <p>{pwError}</p>
          </div>

          <div className="flex flex-col gap-4 col-span-7 bg-white p-6 rounded-md">
          <h2 className="text-xl font-bold ">Delete Account</h2>
          {isDeletingAccount ? 
          <div className="pt-8 flex flex-row gap-2 justify-center">
          <label >Confirm deleting: </label>
          <input type="checkbox" required/>
          
          </div>
          :
          ''}

          {isDeletingAccount ? (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleDelete}>
                Delete Account
              </button>
            ) : (
              isDeleted ?
              <p className="text-center text-blue-700">Your account is Deleted</p>
              :
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setIsDeletingAccount(true)}>
                Want to delete your account?
              </button>
            )}
          </div>
        </div>
      </div>
    </>

  );
};

export default UserProfile;

