# Conceptos de Node.js
**Controller:**
* Son funciones que permiten controlar la lógica de negocios de nuestra app, es decir, si 
necesitamos subir un usuario al sistema es justo en este punto donde estaría toda la lógica para 
subir a nuestro usuario.

**Helpers:**
* Son funciones que son creadas para evitar la repetición de Código y conseguir un mantenimiento 
sencillo de nuestro proyecto.

**Middleware:**
* Un middleware no es más que un trozo de código (función, método) que se ejecutara antes de 
que se haga una petición del tipo que sea. generalmente se utiliza para verificar la 
autenticación antes de ejecutar el código.

**Models:**
* van a representar a una entidad de la base de datos y más concretamente van a representar a 
un único registro o documento de nuestra base de datos. Por ejemplo, si tenemos una 
colección en la base de datos llamada Notas, dentro de ella se guardarán documentos de tipo 
Nota

**Routes:**
* Definimos las rutas de nuestra app, estas contendrán los middlewares o funciones de validación 
de la BD y el nombre de la función del controlador. las rutas funcionan como un puente hacia 
los controladores. ejecutando primero los middlewares en caso de haberlos y luego 
el controlador.
