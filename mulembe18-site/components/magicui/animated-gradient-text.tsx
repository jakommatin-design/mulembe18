import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function AnimatedGradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f] backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%]",
        "border border-white/20 bg-white/10 dark:bg-black/20",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 block h-full w-full animate-gradient-x bg-gradient-to-r from-[#0D6E38]/50 via-[#DDA71D]/40 to-[#0077B6]/50 bg-[length:var(--bg-size)_100%] p-[1px] ![mask-composite:subtract] [border-radius:inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]"
        )}
      />
      {children}
    </div>
  );
}
