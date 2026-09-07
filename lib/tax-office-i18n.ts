import {
  holaTaxAbout,
  holaTaxServiceLabel,
  holaTaxTagline,
} from "@/lib/hola-tax-i18n";
import { HOLA_TAX_SLUG } from "@/lib/client-themes";
import {
  PA_FINANCIAL_SLUG,
  paFinancialAbout,
  paFinancialServiceLabel,
  paFinancialTagline,
} from "@/lib/pa-financial-i18n";
import { TAX_LABEL_COPY, type TaxDocLabel } from "@/lib/tax-office";
import type { Locale } from "@/lib/types";

const servicesEs: Record<string, string> = {
  "Personal tax preparation": "Preparación de impuestos personales",
  "Small-business tax preparation": "Preparación de impuestos para negocios pequeños",
  "Arizona LLC formation": "Formación de LLC en Arizona",
  "ITIN applications": "Solicitudes de ITIN",
  Bookkeeping: "Contabilidad",
  "Year-round tax support": "Apoyo con impuestos todo el año",
  "Income Tax Preparation": "Preparación de impuestos sobre la renta",
  "ITIN Number Processing and Renewal":
    "Trámite y renovación de número ITIN",
  "Business Registration": "Registro de negocios",
  "Personal Income Taxes": "Impuestos personales sobre la renta",
  "Business Income Taxes": "Impuestos de negocios sobre la renta",
  "LLC Formation": "Formación de LLC",
};

