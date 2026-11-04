import { Pokemon, RespostaDetalhe, RespostaLista } from './tipos';

const BASE = 'https://pokeapi.co/api/v2';

/** Quantos Pokémon entram por página — o enunciado pede 20. */
export const TAMANHO_DA_PAGINA = 20;

export type Pagina = {
  itens: Pokemon[];
  /** Quantos Pokémon existem no total (a API devolve em "count"). */
  total: number;
  /** Tem próxima página? A API devolve "next: null" no fim da lista. */
  temMais: boolean;
};

/** fetch + verificação de resposta + conversão, num só lugar. */
async function buscarJson<T>(url: string): Promise<T> {
  const resposta = await fetch(url);

  if (!resposta.ok) {
    // Local para tratar erros do servidor, ex.: 404 e 500.
    throw new Error(`A PokeAPI respondeu ${resposta.status}.`);
  }

  return (await resposta.json()) as T;
}

/** Converte a resposta crua da API no formato que a tela usa. */
function paraPokemon(detalhe: RespostaDetalhe): Pokemon {
  const arte = detalhe.sprites.other['official-artwork'].front_default;

  return {
    id: detalhe.id,
    nome: detalhe.name,
    imagem: arte ?? detalhe.sprites.other.home.front_default ?? detalhe.sprites.front_default,
    tipos: detalhe.types
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map((entrada) => entrada.type.name),
  };
}

/**
 * Busca uma página de Pokémon.
 *
 * A lista da PokeAPI só traz nome e URL, então para cada item é preciso
 * uma segunda requisição para pegar imagem e tipagem. As 20 requisições
 * de detalhe saem em paralelo com Promise.all.
 */
export async function buscarPagina(offset: number): Promise<Pagina> {
  const lista = await buscarJson<RespostaLista>(
    `${BASE}/pokemon?limit=${TAMANHO_DA_PAGINA}&offset=${offset}`
  );

  const detalhes = await Promise.all(
    lista.results.map((item) => buscarJson<RespostaDetalhe>(item.url))
  );

  return {
    itens: detalhes.map(paraPokemon),
    total: lista.count,
    temMais: lista.next !== null,
  };
}
