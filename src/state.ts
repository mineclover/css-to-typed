export const inferredTypeMap = new Map<string, string>();
export let currentHoverKey: string | null = null;

export function setCurrentHoverKey(key: string | null) {
  currentHoverKey = key;
}
