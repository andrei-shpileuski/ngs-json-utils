import { Injectable } from '@angular/core';

/**
 * A utility service for performing common JSON-related operations safely and effectively.
 */
@Injectable({
  providedIn: 'root',
})
export class NgsJsonUtilsService {
  /**
   * Safely converts a JavaScript value to a JSON string.
   * If an error occurs during serialization, returns `undefined` instead of throwing an error.
   *
   * @param data - The value to serialize into a JSON string.
   * @param replacer - Optional function to filter or transform properties.
   * @param space - Optional number of spaces for formatting the output JSON.
   * @returns A JSON string representation of the data, or `undefined` if serialization fails.
   */
  stringify(
    data: unknown,
    replacer?: (key: string, value: any) => any,
    space?: number,
  ): string | undefined {
    try {
      return JSON.stringify(data, replacer, space);
    } catch (error) {
      console.error('Error during JSON.stringify:', error);
      return undefined;
    }
  }

  /**
   * Safely parses a JSON string into a JavaScript object or value.
   * If parsing fails, returns the provided default value (or `null` if not provided).
   *
   * @param json - The JSON string to parse.
   * @param defaultValue - A fallback value to return if parsing fails (defaults to `null`).
   * @returns The parsed object/value, or the default value if parsing fails.
   */
  parse<T>(json: string, defaultValue: T | null = null): T | null {
    try {
      return JSON.parse(json) as T;
    } catch (error) {
      console.error('Error during JSON.parse:', error);
      return defaultValue;
    }
  }

  /**
   * Creates a deep copy of a given value using JSON serialization.
   * It relies on the JSON.stringify and JSON.parse methods to safely clone an object.
   * This approach doesn't handle cyclic references and non-serializable properties (like functions).
   *
   * @param data - The value to create a deep copy of.
   * @returns A deep copy of the input value, or undefined if cloning fails.
   */
  deepCopy<T>(data: T): T | undefined {
    try {
      // Serializing and immediately deserializing the object to create a deep copy
      const jsonString = JSON.stringify(data);
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error('Error during deep copy (JSON serialization)', error);
      return undefined;
    }
  }

