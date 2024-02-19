# API em Laravel

Essa API tem como objetivo cobrir alguns tópicos:

- Auth guard personalizada
    - autenticar em outras tabelas além do padrão do laravel, exemplo: usar outras tabelas além da "user" para autenticar
    - Isso é feito via AuthServiceProvider e config/auth.php
- Autenticação JWT mais robusta
    - controle de tokens e refresh token via banco (para poder forçar logout de alguém)
    - proteção do token contra XSS, através de cookies http only
- Proteção de CSRF inteligente, que aplica proteção de CSRF token "SOMENTE" quando
  a API é usada a nível browser(SPAs e etc), quando chamada diretamente não há necessidade de CSRF
- Internacionalização a nível de API (Middleware: Locale)
- CRUD completo com relacionamentos de (1 -> N) e (N -> N)

## Endpoints

Estão presentes no arquivo insomnia.json, que pode ser importado via insomnia ou postman

## Executar API

```shell
# SEM DOCKER
cp -r .env.example .env

php artisan migrate:fresh --seed

php artisan serve

# Com docker

docker compose up -d
```


**URL: http://localhost:8000**

**Credenciais: admin@admin.com / 123456** 
