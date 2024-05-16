import { useQuery } from "@tanstack/react-query";
import { BookListGet } from "../../apis/list";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Book } from "../../types/book";

const PER_PAGE = 5;

export default function List() {
  const [currentPage, setCurrentPage] = useState(1);
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
  }, [bookList, currentPage]);

  return (
    <section className="content-container">
      <section className="cards-container">
        {displayedBookList?.map((book) => (
          <section key={book.id} className="card">
            <img
              src={book.cover}
              alt={`Cover Picture of ${book.title}`}
              className="card__cover"
            />
            <section className="card__metadata">
              <section className="card__detail">
                <section className="card__title">{book.title}</section>
                <section className="card__author">{book.author}</section>
                <section
                  className={clsx(
                    "card__favorite",
                    book.favorite ? "card__favorite--active" : "",
                  )}
                >
                  <span className="material-symbols-outlined">favorite</span>
                </section>
              </section>
              <button className="card__menu">
                <div className="card__menu__icon"></div>
              </button>
            </section>
          </section>
        ))}
      </section>
      <section className="control">
        <button onClick={handlePrevPage}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </section>
    </section>
  );
}
