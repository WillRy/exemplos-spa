# Aplicação de exemplo - Mini CRM

Uma aplicação de exemplo com o objetivo de demonstrar:

- autenticação
- estruturação de rotas publicas e privadas
- CRUD
- comunicação entre componentes
- internacionalização
- validações

## Telas e seus exemplos

### CRUD de organizações e tags

Tela com carregamento inteiro feito posterior a exibição da tela

### CRUD de contatos

Tela com carregamento inteiro feito antes da exibição da tela


## Usuário e senha

- usuario: admin@admin.com
- senha: 123456

## Como executar?



## Como executar?

**pasta: api**
```shell
composer install

#configurar credenciais do banco dentro do .env
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