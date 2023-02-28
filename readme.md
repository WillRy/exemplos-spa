# Aplicação de exemplos 

- Aplicação que simula um mini crm em uma API em laravel e uma SPA em Vue.JS



## Exemplos contidos

- CRUD completo
- Listas com paginação, ordenação, pesquisa e filtros
- Segurança de rotas publicas e privadas na SPA


## Como executar?

**pasta: api**
```shell
composer install

#configurar credenciais do banco
cp -r .env.example .env

php artisan migrate:fresh --seed
```

**pasta: spa-vue**

```shell
npm install

npm run dev
```


## Credenciais

usuário: admin@admin.com
senha: 123456