import { AuthRule, User } from "@lri/types";

function normalizeValues(values: unknown): string[] {
  if (!Array.isArray(values)) return [];

  return values
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function includesAll(actual: readonly string[], expected: unknown) {
  return normalizeValues(expected).every((value) => actual.includes(value));
}

function includesAny(actual: readonly string[], expected: unknown) {
  const values = normalizeValues(expected);
  return values.length === 0 || values.some((value) => actual.includes(value));
}

export function allowUser(user: User | undefined, rule: AuthRule): boolean {
  if (rule.anonymous === true) return true;
  if (!user) return false;

  const nestedRules = Array.isArray(rule.rules) ? rule.rules : [];
  const nestedRulesAny = Array.isArray(rule.rulesAny) ? rule.rulesAny : [];

  return (
    includesAll(user.roles, rule.roles) &&
    includesAny(user.roles, rule.rolesAny) &&
    includesAll(user.permission, rule.permissions) &&
    includesAny(user.permission, rule.permissionsAny) &&
    includesAll(user.organizations, rule.organizations) &&
    includesAny(user.organizations, rule.organizationsAny) &&
    includesAll([user.tenantId], rule.tenantIds) &&
    includesAny([user.tenantId], rule.tenantIdsAny) &&
    nestedRules.every((item) => allowUser(user, item)) &&
    (nestedRulesAny.length === 0 || nestedRulesAny.some((item) => allowUser(user, item)))
  );
}