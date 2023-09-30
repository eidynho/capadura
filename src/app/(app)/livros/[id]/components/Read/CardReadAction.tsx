import * as React from "react";

import { cn } from "@/utils/cn";

const CardReadAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "group mt-2 flex h-36 w-full flex-col justify-center rounded-md border bg-white dark:bg-black px-8 cursor-pointer relative overflow-hidden hover:bg-gray-200/50 dark:hover:bg-accent/25 transition-all",
                className,
            )}
            {...props}
        />
    ),
);
CardReadAction.displayName = "CardReadAction";

const CardReadActionTitle = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
    <span
        ref={ref}
        className={cn("font-semibold text-black z-10 dark:text-white", className)}
        {...props}
    />
));
CardReadActionTitle.displayName = "CardReadActionTitle";

const CardReadActionDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("mt-2 text-sm leading-6 z-10 text-muted-foreground", className)}
        {...props}
    />
));
CardReadActionDescription.displayName = "CardReadActionDescription";

const CardReadActionPicture = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "group-hover:scale-105 transition-all duration-300 absolute -right-20 w-[38rem] opacity-50 lg:opacity-75",
            className,
        )}
        {...props}
    />
));
CardReadActionPicture.displayName = "CardReadActionPicture";

export { CardReadAction, CardReadActionTitle, CardReadActionDescription, CardReadActionPicture };
