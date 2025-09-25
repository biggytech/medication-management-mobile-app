import { camelCaseToSnakeCase } from "@/utils/other/camelCaseToSnakeCase";

export function camelCaseToSnakeCaseObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(camelCaseToSnakeCaseObject);
  } else if (obj instanceof Date) {
    return obj;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const snakeKey = camelCaseToSnakeCase(key);
        acc[snakeKey] = camelCaseToSnakeCaseObject(obj[key]);
        return acc;
      },
      {} as Record<string, any>,
    );
  }
  return obj;
}
