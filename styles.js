import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    color: white;
    font-family: system-ui;
    text-align: center;
    background: rgb(24,0,45);
background: linear-gradient(124deg, rgba(24,0,45,1) 0%, rgba(85,0,133,1) 100%);
min-height: 100vh;
  }
`;
