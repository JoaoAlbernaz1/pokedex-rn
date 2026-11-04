import { StyleSheet, Text, View } from 'react-native';
import { comAlfa, espaco, fonte, raio } from '../tema';
import { corDaTipagem, rotuloDaTipagem } from '../tipagens';

type Props = { tipo: string };

/** Etiqueta da tipagem, pintada com a cor daquele tipo. */
export function ChipTipagem({ tipo }: Props) {
  const cor = corDaTipagem(tipo);

  return (
    <View
      style={[
        estilos.chip,
        { backgroundColor: comAlfa(cor, 0.16), borderColor: comAlfa(cor, 0.45) },
      ]}
    >
      <Text style={[estilos.texto, { color: cor }]}>{rotuloDaTipagem(tipo)}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  chip: {
    paddingHorizontal: espaco.sm,
    paddingVertical: espaco.xs,
    borderRadius: raio.pilula,
    borderWidth: 1,
  },
  texto: {
    fontSize: fonte.rotulo,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
