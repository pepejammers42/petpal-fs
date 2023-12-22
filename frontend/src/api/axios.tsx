import axios from "axios";

export default axios.create({
  baseURL: "http://18.221.149.61:8000/",
  headers: {
    "Content-type": "application/json",
  },
});
