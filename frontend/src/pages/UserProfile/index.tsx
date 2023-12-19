import userAvatar from "../../assets/default.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const UserProfile = () => {
  const { user } = useAuth();

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
        </div>
      </div>
    </>
  );
};

export default UserProfile;
