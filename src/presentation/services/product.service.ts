import { ProductModel } from "../../data";
import {
  CreateProductDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from "../../domain";

export class ProductService {
  async createProduct(createProductDto: CreateProductDto, user: UserEntity) {
    const productExist = await ProductModel.findOne({
      name: createProductDto.name,
    });

    if (productExist) {
      throw CustomError.badRequest("Product already exist");
    }

    try {
      const product = new ProductModel(createProductDto);
      await product.save();

      return product;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("user")
          .populate("category"),
      ]);

      const url = "/api/products";
      const next =
        total > page * limit ? `${url}?page=${page + 1}&limit=${limit}` : null;
      const prev =
        page - 1 > 0 ? `${url}?page=${page - 1}&limit=${limit}` : null;

      return {
        page,
        limit,
        total,
        next,
        prev,
        products,
      };
    } catch (error) {
      throw CustomError.internalServer();
    }
  }
}
