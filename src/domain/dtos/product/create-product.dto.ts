import { Validators } from "../../../config";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string, // ID del usuario
    public readonly category: string // ID de la categoría
  ) {}

  static create(props: Record<string, any>): [string?, CreateProductDto?] {
    const { name, available, price, description, user, category } = props;

    if (!name) {
      return ["Missing name", undefined];
    }
    if (!user) {
      return ["Missing user", undefined];
    }
    if (!category) {
      return ["Missing category", undefined];
    }
    if (!Validators.isMongoId(user)) {
      return ["Invalid User id", undefined];
    }
    if (!Validators.isMongoId(category)) {
      return ["Invalid Category id", undefined];
    }

    return [
      undefined,
      new CreateProductDto(
        name,
        !!available,
        price,
        description,
        user,
        category
      ),
    ];
  }
}
