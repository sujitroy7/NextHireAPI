import { prisma } from "../../config/prisma.js";

export const createJob = async (data) => {
  const {
    recruiterId,
    organizationId,
    title,
    description,
    employmentType,
    salaryMin,
    salaryMax,
    isActive,
    publishedAt,
  } = data;

  return await prisma.job.create({
    data: {
      recruiterId,
      organizationId,
      title,
      description,
      employmentType,
      salaryMin,
      salaryMax,
      isActive,
      publishedAt,
    },
  });
};

export const getAllJobsByRecruiter = async (recruiterId) => {
  return await prisma.job.findMany({
    where: {
      recruiterId,
    },
  });
};

export const getJobDetailes = async (jobId) => {
  return await prisma.job.findFirst({
    where: {
      id: jobId,
    },
  });
};

export const updateJob = async (jobId, data) => {
  const {
    title,
    description,
    employmentType,
    salaryMin,
    salaryMax,
    isActive,
    publishedAt,
  } = data;

  return await prisma.job.update({
    data: {
      title,
      description,
      employmentType,
      salaryMin,
      salaryMax,
      isActive,
      publishedAt,
    },
    where: {
      id: jobId,
    },
  });
};

export const getCandidateJobs = async (filters) => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    employmentType,
    isActive,
    organizationId,
    recruiterId,
    search,
    salaryMin,
    salaryMax,
    publishedFrom,
    publishedTo,
    createdFrom,
    createdTo,
  } = filters;

  const allowedSortBy = [
    "publishedAt",
    "createdAt",
    "salaryMin",
    "salaryMax",
    "title",
  ];
  const safeSortBy = allowedSortBy.includes(sortBy) ? sortBy : "publishedAt";
  const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";
  const pageNumber =
    Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const limitNumber =
    Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  const normalizedIsActive =
    typeof isActive === "boolean"
      ? isActive
      : typeof isActive === "string"
      ? isActive.toLowerCase() === "true"
      : true;
  const normalizedSalaryMin = Number.isFinite(Number(salaryMin))
    ? Number(salaryMin)
    : undefined;
  const normalizedSalaryMax = Number.isFinite(Number(salaryMax))
    ? Number(salaryMax)
    : undefined;

  const where = {
    ...(employmentType ? { employmentType } : {}),
    ...(typeof normalizedIsActive === "boolean"
      ? { isActive: normalizedIsActive }
      : { isActive: true }),
    ...(organizationId ? { organizationId } : {}),
    ...(recruiterId ? { recruiterId } : {}),
    ...(normalizedSalaryMin !== undefined
      ? { salaryMin: { gte: normalizedSalaryMin } }
      : {}),
    ...(normalizedSalaryMax !== undefined
      ? { salaryMax: { lte: normalizedSalaryMax } }
      : {}),
    ...(publishedFrom || publishedTo
      ? {
          publishedAt: {
            ...(publishedFrom ? { gte: publishedFrom } : {}),
            ...(publishedTo ? { lte: publishedTo } : {}),
          },
        }
      : {}),
    ...(createdFrom || createdTo
      ? {
          createdAt: {
            ...(createdFrom ? { gte: createdFrom } : {}),
            ...(createdTo ? { lte: createdTo } : {}),
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, jobs] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      orderBy: { [safeSortBy]: safeSortOrder },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    }),
  ]);

  return { jobs, total, page: pageNumber, limit: limitNumber };
};
