import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  href?: string;
  subtext?: string;
}

export function Logo({ className, iconOnly = false, href = "/", subtext }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 font-bold text-foreground group transition-all",
        className
      )}
    >
      <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
        <Image
          src="/favicon.png"
          alt="Atenier Technologies Logo"
          fill
          className="object-cover"
        />
      </div>
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold text-foreground">
              ATENIER<span className="text-primary">TECHNOLOGIES</span>
            </span>
          </div>
          {subtext && (
            <span className="text-[10px] font-medium text-muted-foreground uppercase mt-0.5">
              {subtext}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}