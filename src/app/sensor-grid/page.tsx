import Breadcrumb from "@/components/Common/Breadcrumb";
import SensorGrid from "@/components/SensorGrid";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SensorGrid Page",
  description: "This is SensorGrid Page",
  // other metadata
};

const SensorGridPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Sensor Grid Page"
        description="A timeline-based sensor data viewer with labeling tools for marking events, anomalies, and key insights — built for robotics and machine learning workflows."
      />

      <SensorGrid />
    </>
  );
};

export default SensorGridPage;
