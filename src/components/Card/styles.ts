import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  max-width: 480px;

  padding: 24px 28px 16px 28px;
  margin-top: 16px auto 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Adicione o efeito de sombra aqui */

  @media screen and (min-width: 700px) {
    padding: 32px 56px 24px 56px;
  }
`;


