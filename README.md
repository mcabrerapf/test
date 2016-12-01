# Gamification
Aplicación para la gamificación de fuerzas de ventas

## Instalación

1. Instalar los componentes node

```
npm install
```

2. Instalar los componentes bower

```
bower install
```

3. Modificar el fichero:

```
/bower_components/ace-builds/bower.json
```

Añadir la siguiente definición:
    
```
"main": ["./src-min/ace.js"],
```

4. Modificar el fichero:

```
/bower_components/kendo-ui/bower.json
```

Modificar la definición del atributo "main":

```
"main": [
    "js/kendo.all.min.js",
    "styles/kendo.common-material.min.css",
    "styles/kendo.material.min.css"
],
```

5. Ejecutar el servicio

```
npm start
```


---

Para generar la release final, ejecutar el comando:

```
gulp build
```