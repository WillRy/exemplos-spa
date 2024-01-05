# Aplicação de exemplo - Mini CRM

2 aplicações de exemplo com o objetivo de demonstrar:

- autenticação
    - jwt
    - refresh token
    - tratamento de race condition em refresh token rotativo
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


## Divisão das aplicações

Existem 2 modelos


### 1° modelo

Backend e front end separados, através da pasta **api** e a pasta **spa-vue** com o front

### 2° modelo

Aplicação monolítica usando inertia.js

## Como executar?

Depende do modelo que deseja executar


### Executar 1° modelo

**pasta: api**
```shell
docker-compose up -d
```

**pasta: spa-vue**

```shell
npm install

npm run dev
```

### Executar 2° modelo


**pasta: inertia**
```shell
docker-compose up -d

npm install

npm run dev
```