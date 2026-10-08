/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Banco - Orquestador Central del Sistema Bancario &rys Banco
 * Administra Clientes, Autenticación, Operaciones Globales y CRUD
 */

import { Cliente } from './Cliente';
import { Cuenta, OperacionResultado } from './Cuenta';
import { CuentaAhorros } from './CuentaAhorros';
import { CuentaCorriente } from './CuentaCorriente';
import { TarjetaCredito } from './TarjetaCredito';
import { Transaccion } from './Transaccion';

export class Banco {
  static readonly STORAGE_KEY = 'rys_banco_colombia_v2';
  #clientes: Map<string, Cliente> = new Map(); // Key: username
  #clienteAutenticado: Cliente | null = null;

  constructor() {
    this.#inicializarDatos();
  }

  // Inicialización de clientes semilla con persistencia en localStorage
  #inicializarDatos(): void {
    const guardado = localStorage.getItem(Banco.STORAGE_KEY);
    if (guardado) {
      try {
        const datos = JSON.parse(guardado);
        if (Array.isArray(datos) && datos.length > 0) {
          for (const raw of datos) {
            const cliente = this.#reconstruirCliente(raw);
            this.#clientes.set(cliente.username, cliente);
          }
          return;
        }
      } catch (e) {
        console.warn("Error cargando base de datos guardada, inicializando semillas predeterminadas.", e);
      }
    }

