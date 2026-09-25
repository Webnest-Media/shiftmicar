import slugifyLib from "slugify";

export function slugify(value: string) {
  const fn = (typeof slugifyLib === "function" ? slugifyLib : (slugifyLib as any)?.default || slugifyLib) as any;
  return fn(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}
