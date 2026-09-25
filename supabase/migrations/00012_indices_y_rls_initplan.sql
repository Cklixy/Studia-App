-- Índices en las FK y políticas RLS con (select auth.uid()) y TO authenticated (auditoría 2026-09).
-- Equivale a la 00009, que nunca se aplicó en producción, sin los índices que ya cubren restricciones.
-- topic_dependencies exige además que depende_de_tema_id sea un tema del usuario (hallazgo S3).
begin;

-- 1) Índices en las FK (13 advisors)
create index if not exists idx_materias_user_id             on public.materias(user_id);
create index if not exists idx_temas_materia_orden          on public.temas(materia_id, orden);   -- cubre temas_materia_id_fkey
create index if not exists idx_temas_user_id                on public.temas(user_id);
create index if not exists idx_temas_route_id               on public.temas(route_id);
create index if not exists idx_sesiones_user_estado_hora    on public.sesiones(user_id, estado, hora_finalizacion desc); -- cubre sesiones_user_id_fkey
create index if not exists idx_sesiones_materia_id          on public.sesiones(materia_id);
create index if not exists idx_sesiones_tema_id             on public.sesiones(tema_id);
create index if not exists idx_evaluaciones_materia_id      on public.evaluaciones(materia_id);
create index if not exists idx_evaluaciones_user_id         on public.evaluaciones(user_id);
create index if not exists idx_recompensas_user_id          on public.recompensas(user_id);
create index if not exists idx_study_routes_materia_estado  on public.study_routes(materia_id, estado);
create index if not exists idx_study_routes_user_id         on public.study_routes(user_id);
create index if not exists idx_topic_dependencies_depende   on public.topic_dependencies(depende_de_tema_id);

-- 2) Políticas: auth.uid() -> (select auth.uid()) (se evalúa una vez por consulta, no por fila)
--    y TO authenticated en lugar de public (anon no tenía acceso a filas; así ni se evalúa).

alter policy "Users can only select their own materias" on public.materias to authenticated using ((select auth.uid()) = user_id);
alter policy "Users can only insert their own materias" on public.materias to authenticated with check ((select auth.uid()) = user_id);
alter policy "Users can only update their own materias" on public.materias to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "Users can only delete their own materias" on public.materias to authenticated using ((select auth.uid()) = user_id);

alter policy "Users can only select their own temas" on public.temas to authenticated using ((select auth.uid()) = user_id);
alter policy "Users can only insert their own temas" on public.temas to authenticated with check ((select auth.uid()) = user_id);
alter policy "Users can only update their own temas" on public.temas to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "Users can only delete their own temas" on public.temas to authenticated using ((select auth.uid()) = user_id);

alter policy "Users can only select their own sesiones" on public.sesiones to authenticated using ((select auth.uid()) = user_id);
alter policy "Users can only insert their own sesiones" on public.sesiones to authenticated with check ((select auth.uid()) = user_id);
alter policy "Users can only update their own sesiones" on public.sesiones to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "Users can only delete their own sesiones" on public.sesiones to authenticated using ((select auth.uid()) = user_id);

alter policy "Users can only select their own evaluaciones" on public.evaluaciones to authenticated using ((select auth.uid()) = user_id);
alter policy "Users can only insert their own evaluaciones" on public.evaluaciones to authenticated with check ((select auth.uid()) = user_id);
alter policy "Users can only update their own evaluaciones" on public.evaluaciones to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "Users can only delete their own evaluaciones" on public.evaluaciones to authenticated using ((select auth.uid()) = user_id);

alter policy "Users can only select their own rachas" on public.rachas to authenticated using ((select auth.uid()) = user_id);
alter policy "Users can only insert their own rachas" on public.rachas to authenticated with check ((select auth.uid()) = user_id);
alter policy "Users can only update their own rachas" on public.rachas to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "Users can only delete their own rachas" on public.rachas to authenticated using ((select auth.uid()) = user_id);

alter policy "Users can only select their own recompensas" on public.recompensas to authenticated using ((select auth.uid()) = user_id);
alter policy "Users can only insert their own recompensas" on public.recompensas to authenticated with check ((select auth.uid()) = user_id);
alter policy "Users can only update their own recompensas" on public.recompensas to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "Users can only delete their own recompensas" on public.recompensas to authenticated using ((select auth.uid()) = user_id);

alter policy "Users can only select their own subscriptions" on public.push_subscriptions to authenticated using ((select auth.uid()) = user_id);
alter policy "Users can only insert their own subscriptions" on public.push_subscriptions to authenticated with check ((select auth.uid()) = user_id);
alter policy "Users can only update their own subscriptions" on public.push_subscriptions to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "Users can only delete their own subscriptions" on public.push_subscriptions to authenticated using ((select auth.uid()) = user_id);

alter policy "Users can only select their own study_routes" on public.study_routes to authenticated using ((select auth.uid()) = user_id);
alter policy "Users can only insert their own study_routes" on public.study_routes to authenticated with check ((select auth.uid()) = user_id);
alter policy "Users can only update their own study_routes" on public.study_routes to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy "Users can only delete their own study_routes" on public.study_routes to authenticated using ((select auth.uid()) = user_id);

-- topic_dependencies: se exige también que depende_de_tema_id sea del usuario (hallazgo S3)
alter policy "Users can only select their own topic_dependencies" on public.topic_dependencies to authenticated using (exists (select 1 from public.temas t where t.id = topic_dependencies.tema_id and t.user_id = (select auth.uid())));
alter policy "Users can only insert their own topic_dependencies" on public.topic_dependencies to authenticated
  with check (exists (select 1 from public.temas t where t.id = topic_dependencies.tema_id and t.user_id = (select auth.uid()))
    and exists (select 1 from public.temas t2 where t2.id = topic_dependencies.depende_de_tema_id and t2.user_id = (select auth.uid())));
alter policy "Users can only update their own topic_dependencies" on public.topic_dependencies to authenticated
  using (exists (select 1 from public.temas t where t.id = topic_dependencies.tema_id and t.user_id = (select auth.uid())))
  with check (exists (select 1 from public.temas t where t.id = topic_dependencies.tema_id and t.user_id = (select auth.uid()))
    and exists (select 1 from public.temas t2 where t2.id = topic_dependencies.depende_de_tema_id and t2.user_id = (select auth.uid())));
alter policy "Users can only delete their own topic_dependencies" on public.topic_dependencies to authenticated using (exists (select 1 from public.temas t where t.id = topic_dependencies.tema_id and t.user_id = (select auth.uid())));

commit;
