import AnimatedPage from "../../shared/components/AnimatedPage";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";

import Container from "@mui/material/Container";

import Intro from "./components/Intro";
import BottomFragment from "./components/BottomFragment";

import { useDocumentTitle } from "usehooks-ts";

const Home = () => {
  useDocumentTitle("TrickyPlay");

  return (
    <AnimatedPage>
      <Navbar />
      <Container>
        <Intro />
        <BottomFragment />
      </Container>
      <Footer />
    </AnimatedPage>
  );
};
export default Home;
