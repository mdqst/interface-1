import assets from '../../../../fixtures/assets.json';
import constants from '../../../../fixtures/constans.json';
import { skipState } from '../../../../support/steps/common';
import { configEnvWithTenderlyFantomFork } from '../../../../support/steps/configuration.steps';
import { borrow, repay, supply, withdraw } from '../../../../support/steps/main.steps';
import {
  dashboardAssetValuesVerification,
} from '../../../../support/steps/verification.steps';

const testData = {
  depositBaseAmount: {
    asset: assets.fantomMarket.FTM,
    amount: 9000,
    hasApproval: true,
  },
  testCases: {
    borrow: [
      {
        asset: assets.fantomMarket.WBTC,
        amount: 0.02,
        apyType: constants.borrowAPYType.default,
        hasApproval: true,
      },
    ],
    deposit: {
      asset: assets.fantomMarket.WBTC,
      amount: 0.0101,
      hasApproval: false,
    },
    checkDisabledApy: {
      asset: assets.fantomMarket.WBTC,
      apyType: constants.apyType.variable,
    },
    repay: [
      {
        asset: assets.fantomMarket.WBTC,
        apyType: constants.apyType.variable,
        amount: 0.002,
        hasApproval: true,
        repayOption: constants.repayType.default,
      },
      {
        asset: assets.fantomMarket.WBTC,
        apyType: constants.apyType.variable,
        repayableAsset: assets.fantomMarket.aWBTC,
        amount: 0.002,
        hasApproval: true,
        repayOption: constants.repayType.default,
      },
    ],
    withdraw: {
      asset: assets.fantomMarket.WBTC,
      isCollateral: true,
      amount: 0.001,
      hasApproval: true,
    },
  },
  verifications: {
    finalDashboard: [
      {
        type: constants.dashboardTypes.deposit,
        assetName: assets.fantomMarket.WBTC.shortName,
        amount: 0.007,
        collateralType: constants.collateralType.isCollateral,
        isCollateral: true,
      },
      {
        type: constants.dashboardTypes.borrow,
        assetName: assets.fantomMarket.WBTC.shortName,
        amount: 0.016,
        apyType: constants.borrowAPYType.variable,
      },
    ],
  },
};

describe('WBTC INTEGRATION SPEC, FANTOM V3 MARKET', () => {
  const skipTestState = skipState(false);
  configEnvWithTenderlyFantomFork({ v3: true });

  supply(testData.depositBaseAmount, skipTestState, true);
  testData.testCases.borrow.forEach((borrowCase) => {
    borrow(borrowCase, skipTestState, true);
  });
  supply(testData.testCases.deposit, skipTestState, true);
  testData.testCases.repay.forEach((repayCase) => {
    repay(repayCase, skipTestState, false);
  });
  withdraw(testData.testCases.withdraw, skipTestState, false);
  dashboardAssetValuesVerification(testData.verifications.finalDashboard, skipTestState);
});
