// react-helmet-async ships CommonJS; server rendering cannot use its named exports
// directly, so resolve them through the module object (works on server and browser).
import * as helmetModule from "react-helmet-async";

type HelmetModule = typeof import("react-helmet-async");
const resolved = ((helmetModule as unknown as { default?: HelmetModule }).default ?? helmetModule) as HelmetModule;

export const Helmet = resolved.Helmet;
export const HelmetProvider = resolved.HelmetProvider;
