import styled from "styled-components";

export const StyledChat = styled.section`
  max-width: 600px;
  text-align: center;
  background-color: black;
  color: white;
  border-radius: 5px;
  padding: 10px 1rem;
  margin: 10px;
  h2 {
    margin: 0;
    font-weight: 900;
    font-size: x-large;
    letter-spacing: 5px;
  }
  h4 {
    font-weight: 600;
    margin: 0.6rem;
  }
`;

export const StyledChatCanvas = styled.div`
  height: 270px;
  background-color: #2c2c2c;
  border-radius: 5px;
  padding: 5px 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  overflow: auto;
`;

export const StyledMessage = styled.div`
  text-align: left;
  background-color: white;
  overflow-wrap: break-word;
  color: black;
  border-radius: 5px;
  margin: 5px auto 5px 7rem;
  padding: 4px;
`;

export const StyledMessageUser = styled.div`
  text-align: left;
  background-color: #8f43ee;
  overflow-wrap: break-word;
  color: white;
  border-radius: 5px;
  margin: 5px 7rem 5px auto;
  padding: 4px;
`;

export const StyledInput = styled.input`
  color: black;
  background-color: beige;
  border: solid black 0.1rem;
  border-radius: 5px;
  padding: 0.5rem 0.5rem;
  margin: 0.1rem;
`;
