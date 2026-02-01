import { createUser, getUsers } from "./user.service.js";

export const createUserHandler = async (req, res) => {
  const data = req.body;
  try {
    const user = await createUser(data);
    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getUsers();
    return res.status(200).json({ status: "success", data: users });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};
