import React from "react";
import styled from "styled-components";
import ActionButton from "../ActionButton";

type Props = {
  closeModal: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
  title: string;
};

const Modal = ({ closeModal, onConfirm, children, title }: Props) => {
  return (
    <ModalContainer>
      <AnimatedBorderContainer>
        <div className="modal__content">
          <div className="modal__title">{title}</div>
          <div className="modal__body">{children}</div>
          <div className="modal__footer">
            <ActionButton
              onClick={() => {
                closeModal();
              }}
              id="cancelBtn"
            >
              Cancel
            </ActionButton>
            <ActionButton
              onClick={() => {
                onConfirm();
                closeModal();
              }}
            >
              Continue
            </ActionButton>
          </div>
        </div>
      </AnimatedBorderContainer>
    </ModalContainer>
  );
};
export default Modal;

const ModalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  z-index: 500;
  background: transparent;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnimatedBorderContainer = styled.div`
  position: relative;
  width: 70vw;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(0, 0, 0, 0.5);
  overflow: hidden;
  border-radius: 20px;

  .modal__title {
    z-index: 501;
    text-align: center;

    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-top: 10px;
    font-weight: 600;
    font-size: 2rem;
  }
  .modal__content {
    z-index: 501;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 72vh;
  }
  .modal__body {
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .modal__footer {
    z-index: 501;
    /* flex: 20%; */
    margin-bottom: 5%;

    align-self: flex-end;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      width: 150px;
      height: 45px;
    }
  }
  &::before {
    content: "";
    position: absolute;
    width: 20vw;
    height: 220%;
    background: ${(p) =>
      `linear-gradient(${p.theme.primaryColor}, ${p.theme.tertiaryColor})`};
    animation: animated-border-container__animate 8s linear infinite;
  }
  &::after {
    content: "";
    position: absolute;
    inset: 4px;
    background: #0e1538;
    border-radius: 16px;
  }

  @keyframes animated-border-container__animate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// import { Typography, makeStyles } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { useTheme } from "@mui/material/styles";
// const theme = useTheme();

// const Backdrop = ({ children, onClick }: Props) => {
//   const theme = useTheme();
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="backdrop"
//       onClick={() => onClick()}
//       style={{
//         position: "absolute",
//         top: 0,
//         left: 0,
//         height: "100%",
//         width: "100%",
//         background: "#000000e1",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       {children}
//     </motion.div>
//   );
// };

// <motion.button
// whileHover={{ scale: 1.1 }}
// whileTap={{ scale: 0.9 }}
// className="confirmaton-button"
// onClick={() => null}
// >
// {text}
// </motion.button>

// const dropIn = {
//   hidden: {
//     y: "-100vh",
//     opacity: 0,
//   },
//   visible: {
//     y: "0",
//     opacity: 1,
//     transition: {
//       duration: 0.1,
//       type: "spring",
//       damping: 25,
//       stiffness: 500,
//     },
//   },
//   exit: {
//     y: "100vh",
//     opacity: 0,
//   },
// };

// <motion.div
// drag
// onClick={(e) => e.stopPropagation()}
// className="modal"
// variants={dropIn}
// initial="hidden"
// animate="visible"
// exit="exit"
// >

// const [modalOpen, setModalOpen] = useState(false)
// const close = () => setModalOpen(false)
// const open = () => setModalOpen(true)
// () => modalOpen ? close() : open()

// const Modal = styled(motion.div)`
//   background: white;
//   border-radius: 30px;
//   width: 150px;
//   height: 150px;
// `;
