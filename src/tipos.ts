/** Tipos do que a PokeAPI devolve e do que a tela realmente usa. */

/** Resposta de https://pokeapi.co/api/v2/pokemon?limit=20&offset=0 */
export type RespostaLista = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
};

/** Resposta de https://pokeapi.co/api/v2/pokemon/{id} (só o que interessa) */
export type RespostaDetalhe = {
  id: number;
  name: string;
  types: { slot: number; type: { name: string } }[];
  sprites: {
    front_default: string | null;
    other: {
      'official-artwork': { front_default: string | null };
      home: { front_default: string | null };
    };
  };
};

/** Formato enxuto que os componentes consomem. */
export type Pokemon = {
  id: number;
  nome: string;
  imagem: string | null;
  tipos: string[];
};