export const taxOfficeCopy = {
  en: {
    langNav: "Language",
    clientLogin: "Client login / Upload documents",
    call: (phone: string) => `Call ${phone}`,
    ctaMessage: "Send a message",
    portalHint:
      "A private folder for your W-2, 1099, and ID. Not tax-prep software.",
    servicesTitle: "How we help",
    contactTitle: "Contact",
    formName: "Name",
    formEmail: "Email",
    formPhone: "Phone",
    formMessage: "How can we help?",
    formSubmit: "Send",
    noticeSent: (business: string) =>
      `Your message was emailed to ${business}.`,
    noticeNoEmail: (phone: string) =>
      phone
        ? `This business has no email on file, so we could not send your message. Please call ${phone}.`
        : "This business has no email on file, so we could not send your message.",
    noticeMissing: "Name, a real email, and a message are required.",
    noticeFailed: (phone: string) =>
      phone
        ? `We could not send your message by email. Please call ${phone}.`
        : "We could not send your message by email. Please try again.",
    staffLogin: "Tax preparer login",
    portalNav: "Client portal",
    portalFooter:
      "Private document drop box. Not tax-prep software.",
    signOut: "Sign out",
    loginTitle: "Client login",
    loginLead: (name: string, phone: string) =>
      phone
        ? `Upload W-2s, 1099s, and ID into your private folder at ${name}. Only you and this tax office can open it. If you forget your password, call ${phone}.`
        : `Upload W-2s, 1099s, and ID into your private folder at ${name}. Only you and this tax office can open it.`,
    portalDown:
      "This document portal is not connected yet (database or private file storage is missing). Call the office. We will not take uploads until storage is private.",
    newClient: "New client?",
    createAccount: "Create an account",
    taxPreparerQ: "Tax preparer?",
    staffLoginLink: "Staff login",
    signupTitle: "Create a client account",
    signupLead: (name: string) =>
      `This login is only for ${name}. Your documents stay in your folder. We store your name, email, phone, and a hashed password. Files are private — not on the public website, not in git.`,
    signupDown: "This document portal is not connected yet. Call the office.",
    haveAccount: "Already have an account?",
    logIn: "Log in",
    staffTitle: "Tax preparer login",
    staffLead: (name: string) =>
      `This is the staff login for ${name} only. You will see this office’s client folders — not other tax shops, and not the Phoenixwebhost owner panel.`,
    staffDown: "Staff login is not available until the database is connected.",
    forgotTitle: "Reset staff password",
    forgotLead: (name: string) =>
      `Enter the staff email for ${name}. If it is this office’s staff login, we will email a one-time reset link. The link expires in 30 minutes.`,
    forgotSubmit: "Send reset link",
    forgotSent:
      "If that email is a staff login for this office, we sent a one-time reset link. Check the inbox (and spam). The link expires in 30 minutes.",
    forgotMailDown:
      "We cannot email a reset link until email delivery is connected. Call the office.",
    resetTitle: "Choose a new staff password",
    resetLead:
      "Set a new password for this office’s staff login. This link works once and then expires.",
    resetSubmit: "Save new password",
    resetInvalid:
      "That reset link is invalid or has expired. Request a new one.",
    resetDone: "Password updated. Sign in with your new password.",
    backToStaffLogin: "Back to staff login",
    clientQ: "Client?",
    folderTitle: "Your folder",
    folderLead: (name: string) =>
      `Documents you upload here stay in a private folder at ${name}. Only you and this tax office can open them. On a phone you can scan a W-2, 1099, or ID with the camera; we save the pages as one PDF. This is not tax-prep software — just a secure drop box.`,
    storageDown:
      "Document storage is not connected. This office cannot take uploads yet. Call the office.",
    filesTitle: "Documents you sent",
    emptyFolder: "No documents in this folder yet.",
    download: "Download",
    filedTitle: "Your filed copies",
    filedLead:
      "Returns this office filed for you. Download a copy by tax year.",
    filedYear: (year: number) => `Tax ${year}`,
    emptyYear: "No filed copy for this year yet.",
    staffFiledTitle: "Upload filed copy",
    staffFiledLead:
      "After filing, put the client copy in the correct tax year. Clients can download it; they cannot upload here.",
    staffIntakeTitle: "Documents the client sent",
    yearLabel: "Tax year",
    uploadFiled: "Upload filed copy",
    staffFoldersTitle: "Client folders",
    staffFoldersLead: (name: string) =>
      `${name} only. Open a folder to see intake documents and upload filed copies by tax year.`,
    noClients: "No client accounts yet.",
    fileCount: (n: number) => (n === 1 ? "1 file" : `${n} files`),
    noFilesYet: "No files yet",
    allClients: "All clients",
    deleteFile: "Delete",
    deleting: "Deleting…",
    deleteFileConfirm: (name: string) =>
      `Delete ${name}? This cannot be undone.`,
    deleteFileFailed: "Could not delete that file.",
    deleteProfile: "Delete client profile",
    deleteProfileLead:
      "Remove this client and every file in their folder. Only staff of this office can do that. This cannot be undone.",
    deleteProfileConfirm: (name: string) =>
      `Delete ${name} and every file in this folder? This cannot be undone.`,
    deleteProfileFailed: "Could not delete that client profile.",
    auth: {
      name: "Name",
      phone: "Phone",
      email: "Email",
      password: "Password",
      wait: "Please wait…",
      create: "Create account",
      login: "Log in",
      locked: "Too many attempts. Try again in a few minutes.",
      unavailable:
        "This document portal is not connected yet. Call the office.",
      exists: "An account with that email already exists for this office.",
      signupInvalid:
        "Name, a real email, phone, and a password of at least 8 characters are required.",
      badLogin: "That email or password did not match.",
      forgotPassword: "Forgot password?",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      resetMismatch: "Those passwords did not match.",
      resetWeak: "Use a password of at least 8 characters.",
    },
    scan: {
      title: "Upload or scan",
      lead: (max: number) =>
        `On a phone, Scan document opens the rear camera. Take 1–${max} photos of a W-2, 1099, ID, or other paper. We save those pages as one private PDF. On a computer, choose an existing PDF or JPG.`,
      label: "Label",
      chooseFile: "Choose file",
      uploading: "Uploading…",
      scanDocument: "Scan document",
      scanProgress: (n: number, max: number) => `Scan · ${n} of ${max} pages`,
      takePhoto: "Take photo",
      pageLimit: "Page limit reached",
      phoneHint:
        "Use the phone camera. After each photo you can add another page or save the PDF.",
      pageAlt: (n: number) => `Page ${n}`,
      openCamera: "Open camera",
      addPage: "Add page",
      savePdf: "Save PDF",
      saving: "Saving…",
      cancel: "Cancel",
      saved: (n: number) =>
        `Saved ${n} page${n === 1 ? "" : "s"} as a PDF. Only you and this tax office can open it.`,
      uploaded: "Uploaded. Only you and this tax office can open it.",
      cameraNotReady: "Camera is not ready yet. Wait a moment, then try again.",
      captureFailed: "Could not capture that page.",
      fileTooBig: "That file is over 10 MB.",
      storageDown:
        "Document storage is not connected. This office cannot take uploads yet.",
      saveFailed: "Could not save that file. Try again or call the office.",
      needPhoto: "Take at least one photo first.",
      scanFailed: "Could not save that scan.",
      usePdf: "Use a PDF, JPG, or PNG.",
      uploadFailed: "Upload failed.",
      cameraPhoto: "The camera must take a photo. Try again.",
      readPhoto: "Could not read that photo.",
      convertPhoto: "Could not convert that photo.",
    },
  },
  es: {
    langNav: "Idioma",
    clientLogin: "Iniciar sesión / Subir documentos",
    call: (phone: string) => `Llame al ${phone}`,
    ctaMessage: "Enviar un mensaje",
    portalHint:
      "Una carpeta privada para su W-2, 1099 e identificación. No es un programa de impuestos.",
    servicesTitle: "Cómo le ayudamos",
    contactTitle: "Contacto",
    formName: "Nombre",
    formEmail: "Correo",
    formPhone: "Teléfono",
    formMessage: "¿En qué le podemos ayudar?",
    formSubmit: "Enviar",
    noticeSent: (business: string) =>
      `Su mensaje se envió por correo a ${business}.`,
    noticeNoEmail: (phone: string) =>
      phone
        ? `Este negocio no tiene correo registrado, así que no pudimos enviar su mensaje. Llame al ${phone}.`
        : "Este negocio no tiene correo registrado, así que no pudimos enviar su mensaje.",
    noticeMissing: "Se requieren el nombre, un correo real y un mensaje.",
    noticeFailed: (phone: string) =>
      phone
        ? `No pudimos enviar su mensaje por correo. Llame al ${phone}.`
        : "No pudimos enviar su mensaje por correo. Intente de nuevo.",
    staffLogin: "Acceso del preparador",
    portalNav: "Portal del cliente",
    portalFooter:
      "Buzón privado de documentos. No es un programa de impuestos.",
    signOut: "Cerrar sesión",
    loginTitle: "Iniciar sesión",
    loginLead: (name: string, phone: string) =>
      phone
        ? `Suba sus W-2, 1099 e identificación a su carpeta privada en ${name}. Solo usted y esta oficina de impuestos pueden abrirla. Si olvida su contraseña, llame al ${phone}.`
        : `Suba sus W-2, 1099 e identificación a su carpeta privada en ${name}. Solo usted y esta oficina de impuestos pueden abrirla.`,
    portalDown:
      "Este portal de documentos aún no está conectado (falta la base de datos o el archivo privado). Llame a la oficina. No aceptamos documentos hasta que el almacenamiento sea privado.",
    newClient: "¿Cliente nuevo?",
    createAccount: "Crear cuenta",
    taxPreparerQ: "¿Preparador de impuestos?",
    staffLoginLink: "Acceso del personal",
    signupTitle: "Crear una cuenta de cliente",
    signupLead: (name: string) =>
      `Este acceso es solo para ${name}. Sus documentos quedan en su carpeta. Guardamos su nombre, correo, teléfono y una contraseña cifrada. Los archivos son privados: no están en el sitio público ni en git.`,
    signupDown:
      "Este portal de documentos aún no está conectado. Llame a la oficina.",
    haveAccount: "¿Ya tiene cuenta?",
    logIn: "Iniciar sesión",
    staffTitle: "Acceso del preparador",
    staffLead: (name: string) =>
      `Este es el acceso del personal solo para ${name}. Verá las carpetas de clientes de esta oficina, no las de otras oficinas ni el panel de Phoenixwebhost.`,
    staffDown:
      "El acceso del personal no está disponible hasta que la base de datos esté conectada.",
    forgotTitle: "Restablecer contraseña del personal",
    forgotLead: (name: string) =>
      `Escriba el correo del personal de ${name}. Si es el acceso de esta oficina, le enviaremos un enlace de un solo uso. El enlace caduca en 30 minutos.`,
    forgotSubmit: "Enviar enlace",
    forgotSent:
      "Si ese correo es un acceso del personal de esta oficina, enviamos un enlace de un solo uso. Revise el correo (y el spam). El enlace caduca en 30 minutos.",
    forgotMailDown:
      "No podemos enviar el enlace hasta que el correo esté conectado. Llame a la oficina.",
    resetTitle: "Elija una contraseña nueva del personal",
    resetLead:
      "Establezca una contraseña nueva para el acceso del personal de esta oficina. Este enlace funciona una sola vez y luego caduca.",
    resetSubmit: "Guardar contraseña nueva",
    resetInvalid:
      "Ese enlace no es válido o ya caducó. Solicite uno nuevo.",
    resetDone: "Contraseña actualizada. Inicie sesión con su contraseña nueva.",
    backToStaffLogin: "Volver al acceso del personal",
    clientQ: "¿Cliente?",
    folderTitle: "Su carpeta",
    folderLead: (name: string) =>
      `Los documentos que suba aquí quedan en una carpeta privada en ${name}. Solo usted y esta oficina de impuestos pueden abrirlos. En el teléfono puede escanear un W-2, 1099 o identificación con la cámara; guardamos las páginas en un PDF. Esto no es un programa de impuestos, solo un buzón seguro.`,
    storageDown:
      "El almacenamiento de documentos no está conectado. Esta oficina aún no puede recibir archivos. Llame a la oficina.",
    filesTitle: "Documentos que usted envió",
    emptyFolder: "Aún no hay documentos en esta carpeta.",
    download: "Descargar",
    filedTitle: "Sus copias presentadas",
    filedLead:
      "Declaraciones que esta oficina presentó por usted. Descargue una copia por año fiscal.",
    filedYear: (year: number) => `Impuestos ${year}`,
    emptyYear: "Aún no hay copia presentada para este año.",
    staffFiledTitle: "Subir copia presentada",
    staffFiledLead:
      "Después de presentar, ponga la copia del cliente en el año fiscal correcto. El cliente puede descargarla; no puede subir aquí.",
    staffIntakeTitle: "Documentos que envió el cliente",
    yearLabel: "Año fiscal",
    uploadFiled: "Subir copia presentada",
    staffFoldersTitle: "Carpetas de clientes",
    staffFoldersLead: (name: string) =>
      `Solo ${name}. Abra una carpeta para ver lo que subió el cliente y cargar copias presentadas por año fiscal.`,
    noClients: "Aún no hay cuentas de clientes.",
    fileCount: (n: number) => (n === 1 ? "1 archivo" : `${n} archivos`),
    noFilesYet: "Aún no hay archivos",
    allClients: "Todos los clientes",
    deleteFile: "Eliminar",
    deleting: "Eliminando…",
    deleteFileConfirm: (name: string) =>
      `¿Eliminar ${name}? Esto no se puede deshacer.`,
    deleteFileFailed: "No se pudo eliminar ese archivo.",
    deleteProfile: "Eliminar perfil del cliente",
    deleteProfileLead:
      "Elimina a este cliente y todos los archivos de su carpeta. Solo el personal de esta oficina puede hacerlo. Esto no se puede deshacer.",
    deleteProfileConfirm: (name: string) =>
      `¿Eliminar a ${name} y todos los archivos de esta carpeta? Esto no se puede deshacer.`,
    deleteProfileFailed: "No se pudo eliminar el perfil de ese cliente.",
    auth: {
      name: "Nombre",
      phone: "Teléfono",
      email: "Correo",
      password: "Contraseña",
      wait: "Un momento…",
      create: "Crear cuenta",
      login: "Iniciar sesión",
      locked: "Demasiados intentos. Intente de nuevo en unos minutos.",
      unavailable:
        "Este portal de documentos aún no está conectado. Llame a la oficina.",
      exists: "Ya existe una cuenta con ese correo en esta oficina.",
      signupInvalid:
        "Se requieren el nombre, un correo real, teléfono y una contraseña de al menos 8 caracteres.",
      badLogin: "Ese correo o contraseña no coinciden.",
      forgotPassword: "¿Olvidó su contraseña?",
      newPassword: "Contraseña nueva",
      confirmPassword: "Confirmar contraseña",
      resetMismatch: "Esas contraseñas no coinciden.",
      resetWeak: "Use una contraseña de al menos 8 caracteres.",
    },
    scan: {
      title: "Subir o escanear",
      lead: (max: number) =>
        `En el teléfono, Escanear documento abre la cámara trasera. Tome de 1 a ${max} fotos de un W-2, 1099, identificación u otro papel. Guardamos esas páginas en un PDF privado. En la computadora, elija un PDF o JPG que ya tenga.`,
      label: "Etiqueta",
      chooseFile: "Elegir archivo",
      uploading: "Subiendo…",
      scanDocument: "Escanear documento",
      scanProgress: (n: number, max: number) =>
        `Escaneo · ${n} de ${max} páginas`,
      takePhoto: "Tomar foto",
      pageLimit: "Límite de páginas",
      phoneHint:
        "Use la cámara del teléfono. Después de cada foto puede agregar otra página o guardar el PDF.",
      pageAlt: (n: number) => `Página ${n}`,
      openCamera: "Abrir cámara",
      addPage: "Agregar página",
      savePdf: "Guardar PDF",
      saving: "Guardando…",
      cancel: "Cancelar",
      saved: (n: number) =>
        `Se ${n === 1 ? "guardó 1 página" : `guardaron ${n} páginas`} en un PDF. Solo usted y esta oficina de impuestos pueden abrirlo.`,
      uploaded:
        "Subido. Solo usted y esta oficina de impuestos pueden abrirlo.",
      cameraNotReady:
        "La cámara aún no está lista. Espere un momento e intente de nuevo.",
      captureFailed: "No se pudo capturar esa página.",
      fileTooBig: "Ese archivo pesa más de 10 MB.",
      storageDown:
        "El almacenamiento de documentos no está conectado. Esta oficina aún no puede recibir archivos.",
      saveFailed:
        "No se pudo guardar ese archivo. Intente de nuevo o llame a la oficina.",
      needPhoto: "Tome al menos una foto primero.",
      scanFailed: "No se pudo guardar ese escaneo.",
      usePdf: "Use un PDF, JPG o PNG.",
      uploadFailed: "No se pudo subir el archivo.",
      cameraPhoto: "La cámara debe tomar una foto. Intente de nuevo.",
      readPhoto: "No se pudo leer esa foto.",
      convertPhoto: "No se pudo convertir esa foto.",
    },
  },
} as const;

export function tTaxOffice(locale: Locale) {
  return taxOfficeCopy[locale];
}

export function taxOfficeServiceLabel(service: string, locale: Locale) {
  if (locale === "en") return service;
  return (
    servicesEs[service] ??
    paFinancialServiceLabel(service, locale) ??
    holaTaxServiceLabel(service, locale)
  );
}

export function taxOfficeTagline(
  slug: string,
  english: string,
  locale: Locale,
) {
  if (slug === HOLA_TAX_SLUG) return holaTaxTagline(english, locale);
  if (slug === PA_FINANCIAL_SLUG) return paFinancialTagline(english, locale);
  return english;
}

export function taxOfficeAbout(slug: string, english: string, locale: Locale) {
  if (slug === HOLA_TAX_SLUG) return holaTaxAbout(english, locale);
  if (slug === PA_FINANCIAL_SLUG) return paFinancialAbout(english, locale);
  return english;
}

export function taxDocLabel(label: string, locale: Locale) {
  const known = TAX_LABEL_COPY[label as TaxDocLabel];
  if (!known) return label;
  return known[locale];
}

export function dateLocale(locale: Locale) {
  return locale === "es" ? "es-US" : "en-US";
}
