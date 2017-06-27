# virtualizacion_nodejs_rest
Demo NodeJS REST API

## Qué es un REST API
Es una aplicación web que corre en el backend y que permite recibir HTTP requests y responder con JSON.

## Cómo crear endpoints o rutas
Para poder usar el API hay que crearle endpoints o rutas, que es a donde se envían los requests. Están ubicados en el folder de `routes`, y por cada endpoint hay que tener un archivo. Así se crean:
1. Crear un nuevo archivo `.js` en el folder `routes` con el nombre de la ruta.
2. Copiar el contenido del archivo `mi_ruta.js` como base.
3. En la parte de arriba, cambiar el controller al que se hace referencia por el que usará esta ruta. Ver la siguiente sección sobre cómo crear un controller.
4. Definir los métodos que van a usar (GET, POST, PUT, DELETE) y qué método del controller usa cada método.
5. Ir al archivo `routes/index.js` y agregar estas líneas, cambiándolas por el nombre de su nueva ruta:
```
//Lo que va dentro del require es el nombre del archivo sin la terminación .js
var miRuta = require('./mi_ruta');
 
//El primer parámetro dentro de comillas es el nombre de la ruta y cómo lo van a acceder desde una URL. Por ejemplo, con el nombre '/mi_ruta', yo llego a este recurso desde Postman o un navegador mediante localhost:3000/api/mi_ruta/
router.use('/mi_ruta', miRuta);
```
6. Éxito, disfruta tu nueva ruta

## Cómo crear controllers
Los controllers son utilizados por las rutas para procesar los datos. Normalmente es en los controllers donde se pone toda la lógica de la app y el acceso a base de datos, pero en este caso no es necesario accesar base de datos.
1. Crear un nuevo archivo `.js` en el folder `controllers` con el nombre del controller.
2. Copiar el contenido del archivo `mi_controller.js` como base.
3. Definir acá sus métodos a usar en las routes. Deben tener los parámetros `req, res` ya que por allí es que las rutas pasan el body y los params para que ustedes los puedan usar.
4. Al final de cada método, retornar sus datos con `res.status(200).send({ miJSON: 'Lo que quieran retornar' });`. El código del status lo eligen dependiendo del error o tipo de operación que hicieron, y en el json pueden enviar cualquier cosa(s) que quieran, casi que pasa de todo. La magia de JavaScript.
5. Ir a `controllers/index.js` y agregar la referencia al nuevo archivo que crearon. `const mi_controller = require('./mi_controller');`, cambien el nombre de la variable y la ruta de su archivo sin el `.js`. Dentro del `module.exports = { }` agreguen su nueva variable al listado.
6. Cuando están en su ruta y quieran usar un controlador, en el require, deben poner el nombre de la variable que definieron en el index de controllers, no el nombre del archivo. Mejor si usan el mismo nombre tanto para archivo como para variable, para que no se confundan.
7. ¡Éxito! Qué bonito es JavaScript.

## Muy bonito todo, ¿pero cómo corro esta vaina?
1. Clonar el repo, duh.
2. Abrir el folder de su API en CMD y correr el comando `$ npm install`
3. Esperar a que instalen las dependencias y luego correr `$ npm start`. Esto inicia un servidor en el `puerto 3000`, al cual pueden enviar sus requests.
4. Para comprobar si está corriendo, ir a `localhost:3000/api/` en un navegador. Si les aparece el mensaje de Bienvenida, es porque ya estufas.
5. Si quieren debuggear, pueden usar `console.log()` dentro de su controller o ruta y eso se va a imprimir en el CMD donde hicieron el `npm start`.
6. Si cierran el CMD, se apaga el servidor y ya no escucha en el puerto 3000. Para detener el servidor usen `Alt + C` (o Ctrl + C, no recuerdo).
7. Los cambios hechos mientras el servidor está encendido no los va a aplicar hasta que detengan el server y vuelvan a hacer el `npm start`. 

## Docker
Demo creación de imágenes y AWS ECR

