import { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  width?: number | string;
  rounded?: string;
}

export function Skeleton({
  height,
  width,
  rounded = "rounded-[10px]",
  className = "",
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#e7e5e0] ${rounded} ${className}`}
      style={{ height, width, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}
