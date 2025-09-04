"use client";

import { Card } from "@/components/ui/card";
import { flakyByDevice } from "@/lib/mock-data";

interface FlakyBreakdownProps {
  className?: string;
}

export function FlakyBreakdown({ className }: FlakyBreakdownProps) {
  // Calculate donut chart segments
  const total = flakyByDevice.reduce((sum, item) => sum + item.percent, 0);
  let cumulativePercent = 0;
  
  const createPath = (percent: number, offset: number) => {
    const startAngle = (offset / 100) * 360 - 90;
    const endAngle = ((offset + percent) / 100) * 360 - 90;
    const largeArcFlag = percent > 50 ? 1 : 0;
    
    const startX = 50 + 35 * Math.cos((startAngle * Math.PI) / 180);
    const startY = 50 + 35 * Math.sin((startAngle * Math.PI) / 180);
    const endX = 50 + 35 * Math.cos((endAngle * Math.PI) / 180);
    const endY = 50 + 35 * Math.sin((endAngle * Math.PI) / 180);
    
    const innerStartX = 50 + 20 * Math.cos((startAngle * Math.PI) / 180);
    const innerStartY = 50 + 20 * Math.sin((startAngle * Math.PI) / 180);
    const innerEndX = 50 + 20 * Math.cos((endAngle * Math.PI) / 180);
    const innerEndY = 50 + 20 * Math.sin((endAngle * Math.PI) / 180);
    
    return `
      M ${startX} ${startY}
      A 35 35 0 ${largeArcFlag} 1 ${endX} ${endY}
      L ${innerEndX} ${innerEndY}
      A 20 20 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
      Z
    `;
  };
  
  const colors = [
    "var(--brand-warn)",
    "#FFC94D",
    "#FFD873",
    "#FFE4A1",
  ];

  return (
    <Card className={`bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0 ${className}`}>
      <h3 className="text-base font-semibold text-[var(--brand-ink)] mb-4">Flaky Breakdown</h3>
      
      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <svg width="100" height="100" viewBox="0 0 100 100">
          {flakyByDevice.map((item, index) => {
            const path = createPath(item.percent, cumulativePercent);
            cumulativePercent += item.percent;
            
            return (
              <path
                key={item.device}
                d={path}
                fill={colors[index]}
                opacity="0.9"
              />
            );
          })}
          {/* Center text */}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-lg font-bold fill-[var(--brand-ink)]"
          >
            18%
          </text>
          <text
            x="50"
            y="62"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-[var(--text-muted)]"
          >
            Flaky
          </text>
        </svg>
        
        {/* Device list */}
        <div className="flex-1 space-y-2">
          {flakyByDevice.map((item, index) => (
            <div key={item.device} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[index] }}
                />
                <span className="text-sm text-[var(--brand-ink)]">{item.device}</span>
              </div>
              <span className="text-sm font-medium text-[var(--brand-ink)] tabular-nums">
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}