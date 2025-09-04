"use client";

import { Card } from "@/components/ui/card";
import { trendPoints } from "@/lib/mock-data";

interface TrendsStripProps {
  className?: string;
}

export function TrendsStrip({ className }: TrendsStripProps) {
  // Calculate SVG points for polylines
  const width = 600;
  const height = 100;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const maxValue = Math.max(...trendPoints.pass, ...trendPoints.fail, ...trendPoints.flaky) + 2;
  
  const createPoints = (data: number[]) => {
    return data.map((value, index) => {
      const x = padding + (index * chartWidth / (data.length - 1));
      const y = height - padding - (value / maxValue * chartHeight);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <Card className={`bg-[var(--surface)] rounded-[var(--r-card)] p-5 shadow-[var(--e-1)] border-0 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[var(--brand-ink)]">Trends (7d)</h3>
        
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[var(--brand-success)]" />
            <span className="text-xs text-[var(--text-muted)]">Pass</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[var(--brand-danger)]" />
            <span className="text-xs text-[var(--text-muted)]">Fail</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[var(--brand-warn)]" />
            <span className="text-xs text-[var(--text-muted)]">Flaky</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1={padding}
              y1={height - padding - (percent * chartHeight / 100)}
              x2={width - padding}
              y2={height - padding - (percent * chartHeight / 100)}
              stroke="#E4E4E7"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Pass line */}
          <polyline
            fill="none"
            stroke="var(--brand-success)"
            strokeWidth="2"
            points={createPoints(trendPoints.pass)}
          />
          
          {/* Fail line */}
          <polyline
            fill="none"
            stroke="var(--brand-danger)"
            strokeWidth="2"
            points={createPoints(trendPoints.fail)}
          />
          
          {/* Flaky line */}
          <polyline
            fill="none"
            stroke="var(--brand-warn)"
            strokeWidth="2"
            points={createPoints(trendPoints.flaky)}
          />
          
          {/* X-axis labels */}
          {trendPoints.labels.map((label, index) => (
            <text
              key={label}
              x={padding + (index * chartWidth / (trendPoints.labels.length - 1))}
              y={height - 5}
              textAnchor="middle"
              className="text-xs fill-[var(--text-muted)]"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    </Card>
  );
}