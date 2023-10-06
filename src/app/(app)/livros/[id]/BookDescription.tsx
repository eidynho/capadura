"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface BookDescriptionProps {
    description?: string | null;
    className?: string;
}

const MAX_DESCRIPTION_HEIGHT_IN_PX = 120;

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
            <div
                ref={descriptionRef}
                className={cn(
                    "bg-gradient-to-b from-black bg-clip-text text-sm leading-7 text-transparent transition-all dark:from-muted-foreground",
                    showFullDescription
                        ? "to-black dark:to-light"
                        : "max-h-40 overflow-hidden to-light dark:to-dark",
                    className,
                )}
                dangerouslySetInnerHTML={{
                    __html: description || "",
                }}
            ></div>
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
