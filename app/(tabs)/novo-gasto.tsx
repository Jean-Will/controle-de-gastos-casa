import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGastos } from '@/components/GastosContext';

export default function NovoGastoScreen() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('Selecione uma categoria');

  const { adicionarGasto } = useGastos();

  function handleSalvarGasto() {
    if (!descricao.trim()) {
      Alert.alert('Atenção', 'Informe a descrição do gasto.');
      return;
    }

    if (!valor.trim()) {
      Alert.alert('Atenção', 'Informe o valor do gasto.');
      return;
    }

    if (categoria === 'Selecione uma categoria') {
      Alert.alert('Atenção', 'Selecione uma categoria.');
      return;
    }

    const valorNumerico = Number(valor.replace(',', '.'));

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }

    adicionarGasto({
      descricao,
      valor: valorNumerico,
      categoria,
    });

    setDescricao('');
    setValor('');
    setCategoria('Selecione uma categoria');

    Alert.alert('Sucesso', 'Gasto adicionado com sucesso.');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Novo gasto</Text>
        <Text style={styles.subtitle}>Adicione uma despesa da casa.</Text>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              placeholder="Ex: Supermercado"
              style={styles.input}
              value={descricao}
              onChangeText={setDescricao}
            />
          </View>

          <View>
            <Text style={styles.label}>Valor</Text>
            <TextInput
              placeholder="Ex: 45,90 €"
              keyboardType="numeric"
              style={styles.input}
              value={valor}
              onChangeText={setValor}
            />
          </View>

          <View>
            <Text style={styles.label}>Categoria</Text>

            <View style={styles.categoriesContainer}>
              {['Alimentação', 'Energia', 'Internet', 'Transporte'].map((item) => {
                const selecionada = categoria === item;

                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.categoryButton,
                      selecionada && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategoria(item)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selecionada && styles.categoryButtonTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSalvarGasto}>
            <Text style={styles.buttonText}>Salvar gasto</Text>
          </TouchableOpacity>
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
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#DBEAFE',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  categoryButtonTextActive: {
    color: '#1D4ED8',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});