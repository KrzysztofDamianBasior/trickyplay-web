import { regroupEntities } from "../regroupEntities";

describe("regroupEntites works on a collections of objects unrelated to any domain", () => {
  type stubObjectType = {
    stubAttribute: string;
  };
  type stubsArrayType = stubObjectType[];
  type stubsPaginatedCollectionType = stubsArrayType[];

  const stubsPaginatedCollection: stubsPaginatedCollectionType = [
    [
      { stubAttribute: "a" },
      { stubAttribute: "b" },
      { stubAttribute: "c" },
      { stubAttribute: "d" },
    ],
    [
      { stubAttribute: "a" },
      { stubAttribute: "b" },
      { stubAttribute: "c" },
      { stubAttribute: "d" },
    ],
    [
      { stubAttribute: "a" },
      { stubAttribute: "b" },
      { stubAttribute: "c" },
      { stubAttribute: "d" },
    ],
    [
      { stubAttribute: "a" },
      { stubAttribute: "b" },
      { stubAttribute: "c" },
      { stubAttribute: "d" },
    ],
  ];

  it("returns a collection with the correct length", () => {
    const regroupedStubsCollection = regroupEntities({
      currentEntitiesPaginatedCollection: stubsPaginatedCollection,
      currentPerPage: 4,
      newPerPage: 2,
      newTotalNumberOfAllEntities: 20,
    });

    expect(regroupedStubsCollection).toHaveLength(10);
    expect(regroupedStubsCollection[0]).toHaveLength(2);
  });

  it("returns a collection with appropriate elements", () => {
    const regroupedStubsCollection = regroupEntities({
      currentEntitiesPaginatedCollection: stubsPaginatedCollection,
      currentPerPage: 4,
      newPerPage: 2,
      newTotalNumberOfAllEntities: 20,
    });

    expect(regroupedStubsCollection[0][0]).toEqual({ stubAttribute: "a" });
    expect(regroupedStubsCollection[0][1]).toEqual({ stubAttribute: "b" });
    expect(regroupedStubsCollection[1][0]).toEqual({ stubAttribute: "c" });
    expect(regroupedStubsCollection[1][1]).toEqual({ stubAttribute: "d" });
    expect(regroupedStubsCollection[2][0]).toEqual({ stubAttribute: "a" });
  });
});
