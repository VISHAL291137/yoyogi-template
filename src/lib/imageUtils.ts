/**
 * Image processing utility for optimizing uploaded images
 * Resizes large camera/phone photos to max dimensions and compresses to high-quality JPEG
 * to ensure images fit reliably into Firestore documents (1MB limit) and load fast.
 */

export async function optimizeImageFile(file: File, maxDimension = 1100, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    // Safety timeout to prevent any infinite stall
    const timeout = setTimeout(() => {
      resolve('');
    }, 4000);

    const reader = new FileReader();
    reader.onerror = () => {
      clearTimeout(timeout);
      resolve('');
    };
    reader.onload = (e) => {
      clearTimeout(timeout);
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        resolve('');
        return;
      }
      optimizeImageDataUrl(dataUrl, maxDimension, quality)
        .then(resolve)
        .catch(() => resolve(dataUrl));
    };
    reader.readAsDataURL(file);
  });
}

export async function optimizeImageDataUrl(dataUrl: string, maxDimension = 1100, quality = 0.75): Promise<string> {
  // If not data:image or empty, return immediately
  if (!dataUrl || !dataUrl.startsWith('data:image')) {
    return dataUrl || '';
  }

  // If already very compact (< 40KB), return directly without overhead
  if (dataUrl.length < 45000) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    // Safety fallback timeout
    const timeout = setTimeout(() => {
      resolve(dataUrl);
    }, 2500);

    const img = new Image();
    img.onload = () => {
      clearTimeout(timeout);
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          resolve(dataUrl);
          return;
        }

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
}

