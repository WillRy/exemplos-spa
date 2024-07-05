# Aplicação de exemplo - Mini CRM

Repositório contém 2 aplicações:

- API: Backend em Laravel
- FrontEnd: SPA em vue 3

Contemplando:

- autenticação
    - jwt
    - refresh token
    - tratamento de race condition em refresh token rotativo
    - CSRF token 
- estruturação de rotas publicas e privadas
- CRUD
- comunicação entre componentes
    - pinia
    - técnicas de reload de dados
- internacionalização
- validações


## Usuário e senha

- usuario: admin@admin.com
- senha: 123456


## Como executar?


**pasta: api**
```shell
docker-compose up -d
```

**pasta: spa-vue**

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
