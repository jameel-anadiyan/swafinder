import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  DEMO_USERS,
  DIAMOND_CHART_SEED,
  SAMPLE_ITEM,
  DEFAULT_CHARGES,
  DEFAULT_FIELD_VISIBILITY,
} from '../data/seedData';

// ─── Per-user visibility overrides ───────────────────────────────────────────
const USER_VIS_OVERRIDES = {
  rizoya: { dCarat: false, dCtPrice: false },
};

// ─── Fresh user data factory (per-user defaults) ──────────────────────────────
function freshUserData(user = {}) {
  const baseVis = { ...DEFAULT_FIELD_VISIBILITY };
  const overrides = USER_VIS_OVERRIDES[user.id] || {};
  const vis = { ...baseVis, ...overrides };

  return {
    goldPrice: { ratePerGram: 550, lastUpdated: null, updateIntervalHours: 24 },
    diamondChart: DIAMOND_CHART_SEED.map(r => ({ ...r })),
    pricingMethod: { mode: 'manual', percent: 0 },
    charges: { ...DEFAULT_CHARGES },
    fieldVisibility: {
      breakup: { ...vis },
      print:   { ...vis },
    },
    sampleItem: {
      ...SAMPLE_ITEM,
      diamonds: SAMPLE_ITEM.diamonds.map(d => ({ ...d })),
    },
  };
}

// ─── Initial State Factory ─────────────────────────────────────────────────────
function buildInitialState() {
  return {
    currentUser: null,
    screen: 'login',
    screenHistory: [],
    userData: Object.fromEntries(
      DEMO_USERS.map(u => [u.id, freshUserData(u)])
    ),
  };
}

// ─── Merge saved state with fresh defaults (handles stale localStorage) ───────
function mergeWithFresh(saved) {
  const fresh = buildInitialState();
  const mergedUserData = { ...fresh.userData }; // start with ALL fresh users

  // For each existing user in saved data, merge saved fields on top
  if (saved.userData && typeof saved.userData === 'object') {
    DEMO_USERS.forEach(u => {
      const savedUser = saved.userData[u.id];
      if (savedUser) {
        const freshUser = fresh.userData[u.id];
        mergedUserData[u.id] = {
          ...freshUser,
          ...savedUser,
          // Deep-merge charges to pick up any new fields
          charges: { ...freshUser.charges, ...(savedUser.charges || {}) },
          // Deep-merge goldPrice to pick up updateIntervalHours
          goldPrice: { ...freshUser.goldPrice, ...(savedUser.goldPrice || {}) },
          // Deep-merge fieldVisibility
          fieldVisibility: {
            breakup: { ...freshUser.fieldVisibility.breakup, ...(savedUser.fieldVisibility?.breakup || {}) },
            print:   { ...freshUser.fieldVisibility.print,   ...(savedUser.fieldVisibility?.print   || {}) },
          },
          // Ensure sampleItem has all new fields
          sampleItem: {
            ...freshUser.sampleItem,
            ...(savedUser.sampleItem || {}),
            diamonds: (savedUser.sampleItem?.diamonds || freshUser.sampleItem.diamonds).map(d => ({ ...d })),
          },
          // Keep saved diamond chart prices if present
          diamondChart: (savedUser.diamondChart && savedUser.diamondChart.length === DIAMOND_CHART_SEED.length)
            ? savedUser.diamondChart
            : freshUser.diamondChart,
        };
      }
      // If user not in saved data → already has fresh defaults from mergedUserData init
    });
  }

  return {
    ...fresh,
    userData: mergedUserData,
    // Always reset navigation on refresh
    screen: 'login',
    screenHistory: [],
    currentUser: null,
  };
}

