"use client";

import { useContext } from "react";
import { AvatarStateContext } from "../context/avatarState";
import RiveAvatar from "../components-virtual/RiveAvatarComponent";
import RiveIconsContainer from "../components-virtual/RiveIconsContainer";
import RiveOptionsContainer from "../components-virtual/RiveOptionsContainer";
import { JSONType } from "../../lib/localData";

interface RiveMainEntryProps {
  localData: JSONType;
}

export default function RiveMainEntry({ localData }: RiveMainEntryProps) {
  const {
    state: { activeIcon },
  } = useContext(AvatarStateContext);

  // Dynamically determine the correct key for the active icon from the activeIcon state.
  // This includes the new categories like Color, Face, and BackgroundColor.
  const trimmedActiveIcon: keyof JSONType = localData[activeIcon as keyof JSONType]
    ? (activeIcon as keyof JSONType) // If activeIcon is directly a key in localData, use it.
    : "BackgroundColor"; // Default to BackgroundColor if no match.

  // Safely access numOptions from the localData for the trimmedActiveIcon
  const numOptions = localData[trimmedActiveIcon]?.numOptions ?? 0;

  return (
    <div className="md:flex md:flex-row md:justify-center md:px-0 block min-h-[50vh] h-fit">
      <div className="relative w-full h-fit-content flex md:flex-row flex-col md:p-3">
        <div className="w-full h-[50vh] flex flex-col justify-start md:justify-between">
          <div className="block sm:text-4xl md:hidden bg-[#090909]">
            <h1 className="md:text-4xl lg:text-5xl text-6xl text-center py-3">Avatar Creator</h1>
          </div>
          <div className="h-[calc(100%-84px)] w-full md:aspect-square">
            <RiveAvatar />
          </div>
        </div>
        <div className="w-full h-[50vh] md:h-full relative mx-auto overflow-x-hidden bg-[#090909] p-3">
          <RiveIconsContainer />
          {/* Safely pass numOptions to RiveOptionsContainer */}
          <RiveOptionsContainer
            buttonCollectionName={trimmedActiveIcon as string}
            numOptions={numOptions} // Ensures fallback to 0 if numOptions is undefined
          />
        </div>
      </div>
    </div>
  );
}
