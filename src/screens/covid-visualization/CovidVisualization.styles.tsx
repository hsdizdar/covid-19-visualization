import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 2rem;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const View = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 2rem 0;
`;

export const Title = styled.h3`
  text-align: center;
  color: #1890ff;
`;

export const Wrapper = styled.div`
  margin-bottom: 2rem;

  .ant-select {
    width: 20%;
  }

  @media only screen and (max-width: 600px) {
    .ant-select {
      width: 100%;
    }
  }
`;

export const ChartContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const SpinnerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
