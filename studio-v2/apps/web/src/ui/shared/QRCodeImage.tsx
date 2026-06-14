/**
 * QRCodeImage — Web-compatible QR code using the `qrcode` package.
 * Renders a data-URL PNG inside a React Native Image, avoiding
 * react-native-svg / react-native-qrcode-svg which cause duplicate-React
 * errors in the Metro web bundle.
 */
import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import QRCode from 'qrcode';

interface Props {
  value: string;
  size?: number;
  backgroundColor?: string;
  color?: string;
}

export const QRCodeImage: React.FC<Props> = ({
  value,
  size = 160,
  backgroundColor = '#080c18',
  color = '#d0d8f0',
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      color: { dark: color, light: backgroundColor },
    }).then(setDataUrl).catch(() => setDataUrl(null));
  }, [value, size, color, backgroundColor]);

  if (!dataUrl) return <View style={[s.placeholder, { width: size, height: size }]} />;

  return (
    <Image
      source={{ uri: dataUrl }}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
};

export default QRCodeImage;

const s = StyleSheet.create({
  placeholder: { backgroundColor: '#0d1220' },
});
