import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { isCategoriaPadrao } from '@/constants/Categorias';

type CategoriaChipsProps = {
  categorias: string[];
  selecionada?: string;
  onSelecionar: (categoria: string) => void;
  onExcluir?: (categoria: string) => void;
};

export function CategoriaChips({
  categorias,
  selecionada,
  onSelecionar,
  onExcluir,
}: CategoriaChipsProps) {
  return (
    <View style={styles.container}>
      {categorias.map((categoria) => {
        const ativa = selecionada === categoria;
        const personalizada = !isCategoriaPadrao(categoria);

        return (
          <View key={categoria} style={styles.chipWrapper}>
            <TouchableOpacity
              style={[styles.chip, ativa && styles.chipAtivo]}
              onPress={() => onSelecionar(categoria)}
            >
              <Text style={[styles.chipTexto, ativa && styles.chipTextoAtivo]}>
                {categoria}
              </Text>
            </TouchableOpacity>

            {personalizada && onExcluir ? (
              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={() => onExcluir(categoria)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <FontAwesome name="times-circle" size={18} color="#DC2626" />
              </TouchableOpacity>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipAtivo: {
    backgroundColor: '#DBEAFE',
  },
  chipTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  chipTextoAtivo: {
    color: '#1D4ED8',
  },
  botaoExcluir: {
    padding: 2,
  },
});
