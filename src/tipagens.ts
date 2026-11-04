import { cores } from './tema';

/**
 * Cor e nome em português de cada tipagem. A cor da tipagem é a única
 * cor viva da tela: ela pinta o chip e o halo atrás da arte.
 */
const TIPAGENS: Record<string, { rotulo: string; cor: string }> = {
  normal: { rotulo: 'Normal', cor: '#9A9DA6' },
  fire: { rotulo: 'Fogo', cor: '#E8602C' },
  water: { rotulo: 'Água', cor: '#3C8DE0' },
  grass: { rotulo: 'Planta', cor: '#4CAF63' },
  electric: { rotulo: 'Elétrico', cor: '#E3B023' },
  ice: { rotulo: 'Gelo', cor: '#58C7C9' },
  fighting: { rotulo: 'Lutador', cor: '#C8453B' },
  poison: { rotulo: 'Venenoso', cor: '#A05BC4' },
  ground: { rotulo: 'Terra', cor: '#C79A4B' },
  flying: { rotulo: 'Voador', cor: '#7E9BE6' },
  psychic: { rotulo: 'Psíquico', cor: '#E5618A' },
  bug: { rotulo: 'Inseto', cor: '#8FAD2A' },
  rock: { rotulo: 'Pedra', cor: '#B09353' },
  ghost: { rotulo: 'Fantasma', cor: '#6F5BA8' },
  dragon: { rotulo: 'Dragão', cor: '#6354D6' },
  dark: { rotulo: 'Sombrio', cor: '#6D5A4D' },
  steel: { rotulo: 'Metálico', cor: '#8E98A8' },
  fairy: { rotulo: 'Fada', cor: '#DE7FA6' },
  stellar: { rotulo: 'Estelar', cor: '#4FB3A5' },
  unknown: { rotulo: 'Desconhecido', cor: cores.textoFraco },
};

export function rotuloDaTipagem(tipo: string): string {
  return TIPAGENS[tipo]?.rotulo ?? tipo;
}

export function corDaTipagem(tipo: string | undefined): string {
  if (!tipo) return cores.textoFraco;
  return TIPAGENS[tipo]?.cor ?? cores.textoFraco;
}

/** "001", "025", "1025" — o número do Pokémon sempre com 3 dígitos. */
export function numeroFormatado(id: number): string {
  return String(id).padStart(3, '0');
}

/** "mr-mime" -> "Mr. Mime"; "bulbasaur" -> "Bulbasaur" */
export function nomeFormatado(nome: string): string {
  return nome
    .split('-')
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(' ');
}
