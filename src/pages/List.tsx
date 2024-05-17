import { useQuery } from "@tanstack/react-query";
import { BookListGet } from "../apis/book";
import { useEffect, useState } from "react";
import { Book } from "../types/book";
import BookCard from "../components/BookCard";

const PER_PAGE = 5;

export default function List() {
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldShowPrev, setShouldShowPrev] = useState(false);
  const [shouldShowNext, setShouldShowNext] = useState(true);
  const [displayedBookList, setDisplayedBookList] = useState<Book[]>([]);
  const { data: bookList } = useQuery({
    queryKey: ["get-list"],
    queryFn: async () => await BookListGet(),
  });

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  useEffect(() => {
    const offset = (currentPage - 1) * PER_PAGE;
    const targetSliceIndex = currentPage * PER_PAGE;
    setDisplayedBookList(bookList?.slice(offset, targetSliceIndex) || []);

    setShouldShowPrev(currentPage > 1);
    setShouldShowNext(targetSliceIndex < (bookList?.length || 0));
  }, [bookList, currentPage]);

  return (
    <section className="content-container">
      <section className="cards-container">
        {displayedBookList?.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </section>
      <section className="control">
        <section className="control__prev">
          {shouldShowPrev && (
            <button onClick={handlePrevPage} className="control__button">
              PREVIOUS
            </button>
          )}
        </section>
        <section className="control__next">
          {shouldShowNext && (
            <button onClick={handleNextPage} className="control__button">
              NEXT
            </button>
          )}
        </section>
      </section>
    </section>
  );
}
