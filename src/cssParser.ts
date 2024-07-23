export function getAllClassNames(content: string) {
  const matchLineRegexp = /.*[,{]/g;
  const lines = content.match(matchLineRegexp);
  if (lines === null) {
    return [];
  }

  const classNames = lines.join(" ").match(/\.[_A-Za-z0-9-]+/g);
  if (classNames === null) {
    return [];
  }

  const uniqNames = [...new Set(classNames)]
    .map((item) => item.slice(1))
    .filter((item) => !/^[0-9]/.test(item));
  return uniqNames;
}
