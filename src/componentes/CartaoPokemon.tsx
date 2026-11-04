import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { comAlfa, cores, espaco, fonte, raio } from '../tema';
import { corDaTipagem, nomeFormatado, numeroFormatado } from '../tipagens';
import { Pokemon } from '../tipos';
import { ChipTipagem } from './ChipTipagem';

type Props = { pokemon: Pokemon };

export function CartaoPokemon({ pokemon }: Props) {
  const [ativo, setAtivo] = useState(false);
  // A tipagem principal dá a cor do card: número, palco e borda ativa.
  const corPrincipal = corDaTipagem(pokemon.tipos[0]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${nomeFormatado(pokemon.nome)}, número ${numeroFormatado(pokemon.id)}`}
      onHoverIn={() => setAtivo(true)}
      onHoverOut={() => setAtivo(false)}
      onPressIn={() => setAtivo(true)}
      onPressOut={() => setAtivo(false)}
      style={({ pressed }) => [
        estilos.cartao,
        (ativo || pressed) && {
          borderColor: comAlfa(corPrincipal, 0.5),
          backgroundColor: cores.superficieAlta,
        },
        pressed && estilos.pressionado,
      ]}
    >
      <View style={estilos.topo}>
        <Text style={estilos.rotuloNumero}>Nº</Text>
        <Text style={[estilos.numero, { color: corPrincipal }]}>
          {numeroFormatado(pokemon.id)}
        </Text>
      </View>

      <View style={estilos.areaImagem}>
        {/* Palco: a cor da tipagem entra como luz atrás da arte, não como fundo. */}
        <View style={[estilos.palco, { backgroundColor: comAlfa(corPrincipal, 0.14) }]} />

        {pokemon.imagem ? (
          <Image
            source={{ uri: pokemon.imagem }}
            style={estilos.imagem}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={estilos.imagemAusente}>
            <Text style={estilos.imagemAusenteTexto}>sem arte</Text>
          </View>
        )}
      </View>

      <Text style={estilos.nome} numberOfLines={1}>
        {nomeFormatado(pokemon.nome)}
      </Text>

      <View style={estilos.tipos}>
        {pokemon.tipos.map((tipo) => (
          <ChipTipagem key={tipo} tipo={tipo} />
        ))}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    flex: 1,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.lg,
    padding: espaco.lg,
    minHeight: 224,
  },
  pressionado: {
    transform: [{ scale: 0.985 }],
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: espaco.xs,
  },
  rotuloNumero: {
    color: cores.textoFraco,
    fontSize: fonte.rotulo,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  numero: {
    fontSize: fonte.base,
    fontWeight: '800',
    letterSpacing: -0.3,
    fontVariant: ['tabular-nums'],
  },
  areaImagem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espaco.sm,
  },
  palco: {
    position: 'absolute',
    width: 116,
    height: 116,
    borderRadius: raio.pilula,
  },
  imagem: {
    width: 104,
    height: 104,
  },
  imagemAusente: {
    width: 104,
    height: 104,
    borderRadius: raio.pilula,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagemAusenteTexto: {
    color: cores.textoFraco,
    fontSize: fonte.rotulo,
  },
  nome: {
    color: cores.texto,
    fontSize: fonte.titulo,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: espaco.sm,
    marginBottom: espaco.sm,
  },
  tipos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espaco.xs,
  },
});
