<p align="center">
  <img style="margin-right: 30px;" src="https://raw.githubusercontent.com/diglopes/node-red-contrib-resolv-risk/master/docs/resolv-risk-logo.png" width="100" />
  <img src="https://raw.githubusercontent.com/diglopes/node-red-contrib-resolv-risk/master/docs/node-red-logo.png" width="100" />
  <h3 align="center">Resolv Risk Web Services</h3>
  <p align="center">Acesse os produtos através da plataforma Node-red</p>
</p>

<hr/>

## Pre-requisitos

- [Node.js](https://nodejs.org/en/download/)
- [Npm (incluso ao instalar o Node.js)](https://www.npmjs.com)
- [Node-red](https://nodered.org/docs/getting-started/local#installing-with-npm)

## Como instalar

Estes nodes não estão disponiveis publicamente, portanto, não é possivel realizar o download através do <b>Manage palette</b> dentro da própria plataforma. No entanto, o processo pode ser facilmente realizado de forma manual seguindo os seguintes passos:

### 1 - Download

Realize o clone ou download deste módulo clicando no botão "Clone or download" logo acima, caso tenha escolhido por clicar em download vá até o diretório escolhido para salvar o arquivo e descompacte-o.

### 2 - Instalação

Após já ter realizado previamente a instalação do [Node.js](https://nodejs.org/en/download/) e do [Node-red](https://nodered.org/docs/getting-started/local#installing-with-npm), para instalar o módulo basta encontrar o seu diretório de usuário do node-red, que normalmente fica em  ```~/.node-red```, abrir o terminal dentro desta pasta e utilizar o seguinte comando:

```bash
npm install <caminho relativo para a pasta que você fez o download>
```
A caminho indicado deve ser inserido sem os sinais de maior que ( <b><</b> ) e menor que ( <b>></b> ) como indicado no  exemplo abaixo em um caso hipotético em que o módulo tivesse sido salvo na pasta home:

```bash
npm install /home/node-red-contrib-resolv-risk
```

Ao terminar a instalação todo o módulo com seus respectivos nodes estarão disponiveis na aba "Resolv Risk" dentro do node-red.
<p>
<img src="https://raw.githubusercontent.com/diglopes/node-red-contrib-resolv-risk/master/docs/resolv-risk-tab.png" width="600" />
</p>

## Serviços disponiveis

Os seguintes serviços com seus respectivos nodes serão disponibilizados ao realizar a instalação:

- Consulta Cadastral
- Score
- Óbito
- Fraude Data

## Como funciona

### Inserindo as credenciais

Para realizar uma consulta é necessário primariamente fornecer suas credenciais para realizar a autenticação, para isso basta clicar em um dos nodes que estiverem dispostos no seu fluxo e em seguida no ícone de lápis do campo login. Na janela que se abrirá você informará o seu <b>username</b> e <b>password</b>, uma vez salva esta configuração estará disponível para todos os demais nodes Resolv Risk bastando apenas escolher a configuração que estará com o mesmo nome do username que você inseriu.

<p>
<img src="https://raw.githubusercontent.com/diglopes/node-red-contrib-resolv-risk/master/docs/credentials-insert.gif" width="600" />
</p>

### Uso das variaveis de fluxo

Para otimizar o tempo de consulta, visto que a criação de um novo Token e do client-soap demandam um custo em tempo o Token gerado na autenticação assim como o client-soap e o nome do ambiente no qual ambos os dados foram gerados serão guardados no contexto de fluxo do node-red, desta forma, a menos que haja a necessidade de gerar um novo Token ou Client (como no caso de uma troca de ambiente) estes serão  buscados no contexto de fluxo para que não se efetue repetidas vezes as mesmas operação custosas de forma desnecessária.

### Entrada de dados

É esperado que o ```msg.payload``` contenha as informações necessárias de acordo com os serviços escolhidos, sendo estas:

| Serviço            | Cpf | Nome | Nome da mãe | Data de nascimento | Valor | Atraso |
| -------------------|:---:|:----:|:-----------:|:------------------:|:-----:|:------:|
| Consulta Cadastral | ✔️  |  ❌  |      ❌     |         ❌         |  ❌   |  ❌   |
| Score              | ✔️  |  ❌  |      ❌     |         ❌         |  ✔️   |  ✔️   |
| Óbito              | ✔️  |  ✔️  |      ✔️     |         ✔️         |  ❌   |  ❌   |
| Fraude Data        | ✔️  |  ❌  |      ❌     |         ✔️         |  ❌   |  ❌   |

Ao clicar em qualquer um dos nodes na aba <b>info</b> estarão dispostas as informações sobre os campos necessários assim como as suas nomenclaturas, tipo de dado e formato correto que deverá estar inserido no JSON dentro do ```msg.payload```.

<p>
<img src="https://raw.githubusercontent.com/diglopes/node-red-contrib-resolv-risk/master/docs/node-help.png" width="300" />
</p>