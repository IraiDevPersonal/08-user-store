import { Request, Response } from "express";
import { FileUploadService } from "../services/file-upload.service";
import { CustomError } from "../../domain";
import { UploadedFile } from "express-fileupload";

export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  uploadSingleFile = (req: Request, res: Response) => {
    const type = req.params.type;
    const file = req.body.files.at(0) as UploadedFile;

    this.fileUploadService
      .uploadSingleFile(file, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => CustomError.handleError(error, res));
  };

  uploadMultipleFile = (req: Request, res: Response) => {
    const type = req.params.type;
    const files = req.body.files as UploadedFile[];

    this.fileUploadService
      .uploadMultipleFiles(files, `uploads/${type}`)
      .then((uploaded) => res.json(uploaded))
      .catch((error) => CustomError.handleError(error, res));
  };
}
