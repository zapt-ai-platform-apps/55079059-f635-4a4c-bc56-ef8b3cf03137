export async function removeBackground(imageDataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      // Simple background removal: make near-white pixels transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 240 && g > 240 && b > 240) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      const processedDataUrl = canvas.toDataURL('image/png');
      resolve(processedDataUrl);
    };
    image.onerror = function() {
      reject(new Error('Failed to load image for background removal'));
    };
    image.src = imageDataUrl;
  });
}