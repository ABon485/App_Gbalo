import React from "react";
import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";

interface FileUploadWebViewProps {
  token: string;
  onFileSelected: (fileUrl: string) => void;
  onClose: () => void;
}

const FileUploadWebView: React.FC<FileUploadWebViewProps> = ({
  token,
  onFileSelected,
  onClose,
}) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://files.vbalo.com/FileManage.css">
        <script src="https://files.vbalo.com/FileManage.js"></script>
        <style>
          body { margin: 0; padding: 0; width: 100%; height: 100vh; overflow: hidden; background: #f5f5f5; }
          html { width: 100%; height: 100%; }
          .file-manager { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <script>
          (function() {
            try {
              if (typeof FileManage === 'undefined') {
                window.ReactNativeWebView.postMessage(JSON.stringify({ error: "FileManage not defined" }));
                return;
              }
              FileManage.OpenSelectFile('${token}', function(result) {
                console.log("Callback trả về:", JSON.stringify(result));
                window.ReactNativeWebView.postMessage(JSON.stringify(result));
              });
            } catch (err) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ error: err.message }));
            }
          })();
        </script>
      </body>
    </html>
  `;

  const handleShouldStartLoad = (event: any) => {
    const url = event.url.toLowerCase();
    if (
      url.includes("filemanage.js") ||
      url.includes("filemanage.css") ||
      url.includes("reactnativewebview")
    ) {
      console.log("Cho phép tải:", url);
      return true;
    }
    console.log("Chặn tải:", url);
    return false;
  };

  return (
    <WebView
      style={styles.webview}
      source={{ html: htmlContent }}
      onShouldStartLoadWithRequest={handleShouldStartLoad}
      onMessage={(event) => {
        console.log("Nhận thông điệp từ WebView:", event.nativeEvent.data);
        try {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.error) {
            console.error("Lỗi từ WebView:", data.error);
            onClose();
            return;
          }
          // Xử lý thông điệp đóng (nếu có)
          if (
            data.action === "close" ||
            data === null ||
            Object.keys(data).length === 0
          ) {
            console.log("Nhận lệnh đóng từ FileManage.js");
            onClose();
            return;
          }
          // Xử lý URL file
          if (typeof data === "string" && data.trim()) {
            console.log("Nhận URL string:", data);
            onFileSelected(data);
            onClose();
          } else if (data && data.Path && data.Path.trim()) {
            console.log("Nhận object có Path:", data.Path);
            onFileSelected(data.Path);
            onClose();
          } else {
            console.warn("Dữ liệu không hợp lệ:", data);
            onClose();
          }
        } catch (err) {
          if (err instanceof Error) {
            console.error("Lỗi phân tích dữ liệu WebView:", err.message);
          } else {
            console.error("Lỗi phân tích dữ liệu WebView:", err);
          }
          // Nếu dữ liệu không phải JSON, kiểm tra nếu là chuỗi URL hợp lệ
          const rawData = event.nativeEvent.data;
          if (
            typeof rawData === "string" &&
            rawData.trim() &&
            rawData.startsWith("http")
          ) {
            console.log("Nhận raw URL:", rawData);
            onFileSelected(rawData);
            onClose();
          } else {
            console.log("Bỏ qua dữ liệu không hợp lệ:", rawData);
            onClose();
          }
        }
      }}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error("Lỗi WebView:", nativeEvent);
        onClose();
      }}
    />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Tránh màn hình trắng
  },
});

export default FileUploadWebView;
