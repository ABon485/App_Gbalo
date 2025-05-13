import React from "react";
import { WebView } from "react-native-webview";

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
  const injectedJS = `
  FileManage.OpenSelectFile('${token}', function(result){
    console.log("Callback trả về:", JSON.stringify(result));
    window.ReactNativeWebView.postMessage(JSON.stringify(result));
  });
  true;
`;

  return (
    <WebView
      source={{ uri: "https://files.vbalo.com/" }}
      injectedJavaScript={injectedJS}
      onMessage={(event) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          if (typeof data === "string") {
            // Nếu web vẫn trả về chuỗi thuần
            console.log("Nhận URL string:", data);
            onFileSelected(data);
          } else if (data && data.Path) {
            console.log("Nhận object có Path:", data.Path);
            onFileSelected(data.Path);
          } else {
            console.warn("Không có Path:", data);
          }
        } catch (err) {
          // Nếu không phải JSON, giả sử là chuỗi URL
          console.log(
            "Dữ liệu không phải JSON, nhận raw:",
            event.nativeEvent.data
          );
          onFileSelected(event.nativeEvent.data);
        }
        onClose();
      }}
    />
  );
};

export default FileUploadWebView;
