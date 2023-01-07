import React, {useCallback, useEffect, useMemo} from 'react';
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
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';

import HomeImage from '../../assets/img/background.jpg';
import { Grid, Box, Card, CardContent, Button, Typography, Divider } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { Label, Title } from '@material-ui/icons';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useEstimateBShare from '../../hooks/BShareSwapper/useEstimateBShare';
import usebShareStats from '../../hooks/usebShareStats';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import CountUp from 'react-countup';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import moment from 'moment';

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
  const tBondStats = useBondStats();
  const bombStat = useBombStats();
  const cashPrice = useCashPriceInLastTWAP();
  const bShareStats = usebShareStats();
  const bondsPurchasable = useBondsPurchasable();

  const bondBalance = useTokenBalance(bombFinance?.BBOND);
  //const scalingFactor = useMemo(() => (cashPrice ? Number(cashPrice) : null), [cashPrice]);
 

  

  // const handleBuyBonds = useCallback(
  //   async (amount: string) => {
  //     const tx = await bombFinance.buyBonds(amount);
  //     addTransaction(tx, {
  //       summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
  //     });
  //   },
  //   [bombFinance, addTransaction],
  // );

  // const handleRedeemBonds = useCallback(
  //   async (amount: string) => {
  //     const tx = await bombFinance.redeemBonds(amount);
  //     addTransaction(tx, {summary: `Redeem ${amount} BBOND`});
  //   },
  //   [bombFinance, addTransaction],
  // );
//  const bondBalance = useTokenBalance(bombFinance?.BBOND);



  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4); 

  //bomb stats
  const bombPriceInDollars = useMemo(
    () => (bombStat ? Number(bombStat.priceInDollars).toFixed(2) : null),
    [bombStat],
  );
  const bombPriceInBNB = useMemo(() => (bombStat ? Number(bombStat.tokenInFtm).toFixed(4) : null), [bombStat]);
  const bombCirculatingSupply = useMemo(() => (bombStat ? String(bombStat.circulatingSupply) : null), [bombStat]);
  const bombTotalSupply = useMemo(() => (bombStat ? String(bombStat.totalSupply) : null), [bombStat]);


  //bshare stats
  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);


  //tbond stats
  
  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  //
  const cashStat = useCashPriceInEstimatedTWAP();
  const totalStaked = useTotalStakedOnBoardroom();
  const currentEpoch = useCurrentEpoch();
  const TVL = useTotalValueLocked();

  const { to } = useTreasuryAllocationTimes();

  const show=()=>{
    console.log("this is bond stat",tBondStats)
    console.log("this is bomb stat",bombStat)
    //console.log("this is bomb finance",bombFinance)
    console.log("this is bshare",bShareStats)
    console.log("this is cashstat",cashStat)
    console.log("this is totalstacked",totalStaked)
    console.log("this is currenepoch",currentEpoch)
    console.log("this is tvl",TVL)

  }
 
  return (
    <Switch>
      <Page>
        <BackgroundImage />
              <Helmet>
        <title>{TITLE}</title>
      </Helmet>
           
  
          
          <Card >
            <CardContent className='temp'>
            <StyledBond>
           <Mytitle>
            Bomb Finance Summary
           </Mytitle>
          
           <hr
           style={{border:"0.5px solid rgba(195, 197, 203, 0.75);"}}
           ></hr>
           {/* here is my table */}
           


             

             <Div2>
         
            




           <Div1>
           {
            <>
            <table>
  <tr>
    <th></th>
    <th></th>
    <th>Current supply</th>
    <th>Total Supply</th>
    <th>Price</th>
    <th></th>
  </tr>

  <tr>
   <td><TokenSymbol symbol="BOMB" size={15} /> </td>
  <td>$BOMB</td>
    <td>{Number(bombCirculatingSupply)}</td>
    <td>{Number(bombTotalSupply)}</td>
    <td>{Number(bombPriceInDollars)}</td>
    
    
  </tr>
  <tr>
  <td><TokenSymbol symbol="BSHARE" size={15} /> </td>
    <td>$BSHARE</td>
    <td>{Number(bShareCirculatingSupply)}</td>
    <td>{Number(bShareTotalSupply)}</td>
    <td>{Number(bSharePriceInDollars)}</td>
  </tr>
  <tr>
  <td><TokenSymbol symbol="BBOND" size={15} /> </td>
  <td>$BBOND</td>
    <td>{Number(tBondCirculatingSupply)}</td>
    <td>{Number(tBondTotalSupply)}</td>
    <td>{Number(tBondPriceInDollars)}</td>
  </tr>
</table>
            
            </>

           }

           </Div1>
             
            
             <Div3>
                 <div >
                 <Typography style={{color:'white',fontSize:"10px",marginLeft:"50px"}}>Current Epoch</Typography>
                  <Typography style={{color:'white',fontSize:"20px",marginLeft:"65px"}}>{Number(currentEpoch)}</Typography>
                 
             
                  <hr
           style={{border:"0.5px solid rgba(195, 197, 203, 0.75);",width:"180px"}}
           ></hr>
                  <Typography style={{color:'white',fontSize:"20px"}}><ProgressCountdown   base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" /></Typography>
                  <Typography style={{color:'white',fontSize:"10px",marginLeft:"55px"}}>Next Epoch</Typography>
                  <hr
           style={{border:"0.5px solid rgba(195, 197, 203, 0.75);",width:"100px"}}
           ></hr>
                     <div style={{display:'flex',marginLeft:"55px"}}><Typography style={{color:'white',fontSize:"10px",marginTop:"5px"}}>TVL:</Typography>
                     <Typography style={{color:"green"}}>${TVL}</Typography></div>

                
               {/* <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" /> */}
 
                 </div>
                 
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
background: transparent;
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

const Mytitle =styled.div`
font-family: 'Nunito';
font-style: normal;
font-weight: 400;
font-size: 22px;
line-height: 30px;
/* identical to box height */


color: #FFFFFF;
margin:auto;
`

const Div1 = styled.div`


`;
const Div2 = styled.div`
display:flex;

`;
const Div3 = styled.div`

margin-left:600px
`;

export default Bond;
