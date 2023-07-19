import { useState, useEffect } from "react";
import styled from "styled-components";
import { IoBulbOutline } from "react-icons/io5";
import { useDarkMode } from "usehooks-ts";

const ToggleThemeSwitch = () => {
  const { isDarkMode, toggle, enable, disable } = useDarkMode();

  const [checked, setChecked] = useState<boolean>(isDarkMode ? false : true);
  useEffect(() => {
    if (checked === true) {
      disable();
    } else {
      enable();
    }
  }, [checked]);

  return (
    <ToggleThemeSwitchContainer
      onClick={(e) => setChecked((prev) => !prev)}
      style={{
        cursor: "pointer",
        position: "relative",
        display: "block",
        height: "40px",
        width: "80px",
        background: "#212121",
        borderRadius: "10px",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "0",
          left: checked ? "40px" : "0",
          width: "40px",
          height: "40px",
          background: "#333",
          border: "6px solid #212121",
          borderRadius: "14px",
          transition: "0.5s",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IoBulbOutline
          className="icon"
          style={{
            color: checked
              ? "rgba(255, 255, 255, 1)"
              : "rgba(255, 255, 255, 0.25)",
            fontSize: "2em",
            transition: "0.5s",
            filter: checked
              ? "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px #fff) drop-shadow(0 0 15px #fff)"
              : "",
          }}
        />
      </span>
    </ToggleThemeSwitchContainer>
  );
};
export default ToggleThemeSwitch;

const ToggleThemeSwitchContainer = styled.div``;
