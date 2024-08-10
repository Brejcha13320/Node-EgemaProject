//* DTOS /
export * from "./dtos/auth/login-user.dto";
export * from "./dtos/auth/register-user.dto";
export * from "./dtos/solicitud-trabajo-grado/create-solicitud-trabajo-grado.dto";
export * from "./dtos/propuesta/create-propuesta.dto";
export * from "./dtos/propuesta/update-estado-propuesta.dto";
export * from "./dtos/file/create-file.dto";
export * from "./dtos/file/get-file.dto";
export * from "./dtos/informe-final/create-informe-final.dto";

//* ERRORS /
export * from "./errors/custom-errors";
export * from "./errors/handle-error";

//* INTERFACES /
export * from "./interfaces/user.interface";
export * from "./interfaces/email.interface";
export * from "./interfaces/solicitud-trabajo-grado.interface";
export * from "./interfaces/file.interface";
export * from "./interfaces/propuesta.interface";
export * from "./interfaces/informe-final.interface";

//* TEMPLATE EMAILS /
export * from "./template-emails/register.template-email";
