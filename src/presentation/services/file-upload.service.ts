import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";
import { Uuid } from "../../config";
import { CustomError } from "../../domain";

export class FileUploadService {
  constructor(private readonly uuid = Uuid.v4) {}
  private readonly defaultFolder = "uploads";
  private readonly defaultValidExtensions = ["png", "gif", "jpg", "jpeg"];

  public async uploadSingleFile(
    file: UploadedFile,
    folder: string = this.defaultFolder,
    validExtenstions: string[] = this.defaultValidExtensions
  ) {
    try {
      const fileExtention = file.mimetype.split("/").at(1) ?? "";

      if (!validExtenstions.includes(fileExtention)) {
        throw CustomError.badRequest(
          `Invalid file extension: ${fileExtention}, valid ones ${validExtenstions}`
        );
      }

      const destination = path.resolve(__dirname, "../../../", folder);

      this.checkFolder(destination);

      const fileName = `${this.uuid()}.${fileExtention}`;

      file.mv(`${destination}/${fileName}`);

      return { fileName };
    } catch (error) {
      // console.log({ error });
      throw error;
    }
  }

  public async uploadMultipleFiles(
    files: UploadedFile[],
    folder: string = this.defaultFolder,
    validExtenstions: string[] = this.defaultValidExtensions
  ) {
    const fileNames = await Promise.all(
      files.map((file) => this.uploadSingleFile(file, folder, validExtenstions))
    );
    return fileNames;
  }

  // PRIVATE METHODS

  private checkFolder(folderPah: string) {
    if (!fs.existsSync(folderPah)) {
      fs.mkdirSync(folderPah);
    }
  }
}
