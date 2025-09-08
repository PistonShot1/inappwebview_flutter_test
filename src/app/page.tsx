'use client';

import { useEffect } from 'react';

// Extend the Window interface to include flutter_inappwebview
declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler: (handler: string, ...args: unknown[]) => Promise<unknown>;
    };
  }
}

export default function Home() {
  const sendToFlutter = () => {
    // Send Firebase event to Flutter
    window.addEventListener("flutterInAppWebViewPlatformReady", function() {
      if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler('handlerInsiderPurchaseEvent', 1, true, ['bar', 5], {item_name: 'baz' , price : "RM 24.00"}).then(function(result: unknown) {
          console.log(result);
        })
      }
    });
  };

  useEffect(() => {
    // Call the function when component mounts
    sendToFlutter();
  }, []);

  const manualSendToFlutter = () => {
    // Manual trigger for testing
    if (window.flutter_inappwebview) {
      window.flutter_inappwebview.callHandler('handlerInsiderPurchaseEvent', 1, true, ['bar', 5], {item_name: 'baz' , price : "RM 24.00"}).then(function(result: unknown) {
        console.log('Manual trigger result:', result);
      });
    } else {
      console.log('Flutter InAppWebView not available');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Flutter InAppWebView Test Page
      </h1>
      
      <div className="max-w-md w-full space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Auto-trigger on Load</h2>
          <p className="text-gray-600">
            The Flutter handler will be called automatically when the page loads and the Flutter platform is ready.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Manual Trigger</h2>
          <p className="text-gray-600 mb-3">
            Click the button below to manually trigger the Flutter handler.
          </p>
          <button
            onClick={manualSendToFlutter}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Send to Flutter
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Test Data</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><strong>Handler:</strong> handlerInsiderPurchaseEvent</li>
            <li><strong>Params:</strong> 1, true, [&apos;bar&apos;, 5]</li>
            <li><strong>Object:</strong> {`{item_name: 'baz', price: 'RM 24.00'}`}</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500">
        <p>Check the console for results</p>
        <p className="text-sm mt-1">Open DevTools to see Flutter communication logs</p>
      </div>
    </div>
  );
}