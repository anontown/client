export function isNullOrUndefined(x: any): x is null | undefined {
  return x === null || x === undefined;
}

export function nullToUndefined<T>(x: T | null): T | undefined {
  return x === null ? undefined : x;
}

export function undefinedToNull<T>(x: T | undefined): T | null {
  return x === undefined ? null : x;
}