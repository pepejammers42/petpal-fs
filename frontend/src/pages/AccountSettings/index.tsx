import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import SettingsNav from "../../components/SettingsNav";

const AccountSettings = () => {
  const { updateUserPassword, updateNotificationPreferences } = useAuth();
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingNotifs, setIsEditingNotifs] = useState(false);
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [notificationData, setNotificationData] = useState({
    email: "Enabled",
    sms: "Disabled",
  });

  const handleTogglePasswordEdit = () => {
    setIsEditingPassword((prev) => !prev);
  };

  const handlePasswordSubmit = async () => {
    try {
      // Add password validation logic if needed
      await updateUserPassword(passwordData);
      setIsEditingPassword(false);
    } catch (error) {
      console.error("Error updating password:", error);
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
    } catch (error) {
      console.error("Error updating notification preferences:", error);
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;