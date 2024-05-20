import { useEffect } from "react";
import Form from "../components/Form";
import HeaderBack from "../components/HeaderBack";
import { toast } from "react-toastify";
import { Book } from "../types/book";
import { useForm } from "react-hook-form";
import { BookGetByID, BookUpdate } from "../apis/book";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BOOK_LOCAL_MIN_STARTING_ID } from "../constants";

const EditForm = ({ book }: { book: Book }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitted, isSubmitSuccessful },
  } = useForm<Book>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      ...book,
      publicationDate: new Date(book.publicationDate)
        .toISOString() // 1970-01-01T00:00:00.000Z
        .split("T")[0], // 1970-01-01
    },
  });

  const onSubmit = handleSubmit((data) => {
    const updatedBook: Book = {
      ...data,
      publicationDate: new Date(data.publicationDate).toISOString(),
    };

    BookUpdate(updatedBook);
  });

  useEffect(() => {
    if (!isSubmitted) return;

    if (isSubmitSuccessful) {
      toast("Book edited!");
    } else {
      toast("Failed to edit book :(", { type: "error" });
    }
  }, [isSubmitted, isSubmitSuccessful, reset]);

  return (
    <>
      <HeaderBack />
      <Form
        onSubmit={onSubmit}
        isValid={isValid}
        errors={errors}
        register={register}
      />
    </>
  );
};

export default function Edit() {
  const { id } = useParams();
  const userID = parseInt(`${id}`, 10);

  const { data: book } = useQuery({
    queryKey: ["get-book", userID],
    queryFn: async () => await BookGetByID(userID),
  });

  if (!book) return null;

  if (book && book.id < BOOK_LOCAL_MIN_STARTING_ID) {
    return (
      <>
        <HeaderBack />
        <section>Uneditable book ID</section>
      </>
    );
  }

  return <EditForm book={book} />;
}
