import { Pressable, StyleSheet, Text, View } from 'react-native';
import { comAlfa, cores, espaco, fonte, raio } from '../tema';

type Props = {
  titulo: string;
  descricao: string;
  /** Quando existe, mostra o botão de ação principal. */
  acao?: { rotulo: string; aoTocar: () => void };
  variante?: 'erro' | 'neutro';
};

/** Bloco usado nos estados de erro e de lista vazia. */
export function Aviso({ titulo, descricao, acao, variante = 'neutro' }: Props) {
  const corTitulo = variante === 'erro' ? cores.erro : cores.texto;

  return (
    <View style={estilos.area}>
      <View
        style={[
          estilos.selo,
          variante === 'erro' && { borderColor: comAlfa(cores.erro, 0.4) },
        ]}
      >
        <Text style={[estilos.seloTexto, variante === 'erro' && { color: cores.erro }]}>
          {variante === 'erro' ? 'FALHA NA REQUISIÇÃO' : 'NADA AQUI'}
        </Text>
      </View>

      <Text style={[estilos.titulo, { color: corTitulo }]}>{titulo}</Text>
      <Text style={estilos.descricao}>{descricao}</Text>

      {acao && (
        <Pressable
          accessibilityRole="button"
          onPress={acao.aoTocar}
          style={({ pressed }) => [estilos.botao, pressed && estilos.botaoPressionado]}
        >
          <Text style={estilos.botaoTexto}>{acao.rotulo}</Text>
        </Pressable>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  area: {
    paddingVertical: espaco.xxl,
    paddingHorizontal: espaco.lg,
    gap: espaco.md,
    alignItems: 'flex-start',
  },
  selo: {
    borderWidth: 1,
    borderColor: cores.bordaForte,
    borderRadius: raio.pilula,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.xs,
  },
  seloTexto: {
    color: cores.textoFraco,
    fontSize: fonte.rotulo,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  titulo: {
    fontSize: fonte.titulo,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  descricao: {
    color: cores.textoSuave,
    fontSize: fonte.corpo,
    lineHeight: fonte.corpo * 1.6,
    maxWidth: 420,
  },
  botao: {
    minHeight: 48,
    justifyContent: 'center',
    backgroundColor: cores.marca,
    borderRadius: raio.md,
    paddingHorizontal: espaco.xl,
    marginTop: espaco.xs,
  },
  botaoPressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: fonte.base,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
