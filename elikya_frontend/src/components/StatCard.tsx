import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  label: string;
  icon?: LucideIcon;
  className?: string;
}

export const StatCard = ({ title, value, trend, label, icon: Icon, className }: StatCardProps) => {
  const hasTrend = trend !== undefined;
  const isPositive = trend ? trend > 0 : false;
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <Card 
      className={cn(
        "bg-card border border-border/50 rounded-2xl transition-all duration-500 ease-out",
        "hover:bg-card/80 hover:border-primary/30 group cursor-default shadow-md overflow-hidden relative",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-36 sm:h-40 relative z-10">
        <div className="flex justify-between items-start gap-4">
          <p className="text-[10px] font-black text-foreground/50 uppercase tracking-[0.25em] group-hover:text-primary transition-colors duration-300">
            {title}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {hasTrend && (
              <div className={cn(
                "flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black border transition-all duration-500 font-mono",
                isPositive 
                  ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 group-hover:border-green-500/40" 
                  : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 group-hover:border-red-500/40"
              )}>
                {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span>{isPositive ? `+${trend}%` : `${trend}%`}</span>
              </div>
            )}
            {Icon && (
              <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <Icon size={14} className="transition-transform duration-500 group-hover:scale-110" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter truncate w-full group-hover:text-primary transition-all duration-500">
            {formattedValue}
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="h-[2px] w-5 bg-border group-hover:w-8 group-hover:bg-primary transition-all duration-500" /> 
            <p className="text-[10px] font-bold italic text-foreground/50 uppercase tracking-[0.18em] group-hover:text-foreground/80 transition-colors duration-300 truncate">
              {label}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};