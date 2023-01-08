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
import useStake from '../../hooks/useStake';
import useWithdraw from '../../hooks/useWithdraw';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
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
  
  const stakedBalance = useStakedBalance(banks[2].contract,banks[2].poolId);

  //************************************** */
  //const earnings = useEarningsOnBoardroom();
  const earnings = useEarnings(banks[2].contract,banks[2].earnTokenName,banks[2].poolId);
 

  const tokenPriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);


  //********************************* */
 
 

  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(banks[2].depositTokenName,banks[2].depositToken);
  const tokenBOMBtoBTCBPriceInDollars = useMemo(
    () =>
      stakedTokenPriceInDollars
        ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
        : null,
    [stakedTokenPriceInDollars, stakedBalance],
  );


  const {onReward} = useHarvest(banks[2]);
  const [approveStatus, approve] = useApprove(bombFinance.BSHARE, bombFinance.contracts.Boardroom.address);


  const {onStake} = useStake(banks[2]);
  const {onWithdraw} = useWithdraw(banks[2]);
  const canWithdrawFromBoardroom = useWithdrawCheck();

  const tokenBalance = useTokenBalance(banks[2].depositToken);
  
  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      } }
      tokenName={'BOMB-BTCB-LP'} decimals={0}    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'BOMB-BTCB-LP'}
    />,
  );



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
      <Page>
        <BackgroundImage />
              <Helmet>
        <title>{TITLE}</title>
      </Helmet>
           
  
          
          {/* <Card > */}
            <CardContent className='mybasecard'>
            <StyledBond >
           
            <div>
            
            <Div4>
            <TokenSymbol symbol="BOMB-BTCB-LP" size={40} />

            <div>
                   <Mytitle>
           <div>BOMB-BTC</div> 
           <Button className='mybutton'>Recommended</Button>

           </Mytitle>

           <Head
           
           >
           
               
            
           
           <div 
           style={{float:'right',
                         marginLeft:"850px"}}

           >
                    <Typography>TVL:${TVL}</Typography>
           </div>

            
   
          </Head>

                    </div>   
          

            </Div4>
  
            <hr
           style={{border:"0.5px solid rgba(195, 197, 203, 0.75);",width:"1000px",marginLeft:"50px"}}
           ></hr>
           
          </div>
           
          

           {/* here is my table */}
     
           <Div1>

            
           <div>
             <Typography>Your Stake:</Typography> 
              <Typography><TokenSymbol symbol="BOMB-BTCB-LP" size={20} />{getDisplayBalance(stakedBalance)} </Typography>
              <Typography>{`≈ $${tokenBOMBtoBTCBPriceInDollars}`} </Typography>
             </div>
           
             <div>
             <Typography>Earned:</Typography> 
              <Typography><TokenSymbol symbol="BSHARE" size={20} />{getDisplayBalance(earnings)} </Typography>
              <Typography>{`≈ $${earnedInDollars}`} </Typography>
             </div>
              

            
              

              <div>
            {/* <Button onClick={()=>show()}>Click</Button> */}
            <Div2>
            <Button
                onClick={onPresentDeposit}
                
                //className={earnings.eq(0) ? 'shinyButtonDisabled' : 'shinyButton'}
               // disabled={earnings.eq(0)}
               className={'shinyButton'}
              >
                Deposite
              </Button>
              <Button
                onClick={onPresentWithdraw}
                //disabled={!canWithdrawFromBoardroom}
               //  className={earnings.eq(0) ? 'shinyButtonDisabled' : 'shinyButton'}
               // disabled={earnings.eq(0)}
               className={'shinyButton'}
              >
                Withdraw
              </Button>
              <Button
                onClick={onReward}
               // className={earnings.eq(0) ? 'shinyButtonDisabled' : 'shinyButton'}
               // disabled={earnings.eq(0)}
               
               className={'shinyButton'}
              >
                Claim Reward <TokenSymbol symbol="BSHARE" size={20} />
              </Button>

            </Div2>
            </div>
          


           </Div1>
             
           <hr
           style={{border:"0.5px solid rgba(195, 197, 203, 0.75);"}}
           ></hr>
                
            </StyledBond>
            </CardContent>
            {/* </Card> */}
      </Page>
    </Switch>
  );
};













const StyledBond = styled.div`
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