## Imágenes vs Containers
# ¿Qué es una imagen?
Una imagen es un archivo (usualmente llamado Dockerfile) que esencialmente es un snapshot de un container. Las imágenes son construidas a través del comando [build](https://docs.docker.com/glossary/?term=build), y ellas crean un container cuando la iniciamos con el comando [run](https://docs.docker.com/engine/reference/commandline/run/). Las imagenes son almacenadas en repositorios (Sí, justo como este repositorio de github) para que podamos accedarlos desde diferentes instancias (AWS EC2 Servers, por ejemplo).

# ¿Qué es un container?
Si usamos una metáfora de programación; una imagen es una clase y los containers son instancias de la clase. Los containers son más livianos y son paquetes que encapsulan todo el environment en donde van a correr nuestros servicios. 

## ¿Listos? ¡Creemos una imagen!
1. Ingresar via ssh a la "instancia residencia" o donde correrá la imagen.
2. El tree-file donde debemos ubicar nuestro docker es en `var\containers\{service_name}\dockerfile`
> $ cd var\containers\

> $ sudo mkdir {service_name} 

> $ sudo nano dockerfile

3. Pero, ¿Qué tendrá nuestro docker? el template básico del dockerfile puedes encontrarlo [aquí](https://github.com/dockerfile/ubuntu/blob/master/Dockerfile). Un punto importante es que hay que agregar el puerto donde nuestros contenedores se comunicaran con el exterior (con la instancia de AWS). Para lograrlo debes de agregar en la última línea la siguiente instrucción:

> EXPOSE 80

4. ¡Nuestra imagen está lista! Es momento de construirla. Para ellos ejecutaremos el siguiente comando: 

> $ sudo docker build {path_to_dockerfile} --no-cache

Si te encuentras en la carpeta donde está el dockerfile, puedes ejecutarlo de la siguiente manera: 

> $ sudo docker build . --no-cache

5. Hey pero ... ¿Cómo sé que lo creé?; es momento de aprender un nuevo comando: el comando [docker images](https://docs.docker.com/engine/reference/commandline/images/). Utilizando este comando nos debería de aparecer un listado de todas las imagenes creadas en esa instancia de AWS. 

> $ sudo docker images

## Es momento de una pausa de linux ... ¡Necesitamos crear un repositorio!
Unas líneas arriba hablamos sobre la importante de tener un lugar donde almacenar las imágenes y AWS nos proporciona de repositorios de almacenamientos para que conservemos en ellos nuestras imágenes.

1. Ingresemos a la consola de AWS. 
2. Luego buscamos `Services > EC2 Container Services`.
3. En el sidebar buscamos `Repositories`.
4. Posteriormente en `Create repository`.
5. El nombre del repositorio debe ser el mismo que tiene el servicio. `Ej. Query, Matching, Ranking ...`
6. Esto nos generará un `URL Repository`, el cual es el que utilizaremos para conectar imagen <-> repositorio. 
7. El último paso es contactar al administrador de la consola de AWS para que pueda suministrarte permisos de `push` y `pull` para poder continuar.

## Going back to linux ...
Ya que tenemos nuestro `URL Repository` podemos continuar diciendo a docker donde almacenaremos la imagen que acabamos de construir. 
Para poder hacerle push a la imagen es necesario seguir estos tres pasos:

1. Loggearnos desde la instancia de AWS a la consola desde AWSCLI. Lo realizamos ejecutando el siguiente comando:

> $ sudo $(aws ecr get-login --region us-east-2)

2. Asociarle un tag a la versión de la imagen que estamos subiendo. Este "tag" es una manera de "versionar" nuestra imagen. En nuestro caso siempre la manejaremos como la última versión estable. Se ejecuta el siguiente comando:

> $ sudo docker tag {image_id} {url_repository}:latest

En el comando anterior mencioné lo que es un `image_id`, este podemos encontrarlo al ejecutar el comando `docker images` que nos permite listar todas las imágenes que tenemos en la instancia.

3. Finalmente, ejecutamos el siguiente comando:

> $ sudo docker push {url_repository}




