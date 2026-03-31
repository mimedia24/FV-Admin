import { useEffect, useState, useCallback } from "react";
import { apiAuthToken } from "../../secrets";

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetchIndex, setRefetchIndex] = useState(0); // Trigger state

  // Function to manually trigger a refresh
  const refetch = useCallback(() => {
    setRefetchIndex((prev) => prev + 1);
  }, []);

  const defaultHeaders = {
    "x-auth-token": apiAuthToken,
    "content-type": "application/json",
  };

  useEffect(() => {
    const fetchData = async () => {
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
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Added refetchIndex to the dependency array
  }, [url, refetchIndex]); 

  return { data, loading, error, refetch };
};

export default useFetch;