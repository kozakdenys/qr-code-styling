import { UnknownObject } from "../types";

const isObject = (obj: Record<string, unknown>): boolean => !!obj && typeof obj === "object" && !Array.isArray(obj);

export default function mergeDeep(target: UnknownObject, ...sources: UnknownObject[]): UnknownObject {
  if (!sources.length) return target;
  const source = sources.shift();
  if (source === undefined || !isObject(target) || !isObject(source)) return target;
  target = { ...target };
  Object.keys(source).forEach((key: string): void => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = sourceValue;
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });

  return mergeDeep(target, ...sources);
}
