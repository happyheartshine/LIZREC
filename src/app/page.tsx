import SentraCoreSectionOne from "@/components/SentraCore/SentraCoreSectionOne";
import IronGate from "@/components/IronGate";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import SensorGrid from "@/components/SensorGrid";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "This is Home for Startup Nextjs Template",
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      {/* <Features /> */}
      {/* <Video /> */}
      {/* <Brands /> */}
      <SentraCoreSectionOne />
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <IronGate />
      <SensorGrid />
    </>
  );
}
