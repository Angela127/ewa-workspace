import { Suspense } from "react";
import { RuntimeLoader } from "@rive-app/react-canvas";
import { getLocalData } from "@root/lib/localData";
import { AvatarStateProvider } from "../src/context/avatarState";

import data from '@root/json/avatarConfig.json'
import RiveMainEntry from "@/components-virtual/RiveMainEntry";
export type JSONData = typeof data;

export default async function Home() {
  const localData: JSONData = await getLocalData();
  return (
    <main className="block relative w-screen max-w-screen-xl h-screen max-h-screen md:mx-auto">
      <Suspense fallback={<p>loading</p>}>
        <AvatarStateProvider>
          <RiveMainEntry localData={localData} />
        </AvatarStateProvider>
      </Suspense>
    </main>
  );
} 