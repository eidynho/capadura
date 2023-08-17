import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
    "inline-flex gap-2 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "text-black hover:bg-black hover:bg-opacity-5",
                black: "bg-black text-primary hover:bg-black/90",
                success: "bg-green-500 text-white hover:bg-green-500/90",
                destructive: "bg-destructive text-white hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                link: "text-black underline-offset-4 hover:underline",
                neobrutalism:
                    "flex items-center justify-center gap-2 rounded-lg border border-black bg-black  text-white transition-all duration-300 disabled:cursor-default disabled:border-black disabled:bg-black/80 disabled:bg-opacity-100 disabled:text-white   enabled:hover:-translate-x-1 enabled:hover:-translate-y-1 enabled:hover:bg-yellow-500 enabled:hover:text-black enabled:hover:shadow-[0.25rem_0.25rem_#000]",
            },
            size: {
                default: "text-base px-4 py-3",
                xs: "text-xs px-3 py-1",
                sm: "text-sm px-3 py-2",
                md: "text-base px-4 py-3",
                lg: "text-lg px-6 py-4",
                icon: "h-10 w-10",
                "icon-sm": "h-8 w-8",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = "Button";

export { Button, buttonVariants };
