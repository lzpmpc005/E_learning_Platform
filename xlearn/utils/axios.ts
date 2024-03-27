import axios from "axios";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_CONTENT_HOST}`,
});

export default instance;
