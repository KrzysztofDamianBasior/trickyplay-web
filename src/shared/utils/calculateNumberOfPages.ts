export const calculateNumberOfPages = ({
  perPage,
  totalNumberOfEntities,
}: {
  totalNumberOfEntities: number;
  perPage: number;
}) => {
  if (totalNumberOfEntities === 0) return 1;
  return Math.ceil(totalNumberOfEntities / perPage);
};
