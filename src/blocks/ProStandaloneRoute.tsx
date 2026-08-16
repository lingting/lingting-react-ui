import { useRouter } from "@lri/hooks";
import { BasicLayout } from "@lri/layout";

export function ProStandaloneRoute() {
  const { match } = useRouter();
  if (!match || match.type !== "standalone") return null;

  const Component = match.definition.component;
  if (match.definition.mode === "none") return <Component />;

  return (
    <BasicLayout>
      <Component />
    </BasicLayout>
  );
}
