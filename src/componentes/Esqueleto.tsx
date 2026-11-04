import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { cores, espaco, raio } from '../tema';

// No navegador o driver nativo não existe; no celular ele roda fora da thread de JS.
const DRIVER_NATIVO = Platform.OS !== 'web';

/**
 * Placeholder exibido enquanto a primeira página carrega — o usuário já vê
 * a forma da lista antes dos dados chegarem.
 */
export function CartaoEsqueleto() {
  const [pulso] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const animacao = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, {
          toValue: 0.9,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: DRIVER_NATIVO,
        }),
        Animated.timing(pulso, {
          toValue: 0.4,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: DRIVER_NATIVO,
        }),
      ])
    );

    animacao.start();
    return () => animacao.stop();
  }, [pulso]);

  return (
    <Animated.View style={[estilos.cartao, { opacity: pulso }]}>
      <View style={[estilos.bloco, { width: 48, height: 10 }]} />
      <View style={estilos.circulo} />
      <View style={[estilos.bloco, { width: '70%', height: 16 }]} />
      <View style={estilos.linhaChips}>
        <View style={[estilos.bloco, { width: 56, height: 20, borderRadius: raio.pilula }]} />
        <View style={[estilos.bloco, { width: 44, height: 20, borderRadius: raio.pilula }]} />
      </View>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    flex: 1,
    minHeight: 220,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.lg,
    padding: espaco.lg,
    gap: espaco.md,
  },
  bloco: {
    backgroundColor: cores.bordaForte,
    borderRadius: raio.sm,
  },
  circulo: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: raio.pilula,
    backgroundColor: cores.bordaForte,
  },
  linhaChips: {
    flexDirection: 'row',
    gap: espaco.xs,
  },
});
