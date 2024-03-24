import { AnimatePresence } from "framer-motion";

import ActionButton from "../ActionButton";

import Backdrop from "./components/Backdrop";
import SnakeBorderContainer from "./components/SnakeBorderContainer";

type Props = {
  isModalOpened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
  title: string;
};

const Modal = ({
  isModalOpened,
  onClose,
  onConfirm,
  children,
  title,
}: Props) => {
  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isModalOpened && (
        <Backdrop onClick={() => onClose()}>
          <SnakeBorderContainer
            key="modal"
            onClick={(e) => e.stopPropagation()}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="modal__content">
              <div className="modal__title">{title}</div>
              <div className="modal__body">{children}</div>
              <div className="modal__footer">
                <ActionButton
                  onClick={() => {
                    onClose();
                  }}
                  // id="cancelBtn"
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  Continue
                </ActionButton>
              </div>
            </div>
          </SnakeBorderContainer>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};
export default Modal;
