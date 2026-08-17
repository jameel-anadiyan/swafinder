import React from 'react';
import { AppProvider, useApp } from './context/AppContext';

// Screens
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';
import GoldPriceGate from './screens/GoldPriceGate';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import ScanScreen from './screens/ScanScreen';
import CostBreakupScreen from './screens/CostBreakupScreen';
import PrintSlipScreen from './screens/PrintSlipScreen';

// Settings sub-screens
import GoldPriceSettings from './screens/settings/GoldPriceSettings';
import DiamondChartSettings from './screens/settings/DiamondChartSettings';
import CertificationSettings from './screens/settings/CertificationSettings';
import MakingChargeSettings from './screens/settings/MakingChargeSettings';
import OtherStoneSettings from './screens/settings/OtherStoneSettings';
import BreakupVisibilitySettings from './screens/settings/BreakupVisibilitySettings';
import PrintVisibilitySettings from './screens/settings/PrintVisibilitySettings';
import SpecialPriceSettings from './screens/settings/SpecialPriceSettings';
import RizoyaMarkupSettings from './screens/settings/RizoyaMarkupSettings';

const SCREEN_MAP = {
  login:            LoginScreen,
  splash:           SplashScreen,
  goldgate:         GoldPriceGate,
  home:             HomeScreen,
  settings:         SettingsScreen,
  scan:             ScanScreen,
  costbreakup:      CostBreakupScreen,
  printslip:        PrintSlipScreen,
  'settings-gold':    GoldPriceSettings,
  'settings-diamond': DiamondChartSettings,
  'settings-cert':    CertificationSettings,
  'settings-making':  MakingChargeSettings,
  'settings-stone':   OtherStoneSettings,
  'settings-breakup': BreakupVisibilitySettings,
  'settings-print':   PrintVisibilitySettings,
  'settings-special':        SpecialPriceSettings,
  'settings-rizoya-markup':  RizoyaMarkupSettings,
};

function AppInner() {
  const { state } = useApp();
  const Screen = SCREEN_MAP[state.screen] || LoginScreen;
  return <Screen key={state.screen} />;
}

export default function App() {
  return (
    <AppProvider>
      <div className="desktop-bg" />
      <div className="phone-frame">
        <div className="phone-screen">
          <AppInner />
        </div>
      </div>
    </AppProvider>
  );
}
