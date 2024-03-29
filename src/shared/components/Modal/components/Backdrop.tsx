import { motion } from "framer-motion";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
};

// According to @mui the z-index values start at an arbitrary number, high and specific enough to ideally avoid conflicts:
// mobile stepper: 1000
// fab: 1050
// speed dial: 1050
// app bar: 1100
// drawer: 1200
// modal: 1300
// snackbar: 1400
// tooltip: 1500

const Backdrop = ({ children, onClick }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onClick()}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1300,

        height: "100%",
        width: "100%",

        background: "#000000e1",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
