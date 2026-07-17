import React from 'react';
import { View, Text } from 'react-native';

export const Placeholder = ({ label }: { label: string }) => {
  return (
    <View style={{
      flex: 1,
      minHeight: 40,
      minWidth: 40,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: 'rgba(150, 150, 150, 0.5)',
      borderRadius: 4,
      margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(150, 150, 150, 0.05)',
    }}>
      <Text style={{
        color: 'rgba(150, 150, 150, 0.8)',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}>
        {label}
      </Text>
    </View>
  );
};
