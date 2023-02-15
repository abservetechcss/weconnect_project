import { useState } from "react";

// Centralizes modal control
const useModal = () => {
  const [modelStatus, setModalOpen] = useState(true);

  const modalClose = () => setModalOpen(false);
  const modelOpen = () => setModalOpen(true);

  return { modelStatus, modalClose, modelOpen };
};

export default useModal;
