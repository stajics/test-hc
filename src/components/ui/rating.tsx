import * as React from "react";
import { cn } from "@/lib/utils/ui";
import { StarIcon } from "../icons/StarIcon";

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  maxValue?: number;
}

function Rating({ value, maxValue = 10, className, ...props }: RatingProps) {
  // Convert the rating to a 0-5 scale for stars
  const normalizedValue = (value / maxValue) * 5;
  const fullStars = Math.floor(normalizedValue);
  const hasHalfStar = normalizedValue - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div
      className={cn("flex items-center text-yellow-500", className)}
      {...props}
    >
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIcon key={`full-${i}`} className="fill-current" />
      ))}

      {hasHalfStar && <StarIcon className="fill-current" />}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <StarIcon key={`empty-${i}`} className="text-gray-300" />
      ))}

      <span className="ml-1 text-sm font-medium">
        {value.toFixed(1)}/{maxValue}
      </span>
    </div>
  );
}

export { Rating };
