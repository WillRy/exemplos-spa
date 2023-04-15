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

- entrar na pasta "../api"
- executar o ambiente docker
```shell
docker-compose up -d 

#OU

docker compose up -d
```

- voltar na pasta da "spa-vue"
- executar:
```shell
npm run dev
```