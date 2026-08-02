export function useAudioStyle(logic: any) {
  return {
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: 12,
      width: '100%',
    },
    button: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
    },
    progressContainer: {
      flex: 1,
      height: 4,
      backgroundColor: 'rgba(0,0,0,0.1)',
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#007AFF',
    }
  };
}
