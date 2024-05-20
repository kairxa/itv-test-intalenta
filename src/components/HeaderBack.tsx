import { Link } from "react-router-dom";

export default function HeaderBack() {
  return (
    <section className="header">
      <button className="button--ghost">
        <span className="material-symbols-outlined">chevron_left</span>
        Back
        <Link to="/" className="link" />
      </button>
    </section>
  );
}
