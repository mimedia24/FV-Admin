import { apiAuthToken, apiPath } from "../../secrets";

export default async function handleApiRequest(url, options) {
  let loading = true;
  const accessToken = localStorage.getItem("AccessToken");

  const defaultHeaders = {
    "x-auth-token": apiAuthToken,
    "content-type": "application/json",
    ...(accessToken ? { AccessToken: accessToken } : {}),
  };

  try {
    const apiResponse = await fetch(`${apiPath}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });


    const result = await apiResponse.json();

    loading = false;

    return { loading, result };
  } catch (error) {
    throw new Error(error);
  }
}
