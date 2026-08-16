export type AvatarSource =
  | { kind: "empty" }
  | { kind: "image"; source: string }
  | { kind: "text"; text: string };

const rawImageSources = [
  { mimeType: "image/png", prefix: "iVBORw0KGgo" },
  { mimeType: "image/jpeg", prefix: "/9j/" },
  { mimeType: "image/gif", prefix: "R0lGOD" },
  { mimeType: "image/webp", prefix: "UklGR" },
  { mimeType: "image/svg+xml", prefix: "PHN2Zy" },
  { mimeType: "image/x-icon", prefix: "AAABAA" },
] as const;

function resolveImageSource(value: string) {
  if (/^(?:https?:\/\/|data:image\/|blob:)/i.test(value) || value.includes("/")) {
    return value;
  }

  const matchedSource = rawImageSources.find(({ prefix }) => value.startsWith(prefix));
  return matchedSource ? `data:${matchedSource.mimeType};base64,${value}` : undefined;
}

export function resolveSource(value?: string): AvatarSource {
  const source = value?.trim();
  if (!source) return { kind: "empty" };

  const imageSource = resolveImageSource(source);
  if (imageSource) return { kind: "image", source: imageSource };

  return { kind: "text", text: source };
}