  /**
   * Safely validates if a given string is in valid JSON format.
   * If the string is invalid, it logs the error and returns `false`.
   *
   * @param jsonString - The string to validate.
   * @returns `true` if the string is valid JSON; otherwise, `false`.
   */
  isValidJSON(jsonString: string): boolean {
    if (!jsonString) {
      console.error('Invalid JSON string: empty or undefined input');
      return false;
    }

    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      console.error('Invalid JSON string:', error);
      return false;
    }
  }

  /**
   * Compares two JSON-compatible values for equality using serialization.
   * Logs an error to the console if serialization fails.
   *
   * @param obj1 - The first JSON-compatible value to compare.
   * @param obj2 - The second JSON-compatible value to compare.
   * @returns `true` if the two values are equal, `false` otherwise.
   */
  equalJSON<T>(obj1: T, obj2: T): boolean {
    try {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    } catch (error) {
      console.error('Failed to serialize objects for comparison', {
        obj1,
        obj2,
        error,
      });
      return false;
    }
  }

  /**
   * Safely compares two values for deep equality, adhering strictly to JSON-compatible types.
   * It does not handle cyclic references or non-JSON-serializable objects.
   *
   * @param obj1 - The first value to compare.
   * @param obj2 - The second value to compare.
   * @returns `true` if the two values are deeply equal, `false` otherwise.
   */
  deepEqualJSON<T>(obj1: T, obj2: T): boolean {
    const isObject = (val: unknown): val is Record<string, unknown> =>
      typeof val === 'object' && val !== null;

    const deepEqualHelper = (a: unknown, b: unknown): boolean => {
      if (a === b) return true;

      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((item, index) => deepEqualHelper(item, b[index]));
      }

      if (isObject(a) && isObject(b)) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) return false;

        return keysA.every(
          (key) => keysB.includes(key) && deepEqualHelper(a[key], b[key]),
        );
      }

      return false;
    };

    return deepEqualHelper(obj1, obj2);
  }

  /**
   * Safely performs a deep merge of two objects using JSON serialization.
   * Handles cyclic references by catching errors gracefully.
   * Source properties will overwrite corresponding target properties.
   *
   * @param target - The target object to be updated.
   * @param source - The source object providing updates.
   * @returns A new object with merged properties, or the original target if an error occurs.
   */
  deepMerge<T>(target: T, source: Partial<T>): T {
    try {
      const targetClone = JSON.stringify(target);
      const sourceClone = JSON.stringify(source);

      const merged = JSON.parse(
        `{${targetClone.slice(1, -1)},${sourceClone.slice(1, -1)}}`,
      );

      return merged as T;
    } catch (error) {
      console.error('Error during safe deep merge:', error);
      return target;
    }
  }

  /**
   * Safely filters an object's properties, keeping only those specified in the allowed keys.
   * Handles cyclic references and non-serializable objects gracefully.
   * Logs errors if any occur.
   *
   * @param obj - The object to filter.
   * @param allowedKeys - An array of keys to retain in the filtered object.
   * @returns A new object containing only the allowed keys, or an empty object if an error occurs.
   */
  filterKeys<T extends object, K extends keyof T>(
    obj: T,
    allowedKeys: K[],
  ): Partial<Pick<T, K>> {
    try {
      const serializedObj = JSON.stringify(obj, (key, value) => {
        if (typeof value === 'function') {
          return undefined;
        }
        return value;
      });
      const parsedObj = JSON.parse(serializedObj);

      return allowedKeys.reduce(
        (acc, key) => {
          if (key in parsedObj) {
            acc[key] = parsedObj[key];
          }
          return acc;
        },
        {} as Partial<Pick<T, K>>,
      );
    } catch (error) {
      console.error('Error during filtering object:', error);
      return {} as Partial<Pick<T, K>>;
    }
  }

  /**
   * Safely recursively updates the target object with values from the updates object.
   * Handles serialization of objects and logs errors if any occur (e.g., with non-serializable data).
   * If an error occurs during the update, the target remains unchanged.
   *
   * @param target - The object to be updated.
   * @param updates - The object containing updates to apply.
   * @returns A new object with updated values, or the original target if an error occurs.
   */
  deepUpdate<T>(target: T, updates: Partial<T>): T {
    try {
      const serializedUpdates = JSON.stringify(updates, (key, value) => {
        if (typeof value === 'function' || value === undefined) {
          return undefined;
        }
        return value;
      });
      const parsedUpdates = JSON.parse(serializedUpdates);

      return Object.keys(parsedUpdates).reduce(
        (acc, key) => {
          const value = parsedUpdates[key as keyof T];
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            acc[key as keyof T] = this.deepUpdate(
              acc[key as keyof T] || ({} as T),
              value,
            ) as any;
          } else {
            acc[key as keyof T] = value as any;
          }
          return acc;
        },
        { ...target },
      );
    } catch (error) {
      console.error('Error during deep update:', error);
      return target;
    }
  }

  /**
   * Searches for a value in a nested object by its key.
   *
   * @param obj - The object to search within.
   * @param key - The key to look for.
   * @returns The value associated with the key, or `undefined` if not found.
   */
  findValueByKey<T extends object, K extends keyof T>(
    obj: T,
    key: K,
  ): T[K] | undefined {
    if (key in obj) {
      return obj[key];
    }

    for (const k in obj) {
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        const result = this.findValueByKey(obj[k] as T, key);
        if (result !== undefined) {
          return result;
        }
      }
    }

    return undefined;
  }

  /**
   * Safely searches for a value in a nested object by its key.
   * If an error occurs during the search, returns `undefined` instead of throwing.
   *
   * @param obj - The object to search within.
   * @param key - The key to look for.
   * @returns The value associated with the key, or `undefined` if not found or an error occurs.
   */
  safeFindValueByKey<T extends object, K extends keyof T>(
    obj: T,
    key: K,
  ): T[K] | undefined {
    try {
      if (key in obj) {
        return obj[key];
      }

      for (const k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
          const result = this.safeFindValueByKey(obj[k] as T, key);
          if (result !== undefined) {
            return result;
          }
        }
      }

      return undefined;
    } catch (error) {
      console.error('Error during object search:', error);
      return undefined;
    }
  }

  /**
   * Safely removes all `undefined` values from an object.
   * If an error occurs during the cleaning process, returns the original object.
   *
   * @param obj - The object to clean.
   * @returns A new object without `undefined` values, or the original object if an error occurs.
   */
  removeUndefined<T>(obj: T): T {
    try {
      return JSON.parse(
        JSON.stringify(obj, (_, value) =>
          value === undefined ? undefined : value,
        ),
      );
    } catch (error) {
      console.error('Error during object cleaning:', error);
      return obj;
    }
  }

  /**
   * Safely converts a Map object to a plain JSON object.
   * If an error occurs during the conversion, returns an empty object.
   *
   * @param map - The Map to convert.
   * @returns A JSON object with the same key-value pairs as the Map, or an empty object if an error occurs.
   */
  mapToJSON<K, V>(map: Map<K, V>): Record<string, V> {
    try {
      const obj: Record<string, V> = {};
      map.forEach((value, key) => {
        obj[String(key)] = value;
      });
      return obj;
    } catch (error) {
      console.error('Error during Map to JSON conversion:', error);
      return {};
    }
  }

  /**
   * Safely converts a plain JSON object to a Map object.
   * If an error occurs during the conversion, returns an empty Map.
   *
   * @param json - The JSON object to convert.
   * @returns A Map containing the key-value pairs from the JSON object, or an empty Map if an error occurs.
   */
  jsonToMap<V>(json: Record<string, V>): Map<string, V> {
    try {
      if (json && typeof json === 'object' && !Array.isArray(json)) {
        return new Map(Object.entries(json));
      }
      return new Map();
    } catch (error) {
      console.error('Error during JSON to Map conversion:', error);
      return new Map();
    }
  }

  /**
   * Safely merges multiple arrays of objects, keeping only unique objects based on a specified key.
   * If invalid input is provided (non-array or non-object values), returns an empty array.
   *
   * @param arrays - An array of arrays of objects to merge.
   * @param key - The key used to determine uniqueness (objects with the same key value are considered duplicates).
   * @returns An array of unique objects based on the specified key, or an empty array if the input is invalid.
   */
  mergeUniqueByKey<T extends Record<string, any>>(
    arrays: T[],
    key: string,
  ): T[] {
    // Проверяем, что входные данные являются массивом и ключ - строкой
    if (!Array.isArray(arrays) || typeof key !== 'string') return [];

    return arrays.flat().reduce((acc: T[], obj: T) => {
      // Проверяем, что каждый объект содержит заданный ключ
      if (
        obj &&
        obj.hasOwnProperty(key) &&
        !acc.some((item) => item[key] === obj[key])
      ) {
        acc.push(obj);
      }
      return acc;
    }, []);
  }

  /**
   * Safely removes all keys from an object that have null or empty values.
   * If the input is not an object, returns an empty object.
   *
   * @param obj - The object from which to remove empty values.
   * @returns A new object with only non-empty values, or an empty object if the input is invalid.
   */
  removeEmptyValues(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return {};

    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v != null && v !== ''),
    );
  }

  /**
   * Safely retrieves the value from an object based on a specified path (array of keys).
   * Returns undefined if the object or the path is invalid.
   *
   * @param obj - The object to retrieve the value from.
   * @param path - An array of keys representing the path to the value.
   * @returns The value at the specified path, or undefined if the object or path is invalid.
   */
  getByPath(obj: any, path: string[]): any {
    if (typeof obj !== 'object' || obj === null || !Array.isArray(path))
      return undefined;

    return path.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj,
    );
  }

  /**
   * Safely extracts unique values from an array of objects based on a specific key.
   * If the input is invalid (non-array or non-object values), returns an empty array.
   *
   * @param arr - An array of objects from which to extract unique values.
   * @param key - The key used to extract unique values.
   * @returns An array of unique values based on the specified key, or an empty array if the input is invalid.
   */
  uniqueValuesByKey<T extends Record<string, unknown>>(
    arr: T[],
    key: string,
  ): unknown[] {
    if (!Array.isArray(arr) || typeof key !== 'string') return [];

    return Array.from(
      new Set(arr.map((item) => (item && key in item ? item[key] : undefined))),
    );
  }

  /**
   * Safely flattens a nested object into a single-level object, using dot notation for nested keys.
   * If the input is invalid (non-object or null), returns an empty object.
   *
   * @param obj - The object to flatten.
   * @param prefix - The prefix to prepend to each key (used for nested objects).
   * @returns A flattened object with dot notation keys, or an empty object if the input is invalid.
   */
  flattenObject<T extends Record<string, unknown>>(
    obj: T,
    prefix: string = '',
  ): Record<string, unknown> {
    if (typeof obj !== 'object' || obj === null) return {};

    return Object.entries(obj).reduce(
      (acc: Record<string, unknown>, [key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
          Object.assign(
            acc,
            this.flattenObject(value as Record<string, unknown>, newKey),
          );
        } else {
          acc[newKey] = value;
        }
        return acc;
      },
      {},
    );
  }
}
