import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoriaChips } from '@/components/CategoriaChips';
import { ConfirmacaoModal } from '@/components/ConfirmacaoModal';
import { useGastos } from '@/components/GastosContext';
import { TextoModal } from '@/components/TextoModal';

export default function NovoGastoScreen() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('Selecione uma categoria');
  const [modalNovaCategoria, setModalNovaCategoria] = useState(false);
  const [nomeNovaCategoria, setNomeNovaCategoria] = useState('');
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState<string | null>(null);

  const {
    adicionarGasto,
    adicionarCategoria,
    excluirCategoria,
    categorias,
    contarGastosDaCategoria,
    possuiOrcamento,
  } = useGastos();

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

  function handleCriarCategoria() {
    const sucesso = adicionarCategoria(nomeNovaCategoria);

    if (!sucesso) {
      Alert.alert(
        'Atenção',
        'Informe um nome válido. Categorias duplicadas não são permitidas.'
      );
      return;
    }

    setCategoria(nomeNovaCategoria.trim());
    setNomeNovaCategoria('');
    setModalNovaCategoria(false);
  }

  function handleSolicitarExclusaoCategoria(nome: string) {
    setCategoriaParaExcluir(nome);
  }

  function confirmarExclusaoCategoria() {
    if (!categoriaParaExcluir) {
      return;
    }

    excluirCategoria(categoriaParaExcluir);

    if (categoria === categoriaParaExcluir) {
      setCategoria('Selecione uma categoria');
    }

    setCategoriaParaExcluir(null);
  }

  function obterMensagemExclusaoCategoria(): string {
    if (!categoriaParaExcluir) {
      return '';
    }

    const quantidadeGastos = contarGastosDaCategoria(categoriaParaExcluir);
    const temOrcamento = possuiOrcamento(categoriaParaExcluir);
    const partes: string[] = [
      `Deseja excluir a categoria "${categoriaParaExcluir}"?`,
    ];

    if (quantidadeGastos > 0) {
      partes.push(
        `\n\nEsta categoria possui ${quantidadeGastos} gasto(s) associado(s). Os registros serão mantidos no histórico com o nome "${categoriaParaExcluir}", mas a categoria deixará de aparecer na lista.`
      );
    }

    if (temOrcamento) {
      partes.push(
        '\n\nA reserva/orçamento desta categoria também será removida e o valor restante será devolvido ao saldo principal.'
      );
    }

    return partes.join('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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
            <View style={styles.categoriaHeader}>
              <Text style={styles.label}>Categoria</Text>
              <TouchableOpacity
                style={styles.botaoNovaCategoria}
                onPress={() => setModalNovaCategoria(true)}
              >
                <Text style={styles.botaoNovaCategoriaTexto}>+ Nova categoria</Text>
              </TouchableOpacity>
            </View>

            <CategoriaChips
              categorias={categorias}
              selecionada={categoria !== 'Selecione uma categoria' ? categoria : undefined}
              onSelecionar={setCategoria}
              onExcluir={handleSolicitarExclusaoCategoria}
            />

            <Text style={styles.dicaCategoria}>
              Toque no ícone vermelho para excluir categorias personalizadas.
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSalvarGasto}>
            <Text style={styles.buttonText}>Salvar gasto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TextoModal
        visivel={modalNovaCategoria}
        titulo="Nova categoria"
        descricao="Crie uma categoria personalizada para os seus gastos."
        placeholder="Ex: Saúde, Animais, Educação"
        valor={nomeNovaCategoria}
        onChangeValor={setNomeNovaCategoria}
        onConfirmar={handleCriarCategoria}
        onCancelar={() => {
          setModalNovaCategoria(false);
          setNomeNovaCategoria('');
        }}
        textoConfirmar="Criar"
      />

      <ConfirmacaoModal
        visivel={categoriaParaExcluir !== null}
        titulo="Excluir categoria"
        descricao={obterMensagemExclusaoCategoria()}
        textoConfirmar="Excluir"
        confirmarDestrutivo
        onConfirmar={confirmarExclusaoCategoria}
        onCancelar={() => setCategoriaParaExcluir(null)}
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
    gap: 20,
    paddingBottom: 32,
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
  categoriaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  botaoNovaCategoria: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  botaoNovaCategoriaTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  dicaCategoria: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
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
