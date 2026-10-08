/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Aplicación Central &rys Bank
 * Arquitectura de Programación Orientada a Objetos (POO)
 */

import React, { useState, useEffect } from 'react';
import { bancoCentral, Banco } from './models/Banco';
import { Cliente } from './models/Cliente';
import { Cuenta } from './models/Cuenta';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { TransaccionesPanel } from './components/TransaccionesPanel';
import { NotificationsView } from './components/NotificationsView';
import { PerfilSeguridad } from './components/PerfilSeguridad';
import { AdminUsuariosCRUD } from './components/AdminUsuariosCRUD';
import { ModalConsignar } from './components/ModalConsignar';
import { ModalRetirar } from './components/ModalRetirar';
import { ModalTransferir } from './components/ModalTransferir';
import { ModalCompraTarjeta } from './components/ModalCompraTarjeta';
import { ModalPagarTarjeta } from './components/ModalPagarTarjeta';
import { PooInspectorModal } from './components/PooInspectorModal';
import { UmlDiagramModal } from './components/UmlDiagramModal';
import { ToastFeedback, ToastMessage } from './components/ToastFeedback';

export default function App() {
  const [banco] = useState<Banco>(bancoCentral);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [clienteActual, setClienteActual] = useState<Cliente | null>(null);

  // Estados de modales
  const [modalConsignarOpen, setModalConsignarOpen] = useState(false);
  const [modalRetirarOpen, setModalRetirarOpen] = useState(false);
  const [modalTransferirOpen, setModalTransferirOpen] = useState(false);
  const [modalCompraOpen, setModalCompraOpen] = useState(false);
  const [modalPagarTarjetaOpen, setModalPagarTarjetaOpen] = useState(false);
  const [modalAuditOpen, setModalAuditOpen] = useState(false);
  const [modalUmlOpen, setModalUmlOpen] = useState(false);

  const [cuentaSeleccionadaModal, setCuentaSeleccionadaModal] = useState<Cuenta | undefined>(undefined);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [, setTick] = useState(0);

  // Refrescar estado para que los cambios en las instancias POO se reflejen en la UI
  const forzarActualizacionUI = () => {
    banco.guardarEnStorage();
    setTick(t => t + 1);
  };

  const showToast = (tipo: 'exito' | 'error' | 'advertencia' | 'info', texto: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, tipo, texto }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Login automático o selección de cliente demo
  const handleQuickDemoLogin = (username: string = 'david') => {
    const res = banco.autenticar(username, 'password123');
    if (res.exito && res.cliente) {
      setClienteActual(res.cliente);
      setCurrentView('dashboard');
      showToast('exito', `Sesión iniciada con éxito como ${res.cliente.nombreCompleto}`);
    } else {
      // Si está bloqueado, lo desbloqueamos para facilitar la prueba
      const user = banco.obtenerClientePorUsername(username);
      if (user) {
        user.desbloquear();
        const retry = banco.autenticar(username, 'password123');
        if (retry.cliente) {
          setClienteActual(retry.cliente);
          setCurrentView('dashboard');
          showToast('exito', `Cuenta desbloqueada e iniciada como ${retry.cliente.nombreCompleto}`);
        }
      }
    }
  };

  const handleLogout = () => {
    banco.cerrarSesion();
    setClienteActual(null);
    setCurrentView('landing');
    showToast('info', 'Has cerrado tu sesión bancaria de manera segura.');
  };

  const handleSelectClienteCRUD = (c: Cliente) => {
    banco.setClienteAutenticado(c);
    setClienteActual(c);
    setCurrentView('dashboard');
    showToast('info', `Cambiado a la cuenta de ${c.nombreCompleto} (@${c.username})`);
  };

  return (
    <div className="min-h-screen bg-[#050911] text-slate-100 flex flex-col font-sans">
      {/* Barra de Navegación Neobanco */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        clienteActual={clienteActual}
        onLogout={handleLogout}
        onOpenPooAudit={() => setModalAuditOpen(true)}
        onOpenUmlModal={() => setModalUmlOpen(true)}
        onQuickDemoLogin={() => handleQuickDemoLogin('david')}
      />

      {/* Contenido Principal según la vista activa */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onOpenRegister={() => setCurrentView('register')}
            onOpenLogin={() => setCurrentView('login')}
            onOpenAudit={() => setModalAuditOpen(true)}
            onQuickDemo={() => handleQuickDemoLogin('david')}
          />
        )}

        {currentView === 'login' && (
          <LoginForm
            banco={banco}
            onLoginSuccess={() => {
              setClienteActual(banco.clienteAutenticado);
              setCurrentView('dashboard');
              showToast('exito', `¡Bienvenido, ${banco.clienteAutenticado?.nombreCompleto}!`);
            }}
            onNavigateRegister={() => setCurrentView('register')}
            onQuickDemo={handleQuickDemoLogin}
          />
        )}

        {currentView === 'register' && (
          <RegisterForm
            banco={banco}
            onRegisterSuccess={() => {
              setClienteActual(banco.clienteAutenticado);
              setCurrentView('dashboard');
              showToast('exito', '¡Cuenta y productos creados exitosamente!');
            }}
            onNavigateLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'dashboard' && clienteActual && (
          <TransaccionesPanel
            cliente={clienteActual}
            onOpenConsignar={(cta) => {
              setCuentaSeleccionadaModal(cta);
              setModalConsignarOpen(true);
            }}
            onOpenRetirar={(cta) => {
              setCuentaSeleccionadaModal(cta);
              setModalRetirarOpen(true);
            }}
            onOpenTransferir={() => setModalTransferirOpen(true)}
            onOpenCompraTarjeta={() => setModalCompraOpen(true)}
            onOpenPagarTarjeta={() => setModalPagarTarjetaOpen(true)}
            onOpenNotificaciones={() => setCurrentView('notificaciones')}
            onOpenPerfil={() => setCurrentView('perfil')}
            onOpenAudit={() => setModalAuditOpen(true)}
          />
        )}

        {currentView === 'notificaciones' && clienteActual && (
          <NotificationsView
            cliente={clienteActual}
            onBack={() => setCurrentView('dashboard')}
            onUpdate={forzarActualizacionUI}
          />
        )}

        {currentView === 'perfil' && clienteActual && (
          <PerfilSeguridad
            cliente={clienteActual}
            banco={banco}
            onSuccess={(msj) => {
              showToast('exito', msj);
              forzarActualizacionUI();
            }}
          />
        )}

        {currentView === 'crud' && (
          <AdminUsuariosCRUD
            banco={banco}
            clienteActual={clienteActual}
            onSelectCliente={handleSelectClienteCRUD}
            onRefresh={forzarActualizacionUI}
            onSuccess={(msj) => {
              showToast('exito', msj);
              forzarActualizacionUI();
            }}
          />
        )}
      </main>

      {/* Footer corporativo */}
      <Footer
        onOpenSimulator={() => {
          if (currentView !== 'landing') setCurrentView('landing');
          setTimeout(() => {
            document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenAudit={() => setModalAuditOpen(true)}
      />

      {/* MODALES TRANSACCIONALES */}
      {clienteActual && (
        <>
          <ModalConsignar
            isOpen={modalConsignarOpen}
            onClose={() => setModalConsignarOpen(false)}
            cliente={clienteActual}
            cuentaSeleccionadaInicial={cuentaSeleccionadaModal}
            onSuccess={(msj) => {
              showToast('exito', msj);
              forzarActualizacionUI();
            }}
          />

          <ModalRetirar
            isOpen={modalRetirarOpen}
            onClose={() => setModalRetirarOpen(false)}
            cliente={clienteActual}
            cuentaSeleccionadaInicial={cuentaSeleccionadaModal}
            onSuccess={(msj) => {
              showToast('exito', msj);
              forzarActualizacionUI();
            }}
          />

          <ModalTransferir
            isOpen={modalTransferirOpen}
            onClose={() => setModalTransferirOpen(false)}
            cliente={clienteActual}
            banco={banco}
            onSuccess={(msj) => {
              showToast('exito', msj);
              forzarActualizacionUI();
            }}
          />

          <ModalCompraTarjeta
            isOpen={modalCompraOpen}
            onClose={() => setModalCompraOpen(false)}
            cliente={clienteActual}
            onSuccess={(msj) => {
              showToast('exito', msj);
              forzarActualizacionUI();
            }}
          />

          <ModalPagarTarjeta
            isOpen={modalPagarTarjetaOpen}
            onClose={() => setModalPagarTarjetaOpen(false)}
            cliente={clienteActual}
            onSuccess={(msj) => {
              showToast('exito', msj);
              forzarActualizacionUI();
            }}
          />
        </>
      )}

      {/* Modal Inspector de Arquitectura POO (Para el Docente y Evaluadores) */}
      <PooInspectorModal
        isOpen={modalAuditOpen}
        onClose={() => setModalAuditOpen(false)}
      />

      {/* Modal Diagrama UML y Código JavaScript para Visual Studio Code */}
      <UmlDiagramModal
        isOpen={modalUmlOpen}
        onClose={() => setModalUmlOpen(false)}
      />

      {/* Feedback Toasts y Confetti */}
      <ToastFeedback
        toasts={toasts}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}
