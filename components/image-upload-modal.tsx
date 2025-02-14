'use client'

import { ReactNode, useEffect, useRef, useState } from "react";
import { Modal } from "./modal";
import { Button } from "./ui/button";
import { Image } from "lucide-react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { UploadService } from "@/services/upload.service";

interface ImageUploadModalProps {
  children: ReactNode
  isOpen: boolean
  onUpload: (imageUrl: string) => void
  aspectRatio?: number
}

export default function ImageUploadModal ({
  children,
  isOpen,
  onUpload,
  aspectRatio
}: ImageUploadModalProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cropperRef = useRef<HTMLImageElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setImageSrc(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  }

  const onImageUpload = async () => {
    if (cropperRef.current) {
      //@ts-ignore
      const cropper = cropperRef.current?.cropper;
      const croppedCanvas = cropper.getCroppedCanvas({
        maxWidth: 2048,
        maxHeight: 2048
      });

      const croppedImageURL = croppedCanvas.toDataURL('image/png');

      await new Promise<void>((resolve, reject) => {
        croppedCanvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append('file', blob, 'image.jpeg');

          try {
            const response = await UploadService.uploadImage(formData);
            onUpload(response.imageUrl)
            
            resolve();
          } catch (error) {
            console.error('Upload failed:', error);
            reject(error)
          }
        });
      });
    }
  };

  useEffect(() => {
    setImageSrc("")
  }, [isOpen])

  return (
    <Modal.Root>
      <Modal.OpenButton>
        {children}
      </Modal.OpenButton>

      <Modal.Container
        className="[&>button]:hidden"
      >
        <Modal.Header
          className="[&>button]:hidden"
        >
          <Modal.Title title="Selecione uma imagem para fazer upload" />
        </Modal.Header>

        <Modal.Content>
          {
            !imageSrc
            ? (
              <div className="flex flex-col items-center">
                <p>Tamanho máximo de 5MB</p>
                <p>png, jpg, jpeg, webp</p>

                <Button 
                  className="mt-1"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Image />
                  Selecionar Imagem
                </Button>

                <input
                  type="file"
                  id="upload-image"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="sr-only"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </div>
            ) : (
              <div
                className="max-h-80 h-full"
              >
                <Cropper
                  dragMode="move"
                  guides={false}
                  initialAspectRatio={1}
                  aspectRatio={aspectRatio}
                  viewMode={1}
                  ref={cropperRef}
                  src={imageSrc}
                  style={{ 
                    maxHeight: "20rem", 
                    height: "100%"
                  }}
                />
              </div>
            )
          }
        </Modal.Content>

        <Modal.Footer>
          <Modal.CloseButton>
            <Button
              className="text-white font-medium text-base py-3 px-11"
              variant="destructive"
              onClick={() => setImageSrc("")}
            >
              Fechar
            </Button>
          </Modal.CloseButton>

          <Button
            className="text-white font-medium text-base bg-[#164F62]"
            disabled={!imageSrc}
            onClick={onImageUpload}
          >
            Fazer upload
          </Button>
        </Modal.Footer>
      </Modal.Container>
    </Modal.Root>
  );
}
