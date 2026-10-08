# Proyecto Bancario &rys Bank - Programación Orientada a Objetos en JavaScript

Este módulo contiene la implementación en **JavaScript puro (ES6 Modules)** basada 100% en el **Diagrama de Clases UML** entregado:

```
                          +------------------------+
                          |        Cliente         |
                          +------------------------+
                                      | 1
                                      | posee
                                      v *
                          +------------------------+
                          |         Cuenta         |
                          +------------------------+
                             ^        ^        ^
                      hereda | hereda | hereda | registra
             +---------------+   +----+        +-----+
             |                   |                   |
+-------------------+   +--------------------+  +-------------------+  +-------------------+
|   CuentaAhorros   |   |   CuentaCorriente  |  |   TarjetaCredito  |  |    Movimiento     |
+-------------------+   +--------------------+  +-------------------+  +-------------------+
```

---

## 🚀 ¿Cómo trabajar con este código en Visual Studio Code?

### Paso 1: Abrir la carpeta en Visual Studio Code
Abre la carpeta del proyecto en tu VS Code (`File > Open Folder...`).

### Paso 2: Abrir la terminal integrada
Presiona:
- **Windows / Linux**: `Ctrl + \`` o ve al menú superior: `Terminal > New Terminal`.
- **Mac**: `Cmd + \``

### Paso 3: Ejecutar la demostración de consola
Ejecuta el script principal con Node.js:

```bash
node src/poo-javascript/main.js
```

Verás en la consola de VS Code la ejecución paso a paso de:
1. **Abstracción**: Creación de Cliente, Cuenta y Movimientos.
2. **Encapsulamiento**: Campos privados `#` de JavaScript que previenen alteraciones no autorizadas.
3. **Herencia**: Subclases `CuentaAhorros`, `CuentaCorriente` y `TarjetaCredito` heredando de `Cuenta`.
4. **Polimorfismo**: El método `retirar(monto)` ejecutándose de forma diferente en cada tipo de cuenta:
   - **Ahorros**: Liquidando 1.5% mensual antes de retirar y verificando saldo disponible.
   - **Corriente**: Permitiendo sobregiro de hasta el 20% sobre el saldo base.
   - **Tarjeta de Crédito**: Calculando cuota mensual según la fórmula financiera y plazos de tasas (0%, 1.9%, 2.3%).
5. **Seguridad**: Contador visible y bloqueo tras 3 intentos fallidos de inicio de sesión.
6. **Transferencias**: Entre cuentas y validación de restricción de mismo producto.

---

## 📂 Archivos del Modelo POO

| Archivo | Clase | Responsabilidad |
|---|---|---|
| `Movimiento.js` | `Movimiento` | Registra fechaHora, tipo, valor y `obtenerDetalle()`. |
| `Cuenta.js` | `Cuenta` | Clase base abstracta con `#numeroCuenta`, `#saldo`, `consignar()`, `retirar()`, `transferir()`. |
| `CuentaAhorros.js` | `CuentaAhorros` | Subclase con `- tasaInteresMensual = 0.015`, `retirar()` y `aplicarInteres()`. |
| `CuentaCorriente.js` | `CuentaCorriente` | Subclase con `- porcentajeSobregiro = 0.20`, retiro con margen +20%. |
| `TarjetaCredito.js` | `TarjetaCredito` | Subclase con `- cupoCredito`, `- deudaActual`, `financiarCompra()` y `calcularCuotaMensual()`. |
| `Cliente.js` | `Cliente` | Entidad con `#password`, lista de cuentas, `iniciarSesion()`, `registrar()`, `editarPerfil()`. |
| `main.js` | *Script* | Pruebas integradas ejecutables para entrega académica ante el docente. |
