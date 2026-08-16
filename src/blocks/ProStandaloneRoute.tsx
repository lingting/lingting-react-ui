import { useRouter } from "@/hooks";
import { BasicLayout } from "@/layout";

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
