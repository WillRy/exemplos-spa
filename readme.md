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
