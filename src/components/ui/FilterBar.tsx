import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

export function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  className,
}: FilterBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Calculate the sliding indicator position
  useEffect(() => {
    if (!containerRef.current) return;
    const activeBtn = containerRef.current.querySelector<HTMLButtonElement>(
      `[data-filter="${activeFilter}"]`,
    );
    if (activeBtn) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setIndicatorStyle({
        left:
          btnRect.left - containerRect.left + containerRef.current.scrollLeft,
        width: btnRect.width,
      });
    }
  }, [activeFilter, filters]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex gap-2 overflow-x-auto pb-2 no-scrollbar",
        className,
      )}
    >
      {/* Sliding active indicator */}
      <motion.div
        className="absolute bottom-2 h-[calc(100%-8px)] rounded-full bg-accent-cyan/15 border border-accent-cyan/30"
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        style={{ top: 0 }}
      />

      {filters.map((filter) => (
        <button
          key={filter}
          data-filter={filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            "relative z-10 shrink-0 rounded-full border border-transparent px-4 py-1.5 font-mono text-xs transition-colors duration-200",
            activeFilter === filter
              ? "text-accent-cyan font-medium"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
