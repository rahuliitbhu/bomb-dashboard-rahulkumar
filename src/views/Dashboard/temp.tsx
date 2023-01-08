import React, {useCallback, useMemo} from 'react';
import Page from '../../components/Page copy';
import {createGlobalStyle} from 'styled-components';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
//import useBombStats from '../../hooks/useBombStats';
import useBombFinance from '../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import {useTransactionAdder} from '../../state/transactions/hooks';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import {getDisplayBalance} from '../../utils/formatBalance';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import { Alert } from '@material-ui/lab';


import HomeImage from '../../assets/img/background.jpg';
import { Grid, Box, Card, CardContent } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { Label } from '@material-ui/icons';
import TokenSymbol from '../../components/TokenSymbol';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | Bonds'

const Bond: React.FC = () => {
  const {path} = useRouteMatch();
  const bombFinance = useBombFinance();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  //const bombStat = useBombStats();
  const cashPrice = useCashPriceInLastTWAP();

  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(bombFinance?.BBOND);
  //const scalingFactor = useMemo(() => (cashPrice ? Number(cashPrice) : null), [cashPrice]);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
      });
    },
    [bombFinance, addTransaction],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, {summary: `Redeem ${amount} BBOND`});
    },
    [bombFinance, addTransaction],
  );
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
  const isBondPayingPremium = useMemo(() => Number(bondStat?.tokenInFtm) >= 1.1, [bondStat]);
// console.log("bondstat", Number(bondStat?.tokenInFtm))
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4); 

  return (
    <Switch>
      <Page>
        <BackgroundImage />
              <Helmet>
        <title>{TITLE}</title>
      </Helmet>
       

          
          <Card className='temp'>
            <CardContent className='temp'>
            <StyledBond>
           
           <Div1>
           <TokenSymbol symbol={bombFinance.BBOND.symbol} size={54} />
              <div>
              <div>{`BONDS`}</div>
              <div>Bond can be purchased only on contraction,when TWAP of BOMB is below 1</div>
              </div>
           </Div1>
             

             <Div2>

            
                     <ExchangeStat

                image=''
                tokenName="BBond"
                description="Current Price: (Bomb)^2"
                price={Number(bondStat?.tokenInFtm).toFixed(4) || '-'} />
              <Spacer size="md" />
              <ExchangeStat

                image={bombFinance.BBOND}
                tokenName="BBond"
                description="Available to reedeem:"
                price={getDisplayBalance(bondBalance) || '-'} />
     
                <Div3>

                <ExchangeCard
                  action="Purchase BBond"
                  fromToken={bombFinance.BOMB}
                  fromTokenName="BOMB"
                  toToken={bombFinance.BBOND}
                  toTokenName="BBOND"
                  priceDesc={
                    !isBondPurchasable
                      ? 'BOMB is over peg'
                      : ''
                  }
                  onExchange={handleBuyBonds}
                  disabled={!bondStat || isBondRedeemable}
                />
             
             <hr
           style={{border:"0.5px solid rgba(195, 197, 203, 0.75);",width:"520px",marginLeft:"-50px"}}
           ></hr>
       

            
              <ExchangeCard
                action="Redeem Bomb"
                fromToken={bombFinance.BBOND}
                fromTokenName="BBOND"
                toToken={bombFinance.BOMB}
                toTokenName="BOMB"
                priceDesc={``}
                onExchange={handleRedeemBonds}
                disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                disabledDescription={!isBondRedeemable ? `Enabled when 10,000 BOMB > ${BOND_REDEEM_PRICE}BTC` : null} />

                  </Div3>
            </Div2>
            </StyledBond>
            </CardContent>
            </Card>
      </Page>
    </Switch>
  );
};

const StyledBond = styled.div`
  
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: left;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

const Div1 = styled.div`
display:flex;

`;
const Div2 = styled.div`
display:flex;

`;
const Div3 = styled.div`
margin-left:200px;
`;

export default Bond;
