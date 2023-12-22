import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";

// "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGV0fGVufDB8fDB8fHww&auto=format&fit=crop&w=700&q=60";
const Home = () => {
  return (
    <>
      <div className="flex mx-auto max-w-[1200px] justify-center">
        <div className="flex flex-col">
          <p className="">Petpal</p>
          <input type="text" placeholder="What are you looking for?" />
          <Link to="/">Let's find your new best friend!</Link>
        </div>
      </div>
    </>
  );
};
export default Home;
