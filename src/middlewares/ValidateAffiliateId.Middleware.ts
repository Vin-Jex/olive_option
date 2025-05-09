import { NextFunction, Request, Response } from "express";

export const validateAffiliateId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (id && isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid affiliate ID" });
  }

  next();
};