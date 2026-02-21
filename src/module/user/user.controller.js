import { prisma } from "../../config/prisma.js";
import { createRecruiterProfile } from "../recruiter-profile/recruiter-profile.service.js";
import {
  createUser,
  getUserById,
  getUsers,
  getRecruitersByOrganization,
  deleteRecruiter,
} from "./user.service.js";

export const createUserHandler = async (req, res) => {
  const data = req.body;
  try {
    const user = await createUser(data);
    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const createRecruiterUserHandler = async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;

  try {
    const organizationId = req?.user?.sub;

    const user = await prisma.$transaction(async (tx) => {
      const user = await createUser({ email, password, userType }, tx);

      await createRecruiterProfile(
        {
          userId: user.id,
          organizationId,
          firstName,
          lastName,
        },
        tx,
      );
      return user;
    });

    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    console.error(error);
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

export const getMyUserDetailsHandler = async (req, res) => {
  try {
    const userId = req.user.sub;
    const {
      candidateProfile,
      recruiterProfile,
      organizationProfile,
      ...restData
    } = await getUserById(userId);

    const profile = organizationProfile ?? recruiterProfile ?? candidateProfile;
    const fullName =
      profile?.name ?? profile?.firstName + " " + profile?.lastName;

    return res
      .status(200)
      .json({ status: "success", data: { ...restData, fullName } });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getRecruitersHandler = async (req, res) => {
  try {
    const organizationId = req.user.sub;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getRecruitersByOrganization(organizationId, {
      page,
      limit,
    });
    return res.status(200).json({ status: "success", data: result });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteRecruiterHandler = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const organizationId = req.user.sub;

    await deleteRecruiter(recruiterId, organizationId);

    return res
      .status(200)
      .json({ status: "success", message: "Recruiter deleted successfully" });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ status: "error", message: error.message });
  }
};
