import { snakeCaseToCamelCase } from "@/utils/objects/snakeCaseToCamelCase";

export function snakeCaseToCamelCaseObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(snakeCaseToCamelCaseObject);
  } else if (obj instanceof Date) {
    return obj;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const camelKey = snakeCaseToCamelCase(key);
        acc[camelKey] = snakeCaseToCamelCaseObject(obj[key]);
        return acc;
      },
      {} as Record<string, any>,
    );
  }
  return obj;
}
