import { useForm } from "react-hook-form";
import { Book } from "../types/book";
import { BookAdd } from "../apis/book";
import { toast } from "react-toastify";
import Form from "../components/Form";
import { useEffect } from "react";
import HeaderBack from "../components/HeaderBack";
export default function Create() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitted, isSubmitSuccessful },
  } = useForm<Book>({
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit = handleSubmit((data) => {
    const book: Book = {
      ...data,
      publicationDate: new Date(data.publicationDate).toISOString(),
    };

    BookAdd(book);
  });

  useEffect(() => {
    if (!isSubmitted) return;

    if (isSubmitSuccessful) {
      toast("Book added!");
      reset();
    } else {
      toast("Failed to add book :(", { type: "error" });
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
}
