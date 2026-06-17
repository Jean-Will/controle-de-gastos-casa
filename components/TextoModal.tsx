import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type TextoModalProps = {
  visivel: boolean;
  titulo: string;
  descricao?: string;
  placeholder?: string;
  valor: string;
  onChangeValor: (valor: string) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
  textoConfirmar?: string;
};

export function TextoModal({
  visivel,
  titulo,
  descricao,
  placeholder = 'Digite aqui',
  valor,
  onChangeValor,
  onConfirmar,
  onCancelar,
  textoConfirmar = 'Confirmar',
}: TextoModalProps) {
  return (
    <Modal visible={visivel} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>{titulo}</Text>
          {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}

          <TextInput
            placeholder={placeholder}
            style={styles.input}
            value={valor}
            onChangeText={onChangeValor}
            autoFocus
          />

          <View style={styles.botoes}>
            <TouchableOpacity style={styles.botaoSecundario} onPress={onCancelar}>
              <Text style={styles.textoSecundario}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoPrimario} onPress={onConfirmar}>
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
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
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
  textoPrimario: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
