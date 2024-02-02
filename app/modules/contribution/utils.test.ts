import type { TrickForContribution } from "./service.server";
import { addKey, difference, differenceInArray } from "./utils.server";
import type { UserContribution } from "../trick";

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
		const initial: TrickForContribution = {
			name: "test trick",
			tags: ["tag1", "tag2"],
			difficulty: "basics",
		};
		const updated: UserContribution = {
			name: "test trick",
			tags: ["tag1", "tag2"],
			difficulty: "basics",
		};
		const result = difference(initial, updated);
		expect(result).toEqual([]);
	});

	it("should return an array of changes when the initial and updated objects are different", () => {
		const initial: TrickForContribution = {
			name: "test trick",
			tags: ["tag1", "tag2"],
			difficulty: "basics",
		};
		const updated: UserContribution = {
			name: "new trick",
			tags: ["tag1", "tag3"],
			difficulty: "basics",
		};
		const result = difference(initial, updated);
		expect(result).toEqual([
			{ key: "name", action: "update", value: "new trick" },
			{ key: "tags", action: "remove", value: "tag2" },
			{ key: "tags", action: "add", value: "tag3" },
		]);
	});
});
