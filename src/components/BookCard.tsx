import clsx from "clsx";
import { Book } from "../types/book";
import isBookLocallyAdded from "../utils/isBookLocallyAdded";

interface BookCardProps {
  book: Book;
  onToggleFavorite: (id: number) => void;
}
export default function BookCard({ book, onToggleFavorite }: BookCardProps) {
  return (
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
          <button className="card__menu">
            <div className="card__menu__icon"></div>
          </button>
        )}
      </section>
    </section>
  );
}
