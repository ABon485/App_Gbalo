import { WebView } from 'react-native-webview';
import React, { useRef } from 'react';
import { View } from 'react-native';

const UploadWebView = ({ userId, onUploaded }) => {
  const webRef = useRef(null);
  const token = "User" + userId;

  const htmlContent = `
    <html>
      <head>
        <script src="https://files.vbalo.com/FileManage.js"></script>
        <link rel="stylesheet" href="https://files.vbalo.com/FileManage.css" />
      </head>
      <body>
        <script>
          FileManage.OpenSelectFile('${token}', function(url) {
            window.ReactNativeWebView.postMessage(url);
          });
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      ref={webRef}
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      onMessage={(event) => {
        const uploadedUrl = event.nativeEvent.data;
        onUploaded(uploadedUrl); // callback về React Native
      }}
    />
  );
};

export default UploadWebView;
