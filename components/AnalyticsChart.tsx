import React, { useState, useRef, useEffect } from 'react';

interface ChartDataPoint {
    value: number;
    label: string;
}

interface AnalyticsChartProps {
    data: ChartDataPoint[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; label: string; index: number } | null>(null);
    const [viewBox, setViewBox] = useState({ width: 500, height: 300 });

    useEffect(() => {
        const handleResize = () => {
            if (svgRef.current) {
                const { width } = svgRef.current.getBoundingClientRect();
                // Maintain a consistent aspect ratio, e.g., 5:3
                setViewBox({ width: 500, height: 300 }); 
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-neutral-500">Không có dữ liệu để hiển thị.</div>;
    }

    const padding = { top: 20, right: 10, bottom: 30, left: 45 };
    const chartWidth = viewBox.width - padding.left - padding.right;
    const chartHeight = viewBox.height - padding.top - padding.bottom;

    const maxValue = Math.max(...data.map(d => d.value)) * 1.1; // 10% buffer for top padding
    const minValue = 0;

    const barPadding = 0.3; // 30% padding between bars
    const barWidth = (chartWidth / data.length) * (1 - barPadding);
    const barSpacing = (chartWidth / data.length) * barPadding;

    const getX = (index: number) => padding.left + index * (barWidth + barSpacing);
    const getY = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        // Convert clientX to SVG's coordinate system
        const svgX = (e.clientX - rect.left) * (viewBox.width / rect.width);
        
        const index = Math.floor((svgX - padding.left + barSpacing / 2) / (barWidth + barSpacing));

        if (index >= 0 && index < data.length) {
            const point = data[index];
            setTooltip({
                x: getX(index) + barWidth / 2,
                y: getY(point.value),
                value: point.value,
                label: point.label,
                index: index,
            });
        }
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };
    
    // Y-axis labels and grid lines
    const yAxisLabels = [];
    const numTicks = 5;
    for (let i = 0; i <= numTicks; i++) {
        const value = Math.round(minValue + (maxValue - minValue) * (i / numTicks));
        const y = getY(value);
        yAxisLabels.push(
            <g key={i} className="text-xs">
                <text x={padding.left - 8} y={y} dy="0.32em" textAnchor="end" className="fill-current text-neutral-500">
                    {value.toLocaleString('vi-VN')}
                </text>
                <line x1={padding.left} x2={viewBox.width - padding.right} y1={y} y2={y} className="stroke-current text-gray-800" strokeWidth="1" />
            </g>
        );
    }
    
    // X-axis labels
    const xAxisLabels = [];
    const labelFrequency = data.length > 15 ? Math.floor(data.length / 5) : 1;
     for (let i = 0; i < data.length; i++) {
        if (i % labelFrequency === 0 && data[i].label) {
             xAxisLabels.push(
                <text
                    key={i}
                    x={getX(i) + barWidth / 2}
                    y={padding.top + chartHeight + 15}
                    textAnchor="middle"
                    className="text-xs fill-current text-neutral-500"
                >
                    {data[i].label}
                </text>
            );
        }
    }


    return (
        <div className="relative w-full h-full">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
                className="w-full h-full"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <g>{yAxisLabels}</g>
                <g>{xAxisLabels}</g>
                <g>
                    {data.map((point, i) => (
                        <rect
                            key={i}
                            x={getX(i)}
                            y={getY(point.value)}
                            width={barWidth}
                            height={chartHeight + padding.top - getY(point.value)}
                            fill="url(#barGradient)"
                            rx="2"
                            className="transition-opacity duration-200"
                            opacity={tooltip && tooltip.index === i ? 1 : 0.6}
                            style={{transformOrigin: `50% 100%`, transform: (tooltip && tooltip.index === i ? 'scaleY(1.02)' : 'scaleY(1)'), transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'}}
                        />
                    ))}
                </g>
                <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.8" />
                    </linearGradient>
                </defs>
                 {tooltip && (
                    <g className="pointer-events-none">
                        <line 
                          x1={tooltip.x} y1={tooltip.y - 10} 
                          x2={tooltip.x} y2={padding.top + chartHeight} 
                          stroke="#a855f7" 
                          strokeWidth="1" 
                          strokeDasharray="3,3" 
                        />
                        <circle cx={tooltip.x} cy={tooltip.y} r="4" fill="#a855f7" stroke="#0c0a09" strokeWidth="2" />
                    </g>
                )}
            </svg>
            {tooltip && (
                <div 
                    className="absolute p-2 text-sm bg-gray-950 text-white rounded-md pointer-events-none border border-gray-700 shadow-xl"
                    style={{ 
                        left: `${(tooltip.x / viewBox.width) * 100}%`,
                        top: `${(tooltip.y / viewBox.height) * 100 - 15}%`,
                        transform: 'translate(-50%, -100%)',
                        minWidth: '110px',
                        transition: 'left 0.1s ease-out, top 0.1s ease-out'
                    }}
                >
                    <div className="font-bold text-center text-purple-300">{tooltip.label}</div>
                    <div className="text-center font-semibold">{tooltip.value.toLocaleString('vi-VN')} Lượt xem</div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsChart;