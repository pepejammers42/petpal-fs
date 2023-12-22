import logo from "../../assets/logo.png";
import defaultProfile from "../../assets/default.png";
import useMediaQuery from "../../hooks/usemediaQuery";
import { useState, useEffect, useRef } from "react";
import { ChevronDoubleDownIcon, BellIcon } from "@heroicons/react/24/solid";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// TODO: responsive design (scaling elements)
// TODO: css design update
// TODO: add transition on menu page (responsive)
// TODO: fix paragraphs with proper links

const Layout = () => {
  const flexBetween = "flex justify-between items-center";
  const isAboveMedium = useMediaQuery("(min-width: 1060px)");
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();

  let menuRef = useRef<HTMLDivElement>(null);
  let profileRef = useRef<HTMLImageElement>(null);
  let iconRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [menuRef]);

  useEffect(() => {
    const profileHandler = (e: MouseEvent) => {
      if (
        (!iconRef.current || !iconRef.current.contains(e.target as Node)) &&
        (!profileRef.current || !profileRef.current.contains(e.target as Node))
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", profileHandler);

    return () => {
      document.removeEventListener("mousedown", profileHandler);
    };
  }, [iconRef, profileRef]);
  const Dropdown = () => (
    <div
      className="absolute right-0 top-2 md:top-10 mt-10 py-2 w-48 bg-white rounded-md shadow-xl z-50"
      ref={profileRef}
    >
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Profile
      </Link>
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Logout
      </button>
      <a
        href="/logout"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        My Applications
      </a>
    </div>
  );
  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      // Handle login errors, e.g., showing an error message
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <nav>
          <div
            className={`${flexBetween} fixed top-0 z-30 w-full bg-gradient-header h-12 md:h-20 px-4`}
          >
            <div className={`${flexBetween} mx-auto w-full`}>
              <div className={`${flexBetween} w-full md:gap-16`}>
                <div className={`${flexBetween} gap-2 md:gap-6`}>
                  <div className={`${flexBetween} gap-2`}>
                    <img className="h-10 md:h-14" alt="logo" src={logo} />
                    <p className="text-2xl md:text-4xl font-righteous text-bg-accent">
                      PetPal
                    </p>
                  </div>
                  {isAboveMedium ? (
                    <div
                      className={`${flexBetween} gap-4 font-fahkwang text-xl text-fg-alt-1 h-20`}
                    >
                      {localStorage.getItem("user") === "seeker" ? (
                        // Render for Seeker
                        <>
                          <Link
                            to="/"
                            className="px-6 py-4 hover:py-5 hover:text-fg-alt-3 hover:bg-primary-100"
                          >
                            Home
                          </Link>
                          <Link
                            to="/shelter"
                            className="px-6 py-4 hover:py-5 hover:text-fg-alt-3 hover:bg-primary-100"
                          >
                            Shelters
                          </Link>
                          <Link
                            to="/pets"
                            className="px-6 py-4 hover:py-5 hover:text-fg-alt-3 hover:bg-primary-100"
                          >
                            Pets
                          </Link>
                          <Link
                            to="/favorites"
                            className="px-6 py-4 hover:py-5 hover:text-fg-alt-3 hover:bg-primary-100"
                          >
                            Favorites
                          </Link>
                        </>
                      ) : localStorage.getItem("user") === "shelter" ? (
                        // Render for Shelter
                        <>
                          <Link
                            to="/my-shelter"
                            className="px-6 py-4 hover:py-5 hover:text-fg-alt-3 hover:bg-primary-100"
                          >
                            My Shelter Page
                          </Link>
                          <Link
                            to="/list-pet"
                            className="px-6 py-4 hover:py-5 hover:text-fg-alt-3 hover:bg-primary-100"
                          >
                            List a New Pet
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/"
                            className="px-6 py-4 hover:py-5 hover:text-fg-alt-3 hover:bg-primary-100"
                          >
                            Home
                          </Link>
                          <Link
                            to="/shelter"
                            className="px-6 py-4 hover:py-5 hover:text-fg-alt-3 hover:bg-primary-100"
                          >
                            Shelter
                          </Link>
                          <Link
                            to="/pets"
                            className="px-6 py-4 hover:py-5 hover:text-fg-alt-3 hover:bg-primary-100"
                          >
                            Pets
                          </Link>
                          {/* <Link
                            to="/search"
                            className="px-6 py-4 hover:py-5 hover:text-fg-alt-3 hover:bg-primary-100"
                          >
                            Explore
                          </Link> */}
                        </>
                      )}
                    </div>
                  ) : (
                    <button>
                      <ChevronDoubleDownIcon
                        className="h-6 w-6 text-fg-alt-1"
                        onClick={() => setIsOpen((prev) => !prev)}
                      />
                    </button>
                  )}
                </div>
                <div className={`${flexBetween} gap-6 font-cinzel`}>
                  {user ? (
                    // Render for logged in user
                    <>
                      <Link to="/notifications/"> <BellIcon className="h-6 w-6 text-fg-alt-3" />{" "}</Link>
                      {/* Bell icon */}
                      <img
                        className="h-10 md:h-14 rounded-full"
                        alt="profile icon"
                        src={user.avatar ? user.avatar : defaultProfile}
                        onClick={() => setShowDropdown((prev) => !prev)}
                        ref={iconRef}
                      />
                      {showDropdown && <Dropdown />}
                    </>
                  ) : (
                    // Render for not logged in user
                    <>
                      <Link
                        to="/login"
                        className="text-fg-alt-3 text-xs md:text-base"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/signup"
                        className="bg-fg-accent px-3 py-1.5 rounded-md text-xs md:text-base text-bg-alt-3"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {!isAboveMedium && isOpen && (
            <div
              className="fixed left-0 bottom-0 z-40 h-full w-[180px] bg-gradient-header drop-shadow-xl text-fg-alt-3 flex flex-col gap-10 text-xl pt-8 pl-4 "
              ref={menuRef}
            >
              {localStorage.getItem("user") === "seeker" ? (
                // Render for Seeker
                <>
                  <Link
                    to="/"
                    className="px-6 py-4 hover:py-4 hover:text-fg-alt-3 hover:bg-primary-100"
                  >
                    Home
                  </Link>
                  <Link
                    to="/shelter"
                    className="px-6 py-4 hover:py-4 hover:text-fg-alt-3 hover:bg-primary-100"
                  >
                    Shelters
                  </Link>
                  <Link
                    to="/pets"
                    className="px-6 py-4 hover:py-4 hover:text-fg-alt-3 hover:bg-primary-100"
                  >
                    Pets
                  </Link>
                  <Link
                    to="/favorites"
                    className="px-6 py-4 hover:py-4 hover:text-fg-alt-3 hover:bg-primary-100"
                  >
                    Favorites
                  </Link>
                </>
              ) : localStorage.getItem("user") === "shelter" ? (
                // Render for Shelter
                <>
                  <Link
                    to="/my-shelter"
                    className="px-6 py-4 hover:py-4 hover:text-fg-alt-3 hover:bg-primary-100"
                  >
                    My Shelter Page
                  </Link>
                  <Link
                    to="/list-pet"
                    className="px-6 py-4 hover:py-4 hover:text-fg-alt-3 hover:bg-primary-100"
                  >
                    List a New Pet
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="px-6 py-4 hover:py-4 hover:text-fg-alt-3 hover:bg-primary-100"
                  >
                    Home
                  </Link>
                  <Link
                    to="/shelter"
                    className="px-6 py-4 hover:py-4 hover:text-fg-alt-3 hover:bg-primary-100"
                  >
                    Shelter
                  </Link>
                  <Link
                    to="/pets"
                    className="px-6 py-4 hover:py-4 hover:text-fg-alt-3 hover:bg-primary-100"
                  >
                    Pets
                  </Link>
                  {/* <Link
                    to="/explore"
                    className="px-6 py-4 hover:py-4 hover:text-fg-alt-3 hover:bg-primary-100"
                  >
                    Explore
                  </Link> */}
                </>
              )}
            </div>
          )}
        </nav>
      </header>
      <main className="pt-12 md:pt-20 flex-grow pb-10">
        <Outlet />
      </main>
      <footer className="">
        <div
          className={`${flexBetween} z-30 w-full bg-gradient-header h-12 md:h-20 px-4`}
        >
          <div className={`${flexBetween} flex-col mx-auto w-[1194px] gap-2`}>
            <div
              className={`${flexBetween} text-fg-alt-1 mx-auto gap-20 border-b-2 border-b-primary-100 font-fahkwang`}
            >
              <p>About</p>
              <p>Mission</p>
              <p>Donate</p>
              <p>FAQs</p>
              <p>Contact Us</p>
            </div>
            <p className="font-cinzel text-fg-alt-2">
              Copyright © 2023, CSC309 PetPal Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
