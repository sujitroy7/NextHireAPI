import {createUser} from './user.service.js'

export const createUserHandler = async(req, res)=>{
  const data = req.body;
  try {
   const user = await createUser(data);
  return res.status(201).json({ status: "success", data: user });   
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });   
  }

}