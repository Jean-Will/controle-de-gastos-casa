import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ConfirmacaoModalProps = {
  visivel: boolean;
  titulo: string;
  descricao: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  confirmarDestrutivo?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export function ConfirmacaoModal({
  visivel,
  titulo,
  descricao,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  confirmarDestrutivo = false,
  onConfirmar,
  onCancelar,
}: ConfirmacaoModalProps) {
  return (
    <Modal visible={visivel} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.descricao}>{descricao}</Text>

          <View style={styles.botoes}>
            <TouchableOpacity style={styles.botaoSecundario} onPress={onCancelar}>
              <Text style={styles.textoSecundario}>{textoCancelar}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.botaoPrimario,
                confirmarDestrutivo && styles.botaoDestrutivo,
              ]}
              onPress={onConfirmar}
            >
              <Text style={styles.textoPrimario}>{textoConfirmar}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  conteudo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  descricao: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  botoes: {
    flexDirection: 'row',
    gap: 12,
  },
  botaoSecundario: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  textoSecundario: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  botaoPrimario: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botaoDestrutivo: {
    backgroundColor: '#DC2626',
  },
  textoPrimario: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
