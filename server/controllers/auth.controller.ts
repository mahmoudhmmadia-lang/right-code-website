import { compare } from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../prisma/db";
import {
  clientErrorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/responses";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const account = await db.account.findUnique({ where: { email } });

    if (
      !account?.password ||
      account.role !== 0 ||
      !(await compare(password, account.password))
    ) {
      return clientErrorResponse({
        res,
        req,
        message: "INVALID_CREDENTIALS",
        status: 401,
      });
    }

    const token = jwt.sign({ id: account.id }, process.env.SECRET!, {
      expiresIn: "30d",
    });
    await db.account.update({ where: { id: account.id }, data: { token } });

    return successResponse({
      res,
      req,
      data: {
        id: account.id,
        email: account.email,
        fullName: account.fullName,
        avatarUrl: account.avatarUrl,
        locale: account.locale,
        role: account.role,
        token,
      },
    });
  } catch (err) {
    return serverErrorResponse({ res, req, err });
  }
}
