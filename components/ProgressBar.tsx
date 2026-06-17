import { StyleSheet, View } from 'react-native';

type ProgressBarProps = {
  percentual: number;
  esgotado?: boolean;
};

export function ProgressBar({ percentual, esgotado = false }: ProgressBarProps) {
  const percentualLimitado = Math.min(Math.max(percentual, 0), 100);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.preenchimento,
          { width: `${percentualLimitado}%` },
          esgotado && styles.preenchimentoEsgotado,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    overflow: 'hidden',
  },
  preenchimento: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 999,
  },
  preenchimentoEsgotado: {
    backgroundColor: '#EF4444',
  },
});
