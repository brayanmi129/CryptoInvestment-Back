# CryptoInvestment - Backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-4.x-blue)
![SQL Server](https://img.shields.io/badge/DB-SQL--Server-lightgrey)
![Deploy](https://img.shields.io/badge/Deployed-Azure-blue)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Backend del sistema **CryptoInvestment**, una plataforma diseñada para inversores de criptomonedas que desean una visión consolidada y persistente del comportamiento de sus activos digitales en tiempo real.

 **URL de la aplicación:**  

[https://cryptoinvestment.azurewebsites.net/](https://cryptoinvestment.azurewebsites.net/)

## 📌 Requisitos Funcionales (RF)

- RF01: El sistema debe obtener información actualizada de criptomonedas desde la API de CoinMarketCap.
- RF02: El sistema debe almacenar el historial diario de precios y variación porcentual.
- RF03: Debe exponer una API REST para consultar la lista de criptos, su información actual y el historial.
- RF04: Permitir filtrar la información de una criptomoneda por ID.
- RF05: Actualizar automáticamente los precios diariamente.

## ⚙️ Requisitos No Funcionales (RNF)

- RNF01: El sistema debe ser de una sola página (SPA), sin recarga del navegador.
- RNF02: Debe permitir visualización desde diferentes dispositivos (responsivo).
- RNF03: Debe desplegarse en la nube (Azure).
- RNF04: Se deben almacenar y persistir los datos históricos.
- RNF05: Debe ser fácilmente extensible a futuro.

## 🧰 Tecnologías

- Node.js
- Express.js
- SQL Server (Azure Database)
- Axios
- Despliegue en Azure App Service

## Enpoints

| Método | Ruta                         | Descripción                         |
| ------ | ---------------------------- | ----------------------------------- |
| GET    | `/api/getCryptoData`         | Lista de criptomonedas  |
| GET    | `/api/getDataById?id=1`      | Info detallada de precio y cambios históricos |
| GET    | `/api/getCryptoHistory?id=1` | Historial diario registrado         |


# Base de Datos

DB_USER=usuario_db 

DB_PASSWORD=contraseña_db

SERVER=servidor_db

DATABASE=nombre_db

# API CoinMarketCap
COINMARKETCAP_API_KEY=tu_api_key

## Estructura DB 

**Tabla: crypto_moneda**

| Columna  | Tipo de Dato | Clave | Descripción                      |
| -------- | ------------ | ----- | -------------------------------- |
| `id`     | INT          | PK    | Identificador único de la cripto |
| `name`   | VARCHAR(100) |       | Nombre de la criptomoneda        |
| `symbol` | VARCHAR(20)  |       | Símbolo (por ejemplo, BTC, ETH)  |
| `logo`   | VARCHAR(255) |       | URL del logo de la criptomoneda  |


**Tabla: historial_precio**

| Columna              | Tipo de Dato  | Clave        | Descripción                                          |
| -------------------- | ------------- | ------------ | ---------------------------------------------------- |
| `id`                 | INT           | PK, IDENTITY | Identificador único del historial (auto-incremental) |
| `crypto_id`          | INT           | FK           | Relación con `crypto_moneda.id`                      |
| `price`              | DECIMAL(18,8) |              | Precio de la criptomoneda en ese momento             |
| `date`               | DATE          |              | Fecha del registro                                   |
| `percent_change_24h` | DECIMAL(10,6) |              | Cambio porcentual en 24 horas                        |


