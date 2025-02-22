import multer from "multer";

const storage = multer.memoryStorage();
const multerMiddleware = multer({ storage });

export default multerMiddleware;

// import { Request } from "express";
// import { v4 as uuidv4 } from "uuid";
// import multer, { diskStorage } from "multer";

// const PATH_STORAGE = `${process.cwd()}/uploads`;

// const storage = diskStorage({
//   destination(req: Request, file: Express.Multer.File, cb: any) {
//     cb(null, PATH_STORAGE);
//   },
//   filename(req: Request, file: Express.Multer.File, cb: any) {
//     const ext = file.originalname.split(".").pop();
//     const fileNameRandom = `${uuidv4()}.${ext}`;
//     cb(null, fileNameRandom);
//   },
// });

// const multerMiddleware = multer({ storage });

// export default multerMiddleware;
