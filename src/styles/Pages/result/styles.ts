import styled from "styled-components";

import { theme } from "@/styles/theme";

export const Wrapper = styled.main`
  width: 100%;
  height: 100%;
  padding: 16px;
  min-height: 100vh;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: ${theme.palette.success.light};
  
`;

export const Value = styled.div`
  margin: 16px 0;
  background-color: #7FFFD4; 
  border-radius: 20px;
  width: 200px;
  height: 20px;
  justify-content: center;
  color: ;
  
`;

