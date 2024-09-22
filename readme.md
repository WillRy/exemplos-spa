# Aplicação de exemplo - Mini CRM

Repositório contém 3 aplicações:

- API: Backend em Laravel: Reuntilizável entre os multiplos frontends
- FrontEnd versão 1: SPA em vue 3
- FrontEnd versão 2: App Nuxt 3

**A API é reutilizável entre as multiplas opções de frontend.**

**A API tem exemplos contemplando:**

- autenticação
    - jwt
    - refresh token
    - tratamento de race condition em refresh token rotativo
    - CSRF token 

**O frontend com Vue3 contempla** 
- estruturação de rotas publicas e privadas
- CRUD
- comunicação entre componentes
    - pinia
    - técnicas de reload de dados
- internacionalização
- validações

**O frontend feito com Nuxt3 contempla**
- Autenticação Server Side Rendering e também Client Side
- Personalização da lib ajax do Nuxt3 para fluxo de logout automatico ao expirar token e também refresh token
- estruturação de rotas publicas e privadas
- CRUD
- comunicação entre componentes
    - pinia
    - técnicas de reload de dados
- validações


## Usuário e senha

- usuario: admin@admin.com
- senha: 123456


## Como executar a API?


**pasta: api**
```shell
docker-compose up -d
```

## Como executar o frontend?

**Escolha entre um dos frontends**

### SPA com Vue3

**pasta: spa-vue**

```shell
npm install

npm run dev
```

### SPA com Nuxt3

**pasta: nuxt**

```shell
npm install

npm run dev
```


## Endpoints

Na pasta da **api** contém um arquivo **insomnia.json** que pode ser importado no insomnia ou postman, para já ter os endpoints prontos para uso

## Controle de qualidade

O código conta com análise de erros no backend e frontend. 

- **Backend**: é feito via phpstan/larastan. Comando: composer qualidade
- **FrontEnd**: é feito via ESLint com regras recomendadas para o Vue3. Comando: npm run fix

Além disso tem formatador automático

- **Backend**: é feito via Laravel Pint. Comando: composer cs
- **FrontEnd**: é feito via Prettier com regras recomendadas para o Vue3. Comando: npm run format
