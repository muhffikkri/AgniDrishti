"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import dataset from "@/data/fixtures/dataset.json";
import type {
  Buyer,
  FixtureMetadata,
  ResidueRecord,
  RiskZone,
  Transaction,
  TransactionStatus,
} from "@/lib/types";
import { canTransition } from "@/modules/transactions/state";

export interface AppState {
  metadata: FixtureMetadata;
  riskZones: RiskZone[];
  residues: ResidueRecord[];
  buyers: Buyer[];
  transactions: Transaction[];
}

type Action =
  | { type: "ADD_RESIDUE"; residue: ResidueRecord }
  | { type: "SET_ZONE_REVIEW"; zoneId: string; status: "pending" | "reviewed" }
  | { type: "ADD_TRANSACTION"; transaction: Transaction }
  | { type: "TRANSITION"; id: string; to: TransactionStatus; actor: string; note?: string }
  | { type: "RECORD_MEASUREMENT"; id: string; measuredTonnes: number }
  | { type: "CONFIRM_PAYMENT"; id: string; paidTonnes: number }
  | { type: "HYDRATE"; state: AppState }
  | { type: "RESET" };

const initialState: AppState = {
  metadata: dataset.metadata as FixtureMetadata,
  riskZones: dataset.riskZones as RiskZone[],
  residues: dataset.residues as ResidueRecord[],
  buyers: dataset.buyers as Buyer[],
  transactions: dataset.transactions as Transaction[],
};

function nowIso() {
  return new Date().toISOString();
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_RESIDUE":
      return { ...state, residues: [action.residue, ...state.residues] };
    case "SET_ZONE_REVIEW":
      return {
        ...state,
        riskZones: state.riskZones.map((z) =>
          z.id === action.zoneId ? { ...z, reviewStatus: action.status } : z
        ),
      };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.transaction, ...state.transactions] };
    case "TRANSITION": {
      const tx = state.transactions.find((t) => t.id === action.id);
      if (!tx) return state;
      if (!canTransition(tx.status, action.to)) {
        return state;
      }
      const updated: Transaction = {
        ...tx,
        status: action.to,
        pickupScheduledAt: action.to === "Pickup Scheduled" ? nowIso() : tx.pickupScheduledAt,
        collectedAt: action.to === "Collected / Weighed" ? nowIso() : tx.collectedAt,
        paymentConfirmedAt: action.to === "Completed" ? nowIso() : tx.paymentConfirmedAt,
        events: [
          ...tx.events,
          {
            fromStatus: tx.status,
            toStatus: action.to,
            timestamp: nowIso(),
            actor: action.actor,
            note: action.note,
            provenance: "simulated",
          },
        ],
      };
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === action.id ? updated : t)),
      };
    }
    case "RECORD_MEASUREMENT":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.id ? { ...t, measuredQuantityTonnes: action.measuredTonnes } : t
        ),
      };
    case "CONFIRM_PAYMENT":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.id
            ? { ...t, paidQuantityTonnes: action.paidTonnes, acceptedQuantityTonnes: action.paidTonnes }
            : t
        ),
      };
    case "HYDRATE":
      return action.state;
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface AppStore {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addResidue: (r: ResidueRecord) => void;
  transition: (id: string, to: TransactionStatus, note?: string) => void;
  reset: () => void;
}

const AppContext = createContext<AppStore | null>(null);
const STORAGE_KEY = "agnidrishti.demo.v1";

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) as AppState });
    } catch {
      // ignore malformed local demo state
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage may be unavailable; demo state stays in memory
    }
  }, [state]);

  const value = useMemo<AppStore>(
    () => ({
      state,
      dispatch,
      addResidue: (r) => dispatch({ type: "ADD_RESIDUE", residue: r }),
      transition: (id, to, note) => dispatch({ type: "TRANSITION", id, to, actor: "demo operator", note }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [state]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
