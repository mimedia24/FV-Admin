import { useEffect, useState } from "react";
import { apiAuthToken } from "../../secrets";

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const defaultHeaders = {
    "x-auth-token": apiAuthToken,
    "content-type": "application/json",
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const apiResponse = await fetch(
          `${import.meta.env.VITE_API_PATH}${url}`,
          {
            ...options,
            headers: {
              ...defaultHeaders,
              ...options.header,
            },
            credentials: "include"
          }
        );

        const result = await apiResponse.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
