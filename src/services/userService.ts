import axios from "../api/axios";

export const fetchUserById = async (userId: string) => {
  try {
    const response = await axios.get(`/users/${userId}`);
    const user = response.data;
    return user;
  } catch (error: any) {
    throw new Error(
      `Error fetching user for userId ${userId}: ${error.message}`
    );
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get("/users");
    return response.data.list;
  } catch (error: any) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};
