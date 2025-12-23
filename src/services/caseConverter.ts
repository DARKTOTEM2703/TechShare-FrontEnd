// Utilities to convert object keys between snake_case and camelCase
export function toCamelCase(input: any): any {
  if (input === null || input === undefined) return input;
  if (Array.isArray(input)) return input.map(toCamelCase);
  if (typeof input !== 'object') return input;

  const output: Record<string, any> = {};
  for (const [key, value] of Object.entries(input)) {
    const camelKey = key.replace(/_([a-z0-9])/g, (_m, p1) => p1.toUpperCase());
    output[camelKey] = toCamelCase(value);
  }
  return output;
}

export function toSnakeCase(input: any): any {
  if (input === null || input === undefined) return input;
  if (Array.isArray(input)) return input.map(toSnakeCase);
  if (typeof input !== 'object') return input;

  const output: Record<string, any> = {};
  for (const [key, value] of Object.entries(input)) {
    const snakeKey = key.replace(/([A-Z])/g, (m) => `_${m.toLowerCase()}`);
    output[snakeKey] = toSnakeCase(value);
  }
  return output;
}

export default { toCamelCase, toSnakeCase };
