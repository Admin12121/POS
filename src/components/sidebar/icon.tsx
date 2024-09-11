import React from 'react';

import { RxDashboard } from "react-icons/rx";
import { IoCubeOutline } from "react-icons/io5";
import { RiAddBoxLine } from "react-icons/ri";
import { GiCubeforce } from "react-icons/gi";
import { PiChartLineDown } from "react-icons/pi";
import { PiCubeTransparentLight } from "react-icons/pi";
import { GoTag } from "react-icons/go";

const iconMap: { [key: string]: React.ComponentType } = {
  Dashboard: RxDashboard,
  Product: IoCubeOutline,
  Create: RiAddBoxLine,
  Expired: GiCubeforce,
  Low: PiChartLineDown,
  Category: PiCubeTransparentLight,
  Brand: GoTag,
};

const Icon = ({ iconName, children }: { iconName: string, children: React.ReactNode }) => {
  const IconComponent = iconMap[iconName] || null;

  return (
    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
      {IconComponent ? <IconComponent /> : null}
      <span>{children}</span>
    </div>
  );
};

export default Icon;