import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { Seccion, lista } from "@/components/legal/PaginaLegal";
import { CORREO_CONTACTO, NOMBRE_SITIO } from "@/lib/sitio";
import { LIMITES, PRECIO_PRO_COP } from "@/lib/plan";
import { PROTECTORES } from "@/lib/protectores";

export const metadata: Metadata = {
  title: "Términos y condiciones de uso",
  description: "Las reglas para usar studia+: tu cuenta, los planes Free y Pro, los pagos, el uso de la IA y tus responsabilidades.",
  alternates: { canonical: "/terminos" },
};

// Última revisión del texto: se actualiza cada vez que cambien los planes, precios o reglas.
const ACTUALIZADA = "5 de octubre de 2026";

const enlace = "font-semibold text-glacier-blue underline underline-offset-2";

export default function TerminosPage() {
  const precio = PRECIO_PRO_COP.toLocaleString("es-CO");

  return (
    <PaginaLegal titulo="Términos y condiciones de uso" actualizada={ACTUALIZADA}>
      <p>
        Estos términos regulan el uso de {NOMBRE_SITIO}, una aplicación para organizar el estudio universitario. Al crear una
        cuenta o usar la app aceptas estas condiciones. Si no estás de acuerdo, no la uses. Léelas junto con nuestra{" "}
        <Link href="/privacidad" className={enlace}>
          política de privacidad
        </Link>
        .
      </p>

      <Seccion titulo="1. El servicio">
        <p>
          {NOMBRE_SITIO} te permite organizar materias y temas, planear tus parciales, hacer sesiones de estudio con
          temporizador, registrar notas, seguir tu racha y progreso, y usar herramientas con inteligencia artificial (método
          recomendado, rutas de estudio y tutor). Podemos mejorar, cambiar o retirar funciones.
        </p>
      </Seccion>

      <Seccion titulo="2. Tu cuenta">
        <ul className={lista}>
          <li>Debes dar un correo válido y mantener tu cuenta bajo tu control. Eres responsable de lo que se haga con ella.</li>
          <li>Cuida tu contraseña. Avísanos si crees que alguien accedió sin tu permiso.</li>
          <li>La app está pensada para estudiantes universitarios y no está dirigida a menores de 14 años.</li>
          <li>Puedes eliminar tu cuenta cuando quieras desde Ajustes → Privacidad y datos.</li>
        </ul>
      </Seccion>

      <Seccion titulo="3. Uso aceptable">
        <p>Te comprometes a no:</p>
        <ul className={lista}>
          <li>Usar la app para actividades ilegales o para dañar a otras personas.</li>
          <li>Intentar acceder a cuentas o datos de otros, ni vulnerar o sobrecargar el servicio.</li>
          <li>Manipular tu racha, XP o logros con métodos automáticos o engañosos.</li>
          <li>Usar bots, scraping o automatizaciones sobre la app o su IA sin permiso.</li>
          <li>Revender o compartir tu plan Pro con otras personas.</li>
        </ul>
        <p>Podemos limitar o suspender cuentas que incumplan estas reglas.</p>
      </Seccion>

      <Seccion titulo="4. Planes Free y Pro">
        <ul className={lista}>
          <li>
            <strong>Free:</strong> gratis. Incluye hasta {LIMITES.free.ruta} rutas con IA y {LIMITES.free.mensaje} mensajes al
            tutor al mes, y {PROTECTORES.free} protector de racha al mes.
          </li>
          <li>
            <strong>Pro:</strong> incluye hasta {LIMITES.pro.ruta} rutas con IA y {LIMITES.pro.mensaje} mensajes al tutor al
            mes, y {PROTECTORES.pro} protectores de racha al mes. Cuesta ${precio} COP por 30 días.
          </li>
          <li>
            Los límites se reinician el primer día de cada mes (hora de Colombia). Los cupos no usados no se acumulan.
          </li>
          <li>
            El Pro es un <strong>pago único</strong> que activa 30 días de uso. No se renueva automáticamente ni se hacen
            cobros recurrentes: si quieres continuar, pagas de nuevo. Si ya eres Pro, los días nuevos se suman a los que te
            quedan.
          </li>
          <li>Podemos cambiar los precios y los límites hacia adelante. Lo que ya pagaste no cambia.</li>
        </ul>
      </Seccion>

      <Seccion titulo="5. Pagos y devoluciones">
        <p>
          Los pagos se procesan a través de Wompi (tarjeta, PSE o Nequi). {NOMBRE_SITIO} no recibe ni guarda tus datos de pago.
          El Pro se activa cuando Wompi confirma el pago aprobado; si ves un retraso, espera unos minutos y recarga la página.
        </p>
        <p>
          Si crees que se te cobró por error o tuviste un problema con tu pago, escríbenos y lo revisaremos. Lo que corresponda
          por ley, como el derecho de retracto cuando aplique, se respeta conforme al Estatuto del Consumidor (Ley 1480 de
          2011).
          {CORREO_CONTACTO && (
            <>
              {" "}
              Contacto:{" "}
              <a href={`mailto:${CORREO_CONTACTO}`} className={enlace}>
                {CORREO_CONTACTO}
              </a>
              .
            </>
          )}
        </p>
      </Seccion>

      <Seccion titulo="6. Inteligencia artificial">
        <p>
          Las recomendaciones, rutas y respuestas del tutor las genera un modelo de IA y pueden ser incorrectas, incompletas o
          desactualizadas. Son una ayuda para estudiar, no sustituyen a tus profesores, a tu material de clase ni a una
          asesoría profesional. Verifica fórmulas, datos y resultados antes de tus evaluaciones. No somos responsables de
          decisiones académicas que tomes basándote solo en la IA.
        </p>
      </Seccion>

      <Seccion titulo="7. Tu contenido">
        <p>
          Lo que escribes en la app (materias, temas, notas, objetivos) sigue siendo tuyo. Nos das permiso para guardarlo,
          procesarlo y mostrártelo con el único fin de prestar el servicio. {NOMBRE_SITIO}, su marca, su diseño y su código
          pertenecen a sus titulares y no puedes copiarlos ni reutilizarlos sin autorización.
        </p>
      </Seccion>

      <Seccion titulo="8. Servicios de terceros">
        <p>
          La app se apoya en terceros (Supabase, Vercel, Google, Wompi y, si lo usas, Spotify). Su uso también está sujeto a
          sus propios términos. Si pegas tu playlist de Spotify, escuchar canciones completas depende de tu cuenta y plan de
          Spotify, que no controlamos.
        </p>
      </Seccion>

      <Seccion titulo="9. Disponibilidad">
        <p>
          Hacemos lo posible por mantener el servicio disponible, pero puede haber interrupciones por mantenimiento, fallas de
          terceros o causas fuera de nuestro control. El servicio se ofrece «tal cual», sin garantía de que esté libre de
          errores.
        </p>
      </Seccion>

      <Seccion titulo="10. Limitación de responsabilidad">
        <p>
          En la medida que la ley lo permita, {NOMBRE_SITIO} no responde por daños indirectos, por pérdida de datos, notas o
          rachas, ni por resultados académicos. Nuestra responsabilidad total frente a ti se limita a lo que hayas pagado por el
          plan Pro en los 12 meses anteriores al reclamo. Esto no limita los derechos que la ley te reconoce como consumidor.
        </p>
      </Seccion>

      <Seccion titulo="11. Terminación">
        <p>
          Puedes dejar de usar la app y eliminar tu cuenta cuando quieras. Podemos suspender o cerrar una cuenta si incumples
          estos términos o si la ley lo exige. Al eliminar tu cuenta se pierde el tiempo de Pro que te quedara.
        </p>
      </Seccion>

      <Seccion titulo="12. Cambios en estos términos">
        <p>
          Podemos actualizar estos términos. Publicaremos la nueva versión aquí con su fecha y, si el cambio es importante, te
          avisaremos en la app. Si sigues usando {NOMBRE_SITIO} después del cambio, lo aceptas.
        </p>
      </Seccion>

      <Seccion titulo="13. Ley aplicable">
        <p>Estos términos se rigen por las leyes de la República de Colombia. Las controversias se resolverán ante las autoridades competentes en Colombia.</p>
      </Seccion>
    </PaginaLegal>
  );
}
