import { NextFunction, Request, Response } from "express";
import { RolUser } from "../../domain";

export class ValidRolMiddleware {
  static validateRol(roles: RolUser[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { rol } = req.body.user;

      if (!roles.includes(rol)) {
        /**
         * TODO: Validacion de Roles
         * Si el Rol del Usuario que hace la petición, no esta
         * en los roles permitidos genera un error
         */
        return res.status(403).json({
          success: false,
          error: `El usuario no tiene permisos para solicitar la informacion. RolUser: ${rol}, ValidRoles: ${roles}`,
        });
      }

      next();
    };
  }
}
