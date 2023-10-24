interface ProgressBarProps {
    bookPageCount: number;
    currentPage: number;
    currentPercentage?: number;
}

export function ProgressBar({ bookPageCount, currentPage, currentPercentage }: ProgressBarProps) {
    return (
        <div className="mt-4 flex items-center text-black dark:text-white">
            <div className="flex items-center gap-1 text-sm font-medium">
                <span>{currentPage}</span>
            </div>
            <div className="relative mx-2 h-5 flex-1 overflow-hidden rounded border bg-muted dark:bg-muted-foreground/25">
                <div
                    className="h-5 bg-primary/50"
                    style={{
                        width: `${currentPercentage ?? 0}%`,
                    }}
                ></div>
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-black">
                    {`${currentPercentage}%`}
                </span>
            </div>
            <span className="w-8 text-sm font-medium">{bookPageCount}</span>
        </div>
    );
}
