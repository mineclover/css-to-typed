export const arrayToStringTyped = (arr: string[], name: string) => {
  const types = arr.map((item) => '"' + item + '"').join(" | ");
  const context = "export type " + name + "Styles" + " = " + types;
  return context;
};

export function formatFunctionType(funcString: string): string {
  // 함수 시그니처를 파싱하여 수정
  const match = funcString.match(/^(.*?)\s*{/);
  if (match) {
    const signature = match[1].trim();
    // 반환 타입이 명시적으로 지정되어 있지 않으면 ': void' 추가
    const returnType =
      signature.includes(")") && !signature.includes("):") ? ": void" : "";
    return `${signature}${returnType} => {...}`;
  }
  return funcString;
}

export function typeToConstantObject(type: string): string {
  // Remove whitespace and unnecessary characters
  const cleanType = type.replace(/\s/g, "").replace(/;/g, ",");

  // Extract the main object structure
  const match = cleanType.match(/^\{(.+)\}$/);
  if (!match) return type; // Return original if not an object type

  const properties = match[1].split(",");
  const result: string[] = [];

  properties.forEach((prop) => {
    const [key, value] = prop.split(":");
    if (value && value.startsWith("{")) {
      // For nested objects, keep the structure
      result.push(key);
    } else {
      // For simple properties, just add the key
      result.push(key);
    }
  });

  return `{ ${result.join(", ")} }`;
}
