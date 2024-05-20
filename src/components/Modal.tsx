import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

interface ModalProps extends PropsWithChildren {
  isModalVisible: boolean;
}

export default function Modal({ isModalVisible, children }: ModalProps) {
  if (!isModalVisible) return null;

  return createPortal(
    <section className="modal__overlay">
      <section className="modal">{children}</section>
    </section>,
    document.body,
  );
}
