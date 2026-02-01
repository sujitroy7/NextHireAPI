import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string("Email is required").email("Please enter valid email"),
    password: z.string("Password is required"),
    userType: z
      .enum(["ORGANIZATION", "RECRUITER", "CANDIDATE"])
      .default("CANDIDATE"),
  }),
});

export const updateUserPasswordSchema = z.object({
  body: z.object({
    id: z.number("Id is required"),
    oldPassword: z.string("Old password is required"),
    newPassword: z.string("New password is required"),
  }),
});
