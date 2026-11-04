export interface ImageCompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 - 1.0
  mimeType?: string; // e.g. "image/webp" or "image/jpeg"
}

export async function compressClientImage(
  file: File,
  options: ImageCompressOptions = {},
): Promise<File> {
  const { maxWidth = 1080, maxHeight = 1080, quality = 0.8, mimeType = "image/webp" } = options;

  return new Promise((resolve, reject) => {
    // If not an image, return original
    if (!file.type.startsWith("image/")) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gagal memuat format gambar"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else if (width <= height && height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }

            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const newExtension = mimeType === "image/webp" ? ".webp" : ".jpg";
            const newFileName = `${baseName}${newExtension}`;

            const compressedFile = new File([blob], newFileName, {
              type: mimeType,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          mimeType,
          quality,
        );
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
