# ParkingBackEnd
Backend para aplicación de gestión de parqueaderos PSL

**Pre-requisitos**
* NodeJS v8.8.1 o superior
* npm v4.6.1 o superior
* MongoDB 

Para instalar los demás pre-requisitos, ejecutar el comando *npm install* en la raiz de la carpeta del proyecto.

Ejecutar el comando *npm install -g gulp*, para instalar el GULP que se utilizará para ejecutar la solución.

Para ejecutar el protecto en modo debug, debe estar en ejecución el servidor de MongoDB y ejecutar el comando *gulp serve* en la consola de NodeJS

## Endpoints

A continuación se describen los end-points con sus métodos y ejemplos de consumo.

###### Parking
End-point para la gestión del recurso parqueaderos.

* GET ('/'): obtiene el listado completo de parqueaderos en el sistema.
    * Parámetros:

* POST ('/'): crea un nuevo parqueadero.
    * Parámetros:
        Body,
        ```JSON
        {
            "parking":{
                "parkingNumber": 1,
                "floorNumber": 1
            }
        }
        ```
* PUT ('/'): cambia el estado de un parqueadero entre ocupado y desocupado.
    * Parámetros:
        Body,
        ```JSON
        {
            "id": "59fa4b508495b50560e1c58c",
	        "status": "NOT_AVAILABLE"
        }
        ```
        Los estados posibles son ["NOT_AVAILABLE", "AVAILABLE"]

* DELETE ('/'): borra un parqueadero de acuerdo al Id proporcionado.
    * Parámetros:

        QueryString,
        id=59fa4b508495b50560e1c58c


###### User
End-point para la gestión de los usuarios y vehiculos.

* GET ('/'): obtiene todos los usuarios registrados en el sistema.
    * Parámetros:

* POST ('/'): crea un nuevo usuario en el sistema. Los usuarios pueden crearse con o sin vehiculos asociados.
    * Parámetros: 
        Body,

        Para crear un usuario con 1 o más vehiculos asociados:
        ```JSON
        {
            "user": {
                "userName": "Ricardo Osorio",
                "userEmail": "rosoriog@psl.com.co",
                "userTelNumber": "3108747886"
            },
            
            "vehicles": [
                {
                    "vehicleLicensePlate": "HAX045",
                    "vehicleBrand": "Nissan",
                    "vehicleModel": "Tiida"
                }
            ]
        }
        ```

        Para crear un usuario **sin** vehiculos asociados.

        ```JSON
        {
            "user": {
                "userName": "Ricardo Osorio",
                "userEmail": "rosoriog@psl.com.co",
                "userTelNumber": "3108747886"
            },
            
            "vehicles": [
            ]
        }
        ```