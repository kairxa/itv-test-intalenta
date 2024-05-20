import clsx from "clsx";
import { Book } from "../types/book";
import isBookLocallyAdded from "../utils/isBookLocallyAdded";
import { Link } from "react-router-dom";

interface BookCardProps {
  book: Book;
  onToggleFavorite: (id: number) => void;
  onMenuTrigger: (bookID: number) => void;
}

// Some seemingly stray Link components; taken from Google Play Books implementation.
export default function BookCard({
  book,
  onToggleFavorite,
  onMenuTrigger,
}: BookCardProps) {
  const handleToggleMenu = () => onMenuTrigger(book.id);

  return (
    <section key={book.id} className="card">
      <Link to={`/${book.id}`} className="link" />
      <img
        src={book.cover}
        alt={`Cover Picture of ${book.title}`}
        className="card__cover"
      />
      <section className="card__metadata">
        <section className="card__detail">
          <Link to={`/${book.id}`} className="link" />
          <section className="card__title">{book.title}</section>
          <section className="card__author">{book.author}</section>
          <button
            className={clsx(
              "card__favorite",
              book.favorite ? "card__favorite--active" : "",
            )}
            onClick={() => onToggleFavorite(book.id)}
          >
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </section>
        {isBookLocallyAdded(book) && (
          <button className="card__menu__button" onClick={handleToggleMenu}>
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        )}
      </section>
    </section>
  );
}
