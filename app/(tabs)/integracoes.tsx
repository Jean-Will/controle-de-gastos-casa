import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IntegracoesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Integrações</Text>
        <Text style={styles.subtitle}>
          Configure a sincronização com serviços externos.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Status</Text>
          <Text style={styles.cardStatus}>Banco de dados não configurado</Text>
          <Text style={styles.cardDescricao}>
            A integração com banco de dados online (Supabase, Firebase, Appwrite
            ou similar) será implementada futuramente. Os seus dados continuam
            guardados localmente no dispositivo.
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitulo}>Em breve</Text>
          <Text style={styles.infoTexto}>
            • Sincronização automática entre dispositivos{'\n'}
            • Backup na nuvem{'\n'}
            • Restauro de dados
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  cardStatus: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
  },
  cardDescricao: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  infoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  infoTexto: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
});
