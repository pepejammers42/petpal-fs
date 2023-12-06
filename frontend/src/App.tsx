import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/Home";
import Shelter from "./pages/Shelter";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SignupSeeker from "./pages/SignupSeeker";
import SignupShelter from "./pages/SignupShelter";
import AuthProvider from "./context/AuthProvider";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/shelter" element={<Shelter />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup-shelter" element={<SignupShelter />} />
              <Route path="/signup-seeker" element={<SignupSeeker />} />
              <Route path="/profile" element={<UserProfile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
