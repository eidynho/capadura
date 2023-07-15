import Link from "next/link";
import { CaretRight, House } from "phosphor-react";
import { ReactNode } from "react";

export interface BreadcrumbItem {
    name: string;
    path: string;
    icon?: ReactNode;
}

interface BreadcrumbProps {
    items?: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex pb-3 pr-2 pt-4 text-black" aria-label="breadcrumb">
            <ol className="inline-flex items-center gap-2">
                <li>
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-sm font-medium text-black hover:text-yellow-600 hover:underline"
                    >
                        <House size={16} />
                        <span>Início</span>
                    </Link>
                </li>
                {items &&
                    items.length &&
                    items.map((item, index) => {
                        const isLastItem = index === items.length - 1;

                        return (
                            <li
                                key={item.path}
                                className="inline-flex items-center gap-2 text-sm font-medium text-black"
                            >
                                <CaretRight size={14} />
                                {isLastItem ? (
                                    <span>{item.name}</span>
                                ) : (
                                    <Link
                                        href={item.path}
                                        className="flex items-center gap-1 hover:text-yellow-600 hover:underline"
                                    >
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </Link>
                                )}
                            </li>
                        );
                    })}
            </ol>
        </nav>
    );
}
