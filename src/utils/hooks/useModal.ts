import { useState } from "react";

export default function useModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookID, setBookID] = useState(0);

  const toggleModalVisibility = () => {
    setIsModalVisible(!isModalVisible);
  };

  return {
    isModalVisible,
    bookID,
    toggleModalVisibility,
    setBookID,
  };
}
