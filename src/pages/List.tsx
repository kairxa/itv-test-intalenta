import { useQuery } from "@tanstack/react-query";
import { BookDelete, BookFavorite, BookListGet } from "../apis/book";
import { useCallback, useEffect, useMemo, useState } from "react";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";
import useModal from "../utils/hooks/useModal";
import Modal from "../components/Modal";

const PER_PAGE = 5;

export default function List() {
  // Set toggle favorite sort state
  const [showFavoritesFirst, setShowFavoritesFirst] = useState(false);
  // Fetching book data
  const { data: bookList, refetch: refetchBookList } = useQuery({
    queryKey: ["get-list", { showFavoritesFirst }],
    queryFn: async () => await BookListGet({ showFavoritesFirst }),
  });

  // Modal related stuffs
  // This one is for Delete Book Modal
  const {
    bookID: deleteBookID,
    isModalVisible: isDeleteModalVisible,
    toggleModalVisibility: toggleDeleteModalVisibility,
    setBookID: setDeleteBookID,
  } = useModal();
  const handleToggleDeleteModalVisibility = () => toggleDeleteModalVisibility();
  const handleDeleteBook = () => {
    BookDelete(deleteBookID);

    refetchBookList();
    toggleDeleteModalVisibility();
  };
  // This one is for Menu Book Modal
  const {
    bookID: menuBookID,
    isModalVisible: isMenuModalVisible,
    toggleModalVisibility: toggleMenuModalVisibility,
    setBookID: setMenuBookID,
  } = useModal();
  const handleToggleMenuModalVisibility = () => toggleMenuModalVisibility();
  const handleSetMenuModalBookID = (bookID: number) => setMenuBookID(bookID);
  const handleMenuTrigger = (bookID: number) => {
    handleSetMenuModalBookID(bookID);
    handleToggleMenuModalVisibility();
  };
  const handleMenuDeleteTrigger = () => {
    setDeleteBookID(menuBookID);
    toggleMenuModalVisibility();
    toggleDeleteModalVisibility();
  };

  // Toggling favorite book
  const handleToggleFavorite = useCallback(
    (id: number) => {
      BookFavorite(id);
      refetchBookList();
    },
    [refetchBookList],
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const offset = useMemo(() => (currentPage - 1) * PER_PAGE, [currentPage]);
  const targetSliceIndex = useMemo(() => currentPage * PER_PAGE, [currentPage]);
  const displayedBookList = useMemo(
    () => bookList?.slice(offset, targetSliceIndex) || [],
    [bookList, offset, targetSliceIndex],
  );
  const shouldShowPrev =
    currentPage > 1 && !!displayedBookList && displayedBookList.length > 0;
  const shouldShowNext = targetSliceIndex < (bookList?.length || 0);

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);
  const handleChangeFavoritesSort = () =>
    setShowFavoritesFirst(!showFavoritesFirst);

  // Refetch mechanism when toggling favorite sort checkbox
  useEffect(() => {
    refetchBookList();
  }, [showFavoritesFirst, refetchBookList]);

  return (
    <>
      <section className="list__header">
        <section className="list__header__filter">
          <label htmlFor="sort">
            <input
              type="checkbox"
              name="sort"
              id="sort"
              checked={showFavoritesFirst}
              onChange={handleChangeFavoritesSort}
            />
            Showing favorites first
          </label>
        </section>
        <section className="list__header__create">
          <button className="list__header__create__button">
            <span>Create Book</span>
            <Link to="/create" className="link" />
          </button>
        </section>
      </section>
      <section className="content">
        <section className="cards__container">
          {displayedBookList?.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onToggleFavorite={handleToggleFavorite}
              onMenuTrigger={handleMenuTrigger}
            />
          ))}
        </section>
      </section>
      <section className="cards__control__container">
        <section className="cards__control--prev">
          {shouldShowPrev && (
            <button onClick={handlePrevPage} className="cards__control__button">
              <span className="material-symbols-outlined">chevron_left</span>
              PREVIOUS
            </button>
          )}
        </section>
        <section className="cards__control--next">
          {shouldShowNext && (
            <button onClick={handleNextPage} className="cards__control__button">
              NEXT
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )}
        </section>
      </section>
      <Modal isModalVisible={isDeleteModalVisible}>
        <header className="modal__header">
          <h4>Deleting Book</h4>
          <button
            className="modal__close"
            onClick={handleToggleDeleteModalVisibility}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>
        <section className="modal__item">
          <span className="modal__text">
            Are you sure you want to delete book ID: {deleteBookID}?
          </span>
        </section>
        <section className="modal__control">
          <button
            className="modal__control__button"
            onClick={handleToggleDeleteModalVisibility}
          >
            Nope, cancel
          </button>
          <button
            className="modal__control__button--proceed"
            onClick={handleDeleteBook}
          >
            Yes, delete
          </button>
        </section>
      </Modal>
      <Modal isModalVisible={isMenuModalVisible}>
        <header className="modal__header">
          <h4>Book ID: {menuBookID}</h4>
          <button
            className="modal__close"
            onClick={handleToggleMenuModalVisibility}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>
        <section className="modal__control">
          <section className="modal__item">
            <button className="card__menu__item">
              <span>Edit</span>
              <Link to={`/${menuBookID}/edit`} />
            </button>
          </section>
          <section className="modal__item">
            <button
              className="card__menu__item"
              onClick={handleMenuDeleteTrigger}
            >
              <span>Delete</span>
            </button>
          </section>
        </section>
      </Modal>
    </>
  );
}
