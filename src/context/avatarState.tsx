"use client";

import React, { createContext, useContext, useReducer, PropsWithChildren, Context } from "react";
import { getLocalData, JSONType } from "../../lib/localData"

const initialState = {
  activeIcon: "Color", // Default active icon
  riveAvatarSelections: {
    Color: 0,
    Face: 0,
    BackgroundColor: 0,
  },
};

const actions = {
  SET_ACTIVE_ICON: "SET_ACTIVE_ICON",
  SET_RIVE_AVATAR_SELECTION: "SET_RIVE_AVATAR_SELECTION",
};

export const AvatarStateContext: Context<any> = createContext({});

export const AvatarStateProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case actions.SET_ACTIVE_ICON:
        return { ...state, activeIcon: action.activeIcon };
      case actions.SET_RIVE_AVATAR_SELECTION:
        return {
          ...state,
          riveAvatarSelections: {
            ...state.riveAvatarSelections,
            [action.feature]: action.featureValue,
          },
        };
      default:
        return state;
    }
  }, initialState);

  const setActiveIcon = (activeIcon: string) => {
    dispatch({ type: actions.SET_ACTIVE_ICON, activeIcon });
  };

  const setRiveAvatarSelection = (feature: string, featureValue: number) => {
    dispatch({ type: actions.SET_RIVE_AVATAR_SELECTION, feature, featureValue });
  };

  return (
    <AvatarStateContext.Provider
      value={{
        state,
        setActiveIcon,
        setRiveAvatarSelection,
      }}
    >
      {children}
    </AvatarStateContext.Provider>
  );
};
