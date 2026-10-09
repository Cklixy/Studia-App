import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { Resumen, Seccion, lista } from "@/components/legal/PaginaLegal";
import { CORREO_CONTACTO, NOMBRE_SITIO, RESPONSABLE_LEGAL } from "@/lib/sitio";
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

const Correo = () =>
  CORREO_CONTACTO ? (
    <a href={`mailto:${CORREO_CONTACTO}`} className={enlace}>
      {CORREO_CONTACTO}
    </a>
  ) : null;

export default function TerminosPage() {
  const precio = PRECIO_PRO_COP.toLocaleString("es-CO");

  return (
    <PaginaLegal titulo="Términos y condiciones de uso" actualizada={ACTUALIZADA}>
      <p>
        Estos términos son el acuerdo entre tú y {RESPONSABLE_LEGAL ? <strong>{RESPONSABLE_LEGAL}</strong> : "el titular"} de{" "}
        {NOMBRE_SITIO} para usar la aplicación. Al crear una cuenta o usar la app declaras que los leíste y los aceptas. Si no estás
        de acuerdo, no la uses. Léelos junto con la{" "}
        <Link href="/privacidad" className={enlace}>
          política de privacidad
        </Link>
        .
      </p>

      <Resumen
        items={[
          <>
            <strong>Free</strong> es gratis, con límites mensuales. <strong>Pro</strong> cuesta ${precio} COP y dura 30 días.
          </>,
          "El Pro es un pago único: no se renueva solo ni se hacen cobros automáticos. Si quieres seguir, pagas de nuevo.",
          "La IA puede equivocarse: verifica lo importante antes de tus evaluaciones.",
          "Tu racha, XP e insignias son parte de la experiencia de la app: no tienen valor en dinero.",
          "Puedes eliminar tu cuenta cuando quieras. Al hacerlo pierdes tus datos y el Pro que te quede.",
        ]}
      />

      <Seccion titulo="1. Quién puede usar la app">
        <ul className={lista}>
          <li>{NOMBRE_SITIO} está pensada para estudiantes universitarios.</li>
          <li>
            Debes tener 18 años o más. Si eres menor, necesitas la autorización de tu madre, padre o representante legal, y en
            ningún caso puedes tener menos de 14 años.
          </li>
          <li>Debes dar información verdadera y mantener tu cuenta bajo tu control.</li>
        </ul>
      </Seccion>

      <Seccion titulo="2. Qué ofrece el servicio">
        <p>
          {NOMBRE_SITIO} te permite organizar materias y temas, planear tus parciales, hacer sesiones de estudio con temporizador,
          registrar notas, seguir tu racha y tu progreso, y usar herramientas con inteligencia artificial (método recomendado, rutas
          de estudio y tutor). Podemos mejorar, cambiar o retirar funciones. Las funciones, los límites y el precio descritos aquí
          son los vigentes en la fecha de actualización de esta página.
        </p>
      </Seccion>

      <Seccion titulo="3. Tu cuenta">
        <ul className={lista}>
          <li>Puedes crear tu cuenta con correo y contraseña o con tu cuenta de Google.</li>
          <li>Eres responsable de lo que se haga con tu cuenta. Cuida tu contraseña y avísanos si crees que alguien entró sin permiso.</li>
          <li>Una cuenta es personal: no la compartas ni la vendas.</li>
          <li>Puedes eliminar tu cuenta cuando quieras desde Ajustes → Privacidad y datos (ver la sección 13).</li>
        </ul>
      </Seccion>

      <Seccion titulo="4. Uso aceptable">
        <p>Te comprometes a no:</p>
        <ul className={lista}>
          <li>Usar la app para actividades ilegales o para dañar a otras personas.</li>
          <li>Intentar entrar a cuentas o datos de otros, ni vulnerar, probar sin permiso o sobrecargar el servicio.</li>
          <li>Manipular tu racha, XP o logros con métodos automáticos o engañosos.</li>
          <li>Usar bots, extracción masiva de datos o automatizaciones sobre la app o su IA.</li>
          <li>Compartir o revender tu plan Pro.</li>
          <li>Usar la IA para generar contenido ilegal, ofensivo o para hacer trampa en evaluaciones donde esté prohibido.</li>
        </ul>
        <p>Si incumples estas reglas, podemos limitar tu acceso o suspender tu cuenta.</p>
      </Seccion>

      <Seccion titulo="5. Planes y límites">
        <ul className={lista}>
          <li>
            <strong>Free (gratis):</strong> hasta {LIMITES.free.ruta} rutas con IA y {LIMITES.free.mensaje} mensajes al tutor por mes,
            y {PROTECTORES.free} protector de racha por mes.
          </li>
          <li>
            <strong>Pro (${precio} COP por 30 días):</strong> hasta {LIMITES.pro.ruta} rutas con IA y {LIMITES.pro.mensaje} mensajes al
            tutor por mes, y {PROTECTORES.pro} protectores de racha por mes. Incluye todo lo del plan Free.
          </li>
        </ul>
        <p>Cómo se cuentan los límites:</p>
        <ul className={lista}>
          <li>Se cuentan por mes calendario, en hora de Colombia, y se reinician el día 1 de cada mes.</li>
          <li>Lo que no uses en el mes no se acumula para el siguiente.</li>
          <li>Si la IA falla y no te responde, ese intento no se descuenta.</li>
          <li>
            Las recomendaciones de método con IA tienen un tope de {LIMITES.free.metodo} al mes en ambos planes. Al llegar al tope, la app
            sigue recomendándote un método, pero sin IA.
          </li>
          <li>
            Los límites cambian según tu plan en ese momento: si tu Pro vence a mitad de mes, desde ese momento aplican los límites
            del plan Free.
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="6. Racha y protectores de racha">
        <ul className={lista}>
          <li>La racha suma un día por cada día (en hora de Colombia) en que terminas al menos una sesión de estudio.</li>
          <li>
            Si pasa un día sin estudiar, la racha se rompe y vuelve a empezar, a menos que un protector la salve.
          </li>
          <li>
            Los protectores se usan solos cuando vuelves a estudiar después de saltarte días: cada protector cubre un día. Si no te
            alcanzan para cubrir todos los días perdidos, la racha se rompe y no se gasta ninguno.
          </li>
          <li>Los protectores se reinician cada mes y los que no uses no se acumulan.</li>
          <li>La racha, el XP, el nivel y las insignias son parte de la experiencia de la app y no tienen valor en dinero ni se pueden canjear.</li>
        </ul>
      </Seccion>

      <Seccion titulo="7. Cómo se paga el Pro">
        <ul className={lista}>
          <li>
            El Pro cuesta ${precio} COP (pesos colombianos) y da <strong>30 días</strong> de uso desde que el pago es aprobado.
          </li>
          <li>
            Es <strong>un solo pago</strong>. No se renueva automáticamente ni guardamos tu medio de pago para cobros futuros. Si
            quieres seguir con Pro después de los 30 días, tienes que pagar de nuevo.
          </li>
          <li>Si pagas cuando todavía tienes Pro, los 30 días nuevos se suman a los que te quedan.</li>
          <li>
            Pagas en la página de Wompi (tarjeta, PSE o Nequi). {NOMBRE_SITIO} no recibe ni guarda tus datos de pago. Wompi puede
            aplicar sus propias condiciones.
          </li>
          <li>
            El Pro se activa cuando Wompi confirma que el pago fue aprobado. Normalmente es inmediato, pero puede tardar unos
            minutos. Si pasado un rato no se activó, escríbenos con la fecha y la referencia del pago.
          </li>
          <li>Podemos cambiar el precio y los límites a futuro. Un cambio no afecta los días de Pro que ya pagaste.</li>
        </ul>
      </Seccion>

      <Seccion titulo="8. Reembolsos">
        <ul className={lista}>
          <li>
            <strong>Sí devolvemos</strong> el dinero si se te cobró por error, si se te cobró dos veces, o si pagaste y el Pro no se
            activó.
          </li>
          <li>
            <strong>No devolvemos</strong> los días de Pro que ya pudiste usar, ni por arrepentimiento después de haberlo usado, ni por
            eliminar tu cuenta o dejar de usar la app. Esto no limita los derechos que la ley te reconoce como consumidor.
          </li>
          <li>
            {CORREO_CONTACTO ? (
              <>
                Para pedir una devolución escríbenos a <Correo /> con el correo de tu cuenta y la referencia o la fecha del pago.
              </>
            ) : (
              "Para pedir una devolución escríbenos con el correo de tu cuenta y la referencia o la fecha del pago."
            )}{" "}
            Si te aprobamos la devolución, el tiempo en que llega el dinero depende de Wompi y de tu banco.
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="9. Inteligencia artificial">
        <p>
          Las recomendaciones, las rutas de estudio y las respuestas del tutor las genera un modelo de inteligencia artificial. Pueden
          ser incorrectas, incompletas o desactualizadas. Son una ayuda para estudiar y no sustituyen a tus profesores, tu material de
          clase ni la asesoría de un profesional. Verifica fórmulas, datos y resultados antes de tus evaluaciones. No somos
          responsables de las decisiones académicas que tomes basándote solo en la IA.
        </p>
      </Seccion>

      <Seccion titulo="10. Tu contenido y nuestra propiedad">
        <p>
          Lo que escribes en la app (materias, temas, notas, objetivos, mensajes) sigue siendo tuyo. Nos autorizas a guardarlo,
          procesarlo y mostrártelo solo para prestarte el servicio. {NOMBRE_SITIO}, su marca, su diseño y su código pertenecen a su
          titular y no puedes copiarlos ni reutilizarlos sin autorización.
        </p>
      </Seccion>

      <Seccion titulo="11. Servicios de terceros">
        <p>
          La app se apoya en terceros (Supabase, Vercel, Google, Wompi y, si lo usas, Spotify), cuyo uso también depende de sus
          propias condiciones. Si usas Spotify, escuchar las canciones completas depende de tu cuenta de Spotify (por ejemplo, de que
          tengas Premium y hayas iniciado sesión en tu navegador): eso lo decide Spotify y no podemos controlarlo. Los enlaces a
          otros servicios de música se abren en esas apps, fuera de {NOMBRE_SITIO}.
        </p>
      </Seccion>

      <Seccion titulo="12. Disponibilidad y responsabilidad">
        <ul className={lista}>
          <li>
            Hacemos lo posible por mantener el servicio disponible, pero puede haber interrupciones por mantenimiento, fallas de
            terceros o causas fuera de nuestro control. El servicio se ofrece «tal cual», sin garantía de que esté libre de errores.
          </li>
          <li>
            No somos responsables por daños indirectos, por pérdida de datos, notas o rachas, ni por tus resultados académicos.
          </li>
          <li>
            Nuestra responsabilidad total frente a ti se limita a lo que hayas pagado por el plan Pro en los 12 meses anteriores al
            reclamo (si solo usas el plan Free, no has pagado nada).
          </li>
          <li>Nada de esto limita los derechos que la ley te reconoce como consumidor y que no se pueden renunciar.</li>
        </ul>
      </Seccion>

      <Seccion titulo="13. Terminar tu cuenta">
        <ul className={lista}>
          <li>
            Puedes eliminar tu cuenta cuando quieras desde <strong>Ajustes → Privacidad y datos → Eliminar mi cuenta</strong>. Es
            definitivo: se borran tu cuenta y tus datos, y se pierde el tiempo de Pro que te quede (consulta la sección 8 sobre
            reembolsos).
          </li>
          <li>
            Podemos suspender o cerrar una cuenta si incumples estos términos, si hay un uso fraudulento o si la ley lo exige.
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="14. Cambios en estos términos">
        <p>
          Podemos actualizar estos términos. Publicaremos la nueva versión aquí con su fecha y, si el cambio es importante, te lo
          avisaremos en la app. Si sigues usando {NOMBRE_SITIO} después del cambio, lo aceptas; si no estás de acuerdo, puedes
          eliminar tu cuenta.
        </p>
      </Seccion>

      <Seccion titulo="15. Ley aplicable y contacto">
        <p>
          Estos términos se rigen por las leyes de la República de Colombia. Las controversias se resolverán ante las autoridades
          competentes en Colombia, sin perjuicio de tu derecho a acudir a la Superintendencia de Industria y Comercio como consumidor.{" "}
          {CORREO_CONTACTO ? (
            <>
              Para cualquier duda sobre estos términos escríbenos a <Correo />.
            </>
          ) : (
            "Para cualquier duda sobre estos términos escríbenos por los canales de contacto de la app."
          )}
        </p>
      </Seccion>
    </PaginaLegal>
  );
}
