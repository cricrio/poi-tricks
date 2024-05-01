import { addKey, difference, differenceInArray } from "./utils.server";

describe(addKey.name, () => {
  it("should add the key to each element in the array", () => {
    const before = ["a", "b", "c"];
    const after = ["a", "b", "c", "d"];
    const key = "d";
    const expected = [{ key, value: "d", action: "add" }];
    const actual = addKey(differenceInArray(before, after), key);
    expect(actual).toEqual(expected);
  });
});
describe(differenceInArray.name, () => {
  it("should return difference between two arrays", () => {
    expect(differenceInArray(["a", "b", "d"], ["b", "c", "z"])).toEqual([
      { action: "remove", value: "a" },
      { action: "remove", value: "d" },
      { action: "add", value: "c" },
      { action: "add", value: "z" },
    ]);
  });
});
describe(difference.name, () => {
  it("should return an empty array when the initial and updated objects are the same", () => {
    const initial = {
      name: "test trick",
      tags: ["tag1", "tag2"],
      difficulty: "basics",
      preview: "test preview",
    };
    const updated = {
      name: "test trick",
      tags: ["tag1", "tag2"],
      difficulty: "basics",
      preview: "test preview",
    };
    const result = difference(updated, initial);
    expect(result).toEqual([]);
  });

  it("should return an array of changes when the initial and updated objects are different", () => {
    const initial = {
      name: "test trick",
      tags: ["tag1", "tag2"],
      difficulty: "basics",
      preview: "tt",
    };
    const updated = {
      name: "new trick",
      tags: ["tag1", "tag3"],
      difficulty: "basics",
      preview: "tt",
    };
    const result = difference(updated, initial);
    expect(result).toEqual([
      { key: "name", action: "update", value: "new trick" },
      { key: "tags", action: "remove", value: "tag2" },
      { key: "tags", action: "add", value: "tag3" },
    ]);
  });

  it("use-case: remove all tags", () => {
    const initial = {
      name: "test trick",
      tags: ["tag1", "tag2"],
      difficulty: "basics",
      preview: "tt",
    };
    const updated = {
      name: "test trick",
      tags: [""],
      difficulty: "basics",
      preview: "tt",
    };
    const result = difference(updated, initial);
    expect(result).toEqual([
      { key: "tags", action: "remove", value: "tag1" },
      { key: "tags", action: "remove", value: "tag2" },
    ]);
  });

  it("use-case: only changing order of tags", () => {
    const initial = {
      name: "test trick",
      tags: ["tag1", "tag2"],
      difficulty: "basics",
      preview: "tt",
    };
    const updated = {
      name: "test trick",
      tags: ["tag2", "tag1"],
      difficulty: "basics",
      preview: "tt",
    };
    const result = difference(updated, initial);
    expect(result).toEqual([]);
  });
});
