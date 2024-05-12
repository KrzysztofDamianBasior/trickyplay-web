import Container from "@mui/material/Container";

import Intro from "./components/Intro";
import BottomFragment from "./components/BottomFragment";

import { useDocumentTitle } from "usehooks-ts";

const Home = () => {
  useDocumentTitle("TrickyPlay");

  return (
    <Container>
      <Intro />
      <BottomFragment />
    </Container>
  );
};
export default Home;
