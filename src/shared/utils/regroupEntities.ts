import { CommentWithRepliesDetailsType } from "../components/CommentsSection/CommentsContext";
import { CommentDetailsType } from "../hooks/useCommentsAPIFacade";
import { ReplyDetailsType } from "../hooks/useRepliesAPIFacade";

export type EntitiesPaginatedCollectionType = (
  | CommentDetailsType
  | ReplyDetailsType
  | CommentWithRepliesDetailsType
)[][];
export type EntitiesFlatCollectionType = (
  | CommentDetailsType
  | ReplyDetailsType
)[];

export const regroupEntities = ({
  currentEntitiesCollection,
  currentPerPage,
  newPerPage,
  newTotalNumberOfAllEntities,
}: {
  currentEntitiesCollection: EntitiesPaginatedCollectionType;
  currentPerPage: number;
  newPerPage: number;
  newTotalNumberOfAllEntities: number;
}): EntitiesPaginatedCollectionType => {
  let entitiesFlatCollection: EntitiesFlatCollectionType = [];
  if (currentEntitiesCollection.length > 0) {
    for (let i = 0; i < currentEntitiesCollection.length; i++) {
      if (currentEntitiesCollection[i].length < currentPerPage) {
        const complement = new Array(
          currentPerPage - currentEntitiesCollection[i].length
        ).fill(null);
        entitiesFlatCollection = entitiesFlatCollection.concat([
          ...currentEntitiesCollection[i],
          ...complement,
        ]);
      } else {
        entitiesFlatCollection = entitiesFlatCollection.concat(
          currentEntitiesCollection[i]
        );
      }
    }
  }

  const entitiesNewSet: EntitiesPaginatedCollectionType = [];
  const efcl = entitiesFlatCollection.length;
  const numberOfPages = Math.ceil(newTotalNumberOfAllEntities / newPerPage);
  for (let i = 0; i <= numberOfPages - 1; i++) {
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
};
