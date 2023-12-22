import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/Home";
import Shelter from "./pages/Shelter";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SignupSeeker from "./pages/SignupSeeker";
import SignupShelter from "./pages/SignupShelter";
import AuthProvider from "./context/AuthProvider";
import PetAdoption from "./pages/PetAdoption";
import PetCreation from "./pages/PetCreation";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import AppList from "./pages/AppList";
import Application from "./pages/Application";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import ShelterDetail from "./pages/ShelterDetail";
import ShelterManagement from "./pages/ShelterManagement";

function PrivateRoute () {
  return localStorage.getItem('user') ? <Outlet /> : <Navigate to="/login" replace />;
}
function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Search />} />
              <Route path="/shelter" element={<Shelter />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup-shelter" element={<SignupShelter />} />
              <Route path="/signup-seeker" element={<SignupSeeker />} />
              <Route path="/applications/pets/:petId/" element={<PetAdoption />} />
              <Route path="/applications/" element={<AppList />} />
              <Route path="/applications/:appId/" element={<Application />} />
              <Route path="/pet_listings/" element={<PetCreation />} />
              {/* <Route path="/search/" element={<Search />} /> */}
              <Route element={<PrivateRoute />}>
                <Route path="/notifications/" element={<Notifications />} />
              </Route>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/shelter-detail/:shelterId/" element={<ShelterDetail />} />
              <Route path="/shelter-management/:shelterId/" element={<ShelterManagement/>}/>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
