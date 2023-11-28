import logo from "@/assets/logo.png";
type Props = {};

const Navbar = (props: Props) => {
  const flexBetween = "flex justify-between items-center";

  return (
    <nav>
      <div className={`${flexBetween} fixed top-0 z-30 w-full`}>
        <div className={`${flexBetween} mx-auto`}>
          <div className={`${flexBetween} w-full gap-16 text-white`}>
            <img alt="logo" src={logo} />
            <p>Petpal</p>
            <div className={`${flexBetween} gap-8`}>
              <p>Home</p>
              <p>Shelter</p>
              <p>Pets</p>
              <p>Explore</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
