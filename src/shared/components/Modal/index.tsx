import { Typography, useMediaQuery, useTheme } from "@mui/material";

import { AnimatePresence } from "framer-motion";

import ActionButton from "../ActionButton";

import Backdrop from "./components/Backdrop";
import SnakeBorderContainer from "./components/SnakeBorderContainer";

type Props = {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isModalOpened: boolean;
  children: React.ReactNode;
};

const Modal = ({
  onClose,
  onConfirm,
  title,
  isModalOpened,
  children,
}: Props) => {
  const theme = useTheme();
  const isMatchSM = useMediaQuery(theme.breakpoints.down("sm"));
  const isMatchMD = useMediaQuery(theme.breakpoints.down("md"));

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
    <AnimatePresence>
      {isModalOpened && (
        <Backdrop onClick={() => onClose()}>
          <SnakeBorderContainer
            size={isMatchSM ? "sm" : isMatchMD ? "md" : "lg"}
            theme={theme.palette.mode}
            onClick={(e) => e.stopPropagation()}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="modal__content">
              <div className="modal__title">
                <Typography
                  variant="h1"
                  sx={{ fontSize: `${isMatchSM ? "1.5rem" : "3rem"}` }}
                >
                  {title}
                </Typography>
              </div>
              <div className="modal__body">{children}</div>
              <div className="modal__footer">
                <ActionButton
                  onClick={() => {
                    onClose();
                  }}
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
