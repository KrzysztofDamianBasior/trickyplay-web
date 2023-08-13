import { calculateNumberOfPages } from "./calculateNumberOfPages";

export function regroupEntities<EntityType>({
  currentEntitiesPaginatedCollection,
  currentPerPage,
  newPerPage,
  newTotalNumberOfAllEntities,
}: {
  currentEntitiesPaginatedCollection: EntityType[][];
  currentPerPage: number;
  newPerPage: number;
  newTotalNumberOfAllEntities: number;
}): EntityType[][] {
  let entitiesFlatCollection: EntityType[] = [];

  if (currentEntitiesPaginatedCollection.length > 0) {
    for (let i = 0; i < currentEntitiesPaginatedCollection.length; i++) {
      if (currentEntitiesPaginatedCollection[i].length < currentPerPage) {
        const complement = new Array(
          currentPerPage - currentEntitiesPaginatedCollection[i].length
        ).fill(null);
        entitiesFlatCollection = entitiesFlatCollection.concat([
          ...currentEntitiesPaginatedCollection[i],
          ...complement,
        ]);
      } else {
        entitiesFlatCollection = entitiesFlatCollection.concat(
          currentEntitiesPaginatedCollection[i]
        );
      }
    }
  }

  const entitiesNewSet: EntityType[][] = [];
  const efcl = entitiesFlatCollection.length;
  const numberOfPages = calculateNumberOfPages({
    perPage: newPerPage,
    totalNumberOfEntities: newTotalNumberOfAllEntities,
  });

  for (let i = 0; i < numberOfPages; i++) {
    if (efcl >= i * newPerPage + newPerPage) {
      entitiesNewSet.push(
        entitiesFlatCollection
          .slice(i * newPerPage, i * newPerPage + newPerPage)
          .filter((val) => val !== null)
      );
    } else if (efcl >= i * newPerPage) {
      entitiesNewSet.push(
        entitiesFlatCollection
          .slice(i * newPerPage)
          .filter((val) => val !== null)
      );
    } else {
      entitiesNewSet.push([]);
    }
  }

  return entitiesNewSet;
}
