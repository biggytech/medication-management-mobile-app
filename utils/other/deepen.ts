type IncomingType = Record<string, unknown>;

export const deepen = <T extends IncomingType = IncomingType>(obj: T): T => {
  const result: T = {} as T;

  // For each object path (property key) in the object
  for (const objectPath in obj) {
    // Split path into component parts
    const parts = objectPath.split(".");

    // Create sub-objects along path as needed
    let target = result;
    while (parts.length > 1) {
      const part = parts.shift();
      if (part) {
        target = (target[part] as T) = (target[part] as T) || ({} as T);
      }
    }

    // Set value at end of path
    target[parts[0] as keyof T] = obj[objectPath];
  }

  return result;
};
