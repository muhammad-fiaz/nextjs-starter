export class SearchError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, code = "SEARCH_ERROR", details?: unknown) {
    super(message);
    this.name = "SearchError";
    this.code = code;
    this.details = details;
  }
}

export class IndexNotFoundError extends SearchError {
  constructor(indexName: string) {
    super(`Search index '${indexName}' was not found`, "INDEX_NOT_FOUND", { indexName });
  }
}

export class DocumentValidationError extends SearchError {
  constructor(message: string, details?: unknown) {
    super(message, "DOCUMENT_VALIDATION_ERROR", details);
  }
}
