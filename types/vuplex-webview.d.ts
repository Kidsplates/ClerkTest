// /types/vuplex-webview.d.ts
export {};

declare global {
  interface Window {
    chrome?: {
      webview?: {
        postMessage: (data: unknown) => void;
      };
    };
    webkit?: {
      messageHandlers?: {
        unityControl?: {
          postMessage: (data: unknown) => void;
        };
      };
    };
  }
}
