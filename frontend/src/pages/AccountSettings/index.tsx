import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import SettingsNav from "../../components/SettingsNav";
import axios from "../../api/axios";
import {SeekerUser, ShelterUser} from "../../context/AuthContext"


const AccountSettings = () => {
  const { user, updateNotificationPreferences } = useAuth();
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingNotifs, setIsEditingNotifs] = useState(false);
  const [ userError, setUserError] = useState("");
  const [pwError, setPwError] = useState("");
  const [ntError, setNtError] = useState("");
  const [userType, setUserType] = useState("");
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [seekerFormData, setSeekerFormData] = useState({
    email: user?.email || "",
    first_name: "",
    last_name: "",
    location: "",
    password: "",
    confirm_password: ""
    
  });
  const [shelterFormData, setShelterFormData] = useState({
    email: user?.email || "",
    shelter_name: "",
    address: "",
    password: "",
    confirm_password: ""
  })

  const [notificationData, setNotificationData] = useState({
    email: "Enabled",
    sms: "Disabled",
  });

  useEffect(()=> {
    try {
      let userType = localStorage.getItem("user");
      
      const userID = localStorage.getItem("userID");

      if (!userType || !userID) {
        // Handle the case where userType or userID is not available
        return;
      }
      else{
        setUserType(userType);
      }

      if(userType==="seeker"){
        setSeekerFormData({
          email: user?.email || "",
          first_name: (user as SeekerUser)?.first_name || "",
          last_name: (user as SeekerUser)?.last_name || "",
          location: (user as SeekerUser)?.location || "",
          password: "",
          confirm_password: ""
      })
      }
      else if (userType==="shelter"){
        setShelterFormData({
        email: user?.email || "",
        shelter_name: (user as ShelterUser)?.shelter_name || "",
        address: (user as ShelterUser)?.address || "",
        password: "",
        confirm_password: ""
      })
      }
    } catch (errors) {
      setUserError("user is not logged in" + errors);
    }
  }, [user])

  useEffect(() => { 
    if (userType==="seeker"){
      setSeekerFormData({...seekerFormData, password:passwordData.password, confirm_password:passwordData.confirmPassword});
    }
    else if (userType==="shelter"){
      setShelterFormData({...shelterFormData, password:passwordData.password, confirm_password:passwordData.confirmPassword});
    }
  }, [passwordData])

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

      const data = (userType==="seeker"? seekerFormData : shelterFormData);
      const response = await axios.put(`/accounts/${userType}/${userID}/`, data);
      if(response.status === 200){
        setIsEditingPassword(false);
      } else {
        setPwError("Error updating user password 1: "+ response.statusText);
      }
    } catch (errors) {
      setPwError("Error updating password 2:"+ errors);
    }
  };


  const handleNotificationChange = (field: string, value: string) => {
    setNotificationData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleNotifsEdit = () => {
    setIsEditingNotifs((prev) => !prev);
  };

  const handleNotificationSubmit = async () => {
    try {
      await updateNotificationPreferences(notificationData);
      setIsEditingNotifs(false);
    } catch (errors) {
      setNtError("Error updating notification preferences:"+ errors);
    }
  };

  return (
    <div className="flex w-full">
      <div className="grid grid-cols-10 w-full p-8">
        {/* Left nav */}
        <SettingsNav />
        {/* right nav */}
        <div className="flex flex-col gap-2 col-span-7">
          <h1>Account Settings</h1>

          {/* Update Password Section */}
          <div className="bg-white p-6 rounded-md">
            <h2>Update Password</h2>
            <form>
              <label htmlFor="password">New Password: </label>
              <input
                id="password"
                type="password"
                placeholder="New Password"
                value={passwordData.password}
                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                disabled={!isEditingPassword}
              />
              <br />
              <label htmlFor="confirmPassword">Confirm Password: </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                disabled={!isEditingPassword}
              />
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

          {/* Notification Preferences Section */}
          <div className="bg-white p-6 rounded-md">
            <h2>Notification Preferences</h2>
            <form>
              <label>Email Notifications: </label>
              <select
                value={notificationData.email}
                onChange={(e) => handleNotificationChange("email", e.target.value)}
                disabled={!isEditingNotifs}
              >
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
              </select>
              <br />
              <label>SMS Notifications: </label>
              <select
                value={notificationData.sms}
                onChange={(e) => handleNotificationChange("sms", e.target.value)}
                disabled={!isEditingNotifs}
              >
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
              </select>
            </form>
        

            {isEditingNotifs ? (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleNotificationSubmit}>
                Update Preferences
              </button>
            ) : (
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleToggleNotifsEdit}>
                Edit Preferences
              </button>
            )}
            <p>{ntError}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;