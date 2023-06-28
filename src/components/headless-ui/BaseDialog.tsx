import { Fragment, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "phosphor-react";
import { manrope } from "@/pages/_app";

interface BaseDialogProps {
    children: ReactNode;
    size?: string;
    title: string;
    description?: string;
    isOpen: boolean;
    toggleDialog: () => void;
}

export function BaseDialog({
    children,
    size,
    title,
    description,
    isOpen,
    toggleDialog,
}: BaseDialogProps) {
    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className={`relative z-10 ${manrope.variable} font-manrope`}
                    onClose={toggleDialog}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className={`${
                                        size ? size : "max-w-md"
                                    } w-full transform overflow-hidden rounded-2xl bg-primary/80
                                    p-6 text-left align-middle text-black shadow-xl 
                                    backdrop-blur transition-all dark:bg-black/70 dark:text-white`}
                                >
                                    <div className="flex items-center justify-between">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6"
                                        >
                                            {title}
                                        </Dialog.Title>
                                        <button
                                            onClick={toggleDialog}
                                            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-black 
                                            hover:bg-gray-400/20 dark:text-white"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                    {description && (
                                        <Dialog.Description>{description}</Dialog.Description>
                                    )}
                                    {children}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
