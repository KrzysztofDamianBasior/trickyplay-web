import { Outlet } from "react-router-dom";

import AnimatedPage from "../../shared/components/AnimatedPage";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";

const StandardLayout = () => {
  return (
    <AnimatedPage>
      <Navbar />
      <Outlet />
      <Footer />
    </AnimatedPage>
  );
};

export default StandardLayout;
