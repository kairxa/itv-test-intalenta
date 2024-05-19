import { SubmitHandler, useForm } from "react-hook-form";
import { Book } from "../types/book";
import { URL_REGEX_VALIDATION } from "../constants";
import { BookAdd } from "../apis/book";
import { toast } from "react-toastify";
export default function Create() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Book>({
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const onSubmit: SubmitHandler<Book> = (data) => {
    const book: Book = {
      ...data,
      publicationDate: new Date(data.publicationDate).toISOString(),
    };

    BookAdd(book);
    toast("Book added!");
    reset();
  };

  return (
    <section>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label className="input">
          Title
          <input type="text" {...register("title", { required: true })} />
          {errors.title && (
            <span className="input__error">Title is required.</span>
          )}
        </label>
        <label className="input">
          Author
          <input type="text" {...register("author", { required: true })} />
          {errors.author && (
            <span className="input__error">Author is required.</span>
          )}
        </label>
        <label className="input">
          Description
          <textarea {...register("description")} />
        </label>
        <label className="input">
          Cover
          <input
            type="text"
            {...register("cover", {
              validate: {
                isURL: (value) =>
                  URL_REGEX_VALIDATION.test(value) ||
                  "Cover needs to be a URL.",
              },
            })}
          />
          {errors.cover && (
            <span className="input__error">{errors.cover.message}</span>
          )}
        </label>
        <label className="input">
          Publication Date
          <input
            type="date"
            {...register("publicationDate", { required: true })}
          />
        </label>
        <button
          type="submit"
          className="form__submit-button"
          disabled={!isValid}
        >
          Submit
        </button>
      </form>
    </section>
  );
}
