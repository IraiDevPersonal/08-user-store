export class PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}

  static create(page: number, limit: number): [string?, PaginationDto?] {
    if (isNaN(page) || isNaN(limit)) {
      return ["Page and Limit must be numbers", undefined];
    }
    if (limit <= 0) {
      return ["Limit must be greater than 0", undefined];
    }
    if (page <= 0) {
      return ["Page must be greater than 0", undefined];
    }

    return [undefined, new PaginationDto(page, limit)];
  }
}
