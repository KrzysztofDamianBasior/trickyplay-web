export function sortCollection<
  EntityType extends { id: number; createdAt: string; updatedAt: string }
>({
  entitiesCollection,
  orderDirection,
  sortBy,
}: {
  entitiesCollection: EntityType[];
  orderDirection: "Asc" | "Dsc";
  sortBy: "id" | "createdAt" | "updatedAt";
}): EntityType[] {
  // This method mutates the array and returns a reference to the same array.
  let sortedCollection = entitiesCollection.sort((a, b): number => {
    if (sortBy === "createdAt") {
      return Date.parse(a.createdAt) - Date.parse(a.createdAt);
    } else if (sortBy === "updatedAt") {
      return Date.parse(a.updatedAt) - Date.parse(a.updatedAt);
    } else {
      return a.id - b.id;
    }
  });
  sortedCollection =
    orderDirection === "Asc" ? sortedCollection : sortedCollection.reverse();
  return sortedCollection;
}
