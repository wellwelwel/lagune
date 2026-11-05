# Dashboard

> Esta página está desatualizada em relação à versão em inglês. [Ler a versão original](https://lagune.ai/docs/get-started/dashboard).

> Veja o charter, os achados e o catálogo do seu projeto em uma visão local e ao vivo que abre com um único comando.

Canônica: https://lagune.ai/pt-BR/docs/get-started/dashboard
Idioma: pt-BR
Original: https://lagune.ai/docs/get-started/dashboard
Última atualização: 2026-11-05

Execute o **Lagune** diretamente, sem subcomando, para ter uma visão interativa e ao vivo de `.lagune/`. Ele serve um dashboard e o abre em uma porta aleatória:

```bash
npx lagune
```

- [x] **Live reload**
- [x] **Privado** e **local**
- [x] Mostra tudo o que `.lagune/` contém, desde o primeiro charter
- [x] **Gerencie** as categorias do projeto direto do seu navegador
- [x] Não precisa de `node_modules` nem de `package.json` 📦

![Charter no dashboard do Lagune](https://lagune.ai/img/dashboard/02.webp)

![Achados no dashboard do Lagune](https://lagune.ai/img/dashboard/03.webp)

![Side quests no dashboard do Lagune](https://lagune.ai/img/dashboard/04.webp)

![Detalhe de um achado no dashboard do Lagune](https://lagune.ai/img/dashboard/05.webp)

![Catálogo no dashboard do Lagune](https://lagune.ai/img/dashboard/06.webp)

**Dica**

- 🚪 Use `--port` para definir uma porta personalizada.
- ⏏️ Pressione `Ctrl+C` para parar.

## Perguntas frequentes

### Como abrir o dashboard do Lagune?

Execute npx lagune sem subcomando na raiz do seu projeto. Ele serve uma visão ao vivo de .lagune/ em uma porta aleatória e a abre no seu navegador.

### O dashboard é privado?

Sim. Ele roda apenas na sua própria máquina, em um endereço local que nenhum outro computador alcança.

### Posso alterar o meu projeto pelo dashboard?

Só as categorias, pelo seu navegador. Todo o resto que o dashboard mostra é somente leitura.
