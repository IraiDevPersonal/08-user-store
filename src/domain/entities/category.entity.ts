import { CustomError } from "../errors/custom.error";

export class CategoryEntity {
  constructor(
    public id: string,
    public name: string,
    public available: boolean
  ) {}

  static fromObject(object: Record<string, any>) {
    const { _id, id, name, available } = object;

    if (!_id && id) {
      throw CustomError.badRequest("Missing id");
    }

    if (!name) {
      throw CustomError.badRequest("Missing name");
    }

    if (typeof available !== "boolean") {
      throw CustomError.badRequest("Available type is not valid");
    }

    return new CategoryEntity(_id || id, name, available);
  }
}
