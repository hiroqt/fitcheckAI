import React from "react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  className,
  title,
  description,
  header,
  icon,
  badge,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-2xl group/bento transition duration-200 p-6 bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.18] justify-between flex flex-col space-y-4 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm relative overflow-hidden",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200 z-10">
        <div className="flex items-center justify-between mb-2">
          {icon}
          {badge && (
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-slate-300">
              {badge}
            </span>
          )}
        </div>
        <div className="font-sans font-medium text-slate-100 text-lg mb-1 tracking-tight">
          {title}
        </div>
        <div className="font-sans font-normal text-slate-400 text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};

