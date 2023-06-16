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
                } block py-2 pl-3 mt-2 text-sm border border-black rounded-lg outline-none focus:ring-yellow-500 focus:border-yellow-500`}
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
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MagnifyingGlass size={18} />
                </div>
                <input
                    type="text"
                    id={id}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="block p-2 pl-10 text-sm border border-black rounded-lg w-80 outline-none focus:ring-yellow-500 focus:border-yellow-500"
                />
            </div>
        </div>
    );
}
