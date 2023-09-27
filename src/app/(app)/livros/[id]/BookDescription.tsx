"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface BookDescriptionProps {
    description?: string | null;
    className?: string;
}

const MAX_DESCRIPTION_HEIGHT_IN_PX = 320;

export function BookDescription({ description, className }: BookDescriptionProps) {
    const [showFullDescription, setShowFullDescription] = useState(true);
    const [maximumHeightExceeded, setMaximumHeightExceeded] = useState(false);

    const descriptionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!descriptionRef?.current) return;

        if (descriptionRef.current.clientHeight > MAX_DESCRIPTION_HEIGHT_IN_PX) {
            setShowFullDescription(false);
            setMaximumHeightExceeded(true);
        }
    }, [description, descriptionRef]);

    return (
        <>
            <div className="relative">
                <div
                    ref={descriptionRef}
                    className={cn(
                        "text-sm leading-7 text-black dark:text-muted-foreground",
                        showFullDescription ? "" : "max-h-72 overflow-hidden",
                        className,
                    )}
                    dangerouslySetInnerHTML={{
                        __html: description || "",
                    }}
                ></div>
                {!showFullDescription && (
                    <div className="absolute left-0 top-0 z-0 h-full w-full bg-gradient-to-t from-light via-transparent transition-all dark:from-dark"></div>
                )}
            </div>
            {maximumHeightExceeded && (
                <Button
                    size="sm"
                    variant="link"
                    onClick={() => setShowFullDescription((state) => !state)}
                >
                    {showFullDescription ? "Mostrar menos" : "Mostrar tudo"}
                </Button>
            )}
        </>
    );
}
