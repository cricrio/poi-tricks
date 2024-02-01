import { addKey, difference, differenceInArray } from "./utils.server";

describe(addKey.name, () => {
	it("should add key to object", () => {
		expect(addKey([{ a: 1 }, { b: 2 }], "c")).toEqual([
			{ a: 1, key: "c" },
			{ b: 2, key: "c" },
		]);
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
	it("should return only updated tags", () => {
		expect(
			difference(
				{
					name: "John",
					tags: ["a", "b", "d"],
				},
				{
					name: "John",
					tags: ["b", "c", "z"],
				},
			),
		).toEqual([
			{ action: "remove", value: "a", key: "tags" },
			{ action: "remove", value: "d", key: "tags" },
			{ action: "add", value: "c", key: "tags" },
			{ action: "add", value: "z", key: "tags" },
		]);
	});
	it("should return only updated name", () => {
		expect(
			difference(
				{
					name: "John",
					tags: ["a", "b", "d"],
				},
				{
					name: "Paul",
					tags: ["a", "b", "d"],
				},
			),
		).toEqual([{ value: "Paul", action: "update", key: "name" }]);
	});
	it("should return all updated fields", () => {
		expect(
			difference(
				{
					name: "John",
					tags: ["a", "b", "d"],
					difficulty: "hard",
				},
				{
					name: "Paul",
					tags: ["b", "c", "z"],
					difficulty: "hard",
				},
			),
		).toEqual([
			{ value: "Paul", action: "update", key: "name" },
			{ action: "remove", value: "a", key: "tags" },
			{ action: "remove", value: "d", key: "tags" },
			{ action: "add", value: "c", key: "tags" },
			{ action: "add", value: "z", key: "tags" },
		]);
	});
});
