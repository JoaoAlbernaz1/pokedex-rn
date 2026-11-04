import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buscarPagina, TAMANHO_DA_PAGINA } from '../api';
import { Aviso } from '../componentes/Aviso';
import { CartaoPokemon } from '../componentes/CartaoPokemon';
import { CartaoEsqueleto } from '../componentes/Esqueleto';
import { cores, espaco, fonte } from '../tema';
import { Pokemon } from '../tipos';

/** Qual carga está em andamento — define qual indicador aparece na tela. */
type Modo = 'inicial' | 'mais' | 'atualizar';
type Falha = { mensagem: string; offset: number; modo: Modo };

/** Quantas colunas cabem na largura atual (celular, tablet, desktop). */
function colunasPara(largura: number): number {
  if (largura >= 1100) return 4;
  if (largura >= 720) return 3;
  return 2;
}

export default function Pokedex() {
  const { width } = useWindowDimensions();
  const colunas = colunasPara(width);

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<Falha | null>(null);
  const [temMais, setTemMais] = useState(true);
  const [total, setTotal] = useState(0);
  const emAndamento = useRef(false);

  const buscarPokemons = useCallback(async (offset = 0, modo: Modo = 'inicial') => {
    // A ref bloqueia imediatamente, inclusive dois toques antes do próximo render.
    if (emAndamento.current) return;
    emAndamento.current = true;

    if (modo === 'mais') setCarregandoMais(true);
    else if (modo === 'atualizar') setAtualizando(true);
    else setCarregando(true);

    setErro(null);

    try {
      const pagina = await buscarPagina(offset);

      // offset 0 recomeça a lista; os demais acrescentam no fim.
      setPokemons((anteriores) =>
        offset === 0 ? pagina.itens : [...anteriores, ...pagina.itens]
      );
      setTemMais(pagina.temMais);
      setTotal(pagina.total);
    } catch {
      setErro({
        mensagem: 'Não foi possível carregar os Pokémon. Confira a conexão e tente de novo.',
        offset,
        modo,
      });
    } finally {
      emAndamento.current = false;
      setCarregando(false);
      setCarregandoMais(false);
      setAtualizando(false);
    }
  }, []);

  // Primeira execução: os 20 primeiros Pokémon.
  // A busca no mount é justamente o que o efeito existe para fazer; o lint
  // reclama do setState síncrono que acontece antes do await.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    buscarPokemons(0, 'inicial');
  }, [buscarPokemons]);

  /** Chamado quando o arraste chega perto do fim: pede os próximos 20. */
  function carregarProximos() {
    if (carregando || carregandoMais || atualizando || erro || !temMais) return;
    buscarPokemons(pokemons.length, 'mais');
  }

  const listaVazia = pokemons.length === 0;

  /**
   * A última linha pode ficar incompleta. Os espaçadores impedem que o último
   * card estique sozinho pela linha inteira.
   */
  const itens = useMemo(() => {
    const resto = pokemons.length % colunas;
    if (resto === 0) return pokemons;

    const faltam = colunas - resto;
    const vazios: Pokemon[] = Array.from({ length: faltam }, (_, indice) => ({
      id: -(indice + 1),
      nome: '',
      imagem: null,
      tipos: [],
    }));
    return [...pokemons, ...vazios];
  }, [pokemons, colunas]);

  return (
    <SafeAreaView style={estilos.tela} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[estilos.cabecalho, estilos.limite]}>
        <View style={estilos.cabecalhoLinha}>
          <Text style={estilos.titulo}>Pokédex</Text>
          <Text style={estilos.paginacao}>{TAMANHO_DA_PAGINA} por página</Text>
        </View>
        <Text style={estilos.subtitulo}>
          Arraste até o fim da lista para carregar os próximos.
        </Text>
        <View style={estilos.regua} />
        <Text style={estilos.contador}>
          {listaVazia
            ? (carregando ? 'Carregando o primeiro lote…' : 'Nenhum Pokémon carregado')
            : `${pokemons.length} de ${total} registros${temMais ? '' : ' · lista completa'}`}
        </Text>
      </View>

      {erro && listaVazia ? (
        <Aviso
          variante="erro"
          titulo="A PokeAPI não respondeu"
          descricao={erro.mensagem}
          acao={{ rotulo: 'Tentar novamente', aoTocar: () => buscarPokemons(0, 'inicial') }}
        />
      ) : carregando && listaVazia ? (
        <View style={[estilos.areaEsqueleto, estilos.limite]}>
          <View style={estilos.linhaEsqueleto}>
            {Array.from({ length: colunas }).map((_, indice) => (
              <CartaoEsqueleto key={indice} />
            ))}
          </View>
          <View style={estilos.linhaEsqueleto}>
            {Array.from({ length: colunas }).map((_, indice) => (
              <CartaoEsqueleto key={indice} />
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          key={`colunas-${colunas}`}
          data={itens}
          keyExtractor={(item) => String(item.id)}
          numColumns={colunas}
          renderItem={({ item }) =>
            // id negativo = espaçador invisível da última linha.
            item.id < 0 ? <View style={estilos.vazio} /> : <CartaoPokemon pokemon={item} />
          }
          contentContainerStyle={[estilos.grade, estilos.limite]}
          columnWrapperStyle={estilos.coluna}
          showsVerticalScrollIndicator={false}
          onEndReached={carregarProximos}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => buscarPokemons(0, 'atualizar')}
              tintColor={cores.textoSuave}
              colors={[cores.marca]}
              progressBackgroundColor={cores.superficie}
            />
          }
          ListEmptyComponent={
            <Aviso
              titulo="Nenhum Pokémon na lista"
              descricao="A requisição terminou sem registros. Puxe a lista para baixo para tentar de novo."
            />
          }
          ListFooterComponent={
            <View style={estilos.rodape}>
              {carregandoMais && (
                <View style={estilos.rodapeCarregando}>
                  <ActivityIndicator color={cores.textoSuave} />
                  <Text style={estilos.rodapeTexto}>
                    Buscando os próximos {TAMANHO_DA_PAGINA}…
                  </Text>
                </View>
              )}

              {erro && !listaVazia && (
                <Aviso
                  variante="erro"
                  titulo={erro.modo === 'atualizar' ? 'Falhou ao atualizar a lista' : 'Falhou ao carregar mais'}
                  descricao={erro.mensagem}
                  acao={{
                    rotulo: 'Tentar novamente',
                    aoTocar: () => buscarPokemons(erro.offset, erro.modo),
                  }}
                />
              )}

              {!temMais && !erro && (
                <Text style={estilos.rodapeTexto}>
                  Fim da lista — todos os {total} Pokémon da API.
                </Text>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    paddingHorizontal: espaco.lg,
    paddingTop: espaco.lg,
    paddingBottom: espaco.md,
    gap: espaco.sm,
  },
  cabecalhoLinha: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: espaco.md,
  },
  titulo: {
    color: cores.texto,
    fontSize: fonte.display,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  paginacao: {
    color: cores.textoFraco,
    fontSize: fonte.rotulo,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  subtitulo: {
    color: cores.textoSuave,
    fontSize: fonte.corpo,
    lineHeight: fonte.corpo * 1.5,
    maxWidth: 460,
  },
  regua: {
    height: 1,
    backgroundColor: cores.borda,
    marginTop: espaco.xs,
  },
  contador: {
    color: cores.textoFraco,
    fontSize: fonte.rotulo,
    fontVariant: ['tabular-nums'],
  },
  /** Em tela larga o conteúdo para de esticar e fica centralizado. */
  limite: {
    width: '100%',
    maxWidth: 1240,
    alignSelf: 'center',
  },
  grade: {
    padding: espaco.lg,
    paddingBottom: espaco.xxl,
    gap: espaco.md,
  },
  coluna: {
    gap: espaco.md,
  },
  areaEsqueleto: {
    padding: espaco.lg,
    gap: espaco.md,
  },
  linhaEsqueleto: {
    flexDirection: 'row',
    gap: espaco.md,
  },
  vazio: {
    flex: 1,
    padding: espaco.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rodape: {
    paddingTop: espaco.lg,
    alignItems: 'center',
  },
  rodapeCarregando: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
  },
  rodapeTexto: {
    color: cores.textoFraco,
    fontSize: fonte.corpo,
  },
});
