import z from "zod";

export const createOrganizationProfileSchema = z.object({
  body: z.object({
    userId: z.string(),
    name: z.string().min(1, "Name is required"),
    about: z.string().nullable().optional(),
    isActive: z.boolean().default(true),
    isVerified: z.boolean().default(false),
    organizationTypeId: z.number().int().nullable().optional(),
    publicEmail: z.string().email().nullable().optional(),
    publicPhone: z.string().nullable().optional(),
    websiteUrl: z.string().url().nullable().optional(),
    linkedinUrl: z.string().url().nullable().optional(),
  }),
});

export const updateOrganizationProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").optional(),
    about: z.string().nullable().optional(),
    isActive: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    organizationTypeId: z.number().int().nullable().optional(),
    publicEmail: z.string().email().nullable().optional(),
    publicPhone: z.string().nullable().optional(),
    websiteUrl: z.string().url().nullable().optional(),
    linkedinUrl: z.string().url().nullable().optional(),
  }),
});
