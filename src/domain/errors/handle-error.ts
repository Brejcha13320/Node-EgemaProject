import { Response } from "express";
import { CustomError } from "./custom-errors";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library";

export class HandleError {
  static error(error: unknown, res: Response) {
    console.log(`${error}`);

    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    if (error instanceof PrismaClientKnownRequestError) {
      // Manejar errores conocidos de Prisma
      return res.status(500).json({ error: error.message });
    } else if (error instanceof PrismaClientUnknownRequestError) {
      // Manejar errores desconocidos de Prisma
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Servicer error" });
  }
}
