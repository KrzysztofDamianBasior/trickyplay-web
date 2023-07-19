import { motion } from "framer-motion";

type Props = {
  onClick: () => void;
  children: React.ReactNode;
};

const Backdrop = ({ children, onClick }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onClick()}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        background: "#000000e1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 500,
      }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
