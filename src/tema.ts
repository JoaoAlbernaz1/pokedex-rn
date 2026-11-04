/**
 * Tokens de design do app. Nenhuma tela usa cor ou medida solta:
 * tudo sai daqui, do mesmo jeito que um tema em CSS.
 */

export const cores = {
  fundo: '#0B0D13',
  superficie: '#14171F',
  superficieAlta: '#1C202B',
  borda: '#262B38',
  bordaForte: '#343A4B',
  texto: '#F3F5F9',
  textoSuave: '#9BA3B4',
  textoFraco: '#6B7383',
  marca: '#E4572E', // vermelho pokébola, usado só na ação principal
  erro: '#F08A7A',
};

export const espaco = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const raio = {
  sm: 8,
  md: 16,
  lg: 20,
  pilula: 999,
} as const;

/** Escala tipográfica fechada: só estes tamanhos aparecem no app. */
export const fonte = {
  rotulo: 12,
  corpo: 14,
  base: 16,
  titulo: 20,
  display: 32,
} as const;

/** Adiciona transparência a uma cor hex (#RRGGBB) sem depender de lib. */
export function comAlfa(hex: string, alfa: number): string {
  const valor = Math.round(Math.min(Math.max(alfa, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${valor}`;
}
