"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Muy from "@/assets/images/muy.png";

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   router.push("/dashboard");
  // }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {/* <h1 className="text-4xl font-bold">Welcome to Soar Task Assessment</h1> */}
      <Image src={Muy} alt="MUY" className="h-auto w-96" />
    </div>
  );
}
