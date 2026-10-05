import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { Resumen, Seccion, lista } from "@/components/legal/PaginaLegal";
import { CORREO_CONTACTO, NOMBRE_SITIO, RESPONSABLE_LEGAL } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué datos recoge studia+, para qué los usa, con quién los comparte y cómo puedes ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
};

// Última revisión del texto: se actualiza cada vez que cambie lo que se recoge o con quién se comparte.
const ACTUALIZADA = "5 de octubre de 2026";

const enlace = "font-semibold text-glacier-blue underline underline-offset-2";

const Correo = () =>
  CORREO_CONTACTO ? (
    <a href={`mailto:${CORREO_CONTACTO}`} className={enlace}>
      {CORREO_CONTACTO}
    </a>
  ) : null;

export default function PrivacidadPage() {
  return (
    <PaginaLegal titulo="Política de privacidad" actualizada={ACTUALIZADA}>
      <p>
        Esta política explica, con palabras sencillas, qué datos personales trata {NOMBRE_SITIO}, para qué los usa, con quién los
        comparte y qué puedes hacer con ellos. Se rige por la Ley 1581 de 2012 de Colombia y sus normas complementarias. Al
        crear una cuenta o usar la app aceptas esta política y nos autorizas a tratar tus datos como aquí se describe. Si algo no
        te queda claro, escríbenos antes de usar la app.
      </p>

      <Resumen
        items={[
          "Guardamos tu cuenta y lo que registras en la app (materias, temas, sesiones, notas, racha) para que funcione.",
          "No vendemos tus datos y no mostramos publicidad.",
          "Para la inteligencia artificial enviamos a Google solo lo necesario: la materia, el tema, tu pregunta y datos parecidos. Las conversaciones con el tutor no se guardan en tu cuenta.",
          "No guardamos los datos de tu tarjeta, PSE o Nequi: los procesa Wompi.",
          "Puedes eliminar tu cuenta y todos tus datos de estudio cuando quieras, desde Ajustes.",
        ]}
      />

      <Seccion titulo="1. Quién es el responsable de tus datos">
        <p>
          {RESPONSABLE_LEGAL ? (
            <>
              El responsable del tratamiento es <strong>{RESPONSABLE_LEGAL}</strong>, titular de {NOMBRE_SITIO}.
            </>
          ) : (
            <>El responsable del tratamiento es el titular de {NOMBRE_SITIO}.</>
          )}{" "}
          {CORREO_CONTACTO ? (
            <>
              Para cualquier consulta, solicitud o reclamo sobre tus datos escríbenos a <Correo />.
            </>
          ) : (
            "Para cualquier consulta, solicitud o reclamo sobre tus datos, escríbenos por los canales de contacto indicados en la tienda de aplicaciones o en el sitio donde descargaste la app."
          )}
        </p>
      </Seccion>

      <Seccion titulo="2. Qué datos recogemos">
        <p>
          <strong>Los que nos das al registrarte y usar la app:</strong>
        </p>
        <ul className={lista}>
          <li>Tu correo electrónico y tu contraseña. La contraseña se guarda protegida (con hash) y nosotros no podemos verla.</li>
          <li>
            Lo que estudias: materias, temas y su estado, fechas de parcial, sesiones de estudio (fecha, duración, pausas, método
            usado, objetivo, y cómo calificaste la sesión y el método), notas y porcentajes de evaluaciones, rutas de estudio, tu
            nivel educativo y tu meta semanal.
          </li>
          <li>Lo que escribes a la IA: tu petición para una ruta de estudio, tu situación de estudio y tus mensajes al tutor.</li>
        </ul>

        <p>
          <strong>Los que se generan al usar la app:</strong>
        </p>
        <ul className={lista}>
          <li>Tu racha, XP, nivel, insignias y protectores de racha.</li>
          <li>Tu plan (Free o Pro), cuántas rutas con IA y mensajes al tutor usaste en el mes y hasta cuándo dura tu Pro.</li>
          <li>
            Si pagas: la referencia, el monto, el estado y el identificador de cada pago. <strong>No</strong> recibimos ni guardamos
            el número de tu tarjeta, los datos de tu banco ni tu cuenta Nequi: los maneja Wompi.
          </li>
          <li>
            Si activas las notificaciones: los datos técnicos de tu navegador o dispositivo necesarios para enviártelas (un
            identificador y claves de cifrado).
          </li>
        </ul>

        <p>
          <strong>Los que vienen de Google, si entras con Google:</strong> tu nombre, tu correo y tu foto de perfil. Los recibe
          nuestro proveedor de cuentas (Supabase) y quedan asociados a tu cuenta. Nunca recibimos tu contraseña de Google.
        </p>

        <p>
          <strong>Datos técnicos:</strong> nuestros proveedores de alojamiento pueden registrar datos de conexión como la dirección IP
          y el tipo de navegador, por seguridad y para que el servicio funcione.
        </p>
      </Seccion>

      <Seccion titulo="3. Para qué usamos tus datos">
        <ul className={lista}>
          <li>Crear tu cuenta, mantener tu sesión iniciada y que puedas recuperar tu contraseña.</li>
          <li>Prestarte el servicio: organizar tus materias, planear tus parciales, cronometrar tus sesiones, calcular tu racha y tu progreso.</li>
          <li>
            Generar con inteligencia artificial la recomendación de método, las rutas de estudio y las respuestas del tutor.
            Usamos tus calificaciones de los métodos para no volver a recomendarte los que marcaste como «no me funcionó».
          </li>
          <li>Enviarte recordatorios para mantener tu racha, solo si activaste las notificaciones.</li>
          <li>Cobrar el plan Pro y activarlo.</li>
          <li>Mantener la seguridad del servicio, evitar abusos y cumplir obligaciones legales.</li>
        </ul>
        <p>No vendemos tus datos, no los usamos para publicidad y no creamos perfiles para terceros.</p>
      </Seccion>

      <Seccion titulo="4. Inteligencia artificial (Google Gemini)">
        <p>
          Algunas funciones usan un modelo de inteligencia artificial de Google. Para responderte enviamos solo lo necesario, y
          según la función es:
        </p>
        <ul className={lista}>
          <li>
            <strong>Método recomendado:</strong> tu nivel educativo, la materia, el tema, tu situación de estudio y los nombres de los
            métodos que marcaste como «no me funcionó».
          </li>
          <li>
            <strong>Ruta de estudio:</strong> lo que escribes en tu petición, tu nivel educativo, tu objetivo y el tiempo diario que
            indicas.
          </li>
          <li>
            <strong>Tutor:</strong> tu pregunta, el nombre del tema y de la materia, y los últimos mensajes de esa conversación para
            que la respuesta tenga contexto.
          </li>
        </ul>
        <p>
          Las conversaciones con el tutor <strong>no se guardan en tu cuenta</strong>: al cerrar el tutor, desaparecen. Google
          procesa lo que le enviamos según sus propios términos para su API de IA.
        </p>
        <p>
          <strong>Recomendación:</strong> no escribas en la IA datos sensibles ni información personal de otras personas
          (números de documento, contraseñas, datos de salud, etc.). Las respuestas pueden ser incorrectas, así que verifica lo
          importante.
        </p>
      </Seccion>

      <Seccion titulo="5. Con quién compartimos tus datos">
        <p>Solo con los proveedores que hacen funcionar el servicio, y únicamente para eso:</p>
        <ul className={lista}>
          <li>
            <strong>Supabase:</strong> base de datos y cuentas. Aquí se guarda toda tu información.
          </li>
          <li>
            <strong>Vercel:</strong> aloja la aplicación y atiende tus conexiones.
          </li>
          <li>
            <strong>Google:</strong> el inicio de sesión con Google (si lo usas) y el modelo de IA Gemini (lo descrito arriba).
          </li>
          <li>
            <strong>Wompi:</strong> procesa los pagos del plan Pro. Tú das tus datos de pago directamente en su página, no en la
            nuestra.
          </li>
          <li>
            <strong>Spotify:</strong> solo si eliges Spotify como música: el reproductor se carga desde Spotify, que puede recibir
            datos técnicos de tu navegador según su propia política. Los enlaces a otros servicios de música (YouTube, Apple Music,
            etc.) se abren en esas apps, fuera de studia+.
          </li>
        </ul>
        <p>
          No compartimos tus datos con nadie más, salvo que una autoridad competente nos lo exija conforme a la ley. Estos proveedores
          pueden tratar datos fuera de Colombia, por lo que tus datos pueden ser transferidos a otros países; al usar la app lo
          autorizas, y exigimos a estos proveedores un nivel de protección adecuado.
        </p>
      </Seccion>

      <Seccion titulo="6. Cookies y datos guardados en tu dispositivo">
        <ul className={lista}>
          <li>Usamos cookies necesarias para mantener tu sesión iniciada. Sin ellas no podrías entrar.</li>
          <li>
            Guardamos preferencias en tu dispositivo (almacenamiento local) para que la app funcione mejor: el sonido o enlace de
            música que elegiste, tu nivel educativo, el avance de una sesión en curso y si ya viste la guía inicial.
          </li>
          <li>No usamos cookies de publicidad ni herramientas de analítica o seguimiento de terceros.</li>
        </ul>
      </Seccion>

      <Seccion titulo="7. Notificaciones">
        <p>
          Las notificaciones son opcionales. Si las activas, te enviaremos un recordatorio diario si todavía no estudiaste ese día.
          Puedes desactivarlas cuando quieras desde Ajustes → Notificaciones o en la configuración de tu navegador o teléfono.
        </p>
      </Seccion>

      <Seccion titulo="8. Cuánto tiempo guardamos tus datos y cómo se eliminan">
        <ul className={lista}>
          <li>Guardamos tus datos mientras tu cuenta exista.</li>
          <li>
            Puedes eliminar tu cuenta en cualquier momento desde <strong>Ajustes → Privacidad y datos → Eliminar mi cuenta</strong>.
            La eliminación es inmediata y definitiva: se borran tu cuenta y todos tus datos en studia+ (materias, temas, sesiones,
            notas, rutas, racha, plan y registros de pago). No se puede deshacer y se pierde el tiempo de Pro que te quede.
          </li>
          <li>
            Algunas copias de seguridad de nuestros proveedores pueden tardar un tiempo en desaparecer por completo. Wompi y tu banco
            conservan sus propios registros de pago según la ley y sus políticas, fuera de nuestro control.
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="9. Tus derechos y cómo ejercerlos">
        <p>Como titular de tus datos tienes derecho a:</p>
        <ul className={lista}>
          <li>Conocer, actualizar y rectificar tus datos.</li>
          <li>Pedir prueba de la autorización que nos diste.</li>
          <li>Saber cómo usamos tus datos.</li>
          <li>Revocar tu autorización y pedir que eliminemos tus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
        </ul>
        <p>
          {CORREO_CONTACTO ? (
            <>
              Para ejercerlos, escríbenos a <Correo /> desde el correo de tu cuenta, indicando qué necesitas. Respondemos las consultas en un
              máximo de 10 días hábiles y los reclamos en un máximo de 15 días hábiles, como indica la ley.
            </>
          ) : (
            "Para ejercerlos, escríbenos desde el correo de tu cuenta indicando qué necesitas. Respondemos las consultas en un máximo de 10 días hábiles y los reclamos en un máximo de 15 días hábiles, como indica la ley."
          )}{" "}
          Eliminar tu cuenta no requiere solicitud: puedes hacerlo tú directamente desde Ajustes.
        </p>
      </Seccion>

      <Seccion titulo="10. Menores de edad">
        <p>
          {NOMBRE_SITIO} está pensada para estudiantes universitarios. No está dirigida a menores de 14 años y no recogemos datos de
          ellos de forma consciente. Si eres menor de 18 años, solo puedes usar la app con la autorización de tu madre, padre o
          representante legal. Si descubrimos que un menor de 14 años se registró, eliminaremos su cuenta.
        </p>
      </Seccion>

      <Seccion titulo="11. Seguridad">
        <p>
          Protegemos tus datos con conexiones cifradas, contraseñas protegidas y reglas de acceso para que cada persona vea únicamente
          su propia información. Ningún sistema es 100 % infalible. Si ocurre un incidente que afecte tus datos, actuaremos conforme a
          la ley y te avisaremos cuando corresponda.
        </p>
      </Seccion>

      <Seccion titulo="12. Cambios en esta política">
        <p>
          Si cambiamos esta política publicaremos la nueva versión aquí con su fecha. Si el cambio es importante, te lo avisaremos
          en la app. Si sigues usando {NOMBRE_SITIO} después del cambio, lo aceptas. También puedes leer nuestros{" "}
          <Link href="/terminos" className={enlace}>
            términos y condiciones
          </Link>
          .
        </p>
      </Seccion>
    </PaginaLegal>
  );
}
