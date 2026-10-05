import type { Metadata } from "next";
import PaginaLegal, { Seccion, lista } from "@/components/legal/PaginaLegal";
import { CORREO_CONTACTO, NOMBRE_SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué datos recoge studia+, para qué los usa, con quién los comparte y cómo puedes ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
};

// Última revisión del texto: se actualiza cada vez que cambie lo que se recoge o con quién se comparte.
const ACTUALIZADA = "5 de octubre de 2026";

export default function PrivacidadPage() {
  return (
    <PaginaLegal titulo="Política de privacidad" actualizada={ACTUALIZADA}>
      <p>
        {NOMBRE_SITIO} es una aplicación de estudio para universitarios. Esta política explica qué datos personales tratamos, para
        qué, con quién los compartimos y cómo puedes consultarlos, corregirlos o eliminarlos, conforme a la Ley 1581 de 2012 de
        Colombia y demás normas de protección de datos aplicables.
      </p>

      <Seccion titulo="1. Responsable del tratamiento">
        <p>
          El responsable de tus datos es el equipo de {NOMBRE_SITIO}.{" "}
          {CORREO_CONTACTO ? (
            <>
              Puedes escribirnos a{" "}
              <a href={`mailto:${CORREO_CONTACTO}`} className="font-semibold text-glacier-blue underline underline-offset-2">
                {CORREO_CONTACTO}
              </a>
              .
            </>
          ) : (
            "Para cualquier consulta sobre tus datos, escríbenos por los canales de contacto de la tienda donde descargaste la app."
          )}
        </p>
      </Seccion>

      <Seccion titulo="2. Qué datos recogemos">
        <ul className={lista}>
          <li>
            <strong>Cuenta:</strong> tu correo electrónico y tu contraseña (se guarda cifrada; nosotros no la vemos). Si entras
            con Google, recibimos de Google tu nombre, tu correo y tu foto de perfil.
          </li>
          <li>
            <strong>Lo que estudias:</strong> materias, temas, fechas de parcial, sesiones de estudio (duración, pausas, método
            usado, objetivo y tus calificaciones de la sesión), notas y porcentajes de evaluaciones, rutas de estudio, racha, XP,
            nivel e insignias. También tu meta semanal.
          </li>
          <li>
            <strong>Notificaciones:</strong> si las activas, los datos técnicos de tu navegador o dispositivo necesarios para
            enviártelas.
          </li>
          <li>
            <strong>Plan y uso:</strong> tu plan (Free o Pro), cuántas rutas con IA y mensajes al tutor has usado en el mes y los
            protectores de racha que te quedan.
          </li>
          <li>
            <strong>Pagos:</strong> la referencia, el monto, el estado y el identificador de cada pago del plan Pro. No recibimos
            ni guardamos los datos de tu tarjeta, tu cuenta bancaria ni tu Nequi: los procesa Wompi.
          </li>
          <li>
            <strong>Datos técnicos:</strong> cookies de sesión necesarias para mantenerte conectado y preferencias guardadas en tu
            dispositivo (por ejemplo, el sonido elegido, tu nivel educativo y el avance de una sesión en curso).
          </li>
        </ul>
        <p>No usamos cookies de publicidad ni herramientas de analítica o seguimiento de terceros.</p>
      </Seccion>

      <Seccion titulo="3. Para qué usamos tus datos">
        <ul className={lista}>
          <li>Crear y mantener tu cuenta y mantener tu sesión iniciada.</li>
          <li>Ofrecer las funciones de la app: plan hasta el parcial, sesiones, racha, progreso y recomendaciones.</li>
          <li>Generar recomendaciones de método, rutas de estudio y respuestas del tutor con inteligencia artificial.</li>
          <li>Enviarte recordatorios para mantener tu racha, si activaste las notificaciones.</li>
          <li>Procesar tus pagos y activar el plan Pro.</li>
          <li>Proteger el servicio y cumplir obligaciones legales.</li>
        </ul>
        <p>No vendemos tus datos ni los usamos para publicidad.</p>
      </Seccion>

      <Seccion titulo="4. Inteligencia artificial">
        <p>
          Para recomendarte un método, crear rutas de estudio y responder al tutor, enviamos a Google (Gemini) la información
          mínima necesaria: el nombre de la materia, el tema, tu nivel educativo, tu objetivo y tu pregunta, y, para recomendar un
          método, los métodos que marcaste como «no me funcionó». Las conversaciones con el tutor no se guardan en tu cuenta. Las
          respuestas de la IA pueden contener errores: verifica lo importante.
        </p>
      </Seccion>

      <Seccion titulo="5. Con quién compartimos tus datos">
        <p>Solo con los proveedores que hacen funcionar el servicio, y únicamente para eso:</p>
        <ul className={lista}>
          <li>
            <strong>Supabase:</strong> base de datos y autenticación donde se guarda tu cuenta y tu información.
          </li>
          <li>
            <strong>Vercel:</strong> alojamiento de la aplicación.
          </li>
          <li>
            <strong>Google:</strong> inicio de sesión con Google (si lo usas) y el modelo de IA Gemini.
          </li>
          <li>
            <strong>Wompi:</strong> procesamiento de los pagos del plan Pro.
          </li>
          <li>
            <strong>Spotify:</strong> si pegas un enlace de Spotify, el reproductor se carga desde Spotify y esta empresa puede
            recibir datos técnicos de tu navegador según su propia política.
          </li>
        </ul>
        <p>
          Algunos de estos proveedores están fuera de Colombia, por lo que tus datos pueden tratarse en otros países. También
          podremos entregar información si una autoridad competente lo exige conforme a la ley.
        </p>
      </Seccion>

      <Seccion titulo="6. Cuánto tiempo los conservamos">
        <p>
          Conservamos tus datos mientras tu cuenta exista. Cuando la eliminas, se borran tu cuenta y tus datos de estudio. Los
          registros de pagos pueden conservarse el tiempo que exija la ley.
        </p>
      </Seccion>

      <Seccion titulo="7. Tus derechos">
        <p>Como titular puedes:</p>
        <ul className={lista}>
          <li>Conocer, actualizar y rectificar tus datos.</li>
          <li>Solicitar prueba de la autorización que nos diste.</li>
          <li>Ser informado del uso que damos a tus datos.</li>
          <li>Revocar tu autorización y pedir la supresión de tus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
        </ul>
        <p>
          <strong>Eliminar tu cuenta:</strong> puedes hacerlo tú mismo en cualquier momento desde{" "}
          <strong>Ajustes → Privacidad y datos → Eliminar mi cuenta</strong>. Se borran de forma permanente tu cuenta y todos tus
          datos de estudio.
        </p>
        {CORREO_CONTACTO && (
          <p>
            Para ejercer cualquiera de estos derechos, escríbenos a{" "}
            <a href={`mailto:${CORREO_CONTACTO}`} className="font-semibold text-glacier-blue underline underline-offset-2">
              {CORREO_CONTACTO}
            </a>
            .
          </p>
        )}
      </Seccion>

      <Seccion titulo="8. Menores de edad">
        <p>
          {NOMBRE_SITIO} está pensada para estudiantes universitarios. No está dirigida a menores de 14 años y no recogemos datos
          de ellos de forma consciente. Si crees que un menor se registró, avísanos para eliminar su cuenta.
        </p>
      </Seccion>

      <Seccion titulo="9. Seguridad">
        <p>
          Protegemos tus datos con conexiones cifradas, contraseñas almacenadas de forma cifrada y reglas de acceso que permiten
          que cada persona vea únicamente su propia información. Ningún sistema es infalible, pero trabajamos para reducir los
          riesgos.
        </p>
      </Seccion>

      <Seccion titulo="10. Cambios en esta política">
        <p>
          Si cambiamos esta política, publicaremos la nueva versión en esta página con su fecha de actualización. Si el cambio es
          importante, te lo avisaremos en la app.
        </p>
      </Seccion>
    </PaginaLegal>
  );
}
