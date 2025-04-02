interface TextProperties {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  opacity: number;
}

interface StoredImage {
  blob: Blob;
}

interface AppState {
  id: string;
  originalImage?: StoredImage;
  processedImage?: StoredImage;
  texts: TextProperties[];
  origDims: { width: number; height: number; x: number; y: number };
  bgDims: { width: number; height: number; x: number; y: number };
  imgScale: number;
}
