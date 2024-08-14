export const arrayToStringTyped = (arr: string[], name: string) => {
  const types = arr.map((item) => '"' + item + '"').join(" | ");
  const context = "export type " + name + "Styles" + " = " + types;
  return context;
};

export function typeToConstantObject(type: string): string {
  // Remove type information, keeping only the keys
  return type.replace(/:\s*[^,}\s]+/g, "");
}
