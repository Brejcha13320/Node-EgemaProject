import { Response } from "express";
import { CustomError } from "./custom-errors";

export class HandleError {
  static error(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: "Internal Servicer error" });
  }
}
