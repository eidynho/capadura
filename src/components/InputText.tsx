import { MagnifyingGlass } from "phosphor-react";
import { ChangeEvent, HTMLAttributes } from "react";

interface InputTextProps extends HTMLAttributes<HTMLInputElement> {
    htmlFor: string;
    label: string;
    placeholder?: string;
    className?: string;
}

interface InputTextSearchProps extends HTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    placeholder?: string;
    className: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function InputText({ htmlFor, label, placeholder, className }: InputTextProps) {
    return (
        <div>
            <label htmlFor={htmlFor} className="block text-sm font-semibold text-black">
                {label}
            </label>
            <input
                id={htmlFor}
                name={htmlFor}
                className={`${
                    className ? className : ""
                } mt-2 block rounded-lg border border-black py-2 pl-3 text-sm outline-none focus:border-yellow-500 focus:ring-yellow-500`}
                placeholder={placeholder}
            />
        </div>
    );
}

export function InputTextSearch({
    id,
    label,
    placeholder,
    className,
    onChange,
}: InputTextSearchProps) {
    return (
        <div className={className}>
            <label htmlFor={id} className="sr-only">
                {label}
            </label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlass size={18} />
                </div>
                <input
                    type="text"
                    id={id}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="block w-80 rounded-lg border border-black p-2 pl-10 text-sm outline-none focus:border-yellow-500 focus:ring-yellow-500"
                />
            </div>
        </div>
    );
}
