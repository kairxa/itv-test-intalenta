import { useQuery } from "@tanstack/react-query";
import { BookFavorite, BookListGet } from "../apis/book";
import { useEffect, useState } from "react";
import { Book } from "../types/book";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";

const PER_PAGE = 5;

export default function List() {
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldShowPrev, setShouldShowPrev] = useState(false);
  const [shouldShowNext, setShouldShowNext] = useState(true);
  const [displayedBookList, setDisplayedBookList] = useState<Book[]>([]);
  const [showFavoritesFirst, setShowFavoritesFirst] = useState(false);
  const { data: bookList, refetch: refetchBookList } = useQuery({
    queryKey: ["get-list"],
    queryFn: async () => await BookListGet({ showFavoritesFirst }),
  });

  const handleToggleFavorite = (id: number) => {
    BookFavorite(id);
    refetchBookList();
  };

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  useEffect(() => {
    const offset = (currentPage - 1) * PER_PAGE;
    const targetSliceIndex = currentPage * PER_PAGE;
    setDisplayedBookList(bookList?.slice(offset, targetSliceIndex) || []);

    setShouldShowPrev(currentPage > 1 && !!bookList && bookList.length > 0);
    setShouldShowNext(targetSliceIndex < (bookList?.length || 0));
  }, [bookList, currentPage]);

  useEffect(() => {
    refetchBookList();
  }, [showFavoritesFirst, refetchBookList]);

  return (
    <>
      <section className="header">
        <section className="filter">
          <label htmlFor="sort">
            <input
              type="checkbox"
              name="sort"
              id="sort"
              checked={showFavoritesFirst}
              onChange={() => setShowFavoritesFirst(!showFavoritesFirst)}
            />
            Showing favorites first
          </label>
        </section>
        <section className="create">
          <button className="create__button">
            <Link to="/create">Create Book</Link>
          </button>
        </section>
      </section>
      <section className="content">
        <section className="cards-container">
          {displayedBookList?.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </section>
      </section>
      <section className="control">
        <section className="control__prev">
          {shouldShowPrev && (
            <button onClick={handlePrevPage} className="control__button">
              <span className="material-symbols-outlined">chevron_left</span>
              PREVIOUS
            </button>
          )}
        </section>
        <section className="control__next">
          {shouldShowNext && (
            <button onClick={handleNextPage} className="control__button">
              NEXT
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )}
        </section>
      </section>
    </>
  );
}
