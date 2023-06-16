interface SeparatorProps {
    customStyles?: string;
}

export function Separator({ customStyles }: SeparatorProps) {
    return (
        <hr className={`${customStyles ? customStyles : ""} my-4 border-black dark:border-white`} />
    );
}
