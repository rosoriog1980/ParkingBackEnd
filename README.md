# ParkingBackEnd
Backend para aplicación de gestión de parqueaderos PSL

**Pre-requisitos**
* NodeJS v8.8.1 o superior
* npm v4.6.1 o superior
* MongoDB 

Para instalar los demás pre-requisitos, ejecutar el comando *npm install* en la raiz de la carpeta del proyecto.

## Endpoints

A continuación se describen los end-points con sus métodos y ejemplos de consumo.

**Parking**
End-point para la gestión del recurso parqueaderos.

* GET ('/'): obtiene el listado completo de parqueaderos en el sistema.
    * Parámetros:

* POST ('/'): crea un nuevo parqueadero.
    * Parámetros:
        ```JSON
        {
            "parking":{
                "parkingNumber": 1,
                "floorNumber": 1
            }
        }
        ```
