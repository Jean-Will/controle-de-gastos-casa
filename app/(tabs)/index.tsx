import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useGastos } from '@/components/GastosContext';
import { formatarMoeda } from '@/utils/formatarMoeda';

export default function GastosScreen() {
  const { gastos } = useGastos();

  const totalGasto = gastos.reduce((total, gasto) => total + gasto.valor, 0);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={gastos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Gastos</Text>
            <Text style={styles.subtitle}>Lista de todos os gastos cadastrados.</Text>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total gasto</Text>
              <Text style={styles.cardValue}>{formatarMoeda(totalGasto)}</Text>
            </View>

            <Text style={styles.sectionTitle}>Últimos lançamentos</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Ainda não existem gastos lançados.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemText}>{item.descricao}</Text>
              <Text style={styles.itemCategory}>{item.categoria}</Text>
            </View>

            <Text style={styles.itemValue}>{formatarMoeda(item.valor)}</Text>
          </View>
        )}
      />
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
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardLabel: {
    color: '#DBEAFE',
    fontSize: 14,
    marginBottom: 8,
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});