import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoriaChips } from '@/components/CategoriaChips';
import { ConfirmacaoModal } from '@/components/ConfirmacaoModal';
import { useGastos } from '@/components/GastosContext';
import { ProgressBar } from '@/components/ProgressBar';
import { ValorModal } from '@/components/ValorModal';
import { CATEGORIAS_PADRAO } from '@/constants/Categorias';
import { formatarMoeda } from '@/utils/formatarMoeda';

type ModalTipo = 'adicionar' | 'editar' | 'orcamento' | null;

function parseValor(texto: string): number | null {
  const valorNumerico = Number(texto.replace(',', '.'));

  if (isNaN(valorNumerico) || valorNumerico <= 0) {
    return null;
  }

  return valorNumerico;
}

export default function SaldoScreen() {
  const {
    saldoPrincipal,
    orcamentos,
    categorias,
    carregando,
    adicionarAoSaldo,
    definirSaldo,
    criarOrcamento,
    excluirOrcamento,
  } = useGastos();

  const [modalTipo, setModalTipo] = useState<ModalTipo>(null);
  const [valorInput, setValorInput] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>(
    CATEGORIAS_PADRAO[0]
  );
  const [reservaSelecionada, setReservaSelecionada] = useState<string | null>(null);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  useEffect(() => {
    if (!categorias.includes(categoriaSelecionada) && categorias.length > 0) {
      setCategoriaSelecionada(categorias[0]);
    }
  }, [categorias, categoriaSelecionada]);

  const saldoTotal =
    saldoPrincipal +
    orcamentos.reduce((total, orcamento) => total + orcamento.valorReservado, 0);

  const orcamentoParaExcluir = orcamentos.find(
    (orcamento) => orcamento.categoria === reservaSelecionada
  );

  function fecharModal() {
    setModalTipo(null);
    setValorInput('');
  }

  function confirmarAdicionarSaldo() {
    const valor = parseValor(valorInput);

    if (!valor) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }

    adicionarAoSaldo(valor);
    fecharModal();
  }

  function confirmarEditarSaldo() {
    const valor = parseValor(valorInput);

    if (!valor) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }

    definirSaldo(valor);
    fecharModal();
  }

  function confirmarOrcamento() {
    const valor = parseValor(valorInput);

    if (!valor) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }

    if (valor > saldoPrincipal) {
      Alert.alert('Atenção', 'O valor excede o saldo principal disponível.');
      return;
    }

    const sucesso = criarOrcamento(categoriaSelecionada, valor);

    if (!sucesso) {
      Alert.alert('Atenção', 'Não foi possível criar o orçamento.');
      return;
    }

    fecharModal();
  }

  function handleSelecionarReserva(categoria: string) {
    setReservaSelecionada((atual) => (atual === categoria ? null : categoria));
  }

  function handleExcluirReserva() {
    if (!reservaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma reserva para excluir.');
      return;
    }

    setConfirmarExclusao(true);
  }

  function confirmarExclusaoReserva() {
    if (reservaSelecionada) {
      excluirOrcamento(reservaSelecionada);
      setReservaSelecionada(null);
    }

    setConfirmarExclusao(false);
  }

  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.carregando}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Saldo</Text>
        <Text style={styles.subtitle}>Gerencie o seu orçamento por categorias.</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Salário / Saldo total</Text>
          <Text style={styles.cardValue}>{formatarMoeda(saldoTotal)}</Text>
          <Text style={styles.cardDisponivel}>
            Saldo disponível: {formatarMoeda(saldoPrincipal)}
          </Text>
        </View>

        <View style={styles.acoesSaldo}>
          <TouchableOpacity
            style={styles.botaoAcao}
            onPress={() => setModalTipo('adicionar')}
          >
            <Text style={styles.botaoAcaoTexto}>Adicionar valor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoAcao, styles.botaoAcaoSecundario]}
            onPress={() => setModalTipo('editar')}
          >
            <Text style={[styles.botaoAcaoTexto, styles.botaoAcaoTextoSecundario]}>
              Editar saldo
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secao}>
          <Text style={styles.sectionTitle}>Criar orçamento</Text>
          <Text style={styles.sectionSubtitle}>
            Reserve parte do saldo principal para uma categoria.
          </Text>

          <CategoriaChips
            categorias={categorias}
            selecionada={categoriaSelecionada}
            onSelecionar={setCategoriaSelecionada}
          />

          <TouchableOpacity
            style={styles.botaoOrcamento}
            onPress={() => setModalTipo('orcamento')}
          >
            <Text style={styles.botaoOrcamentoTexto}>Reservar para categoria</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secaoHeader}>
          <Text style={styles.sectionTitle}>Orçamentos por categoria</Text>

          {orcamentos.length > 0 ? (
            <TouchableOpacity
              style={[
                styles.botaoExcluirReserva,
                !reservaSelecionada && styles.botaoExcluirReservaDesabilitado,
              ]}
              onPress={handleExcluirReserva}
              disabled={!reservaSelecionada}
            >
              <Text
                style={[
                  styles.botaoExcluirReservaTexto,
                  !reservaSelecionada && styles.botaoExcluirReservaTextoDesabilitado,
                ]}
              >
                Excluir reserva
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {reservaSelecionada ? (
          <Text style={styles.dicaSelecao}>
            Reserva selecionada: {reservaSelecionada}. Toque novamente para desmarcar.
          </Text>
        ) : null}

        {orcamentos.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Nenhum orçamento criado. Reserve valores para começar.
            </Text>
          </View>
        ) : (
          orcamentos.map((orcamento) => {
            const valorUtilizado = orcamento.valorReservado - orcamento.valorRestante;
            const percentualUtilizado =
              orcamento.valorReservado > 0
                ? (valorUtilizado / orcamento.valorReservado) * 100
                : 0;
            const esgotado = orcamento.valorRestante <= 0;
            const selecionada = reservaSelecionada === orcamento.categoria;

            return (
              <TouchableOpacity
                key={orcamento.categoria}
                style={[
                  styles.orcamentoCard,
                  esgotado && styles.orcamentoCardEsgotado,
                  selecionada && styles.orcamentoCardSelecionada,
                ]}
                onPress={() => handleSelecionarReserva(orcamento.categoria)}
                activeOpacity={0.8}
              >
                <View style={styles.orcamentoHeader}>
                  <Text style={styles.orcamentoCategoria}>{orcamento.categoria}</Text>
                  <Text style={[styles.orcamentoValor, esgotado && styles.textoVermelho]}>
                    {formatarMoeda(orcamento.valorReservado)}
                  </Text>
                </View>

                <Text style={[styles.orcamentoRestante, esgotado && styles.textoVermelho]}>
                  Restante: {formatarMoeda(orcamento.valorRestante)}
                </Text>

                <View style={styles.progressoInfo}>
                  <Text style={styles.progressoTexto}>
                    {percentualUtilizado.toFixed(0)}% utilizado
                  </Text>
                </View>

                <ProgressBar percentual={percentualUtilizado} esgotado={esgotado} />
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <ValorModal
        visivel={modalTipo === 'adicionar'}
        titulo="Adicionar ao saldo"
        descricao="Informe o valor a adicionar ao saldo principal."
        valor={valorInput}
        onChangeValor={setValorInput}
        onConfirmar={confirmarAdicionarSaldo}
        onCancelar={fecharModal}
        textoConfirmar="Adicionar"
      />

      <ValorModal
        visivel={modalTipo === 'editar'}
        titulo="Editar saldo principal"
        descricao="Defina o novo valor do saldo principal disponível."
        valor={valorInput}
        onChangeValor={setValorInput}
        onConfirmar={confirmarEditarSaldo}
        onCancelar={fecharModal}
        textoConfirmar="Salvar"
      />

      <ValorModal
        visivel={modalTipo === 'orcamento'}
        titulo={`Reservar para ${categoriaSelecionada}`}
        descricao={`Saldo principal disponível: ${formatarMoeda(saldoPrincipal)}`}
        valor={valorInput}
        onChangeValor={setValorInput}
        onConfirmar={confirmarOrcamento}
        onCancelar={fecharModal}
        textoConfirmar="Reservar"
      />

      <ConfirmacaoModal
        visivel={confirmarExclusao}
        titulo="Excluir reserva"
        descricao={
          orcamentoParaExcluir
            ? `Deseja excluir a reserva de ${orcamentoParaExcluir.categoria}? O valor restante de ${formatarMoeda(orcamentoParaExcluir.valorRestante)} será devolvido automaticamente ao saldo principal.`
            : 'Deseja excluir esta reserva?'
        }
        textoConfirmar="Excluir"
        confirmarDestrutivo
        onConfirmar={confirmarExclusaoReserva}
        onCancelar={() => setConfirmarExclusao(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    gap: 16,
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
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    padding: 20,
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
  cardDisponivel: {
    color: '#DBEAFE',
    fontSize: 14,
    marginTop: 8,
  },
  acoesSaldo: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoAcao: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botaoAcaoSecundario: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  botaoAcaoTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  botaoAcaoTextoSecundario: {
    color: '#374151',
  },
  secao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  botaoOrcamento: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  botaoOrcamentoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  botaoExcluirReserva: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  botaoExcluirReservaDesabilitado: {
    backgroundColor: '#F3F4F6',
  },
  botaoExcluirReservaTexto: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  botaoExcluirReservaTextoDesabilitado: {
    color: '#9CA3AF',
  },
  dicaSelecao: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500',
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
  orcamentoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  orcamentoCardSelecionada: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  orcamentoCardEsgotado: {
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  orcamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orcamentoCategoria: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  orcamentoValor: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  orcamentoRestante: {
    fontSize: 14,
    color: '#6B7280',
  },
  textoVermelho: {
    color: '#DC2626',
  },
  progressoInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  progressoTexto: {
    fontSize: 12,
    color: '#6B7280',
  },
});
