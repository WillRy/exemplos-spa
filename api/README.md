# API em Laravel

Essa API tem como objetivo cobrir alguns tópicos:

- Auth guard personalizada
    - autenticar em outras tabelas além do padrão do laravel (Feito via AuthServiceProvider e config/auth.php)
- Internacionalização a nível de API (Middleware: Locale)
- CRUD completo com relacionamentos de (1 -> N) e (N -> N)
- Autenticação JWT

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
