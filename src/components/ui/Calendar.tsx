"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { pt } from "date-fns/locale";

import { cn } from "@/utils/cn";
import { buttonVariants } from "@/components/ui/Button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            locale={pt}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col justify-center w-full space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium text-black dark:text-white",
                nav: "space-x-1 flex items-center",
                nav_button: cn(buttonVariants({ variant: "default" }), "h-7 w-7 p-0"),
                nav_button_previous: "absolute left-1 text-black dark:text-white",
                nav_button_next: "absolute right-1 text-black dark:text-white",
                table: "w-full border-collapse space-y-1 pointer-events-none",
                head_row: "flex justify-between",
                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2 justify-between",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal text-black rounded-md aria-selected:opacity-100 dark:text-white",
                day_selected: "bg-primary !text-black",
                day_today:
                    "bg-primary text-black h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-black",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({}) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({}) => <ChevronRight className="h-4 w-4" />,
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
