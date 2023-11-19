"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { Point, Area } from "react-easy-crop";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Slider } from "@/components/ui/Slider";
import { useToast } from "@/components/ui/UseToast";

interface ImageCropDialogProps {
    imageSrc?: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onSave: (blobURL: File[]) => void;
}

export function ImageCropDialog({ imageSrc, isOpen, setIsOpen, onSave }: ImageCropDialogProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const [zoom, setZoom] = useState([1]);
    const { toast } = useToast();

    const onZoomChange = (zoom: number) => {
        setZoom([zoom]);
    };

    const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const saveAndApplyCrop = () => {
        const canvas = canvasRef.current;
        if (!canvas || !imageSrc) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return console.error("2D context is null");
        }

        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
            // Set canvas dimensions based on crop data
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            // Draw the cropped portion of the image onto the canvas
            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "temp2.jpeg", { type: "image/jpeg" });
                    onSave([file]);
                    setZoom([1]);
                } else {
                    console.error("Failed to convert canvas to blob.");
                    toast({
                        title: "Erro ao editar imagem.",
                        description: "Atualize a página e tente novamente.",
                        variant: "destructive",
                    });
                }
            }, "image/jpeg");
        };
    };

    if (!imageSrc) return;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="default" onClick={() => setIsOpen(false)}>
                            <ArrowLeft size={16} />
                        </Button>
                        <DialogTitle>Editar imagem</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center gap-4 px-3 py-2">
                    <div className="flex w-full flex-col gap-8">
                        <div className="relative h-96 w-full">
                            <canvas ref={canvasRef} className="hidden" />
                            <Cropper
                                image={imageSrc}
                                zoom={zoom[0]}
                                onZoomChange={onZoomChange}
                                crop={crop}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                aspect={1 / 1}
                                style={{ cropAreaStyle: { borderRadius: "9999px" } }}
                            />
                        </div>

                        <Slider
                            defaultValue={[1]}
                            min={1}
                            max={3}
                            step={0.05}
                            value={zoom}
                            onValueChange={(value: number[]) => setZoom(value)}
                        />

                        <Button size="sm" variant="primary" onClick={saveAndApplyCrop}>
                            Aplicar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
