import {Link} from "react-router-dom";

const SettingsNav = () => {
    return (
        <div className="flex flex-col col-span-3 gap-2">
            <h2>Settings</h2>
            <div className="flex flex-col">
              <Link to="/profile">Profile</Link>
              <Link to="/account-settings">Account Settings</Link>
            </div>
        </div>
    )
}

export default SettingsNav;