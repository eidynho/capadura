import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const badgeVariants = cva(
    "flex select-none items-center gap-1 rounded-lg border px-2 py-1 text-xs",
    {
        variants: {
            variant: {
                default: "border-gray-500 bg-gray-500/10",
                green: "border-green-500 bg-green-500/10",
                sky: "border-sky-500 bg-sky-500/10",
                yellow: "border-yellow-500 bg-yellow-500/10",
                red: "border-red-500 bg-red-500/10",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
