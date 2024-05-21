import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Book } from "../types/book";
import { URL_REGEX_VALIDATION } from "../constants";
import { FormEvent } from "react";

export default function Form({
  onSubmit,
  register,
  errors,
  isValid,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  register: UseFormRegister<Book>;
  errors: FieldErrors<Book>;
  isValid: boolean;
}) {
  return (
    <form className="form" onSubmit={(e) => onSubmit(e)}>
      <label className="input">
        Title
        <input
          type="text"
          {...register("title", { required: true })}
          data-testid="input-title"
        />
        {errors.title && (
          <span className="input__error">Title is required.</span>
        )}
      </label>
      <label className="input">
        Author
        <input
          type="text"
          {...register("author", { required: true })}
          data-testid="input-author"
        />
        {errors.author && (
          <span className="input__error">Author is required.</span>
        )}
      </label>
      <label className="input">
        Description
        <textarea
          {...register("description")}
          data-testid="input-description"
        />
      </label>
      <label className="input">
        Cover
        <input
          type="text"
          {...register("cover", {
            validate: {
              isURL: (value) =>
                URL_REGEX_VALIDATION.test(value) || "Cover needs to be a URL.",
            },
          })}
          data-testid="input-cover"
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
          data-testid="input-publicationDate"
        />
      </label>
      <button type="submit" className="form__submit-button" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}
