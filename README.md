# ngs-json-utils

`ngs-json-utils` is a lightweight utility library for Angular applications that provides easy-to-use functions for working with JSON objects. It includes methods for deep cloning, serialization, and deserialization of JSON data, designed specifically for Angular projects with TypeScript support.

## Features

- **JSON Serialization & Parsing**: Convert between objects and JSON with default values.
- **Deep Object Manipulation**: Copy, merge, and update nested objects.
- **Object Comparison**: Shallow and deep object equality checks.
- **Key Filtering**: Filter objects by specified keys.
- **Map <-> JSON Conversion**: Convert between JSON objects and `Map`.
- **Safe Key Search**: Safe key lookup in objects.
- **Validation**: Validate JSON strings for correctness.

### Navigation

- [Features](#features)
- [Methods](#methods)
  - [stringify](#stringify)
  - [parse](#parse)
  - [deepCopy](#deepcopy)
  - [isValidJSON](#isvalidjson)
  - [equalJSON](#equaljson)
  - [deepEqualJSON](#deepequaljson)
  - [deepMerge](#deepmerge)
  - [filterKeys](#filterkeys)
  - [deepUpdate](#deepupdate)
  - [findValueByKey](#findvaluebykey)
  - [safeFindValueByKey](#safefindvaluebykey)
  - [removeUndefined](#removeundefined)
  - [mapToJSON](#maptojson)
  - [jsonToMap](#jsontomap)
  - [mergeUniqueObjects](#mergeuniqueobjects)
- [Contributing](#contributing)

---

## Installation & Usage in 3 steps

1. Install `ngs-json-utils` via npm:

```bash
npm install ngs-json-utils
```

2. Import NgsJsonUtilsService into your Angular component or service:

```typescript
import { NgsJsonUtilsService } from "ngs-json-utils";
```

3. Inject the service into your component by using dependency injection or the inject function:

```typescript
export class MyComonent {
  constructor(private ngsJsonUtilsService: NgsJsonUtilsService) {}
  // or
  ngsJsonUtilsService = inject(NgsJsonUtilsService);
}
```

---

## Methods

- ### **stringify**
  Converts an object into a JSON string.

```typescript
const result = this.ngsJsonUtilsService.stringify({ name: "John", age: 30 });

console.log(result); // {"name":"John","age":30}
```

- ### **parse**
  Converts a JSON string into a JavaScript object.

```typescript
const json = '{"name":"John","age":30}';
const obj = this.ngsJsonUtilsService.parse(json, { name: "Default", age: 0 });

console.log(obj); // { name: "John", age: 30 }
```

---

- ### **deepCopy**
  Creates a deep copy of an object.

```typescript
const original = { name: "John", details: { age: 30 } };
const copy = this.ngsJsonUtilsService.deepCopy(original);

console.log(copy); // { name: 'John', details: { age: 30 } }
```

---

- ### **isValidJSON**
  Checks if a string is a valid JSON.

```typescript
const isValid = this.ngsJsonUtilsService.isValidJSON('{"name":"John"}');

console.log(isValid); // true
```

---

- ### **equalJSON**
  Compares two objects based on their serialized representations.

```typescript
const obj1 = { name: "John" };
const obj2 = { name: "John" };
const areEqual = this.ngsJsonUtilsService.equalJSON(obj1, obj2);

console.log(areEqual); // true
```

---

- ### **deepEqualJSON**
  Performs a deep comparison of two objects.

```typescript
const obj1 = { name: "John", details: { age: 30 } };
const obj2 = { name: "John", details: { age: 30 } };
const areEqualDeep = this.ngsJsonUtilsService.deepEqualJSON(obj1, obj2);

console.log(areEqualDeep); // true
```

---

- ### **deepMerge**
  Performs a deep merge of two objects.

```typescript
const target = { name: "John", details: { age: 30 } };
const source = { details: { age: 31 }, address: "New York" };
const merged = this.ngsJsonUtilsService.deepMerge(target, source);

console.log(merged); // { name: 'John', details: { age: 31 }, address: 'New York' }
```

---

- ### **filterKeys**
  Filters an object, keeping only specified keys.

```typescript
const obj = { name: "John", age: 30, country: "USA" };
const filtered = this.ngsJsonUtilsService.filterKeys(obj, ["name", "country"]);

console.log(filtered); // { name: 'John', country: 'USA' }
```

---

- ### **deepUpdate**
  Deeply updates an object based on another.

```typescript
const target = { name: "John", details: { age: 30 } };
const updates = { details: { age: 31 }, country: "USA" };
const updated = this.ngsJsonUtilsService.deepUpdate(target, updates);

console.log(updated); // { name: 'John', details: { age: 31 }, country: 'USA' }
```

---

- ### **findValueByKey**
  Finds a value by key in an object or nested object.

```typescript
const obj = { name: "John", details: { age: 30 } };
const value = this.ngsJsonUtilsService.findValueByKey(obj, "age");

console.log(value); // 30
```

---

- ### **safeFindValueByKey**
  Safely finds a value by key, returning undefined in case of an error.

```typescript
const obj = { name: "John", details: { age: 30 } };
const value = this.ngsJsonUtilsService.safeFindValueByKey(obj, "age");

console.log(value); // 30
```

---

- ### **removeUndefined**
  Removes all undefined values from an object.

```typescript
const obj = { name: "John", age: undefined, country: "USA" };
const cleaned = this.ngsJsonUtilsService.removeUndefined(obj);

console.log(cleaned); // { name: 'John', country: 'USA' }
```

---

- ### **mapToJSON**
  Converts a Map into a regular JSON object.

```typescript
const map = new Map();
map.set("name", "John");
map.set("age", 30);
const json = this.ngsJsonUtilsService.mapToJSON(map);

console.log(json); // { name: 'John', age: 30 }
```

---

- ### **jsonToMap**
  Converts a regular JSON object into a Map.

```typescript
const json = { name: "John", age: 30 };
const map = this.ngsJsonUtilsService.jsonToMap(json);

console.log(map); // Map { 'name' => 'John', 'age' => 30 }
```

---

- ### **mergeUniqueObjects**
  Merges multiple arrays of objects, keeping only unique objects based on a key.

```typescript
const array1 = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];
const array2 = [
  { id: 2, name: "Jane" },
  { id: 3, name: "Jim" },
];
const uniqueObjects = this.ngsJsonUtilsService.mergeUniqueObjects(array1, array2, "id");

console.log(uniqueObjects); // [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 3, name: 'Jim' }]
```

---

## Contributing

To contribute or use the library in development mode, you can clone the repository and install dependencies.

### Steps to contribute:

1. Fork the repository
2. Clone the repo, install dependencies

```bash
git clone https://github.com/andrei-shpileuski/ngx-json-utils.git
```

```bash
cd ngx-json-utils
```

```bash
npm install
```

3. Create a new branch for your changes
4. Submit a pull request with a detailed description of the changes

---

## Keywords

angular, json, utils, deep copy, cloning, serialization, deserialization, angular library, typescript, angular utils, ng, ngx, json utilities, json manipulation, deep merge, object comparison, angular helpers
