"use client";

import dynamic from "next/dynamic";

const HeartBackgroundClient = dynamic(() => import("./HeartBackgroundClient"), {
  ssr: false,
});

export default function HeartBackground() {
  return <HeartBackgroundClient />;
}
