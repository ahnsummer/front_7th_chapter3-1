import React from "react";
import { StatCard } from "./StatCard";

interface Stat {
  label: string;
  value: number;
}

interface StatsSectionProps {
  total: number;
  stat1: Stat;
  stat2: Stat;
  stat3: Stat;
  stat4: Stat;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  total,
  stat1,
  stat2,
  stat3,
  stat4,
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5 mb-4">
      <StatCard label="전체" value={total} variant="info" />
      <StatCard label={stat1.label} value={stat1.value} variant="success" />
      <StatCard label={stat2.label} value={stat2.value} variant="warning" />
      <StatCard label={stat3.label} value={stat3.value} variant="danger" />
      <StatCard label={stat4.label} value={stat4.value} variant="default" />
    </div>
  );
};
