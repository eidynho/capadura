import * as React from "react";

import { cn } from "@/utils/cn";

const CardAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "group relative mt-2 flex h-32 w-full cursor-pointer flex-col justify-center overflow-hidden rounded-md border bg-white pl-8 pr-2 transition-all hover:bg-gray-200/50 dark:bg-black dark:hover:bg-accent/25",
                className,
            )}
            {...props}
        />
    ),
);
CardAction.displayName = "CardAction";

const CardActionTitle = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
    ({ className, ...props }, ref) => (
        <span
            ref={ref}
            className={cn("z-10 font-semibold text-black dark:text-white", className)}
            {...props}
        />
    ),
);
CardActionTitle.displayName = "CardActionTitle";

const CardActionDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("z-10 mt-2 text-sm leading-6 text-muted-foreground", className)}
        {...props}
    />
));
CardActionDescription.displayName = "CardActionDescription";

const CardActionPicture = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "absolute -right-20 w-[38rem] opacity-50 transition-all duration-300 group-hover:scale-105 lg:opacity-75",
                className,
            )}
            {...props}
        />
    ),
);
CardActionPicture.displayName = "CardActionPicture";

export { CardAction, CardActionTitle, CardActionDescription, CardActionPicture };
