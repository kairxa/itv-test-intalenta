import { useParams } from "react-router-dom";
import HeaderBack from "../components/HeaderBack";
import { useQuery } from "@tanstack/react-query";
import { BookGetByID } from "../apis/book";
import { useMemo } from "react";

export default function Detail() {
  const { id } = useParams();
  const userID = parseInt(`${id}`, 10);

  const { data: book } = useQuery({
    queryKey: ["get-book", userID],
    queryFn: async () => await BookGetByID(userID),
  });

  const publicationDate = useMemo(() => {
    if (!book || !book.publicationDate) return "";

    return new Date(book?.publicationDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  }, [book]);

  if (!book) return null;

  return (
    <>
      <HeaderBack />
      <section className="content--direction-row">
        <section className="details__cover">
          <img src={book.cover} alt={`Cover of ${book.title}`} />
        </section>
        <section className="details">
          <section className="details__item">
            <h4>Title</h4>
            <span>{book.title}</span>
          </section>
          <section className="details__item">
            <h4>Author</h4>
            <span>{book.author}</span>
          </section>
          <section className="details__item">
            <h4>Description</h4>
            <span>{book.description}</span>
          </section>
          <section className="details__item">
            <h4>Publication Date</h4>
            <span>{publicationDate}</span>
          </section>
        </section>
      </section>
    </>
  );
}
