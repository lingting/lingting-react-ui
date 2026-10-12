import { useRouter } from "@lri/hooks";
import { BasicLayout } from "@lri/layout";
import { resolveRoutePageComponent } from "@lri/lib";

export function StandaloneRoute() {
  const { match } = useRouter();
  if (!match || match.type !== "standalone") return null;

  const Component = resolveRoutePageComponent(match.definition);
  if (match.definition.mode === "none") return <Component />;

  return (
    <BasicLayout>
      <Component />
    </BasicLayout>
  );
}