    this.#crearSemillasPredeterminadas();
    this.guardarEnStorage();
  }

  #crearSemillasPredeterminadas(): void {
    // 1. Cliente Principal: David Morales (Fiel a Image 1.jpeg)
    const david = new Cliente({
      identificacion: '1098765432',
      nombreCompleto: 'David Morales E.',
      celular: '+57 300 987 6543',
      username: 'david',
      password: 'password123',
      email: 'david.morales@rysbanco.com.co',
      tier: 'Banca Preferencial • Nivel Diamante',
    });

    // Cuentas de David en Pesos Colombianos (COP)
    const ahorrosDavid = new CuentaAhorros('AHO-7492-81', 11650000, david.id, david.nombreCompleto);
    const corrienteDavid = new CuentaCorriente('COR-3381-09', 3200000, david.id, david.nombreCompleto);
    const tarjetaDavid = new TarjetaCredito('TC-9284-77', 15000000, david.id, david.nombreCompleto, '4532 •••• •••• 9284', '11/29');

    // Movimientos iniciales de David en COP
    const ahora = new Date();
    const ayer = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
    const hace2Dias = new Date(ahora.getTime() - 48 * 60 * 60 * 1000);
    const hace3Dias = new Date(ahora.getTime() - 72 * 60 * 60 * 1000);

    // Movimientos en Corriente
    corrienteDavid.cargarMovimientos([
      new Transaccion({
        tipo: 'CONSIGNACION',
        monto: 3200000,
        saldoPosterior: 3200000,
        descripcion: 'Acreditación Nómina Mensual',
        categoria: 'Ingreso',
        fecha: ayer,
        estado: 'Acreditado',
      }),
      new Transaccion({
        tipo: 'RETIRO',
        monto: 85000,
        saldoPosterior: 3115000,
        descripcion: 'Carlos Méndez (Transferencia enviada)',
        categoria: 'Gasto',
        fecha: new Date(ahora.getTime() - 3 * 60 * 60 * 1000),
        estado: 'Completada',
      }),
    ]);

    // Movimientos en Tarjeta
    tarjetaDavid.cargarMovimientos([
      new Transaccion({
        tipo: 'COMPRA_CREDITO',
        monto: 450000,
        saldoPosterior: 14550000,
        descripcion: 'Apple Store Online (Suscripción iCloud & Hardware)',
        categoria: 'Crédito',
        fecha: hace2Dias,
        detalles: { cuotas: 1, tasaInteres: 0, cuotaMensual: 450000, comercio: 'Apple Store Online' },
      }),
      new Transaccion({
        tipo: 'COMPRA_CREDITO',
        monto: 48000,
        saldoPosterior: 14502000,
        descripcion: 'Amazon Prime Suscripción Digital',
        categoria: 'Crédito',
        fecha: hace3Dias,
        detalles: { cuotas: 1, tasaInteres: 0, cuotaMensual: 48000, comercio: 'Amazon Prime' },
      }),
    ]);

    david.agregarCuenta(ahorrosDavid);
    david.agregarCuenta(corrienteDavid);
    david.agregarCuenta(tarjetaDavid);

    // Notificaciones iniciales de David en COP
    david.agregarNotificacion({
      titulo: 'Transferencia recibida',
      mensaje: 'Mariana Gómez envió fondos a tu cuenta principal.',
      monto: 1250000,
      tipo: 'TRANSACCION',
      categoriaTag: 'Transferencia recibida',
      estadoBadge: 'Completada',
      fecha: new Date(ahora.getTime() - 15 * 60 * 1000),
    });
    david.agregarNotificacion({
      titulo: 'Inicio de sesión detectado',
      mensaje: 'Nuevo dispositivo autenticado en Bogotá, CO. Canal seguro validado.',
      tipo: 'SEGURIDAD',
      categoriaTag: 'Seguridad',
      estadoBadge: 'Verificado',
      fecha: new Date(ahora.getTime() - 60 * 60 * 1000),
    });
    david.agregarNotificacion({
      titulo: 'Compra con tarjeta',
      mensaje: 'Starbucks Coffee • Tarjeta de Crédito (*9284)',
      monto: 28500,
      tipo: 'TRANSACCION',
      categoriaTag: 'Gastos diarios',
      estadoBadge: 'Aprobada',
      fecha: new Date(ahora.getTime() - 180 * 60 * 1000),
    });
    david.agregarNotificacion({
      titulo: 'Depósito de nómina acreditado',
      mensaje: 'Transferencia procesada por nómina empresarial.',
      monto: 3200000,
      tipo: 'TRANSACCION',
      categoriaTag: 'Nómina',
      estadoBadge: 'Acreditado',
      fecha: ayer,
    });
    david.agregarNotificacion({
      titulo: 'Rendimiento mensual acreditado',
      mensaje: 'Premio mensual por ahorro programado sin comisiones.',
      monto: 45000,
      tipo: 'RECOMPENSA',
      categoriaTag: 'Rendimiento Ahorro',
      estadoBadge: 'Acreditado',
      fecha: hace2Dias,
    });
    david.agregarNotificacion({
      titulo: 'Cupo transaccional actualizado',
      mensaje: 'Tu capacidad operativa de transferencias inmediatas se elevó a $50.000.000 COP.',
      tipo: 'SISTEMA',
      categoriaTag: 'Gestión de cuenta',
      estadoBadge: 'Activo',
      fecha: hace3Dias,
    });

    this.#clientes.set(david.username, david);

    // 2. Cliente Valeria M. Morales
    const valeria = new Cliente({
      identificacion: '5298144210',
      nombreCompleto: 'Valeria M. Morales',
      celular: '+57 312 445 9821',
      username: 'valeria',
      password: 'password123',
      email: 'valeria.morales@rysbanco.com.co',
      tier: 'Banca Preferencial',
    });
    const ahorrosValeria = new CuentaAhorros('AHO-9941-12', 14285000, valeria.id, valeria.nombreCompleto);
    const corrienteValeria = new CuentaCorriente('COR-5510-44', 5500000, valeria.id, valeria.nombreCompleto);
    const tarjetaValeria = new TarjetaCredito('TC-9284-01', 20000000, valeria.id, valeria.nombreCompleto, '•••• •••• •••• 9284', '11/29');
    valeria.agregarCuenta(ahorrosValeria);
    valeria.agregarCuenta(corrienteValeria);
    valeria.agregarCuenta(tarjetaValeria);
    this.#clientes.set(valeria.username, valeria);

    // 3. Cliente Mariana Gómez
    const mariana = new Cliente({
      identificacion: '1014289301',
      nombreCompleto: 'Mariana Gómez S.',
      celular: '+57 318 664 1209',
      username: 'mariana',
      password: 'password123',
      email: 'mariana.gomez@rysbanco.com.co',
    });
    const ahorrosMariana = new CuentaAhorros('AHO-1120-73', 8400000, mariana.id, mariana.nombreCompleto);
    const corrienteMariana = new CuentaCorriente('COR-8812-90', 2150000, mariana.id, mariana.nombreCompleto);
    mariana.agregarCuenta(ahorrosMariana);
    mariana.agregarCuenta(corrienteMariana);
    this.#clientes.set(mariana.username, mariana);

    // 4. Cliente Carlos Méndez
    const carlos = new Cliente({
      identificacion: '8019920192',
      nombreCompleto: 'Carlos Méndez Ruiz',
      celular: '+57 320 881 3344',
      username: 'carlos',
      password: 'password123',
      email: 'carlos.mendez@rysbanco.com.co',
    });
    const corrienteCarlos = new CuentaCorriente('COR-4419-58', 1940000, carlos.id, carlos.nombreCompleto);
    carlos.agregarCuenta(corrienteCarlos);
    this.#clientes.set(carlos.username, carlos);

    // 5. Cliente Sofía M.
    const sofia = new Cliente({
      identificacion: '1032994012',
      nombreCompleto: 'Sofía M. Restrepo',
      celular: '+57 315 771 9042',
      username: 'sofia',
      password: 'password123',
      email: 'sofia.restrepo@rysbanco.com.co',
    });
    const ahorrosSofia = new CuentaAhorros('AHO-6629-18', 4920000, sofia.id, sofia.nombreCompleto);
    sofia.agregarCuenta(ahorrosSofia);
    this.#clientes.set(sofia.username, sofia);
  }

  // --- RECONSTRUCCIÓN DESDE SERIALIZACIÓN ---
  #reconstruirCliente(raw: any): Cliente {
    const c = new Cliente({
      id: raw.id,
      identificacion: raw.identificacion,
      nombreCompleto: raw.nombreCompleto,
      celular: raw.celular,
      username: raw.username,
      password: raw.password,
      email: raw.email,
      tier: raw.tier,
      fechaRegistro: new Date(raw.fechaRegistro),
    });

    if (raw.bloqueado) {
      // Validamos intentos para restaurar el estado bloqueado
      for (let i = 0; i < 3; i++) {
        c.validarPassword('clave_invalida_trigger_bloqueo');
      }
    }

    if (Array.isArray(raw.cuentas)) {
      for (const rawCuenta of raw.cuentas) {
        let cuentaInstancia: Cuenta;
        if (rawCuenta.tipo === 'AHORROS') {
          cuentaInstancia = new CuentaAhorros(rawCuenta.numeroCuenta, rawCuenta.saldo, c.id, c.nombreCompleto);
        } else if (rawCuenta.tipo === 'CORRIENTE') {
          cuentaInstancia = new CuentaCorriente(rawCuenta.numeroCuenta, rawCuenta.saldo, c.id, c.nombreCompleto);
        } else {
          cuentaInstancia = new TarjetaCredito(
            rawCuenta.numeroCuenta,
            rawCuenta.cupoTotal || 10000,
            c.id,
            c.nombreCompleto,
            rawCuenta.numeroTarjetaVisible,
            rawCuenta.fechaVencimiento
          );
        }

        if (Array.isArray(rawCuenta.movimientos)) {
          cuentaInstancia.cargarMovimientos(rawCuenta.movimientos.map((m: any) => Transaccion.fromJSON(m)));
        }
        c.agregarCuenta(cuentaInstancia);
      }
    }

    if (Array.isArray(raw.notificaciones)) {
      for (const n of raw.notificaciones) {
        c.agregarNotificacion({
          id: n.id,
          titulo: n.titulo,
          mensaje: n.mensaje,
          monto: n.monto,
          tipo: n.tipo,
          categoriaTag: n.categoriaTag,
          estadoBadge: n.estadoBadge,
          leida: n.leida,
          fecha: new Date(n.fecha),
          meta: n.meta,
        });
      }
    }

    return c;
  }

  // --- PERSISTENCIA LOCAL ---
  guardarEnStorage(): void {
    try {
      const serializable = Array.from(this.#clientes.values()).map(c => ({
        id: c.id,
        identificacion: c.identificacion,
        nombreCompleto: c.nombreCompleto,
        celular: c.celular,
        email: c.email,
        username: c.username,
        password: c.obtenerClaveParaAlmacenamiento(),
        tier: c.tier,
        bloqueado: c.bloqueado,
        fechaRegistro: c.fechaRegistro.toISOString(),
        notificaciones: c.notificaciones.map(n => ({
          ...n,
          fecha: n.fecha.toISOString(),
        })),
        cuentas: c.cuentas.map(cta => ({
          numeroCuenta: cta.numeroCuenta,
          tipo: cta.obtenerTipo(),
          saldo: cta.saldo,
          cupoTotal: cta instanceof TarjetaCredito ? cta.cupoTotal : undefined,
          numeroTarjetaVisible: cta instanceof TarjetaCredito ? cta.numeroTarjetaVisible : undefined,
          fechaVencimiento: cta instanceof TarjetaCredito ? cta.fechaVencimiento : undefined,
          movimientos: cta.consultarMovimientos().map(m => m.toJSON()),
        })),
      }));

      localStorage.setItem(Banco.STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.error("Error guardando datos en almacenamiento local", e);
    }
  }

  // --- MÓDULO 4.1: REGISTRO Y AUTENTICACIÓN ---
  autenticar(username: string, password: string): { exito: boolean; mensaje: string; cliente?: Cliente; intentosRestantes?: number; bloqueado?: boolean } {
    const userClean = username.toLowerCase().trim();
    const cliente = this.#clientes.get(userClean);

    if (!cliente) {
      return {
        exito: false,
        mensaje: "El nombre de usuario no se encuentra registrado en el sistema bancario.",
      };
    }

    if (cliente.bloqueado) {
      return {
        exito: false,
        mensaje: "Cuenta bloqueada por motivos de seguridad debido a 3 intentos fallidos consecutivos. Contacta a un administrador de &rys Banco para desbloquearla.",
        bloqueado: true,
        intentosRestantes: 0,
      };
    }

    const passwordValida = cliente.validarPassword(password);
    this.guardarEnStorage();

    if (!passwordValida) {
      const restantes = Cliente.MAX_INTENTOS_FALLIDOS - cliente.intentosFallidos;
      if (cliente.bloqueado) {
        return {
          exito: false,
          mensaje: "¡Alerta de Seguridad! Has alcanzado el límite de 3 intentos fallidos. Tu cuenta ha quedado bloqueada. Debes solicitar desbloqueo administrativo.",
          bloqueado: true,
          intentosRestantes: 0,
        };
      }
      return {
        exito: false,
        mensaje: `Contraseña incorrecta. Te quedan ${restantes} de ${Cliente.MAX_INTENTOS_FALLIDOS} intentos antes del bloqueo.`,
        intentosRestantes: restantes,
        bloqueado: false,
      };
    }

    this.#clienteAutenticado = cliente;
    cliente.agregarNotificacion({
      titulo: 'Inicio de sesión exitoso',
      mensaje: `Bienvenido a la sucursal virtual &rys Banco. Sesión iniciada a las ${new Date().toLocaleTimeString('es-CO')}.`,
      tipo: 'SEGURIDAD',
      categoriaTag: 'Acceso seguro',
      estadoBadge: 'Verificado',
    });
    this.guardarEnStorage();

    return {
      exito: true,
      mensaje: `Autenticación exitosa. ¡Bienvenido, ${cliente.nombreCompleto}!`,
      cliente,
    };
  }

  cerrarSesion(): void {
    this.#clienteAutenticado = null;
  }

  get clienteAutenticado(): Cliente | null {
    return this.#clienteAutenticado;
  }

  setClienteAutenticado(cliente: Cliente | null): void {
    this.#clienteAutenticado = cliente;
  }

  // Formulario de Registro de Nuevos Clientes
  registrarCliente(datos: {
    identificacion: string;
    nombreCompleto: string;
    celular: string;
    username: string;
    password: string;
    confirmacionPassword: string;
    email?: string;
    saldoInicialAhorros?: number;
    saldoInicialCorriente?: number;
    cupoTarjetaCredito?: number;
  }): { exito: boolean; mensaje: string; cliente?: Cliente } {
    // Validaciones
    if (!datos.identificacion || !datos.nombreCompleto || !datos.celular || !datos.username || !datos.password) {
      return { exito: false, mensaje: "Todos los campos del formulario son obligatorios." };
    }

    if (datos.password !== datos.confirmacionPassword) {
      return { exito: false, mensaje: "La contraseña y su confirmación no coinciden." };
    }

    if (datos.password.length < 6) {
      return { exito: false, mensaje: "La contraseña debe tener una longitud mínima de 6 caracteres." };
    }

    const usernameLimpio = datos.username.toLowerCase().trim();

    // Verificación de unicidad de username
    if (this.#clientes.has(usernameLimpio)) {
      return { exito: false, mensaje: `El nombre de usuario "${usernameLimpio}" ya se encuentra en uso. Por favor elija otro.` };
    }

    // Verificación de unicidad de identificación
    const existeId = Array.from(this.#clientes.values()).some(c => c.identificacion === datos.identificacion.trim());
    if (existeId) {
      return { exito: false, mensaje: `Ya existe un cliente registrado con el documento ${datos.identificacion}.` };
    }

    const nuevoCliente = new Cliente({
      identificacion: datos.identificacion,
      nombreCompleto: datos.nombreCompleto,
      celular: datos.celular,
      username: usernameLimpio,
      password: datos.password,
      email: datos.email,
    });

    // Creación automática de sus tres productos bancarios
    const rndAho = Math.floor(1000 + Math.random() * 9000);
    const rndCor = Math.floor(1000 + Math.random() * 9000);
    const rndTC = Math.floor(1000 + Math.random() * 9000);

    const ctaAhorros = new CuentaAhorros(
      `AHO-${rndAho}-${Math.floor(10 + Math.random() * 89)}`,
      datos.saldoInicialAhorros !== undefined ? datos.saldoInicialAhorros : 1500000,
      nuevoCliente.id,
      nuevoCliente.nombreCompleto
    );

    const ctaCorriente = new CuentaCorriente(
      `COR-${rndCor}-${Math.floor(10 + Math.random() * 89)}`,
      datos.saldoInicialCorriente !== undefined ? datos.saldoInicialCorriente : 800000,
      nuevoCliente.id,
      nuevoCliente.nombreCompleto
    );

    const tc = new TarjetaCredito(
      `TC-${rndTC}-${Math.floor(10 + Math.random() * 89)}`,
      datos.cupoTarjetaCredito !== undefined ? datos.cupoTarjetaCredito : 5000000,
      nuevoCliente.id,
      nuevoCliente.nombreCompleto,
      `4532 •••• •••• ${rndTC}`,
      '12/30'
    );

    nuevoCliente.agregarCuenta(ctaAhorros);
    nuevoCliente.agregarCuenta(ctaCorriente);
    nuevoCliente.agregarCuenta(tc);

    nuevoCliente.agregarNotificacion({
      titulo: '¡Bienvenido a &rys Banco!',
      mensaje: 'Tus productos (Cuenta de Ahorros, Cuenta Corriente y Tarjeta de Crédito) han sido activados con éxito en pesos colombianos.',
      tipo: 'SISTEMA',
      categoriaTag: 'Apertura',
      estadoBadge: 'Activo',
    });

    this.#clientes.set(usernameLimpio, nuevoCliente);
    this.guardarEnStorage();

    return {
      exito: true,
      mensaje: `Cliente registrado exitosamente. Se asignaron las cuentas Ahorros (${ctaAhorros.numeroCuenta}), Corriente (${ctaCorriente.numeroCuenta}) y Tarjeta de Crédito (${tc.numeroCuenta}).`,
      cliente: nuevoCliente,
    };
  }

  // --- CRUD DE USUARIOS (Módulo 4.1) ---
  obtenerTodosLosClientes(): Cliente[] {
    return Array.from(this.#clientes.values());
  }

  obtenerClientePorUsername(username: string): Cliente | undefined {
    return this.#clientes.get(username.toLowerCase().trim());
  }

  obtenerClientePorId(id: string): Cliente | undefined {
    return Array.from(this.#clientes.values()).find(c => c.id === id);
  }

  actualizarClienteAdmin(id: string, datos: {
    nombreCompleto?: string;
    celular?: string;
    identificacion?: string;
    email?: string;
    desbloquear?: boolean;
    nuevaPassword?: string;
  }): { exito: boolean; mensaje: string } {
    const cliente = this.obtenerClientePorId(id);
    if (!cliente) {
      return { exito: false, mensaje: "Cliente no encontrado." };
    }

    if (datos.nombreCompleto || datos.celular || datos.identificacion || datos.email) {
      cliente.actualizarPerfil({
        nombreCompleto: datos.nombreCompleto,
        celular: datos.celular,
        identificacion: datos.identificacion,
        email: datos.email,
      });
    }

    if (datos.desbloquear) {
      cliente.desbloquear();
    }

    if (datos.nuevaPassword && datos.nuevaPassword.length >= 6) {
      cliente.establecerPasswordAdmin(datos.nuevaPassword);
    }

    this.guardarEnStorage();
    return { exito: true, mensaje: `Cliente ${cliente.nombreCompleto} actualizado correctamente.` };
  }

  eliminarCliente(id: string): { exito: boolean; mensaje: string } {
    const cliente = this.obtenerClientePorId(id);
    if (!cliente) {
      return { exito: false, mensaje: "El cliente a eliminar no existe." };
    }

    if (this.#clienteAutenticado && this.#clienteAutenticado.id === id) {
      return { exito: false, mensaje: "No puedes eliminar al cliente que tiene la sesión activa actualmente." };
    }

    this.#clientes.delete(cliente.username);
    this.guardarEnStorage();
    return { exito: true, mensaje: `Cliente ${cliente.nombreCompleto} (${cliente.username}) eliminado exitosamente del sistema bancario.` };
  }

  // Búsqueda global de cuenta en todos los clientes
  buscarCuentaGlobal(numeroCuenta: string): { cuenta: Cuenta; titular: Cliente } | null {
    const num = numeroCuenta.trim().toUpperCase();
    for (const c of this.#clientes.values()) {
      const match = c.cuentas.find(cta => cta.numeroCuenta.toUpperCase() === num);
      if (match) {
        return { cuenta: match, titular: c };
      }
    }
    return null;
  }

  // --- TRANSFERENCIAS HACIA OTROS USUARIOS ---
  transferirAOtroCliente(
    clienteOrigen: Cliente,
    numeroCuentaOrigen: string,
    numeroCuentaDestino: string,
    monto: number,
    descripcion: string = 'Transferencia interbancaria'
  ): OperacionResultado {
    const origen = clienteOrigen.obtenerCuenta(numeroCuentaOrigen);
    if (!origen) {
      return {
        exito: false,
        mensaje: "La cuenta de origen no pertenece al cliente autenticado.",
        saldoAnterior: 0,
        saldoNuevo: 0,
      };
    }

    if (numeroCuentaOrigen.toUpperCase() === numeroCuentaDestino.toUpperCase()) {
      return {
        exito: false,
        mensaje: "Restricción bancaria: No se permiten transferencias a la misma cuenta de origen.",
        saldoAnterior: origen.saldo,
        saldoNuevo: origen.saldo,
      };
    }

    const destinoEncontrado = this.buscarCuentaGlobal(numeroCuentaDestino);
    if (!destinoEncontrado) {
      return {
        exito: false,
        mensaje: `La cuenta destino "${numeroCuentaDestino}" no existe en el sistema de &rys Banco.`,
        saldoAnterior: origen.saldo,
        saldoNuevo: origen.saldo,
      };
    }

    const { cuenta: cuentaDestino, titular: titularDestino } = destinoEncontrado;

    // Validación: si es el mismo cliente, delegamos al método interno
    if (titularDestino.id === clienteOrigen.id) {
      return clienteOrigen.transferirEntreProductos(numeroCuentaOrigen, numeroCuentaDestino, monto, descripcion);
    }

    if (monto <= 0) {
      return {
        exito: false,
        mensaje: "El monto a transferir debe ser mayor a cero.",
        saldoAnterior: origen.saldo,
        saldoNuevo: origen.saldo,
      };
    }

    // Efectuar débito usando el método polimórfico retirar()
    const debitoResultado = origen.retirar(
      monto,
      `Transferencia enviada a ${titularDestino.nombreCompleto} (${cuentaDestino.numeroCuenta})`
    );

    if (!debitoResultado.exito) {
      return debitoResultado;
    }

    // Efectuar abono en el destinatario
    if (cuentaDestino instanceof TarjetaCredito) {
      cuentaDestino.pagarTarjeta(monto, `Pago recibido de ${clienteOrigen.nombreCompleto}`);
    } else {
      cuentaDestino.consignar(monto, `Transferencia recibida de ${clienteOrigen.nombreCompleto} (${origen.numeroCuenta})`);
    }

    // Notificaciones cruzadas en tiempo real
    clienteOrigen.agregarNotificacion({
      titulo: 'Transferencia enviada exitosamente',
      mensaje: `Enviaste $${monto.toLocaleString('es-CO')} USD a ${titularDestino.nombreCompleto} (${cuentaDestino.numeroCuenta}).`,
      monto,
      tipo: 'TRANSACCION',
      categoriaTag: 'Transferencia enviada',
      estadoBadge: 'Completada',
    });

    titularDestino.agregarNotificacion({
      titulo: 'Transferencia recibida',
      mensaje: `${clienteOrigen.nombreCompleto} envió fondos a tu cuenta ${cuentaDestino.obtenerNombreComercial()}.`,
      monto,
      tipo: 'TRANSACCION',
      categoriaTag: 'Transferencia recibida',
      estadoBadge: 'Completada',
    });

    this.guardarEnStorage();

    return {
      exito: true,
      mensaje: `Transferencia enviada exitosamente por $${monto.toLocaleString('es-CO')} USD a ${titularDestino.nombreCompleto}. Saldo restante en ${origen.obtenerNombreComercial()}: $${origen.saldo.toLocaleString('es-CO')} USD.`,
      saldoAnterior: debitoResultado.saldoAnterior,
      saldoNuevo: origen.saldo,
      detalles: {
        origen: origen.numeroCuenta,
        destino: cuentaDestino.numeroCuenta,
        destinatario: titularDestino.nombreCompleto,
        monto,
      },
    };
  }

  // Reiniciar a datos de fábrica
  restablecerDatosFabrica(): void {
    localStorage.removeItem(Banco.STORAGE_KEY);
    this.#clientes.clear();
    this.#crearSemillasPredeterminadas();
    this.guardarEnStorage();
  }
}

// Instancia singleton para compartir en la aplicación
export const bancoCentral = new Banco();
