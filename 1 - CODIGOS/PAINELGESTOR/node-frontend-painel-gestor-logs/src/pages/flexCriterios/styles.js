import {
  Card, Descriptions
} from 'antd';
import styled from 'styled-components';

// tipografia

export const TituloCardStats = styled.h3`
  display: flex;
  text-align: center;
  font-size: 0.75rem;
  white-space: normal;
  color: #808080;
`;

export const TituloPrincipalCabecalho = styled.h4`
  font-size: 18px;
  margin-bottom: 0;
`;

export const TipografiaCabecalho = styled.h4`
  font-size: 16px;
  margin-bottom: 0;
`;


// grids e componentes de estrutura

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0;
  padding: 0;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const BaseContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

export const CardsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  gap: 16px;
  
  > * {
        flex: 1 1 0;
      }

  @media screen and (max-width: 900px) {
    flex-wrap: wrap;
    flex-direction: column;

    .ant-card {
      flex-grow: 1;
    }
  }
`;

export const CardsStatsRow = styled.div`
  display: flex;
  align-items: stretch;
  align-content: center;
  gap: 16px;

  .ant-card {
    min-width: 100px;

    .ant-card-head {
      border: 0; 
      height: 30%;
    }

    .ant-card-body {
      height: 70%;
      text-align: left;
      padding: 8px 24px;
  
      .ant-typography {
        font-size: 2rem;
      }
    }
  }

  @media screen and (max-width: 1000px) {
      flex-wrap: wrap;

      .ant-card {
        flex-grow: 1;
      }
  }
`;

// cards

export const CardResponsivo = styled(Card)`

  & > .ant-card-body {
    margin-bottom: 40px;
  }

  & > .ant-card-actions {
    position: absolute;
    width: 100%;
    bottom: 0;
      & li {
        display: flex;
        justify-content: flex-end;
        padding-right: 24px;
        span {
          .ant-form-item {
            margin-bottom: 0;
          }  
        }
      }
  }
`;


// divs

export const ContainerIdentificador = styled.div`
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  border-radius: 16px; 
  padding: 18px; 
  background: #F0F0F1;
`;


// descriptions

export const DescriptionsValidacao = styled(Descriptions)`

  .ant-descriptions-title {
    margin: 16px 0 0;
  }

  .ant-space {
    width: 100%;

    .ant-space-item, .ant-btn {
      width: 100%;
      
      .anticon {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }

      .ant-btn, .ant-btn-text, .ant-btn-text:hover, .ant-btn-text:focus {
        color: #fff;
        background: #fff;
      }
  }
  }
`;
