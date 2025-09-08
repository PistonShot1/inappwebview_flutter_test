'use client';

import { useEffect, useState, useCallback } from 'react';

// Extend the Window interface to include flutter_inappwebview

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
  timestamp: string;
}

export default function Home() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const newToast: Toast = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
    }, 5000);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const sendToFlutter = useCallback(() => {
    // Send Firebase event to Flutter
    window.addEventListener("flutterInAppWebViewPlatformReady", function() {
      addToast("🚀 flutterInAppWebViewPlatformReady event fired!", "success");
      
      if (window?.flutter_inappwebview) {
        addToast("📱 Calling handlerInsiderPurchaseEvent...", "info");
        window?.flutter_inappwebview.callHandler('handlerInsiderPurchaseEvent', 1, true, ['bar', 5], {item_name: 'baz' , price : "RM 24.00"}).then(function(result: unknown) {
          console.log(result);
          addToast(`✅ handlerInsiderPurchaseEvent completed! Result: ${JSON.stringify(result)}`, "success");
        }).catch(function(error: unknown) {
          console.error(error);
          addToast(`❌ handlerInsiderPurchaseEvent failed: ${JSON.stringify(error)}`, "error");
        });
      } else {
        addToast("❌ Flutter InAppWebView not available", "error");
      }
    });
  }, [addToast]);

  useEffect(() => {
    // Call the function when component mounts
    addToast("🔄 Page loaded, waiting for Flutter platform...", "info");
    sendToFlutter();
  }, [sendToFlutter, addToast]);

  const manualSendToFlutter = () => {
    // Manual trigger for testing

      addToast("📱 Manual trigger: Calling handlerInsiderPurchaseEvent...", "info");
      window.addEventListener("flutterInAppWebViewPlatformReady", function() {
        window?.flutter_inappwebview?.callHandler('handlerInsiderPurchaseEvent', 1, true, ['bar', 5], {item_name: 'baz' , price : "RM 24.00"}).then(function(result: unknown) {
          console.log('Manual trigger result:', result);
          addToast(`✅ Manual trigger completed! Result: ${JSON.stringify(result)}`, "success");
        }).catch(function(error: unknown) {
          console.error('Manual trigger error:', error);
          addToast(`❌ Manual trigger failed: ${JSON.stringify(error)}`, "error");
        });
      });

  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              p-4 rounded-lg shadow-lg border-l-4 cursor-pointer transform transition-all duration-300 ease-in-out
              ${toast.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : ''}
              ${toast.type === 'info' ? 'bg-blue-50 border-blue-500 text-blue-800' : ''}
              ${toast.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' : ''}
              hover:scale-105
            `}
            onClick={() => removeToast(toast.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm font-medium break-words">{toast.message}</p>
                <p className="text-xs opacity-70 mt-1">{toast.timestamp}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeToast(toast.id);
                }}
                className="ml-2 text-lg leading-none opacity-50 hover:opacity-100"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

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