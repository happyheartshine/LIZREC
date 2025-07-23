import IronGateSectionOne from "@/components/IronGate/IronGateSectionOne";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iron Gate Page",
  description: "This is Iron Gate Page",
  // other metadata
};

const IronGate = () => {
  return (
    <>
      <Breadcrumb
        pageName="Iron Gate"
        description="Automatically verifies logic files for risks, infinite loops, and unsafe operations — so you can test with confidence before going physical."
      />
      <IronGateSectionOne />
    </>
  );
};

export default IronGate;
