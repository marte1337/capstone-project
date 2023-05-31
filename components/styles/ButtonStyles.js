import styled from "styled-components";
import Link from "next/link";

export const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: fixed;
  bottom: 12px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

export const StyledButton = styled.button`
  text-align: center;
  font-size: large;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  &:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }

  &:active {
    transform: translateY(2px);
  }
`;

export const StyledLinkButton = styled(Link)`
  text-decoration: none;
  text-align: center;
  font-size: large;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  &:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }

  &:active {
    transform: translateY(2px);
  }
`;

export const StyledMenuLinkButton = styled(Link)`
  text-decoration: none;
  text-align: center;
  font-size: large;
  font-weight: bold;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);

  &:hover {
    background-color: #2c2c2c;
    border-color: #2c2c2c;
    color: beige;
    cursor: pointer;
  }

  &:active {
    transform: translateY(2px);
  }
`;

export const StyledReplayButton = styled.button`
  text-align: center;
  font-size: large;
  background-color: #2c2c2c;
  color: white;
  border-radius: 5px;
  margin: 0.5rem 1px;
  padding: 0.5rem 1rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);

  &:hover {
    cursor: pointer;
  }

  &:active {
    transform: translateY(2px);
  }
`;

export const StyledEnterGameButton = styled.button`
  text-align: center;
  font-size: large;
  font-weight: bold;
  color: black;
  background-color: beige;
  border: solid black 0.2rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  padding: 0.5rem 0.5rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);

  &:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }

  &:active {
    transform: translateY(2px);
  }
`;
