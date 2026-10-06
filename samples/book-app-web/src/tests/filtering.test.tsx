import { describe, expect, it } from "vitest";
import { filterBooks, type BookFiltersState } from "../App";
import { books } from "../data/books";

const defaultFilters: BookFiltersState = {
  searchTerm: "",
  selectedGenre: "all",
  readingStatus: "all"
};

describe("filterBooks", () => {
  it.each(["hobbit", "HOBBIT", "HoBbIt", "  hobbit  "])(
    "matches the title search %j without depending on letter case",
    (searchTerm) => {
      const results = filterBooks(books, {
        ...defaultFilters,
        searchTerm
      });

      expect(results.map((book) => book.title)).toEqual(["The Hobbit"]);
    }
  );

  it.each(["tolkien", "TOLKIEN", "ToLkIeN"])(
    "matches the author search %j without depending on letter case",
    (searchTerm) => {
      const results = filterBooks(books, {
        ...defaultFilters,
        searchTerm
      });

      expect(results.map((book) => book.title)).toEqual(["The Hobbit"]);
    }
  );

  it.each(["", "   "])("returns all books for an empty search %j", (searchTerm) => {
    const results = filterBooks(books, {
      ...defaultFilters,
      searchTerm
    });

    expect(results).toEqual(books);
  });

  it.each([
    { selectedGenre: "Fantasy", readingStatus: "read", expectedTitles: ["The Hobbit"] },
    { selectedGenre: "Fantasy", readingStatus: "unread", expectedTitles: [] },
    { selectedGenre: "Mystery", readingStatus: "read", expectedTitles: [] }
  ] as const)("combines search with $selectedGenre and $readingStatus filters", ({
    selectedGenre,
    readingStatus,
    expectedTitles
  }) => {
    const results = filterBooks(books, {
      searchTerm: "hobbit",
      selectedGenre,
      readingStatus
    });

    expect(results.map((book) => book.title)).toEqual(expectedTitles);
  });

  it("filters by genre and reading status together", () => {
    const results = filterBooks(books, {
      ...defaultFilters,
      selectedGenre: "Fantasy",
      readingStatus: "unread"
    });

    expect(results.map((book) => book.title)).toEqual(["The Night Circus"]);
  });
});
