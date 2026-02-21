import { z } from "zod";
import { prisma } from "../../config/prisma.js";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string("Email is required").email("Please enter valid email"),
    password: z.string("Password is required"),
    userType: z.enum(["ORGANIZATION", "CANDIDATE"]).default("CANDIDATE"),
  }),
});

export const createRecruiterUserSchema = z.object({
  body: z.object({
    firstName: z
      .string("First Name is required")
      .min(2, "First name must be at least 2 characters long"),
    lastName: z
      .string("Last Name is required")
      .min(2, "Last name must be at least 2 characters long"),
    email: z
      .string("Email is required")
      .email("Please enter valid email")
      .refine(async (email) => {
        const response = await prisma.user.findUnique({ where: { email } });
        console.log(response, "response");
        return !response;
      }, "Email already in use"),
    password: z.string("Password is required").default("password"),
    userType: z.enum(["RECRUITER"]).default("RECRUITER"),
  }),
});

export const updateUserPasswordSchema = z.object({
  body: z.object({
    id: z.string("Id is required"),
    oldPassword: z
      .string("Old password is required")
      .min(8, "Password must be at least 8 characters long"),
    newPassword: z
      .string("New password is required")
      .min(8, "Password must be at least 8 characters long"),
  }),
});
