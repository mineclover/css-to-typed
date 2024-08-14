export const arrayToStringTyped = (arr: string[], name: string) => {
  const types = arr.map((item) => '"' + item + '"').join(" | ");
  const context = "export type " + name + "Styles" + " = " + types;
  return context;
};

export function typeToConstantObject(type: string): string {
  // Remove whitespace and split the string into key-value pairs
  const pairs = type.replace(/\s/g, "").slice(1, -1).split(",");

  // Extract only the keys
  const keys = pairs.map((pair) => pair.split(":")[0]);

  // Create an object with keys
  return `{ ${keys.join(", ")} }`;
}
