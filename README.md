# Pokédex — React Native (Expo)

Segunda atividade, com entrega em 03/11: app de Pokédex consumindo a [PokeAPI](https://pokeapi.co/),
com listagem paginada de 20 em 20 e carregamento ao arrastar.

## Como rodar

```bash
npm install
npx expo start          # abre o menu do Expo (QR code para o Expo Go)
npx expo start --web    # abre direto no navegador
```

Não precisa de chave de API nem de arquivo `.env` — a PokeAPI é pública.

No celular, instale o **Expo Go**, conecte o celular e o computador à mesma
rede Wi-Fi e leia o QR code exibido por `npx expo start` (no iPhone, pela Câmera).
No PowerShell, se `npm` ou `npx` forem bloqueados pela política de scripts, use
`npm.cmd` e `npx.cmd`, respectivamente.

Para verificar o código:

```bash
npm run lint
npm run typecheck
```

## Integração contínua

O projeto executa as verificações **ESLint** e **TypeScript** automaticamente em pull requests, pushes na branch `main` e pelo acionamento manual do [workflow de qualidade](.github/workflows/quality.yml).

Para reproduzir a checagem localmente:

```bash
npm ci
npm run lint
npm run typecheck
```

O workflow verifica qualidade estática e compatibilidade de tipos. Não substitui testes de navegação ou execução em dispositivo físico.

## O que o app faz

| Pedido do enunciado | Onde está |
| --- | --- |
| Listar os 20 primeiros Pokémon | `buscarPagina(0)` em `src/api.ts`, chamada no `useEffect` de `src/app/index.tsx` |
| Ao arrastar, pedir os próximos 20 | `onEndReached` da `FlatList` chama `carregarProximos()` |
| Mostrar imagem, número, nome e tipagem | `src/componentes/CartaoPokemon.tsx` |

Além do pedido: puxar a lista para baixo recarrega do zero (`RefreshControl`),
a primeira carga mostra esqueletos no lugar dos cards, e falha de rede vira um
aviso com botão **Tentar novamente**. A tentativa repete a página que falhou
e bloqueia requisições simultâneas para evitar duplicar os Pokémon.

## Como a requisição funciona

A PokeAPI entrega a lista e o detalhe em endpoints separados:

1. `GET /pokemon?limit=20&offset=N` devolve `{ count, next, results: [{ name, url }] }` —
   só nome e URL, sem imagem nem tipagem.
2. Para cada um dos 20 itens, `GET /pokemon/{id}` devolve `types` e `sprites`.
   As 20 chamadas saem juntas com `Promise.all`, não em sequência.

O `offset` da próxima página é a quantidade de Pokémon já carregados, e a
paginação acaba quando a API devolve `next: null` (`temMais === false`).

Tratamento de erro fica em `buscarJson`: se `resposta.ok` for falso, lança
`Error` com o status, e o `catch` de `src/app/index.tsx` guarda a mensagem e
a página que falhou em `erro`.

## Estrutura

```
src/app/_layout.tsx             entrada do Expo Router, área segura e barra de status
src/app/index.tsx               tela: estados, busca, FlatList e paginação
src/api.ts                      acesso à PokeAPI (fetch, erro, conversão)
src/tipos.ts                    tipos da resposta da API e do modelo da tela
src/tipagens.ts                 cor e nome em português de cada tipagem
src/tema.ts                     tokens de cor, espaço, raio e tipografia
src/componentes/CartaoPokemon.tsx  card de um Pokémon
src/componentes/ChipTipagem.tsx    etiqueta de tipagem
src/componentes/Esqueleto.tsx      placeholder da primeira carga
src/componentes/Aviso.tsx          estados de erro e de lista vazia
```

## Decisões de interface

- **Tema escuro fixo.** A arte oficial dos Pokémon é colorida e tem fundo
  transparente; sobre grafite ela ganha contraste sem competir com a interface.
- **A cor vem da tipagem.** O número, o círculo atrás da arte e os chips usam a
  cor do primeiro tipo. Fora isso a tela só tem neutros — por isso 1 000 cards
  diferentes não viram um mosaico aleatório.
- **Tipografia do sistema** (San Francisco no iOS, Roboto no Android). É uma
  escolha: fonte baixada atrasa a primeira tela e troca de fonte no meio da
  carga. A personalidade vem da escala fechada (12/14/16/20/32) e do
  `letterSpacing` negativo nos títulos.
- **Colunas por largura**: 2 no celular, 3 em tablet, 4 em desktop — e o
  conteúdo para de esticar em 1240px.
