import { HttpResponse } from "msw";
import generateErrorResponseBody from "./generateErrorResponseBody";

export function extractPaginationArguments(url: URL) {
  let pageNumber: number = 0;
  let pageSize: number = 10;
  let sortBy: "id" | "createdAt" | "updatedAt" = "id";
  let orderDirection: "Asc" | "Dsc" = "Asc";

  if (url.searchParams.get("pageNumber")) {
    if (/^[0-9]\d*$/.test(url.searchParams.get("pageNumber") as string)) {
      pageNumber = parseInt(url.searchParams.get("pageNumber") as string);
    } else {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          url.pathname,
          "invalid pageNumber"
        )
      );
    }
  }

  if (url.searchParams.get("orderDirection")) {
    if (/^(Asc|Dsc)$/.test(url.searchParams.get("orderDirection") as string)) {
      orderDirection = url.searchParams.get("orderDirection") as "Asc" | "Dsc";
    } else {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          url.pathname,
          "invalid orderDirection"
        )
      );
    }
  }

  if (url.searchParams.get("pageSize")) {
    if (/^[1-9]\d*$/.test(url.searchParams.get("pageSize") as string)) {
      pageSize = parseInt(url.searchParams.get("pageSize") as string);
    } else {
      throw HttpResponse.json(
        generateErrorResponseBody(
          "Bad Request",
          url.pathname,
          "invalid pageNumber"
        )
      );
    }
  }

  if (url.searchParams.get("sortBy")) {
    if (
      /^(id|createdAt|updatedAt)$/.test(
        url.searchParams.get("sortBy") as string
      )
    ) {
      sortBy = url.searchParams.get("sortBy") as
        | "id"
        | "createdAt"
        | "updatedAt";
    } else {
      throw HttpResponse.json(
        generateErrorResponseBody("Bad Request", url.pathname, "invalid sortBy")
      );
    }
  }

  return {
    pageNumber,
    pageSize,
    orderDirection,
    sortBy,
  };
}
