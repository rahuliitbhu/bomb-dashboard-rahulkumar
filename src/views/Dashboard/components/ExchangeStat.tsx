import React from 'react';
import styled from 'styled-components';

import {Card} from '@material-ui/core';
import { Label } from '@material-ui/icons';
import TokenSymbol from '../../../components/TokenSymbol';
import bombFinance from '../../../bomb-finance';
import useBombFinance from '../../../hooks/useBombFinance';

interface ExchangeStatProps {
  image:any;
  tokenName: string;
  description: string;
  price: string;
}

const ExchangeStat: React.FC<ExchangeStatProps> = ({image,tokenName, description, price}) => {
  const bombFinance = useBombFinance();
  return (
    <div>
      <StyledCardContentInner>
      <StyledDesc>{description}</StyledDesc>
      
        
       
       {
      
        image?
        <>
        <div style={{display:'flex'}}>
        <TokenSymbol symbol={image.symbol} size={54} />
        <StyledCardTitle>{`${price}`}</StyledCardTitle>
        </div>
        
         
        </>
        
        
        :<><StyledCardTitle>{`${tokenName} = ${price} BTCB`}</StyledCardTitle></>

        
       }
        
            
      </StyledCardContentInner>
    </div>
  );
};

const StyledCardTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledDesc = styled.span`
  //color: ${(props) => props.theme.color.grey[300]};
  text-align: left;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  display: flex;
  align-items: left;
  justify-content: center;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[2]}px;
`;

export default ExchangeStat;
