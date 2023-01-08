import React, {useCallback, useEffect, useMemo} from 'react';
import Page from '../../components/Page';
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
import { Grid, Box, Card, CardContent, Button, Typography, IconButton } from '@material-ui/core';
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
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useEarningsOnBoardroom from '../../hooks/useEarningsOnBoardroom';
import CardIcon from '../../components/CardIcon';
import Value from '../../components/Value';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import useHarvestFromBoardroom from '../../hooks/useHarvestFromBoardroom';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useStakeToBoardroom from '../../hooks/useStakeToBoardroom';
import useWithdrawFromBoardroom from '../../hooks/useWithdrawFromBoardroom';
import useWithdrawCheck from '../../hooks/boardroom/useWithdrawCheck';
import useModal from '../../hooks/useModal';
import DepositModal from '../Bank/components/DepositModal';
import WithdrawModal from '../Bank/components/WithdrawModal';
import { AddIcon, RemoveIcon } from '../../components/icons';
import useEarnings from '../../hooks/useEarnings';
import useBanks from '../../hooks/useBanks';
import useStakedBalance from '../../hooks/useStakedBalance';

import useHarvest from '../../hooks/useHarvest';

import Temp1 from './BombFinanceSummary';
import Temp5 from './BombFarms';
import Temp from './Bonds';
import Temp9 from './Boardroom'
import Temp7 from './News'




const TITLE = 'bomb.money | Bonds'

const Bond: React.FC = () => {
    const [banks] = useBanks();
  const {path} = useRouteMatch();
  const bombFinance = useBombFinance();
  const addTransaction = useTransactionAdder();
  const tBondStats = useBondStats();
  const bombStat = useBombStats();
  const cashPrice = useCashPriceInLastTWAP();
  const bShareStats = usebShareStats();
  
  


  //
  const cashStat = useCashPriceInEstimatedTWAP();
  const totalStaked = useTotalStakedOnBoardroom();
  const currentEpoch = useCurrentEpoch();
  const TVL = useTotalValueLocked();

  const { to } = useTreasuryAllocationTimes();
  
  const stakedBalance = useStakedBalance(banks[4].contract,banks[4].poolId);

  //************************************** */
  //const earnings = useEarningsOnBoardroom();
  const earnings = useEarnings(banks[4].contract,banks[4].earnTokenName,banks[4].poolId);
 

  const tokenPriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);


  //********************************* */
 
 

  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(banks[4].depositTokenName,banks[4].depositToken);
  const tokenBOMBtoBTCBPriceInDollars = useMemo(
    () =>
      stakedTokenPriceInDollars
        ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
        : null,
    [stakedTokenPriceInDollars, stakedBalance],
  );


  const {onReward} = useHarvest(banks[2]);



  const show=()=>{
    console.log("this is bank",banks)
    console.log("this is bond stat",tBondStats)
    console.log("this is bomb stat",bombStat)
    //console.log("this is bomb finance",bombFinance)
    console.log("this is bshare",bShareStats)
    console.log("this is cashstat",cashStat)
    console.log("this is totalstacked",totalStaked)
    console.log("this is currenepoch",currentEpoch)
    console.log("this is tvl",TVL)

    console.log("this is stakeBalance",stakedBalance)
    console.log("this is total stake",totalStaked)

    



  }
 

  return (
    <Switch>
      <Page >
        
              <Helmet>
        <title>{TITLE}</title>
      </Helmet>
           
  
          
         
            <CardContent className='mybasecard' >
            <StyledBond >
           
            <Temp1/>
            <div style={{display:'flex'}}>
              <div> 
              <div  style={{width:"700px",marginLeft:"23px"}}>
              <a style={{
                    marginBottom:"5px",
                    color: "#9EE6FF",
                    float:'right'
                  }} href='#'>Read Investment Stratergy {`>`} </a>
              <div  style={{width:"700px" ,marginTop:"10px"}}> 
                 
                  <Button href='https://bombbshare.medium.com/the-bomb-cycle-how-to-print-forever-e89dc82c12e5' style={{height:"50px"}} fullWidth className='mybtn3' >Invest Now</Button>
                </div>
                <div style={{display:'flex'}}>
                <div style={{width:"342px",marginTop:"5px",}}>
                  <Button href='https://discord.bomb.money' style={{height:"50px"}} fullWidth className='mybtn2 '>Chat on Discord</Button>
                </div>
                <div style={{marginLeft:"15px",
                marginTop:"5px",
                width:"342px"}}>
                  <Button href='https://docs.bomb.money/welcome-start-here/readme' style={{height:"50px"}} fullWidth className='mybtn2 '>Read Docs</Button>
                </div>
                </div>
              </div>
                


              <Temp9 />
              </div>
           
           <Temp7/>
            </div>
          
           <Temp5/>
           <Temp/>
        
            </StyledBond>
            </CardContent>
           
      </Page>
    </Switch>
  );
};











const StyledBond = styled.div`
background-color: none;
justify-content: space-between;
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
display:flex;
margin:5px;


`

const Head = styled.div`

display:flex;
justify-content: space-between;

`;
const Div1 = styled.div`

display:flex;
justify-content: space-between;

`;
const Div2 = styled.div`
margin-top:50px;
display:flex;
justify-content: space-between;

`;
const Div3 = styled.div`
width:200px;
`;
const Div4 = styled.div`
display:flex;
`;

export default Bond;
