export class CreateCategoryDto {
  private constructor(public name: string, public available: boolean) {}

  static create(object: Record<string, any>): [string?, CreateCategoryDto?] {
    const { name, available } = object;
    let availableBoolean = available;

    if (!name) {
      return ["Missing name", undefined];
    }
    if (typeof available !== "boolean") {
      availableBoolean = available === "true";
    }

    return [undefined, new CreateCategoryDto(name, availableBoolean)];
  }
}
