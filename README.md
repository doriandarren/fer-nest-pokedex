# Project

## Settings

```sh

// Remover paquete Prettier:
npm remove prettier eslint-config-prettier eslint-plugin-prettier




// Agregar en el archivo: "eslint.config.mjs"
...
rules: {
  '@typescript-eslint/no-unused-vars': [
    'warn',
    { argsIgnorePattern: '^_' },
  ],
}
...


// Librerias para instalar:
npm i uuid                                  // UUID
npm i -D @types/uuid                        // UUID TypeScript
npm i class-validator class-transformer     // Para Validacion en el controlador | @UsePipes()



nest g res seed --no-spec                   // crear los seeders



// Contenido estatico:
npm i @nestjs/serve-static                  // Instalar

// Y en el archivo "app.module.ts":
...
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,’..’,’public’),
    })
  ],
})
export class AppModule {}
...




// Agregar Prefijo: "api/v1". En el archivo: "main.ts":

...
app.setGlobalPrefix('api/v1');
...




// Crear module Common:

nest g mo common                        // crear un Module Common
nest g pi common/pipes/parseMongoId     // Crear los Pipes



```

```sh

npm run start:dev                       // Ejecutar el servidor


// Create Modules

nest --help
nest g mo cars                          // Module
nest g co cars                          // Controller
nest g s cars --no-spec                 // Service
nest g res brands --no-spec




```

# Notas importantes:

```sh

DTO:
Los dto siempre son clases



```




# Docker

```sh

// crear el archivo "docker-compose.yaml"

// Luego:
docker compose up -d

```




# Mongoose

```sh

npm i @nestjs/mongoose mongoose


// en el archivo: app.module.ts

...
// Mongoose
MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
...


```



