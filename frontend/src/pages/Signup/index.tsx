import { Link } from "react-router-dom";

// TODO: css elements
const Signup = () => {
  return (
    <>
      <div className="pt-8 w-full mx-auto flex flex-col justify-between items-center gap-2">
        <h1 className="text-6xl font-noto">I am ...</h1>
        <div className="flex flex-col gap-4">
          <Link
            to="/signup-seeker"
            className="border-primary-100 border-2 rounded-md px-4 py-1"
          >
            Looking to adopt a pet
          </Link>
          <Link
            to="/signup-shelter"
            className="border-primary-100 border-2 rounded-md px-4 py-1"
          >
            A pet shelter
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
