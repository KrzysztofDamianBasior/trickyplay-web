export const calculateNumberOfPages = ({
  perPage,
  totalNumberOfEntities,
}: {
  totalNumberOfEntities: number;
  perPage: number;
}) => Math.ceil(totalNumberOfEntities / perPage);
