import logo from "../../assets/logo.png";
import useMediaQuery from "../../hooks/usemediaQuery";
import { useState, useEffect, useRef } from "react";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/solid";
import { Outlet, Link } from "react-router-dom";
type Props = {};

// TODO: responsive design (scaling elements)
// TODO: css design update
// TODO: add transition on menu page (responsive)
// TODO: fix paragraphs with proper links
// TODO: add one more navbar for the logged in user

const Layout = (props: Props) => {
  const flexBetween = "flex justify-between items-center";
  const isAboveMedium = useMediaQuery("(min-width: 1060px)");
  const [isOpen, setIsOpen] = useState(false);

  let menuRef = useRef<HTMLDivElement>(null);

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
  });

  return (
    <>
      <header>
        <nav>
          <div
            className={`${flexBetween} fixed top-0 z-30 w-full bg-gradient-header h-12 md:h-20 px-4`}
          >
            <div className={`${flexBetween} mx-auto w-[1194px]`}>
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
                      {/* <p className="font-bold bg-bg-alt-4 text-bg-accent px-6 py-4 border-b-8 border-fg-accent hover:text-fg-alt-3"> */}
                      {/*   Home */}
                      {/* </p> */}
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
                      <p className="px-6 py-4 hover:py-5 hover:text-fg-alt-3 hover:bg-primary-100">
                        Pets
                      </p>
                      <Link
                      to="/search"
                       className="px-6 py-4 hover:py-5 hover:text-fg-alt-3 hover:bg-primary-100">
                        Explore
                      </Link>
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
                </div>
              </div>
            </div>
          </div>
          {!isAboveMedium && isOpen && (
            <div
              className="fixed left-0 bottom-0 z-40 h-full w-[180px] bg-gradient-header drop-shadow-xl text-fg-alt-3 flex flex-col gap-10 text-xl pt-8 pl-4 "
              ref={menuRef}
            >
              <p>Home</p>
              <p>Shelter</p>
              <p>Pets</p>
              <p>Explore</p>
            </div>
          )}
        </nav>
      </header>
      <main className="pt-12 md:pt-20">
        <Outlet />
      </main>
      <footer>
        <div
          className={`${flexBetween} fixed bottom-0 z-30 w-full bg-gradient-header h-12 md:h-20 px-4`}
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
    </>
  );
};

export default Layout;
