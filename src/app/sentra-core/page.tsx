import SentraCoreSectionOne from "@/components/SentraCore/SentraCoreSectionOne";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SentraCore Page",
  description: "This is SentraCore Page",
  // other metadata
};

const SentraCorePage = () => {
  return (
    <>
      <Breadcrumb
        pageName="SentraCore Page"
        description="A next-gen visual logic engine that lets you design complex robot behaviors through drag-and-drop blocks — fast, intuitive, and structured for real-world deployment."
      />
      <SentraCoreSectionOne />
    </>
  );
};

export default SentraCorePage;