// ─── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      return { ...state, currentUser: action.user };
    }
    case 'LOGOUT': {
      return { ...state, currentUser: null, screen: 'login', screenHistory: [] };
    }
    case 'SET_SCREEN': {
      return {
        ...state,
        screen: action.screen,
        screenHistory: [...state.screenHistory, state.screen],
      };
    }
    case 'GO_BACK': {
      const history = [...state.screenHistory];
      const prev = history.pop() || 'home';
      return { ...state, screen: prev, screenHistory: history };
    }
    case 'SET_GOLD_PRICE': {
      const uid = state.currentUser.id;
      return {
        ...state,
        userData: {
          ...state.userData,
          [uid]: {
            ...state.userData[uid],
            goldPrice: {
              ...state.userData[uid].goldPrice,
              ratePerGram: action.rate,
              lastUpdated: new Date().toISOString(),
            },
          },
        },
      };
    }
    case 'SET_GOLD_INTERVAL': {
      const uid = state.currentUser.id;
      return {
        ...state,
        userData: {
          ...state.userData,
          [uid]: {
            ...state.userData[uid],
            goldPrice: {
              ...state.userData[uid].goldPrice,
              updateIntervalHours: action.hours,
            },
          },
        },
      };
    }
    case 'UPDATE_DIAMOND_ROW': {
      const uid = state.currentUser.id;
      const chart = state.userData[uid].diamondChart.map(r =>
        r.no === action.no ? { ...r, myPrice: action.myPrice } : r
      );
      return {
        ...state,
        userData: { ...state.userData, [uid]: { ...state.userData[uid], diamondChart: chart } },
      };
    }
    case 'APPLY_SWA_PERCENT': {
      const uid = state.currentUser.id;
      const pct = parseFloat(action.percent) || 0;
      const chart = state.userData[uid].diamondChart.map(r => ({
        ...r,
        myPrice: Math.round(r.swaCaratCost * (1 + pct / 100)),
      }));
      return {
        ...state,
        userData: {
          ...state.userData,
          [uid]: {
            ...state.userData[uid],
            diamondChart: chart,
            pricingMethod: { mode: 'swaPlusPercent', percent: pct },
          },
        },
      };
    }
    case 'SET_PRICING_METHOD': {
      const uid = state.currentUser.id;
      return {
        ...state,
        userData: {
          ...state.userData,
          [uid]: {
            ...state.userData[uid],
            pricingMethod: { ...state.userData[uid].pricingMethod, ...action.payload },
          },
        },
      };
    }
    case 'UPDATE_CHARGES': {
      const uid = state.currentUser.id;
      return {
        ...state,
        userData: {
          ...state.userData,
          [uid]: {
            ...state.userData[uid],
            charges: { ...state.userData[uid].charges, ...action.payload },
          },
        },
      };
    }
    case 'SET_FIELD_VISIBILITY': {
      const uid = state.currentUser.id;
      const { visType, key, value } = action;
      return {
        ...state,
        userData: {
          ...state.userData,
          [uid]: {
            ...state.userData[uid],
            fieldVisibility: {
              ...state.userData[uid].fieldVisibility,
              [visType]: {
                ...state.userData[uid].fieldVisibility[visType],
                [key]: value,
              },
            },
          },
        },
      };
    }
    case 'UPDATE_SAMPLE_ITEM': {
      const uid = state.currentUser.id;
      return {
        ...state,
        userData: {
          ...state.userData,
          [uid]: {
            ...state.userData[uid],
            sampleItem: { ...state.userData[uid].sampleItem, ...action.payload },
          },
        },
      };
    }
    case 'UPDATE_DIAMOND_IN_ITEM': {
      const uid = state.currentUser.id;
      const diamonds = state.userData[uid].sampleItem.diamonds.map(d =>
        d.id === action.id ? { ...d, ...action.payload } : d
      );
      return {
        ...state,
        userData: {
          ...state.userData,
          [uid]: {
            ...state.userData[uid],
            sampleItem: { ...state.userData[uid].sampleItem, diamonds },
          },
        },
      };
    }
    case 'RESET_USER_DATA': {
      const uid = state.currentUser.id;
      const user = DEMO_USERS.find(u => u.id === uid) || {};
      return {
        ...state,
        userData: { ...state.userData, [uid]: freshUserData(user) },
      };
    }
    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────
const AppContext = createContext(null);
const STORAGE_KEY = 'swa_finder_state_v6'; // bumped: new diamond/making discount limits, gold 24h default

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return mergeWithFresh(parsed);
      }
    } catch (e) {
      console.warn('SWA Finder: failed to load saved state, using defaults', e);
    }
    return buildInitialState();
  });

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const login = useCallback((username, password) => {
    const user = DEMO_USERS.find(
      u => u.username === username && u.password === password
    );
    if (!user) return false;
    dispatch({ type: 'LOGIN', user });
    return true;
  }, []);

  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);
  const navigate = useCallback((screen) => dispatch({ type: 'SET_SCREEN', screen }), []);
  const goBack = useCallback(() => dispatch({ type: 'GO_BACK' }), []);

  // Convenience: current user's data (always defined — fallback to fresh)
  const userData = state.currentUser
    ? (state.userData[state.currentUser.id] || freshUserData())
    : null;

  return (
    <AppContext.Provider value={{ state, dispatch, userData, login, logout, navigate, goBack }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
