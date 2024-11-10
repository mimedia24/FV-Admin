import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { apiAuthToken, apiPath } from "../../../secrets";

const defaultFormData = {
  password: "",
  newPassword: "",
  confirmPassword: "",
};
function ChangePassword() {
  const [formData, setFormData] = React.useState(defaultFormData);

  async function handleChangePassword(e) {
    e.preventDefault();
    const id = localStorage.getItem("id");
  
    try {
      const response = await axios.put(
        `${apiPath}/admin/change-password?id=${id}`,
        {
          password: formData.password,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            "x-auth-token": apiAuthToken,
          },
        }
      );
  
      // Log the response data for debugging (successful or not)
      console.log("Response Data:", response.data);
  
      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        setFormData(defaultFormData);
      } else {
        toast.error(data.message);  // Show error message if backend response is unsuccessful
      }
    } catch (error) {
      if (error.response) {
        console.log("Error Response Data:", error.response.data); 
        toast.error(error.response.data.message || "An error occurred"); 
      } else {
       
        console.log("Network or unexpected error:", error);
        toast.error("An error occurred while changing the password.");
      }
    }
  }
  

  function handleOnChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData);
  }

  return (
    <div className="p-12">
      <form action="" autoComplete="off" onSubmit={handleChangePassword}>
        <h1 className="text-center text-gray-500 font-bold text-3xl my-8">
          Change Password
        </h1>

        <div className="flex justify-center flex-col mt-4">
          <label htmlFor="existingPassword" className="text-[12px]">
            Password
          </label>
          <input
            className="px-3 py-1 rounded-md text-blue-500"
            type="password"
            name="password"
            id="password"
            autoComplete="off"
            onChange={handleOnChange}
          />
        </div>
        <div className="flex justify-center flex-col mt-4">
          <label htmlFor="newPassword" className="text-[12px]">
            new password
          </label>
          <input
            className="px-3 py-1 rounded-md text-blue-500"
            type="password"
            name="newPassword"
            id="newPassword"
            placeholder="new password"
            onChange={handleOnChange}
          />
        </div>
        <div className="flex justify-center flex-col mt-4">
          <label htmlFor="confirmPassword" className="text-[12px]">
            confirm password
          </label>
          <input
            className="px-3 py-1 rounded-md text-blue-500"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="confirm password"
            onChange={handleOnChange}
          />
        </div>

        <div>
          <button
            className="px-12 py-2 bg-blue-700 text-white mt-4 mx-auto rounded-full block cursor-pointer"
            type="submit"
          >
            change password
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
