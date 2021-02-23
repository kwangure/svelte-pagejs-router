import { assertIsFunction, assertIsObject, isPlainObject } from "./util.js";
import page from "page";
import root, { stores } from "./_root.svelte";
// TODO(kwangure): import `error` and `layout` dynamically down
// in router options. Dynamic imports don't work well with
// "rollup-plugin-chrome-extension". It's easier to fix here
// rather than debug. `error` and `layout` are tiny anyways.
import error from "./_error.svelte";
import layout from "./_layout.svelte";

export { stores };

export function querystingToObject(querystring) {
    const urlParams = new URLSearchParams(querystring);
    const params = Object.fromEntries(urlParams);
    return params;
}

export default function sveltePageJsRouter(routes, {
    target = document.body,
    hydrate = false,
    hashbang = false,
    intro = false,
    base = "",
    error: getError = () => error,
    layout: getLayout = () => layout,
} = {}) {
    let rootComponent;
    if (base) {
        page.base(base);
    }
    // Render component if route matches
    routes.forEach(({ path, component }) => {
        page(path, ctx => navigate(component, ctx));
    });

    // Error home on 404
    page("*", (ctx) => navigate(null, ctx, true));

    page({ hashbang });

    async function navigate(getComponent, context, is404) {
        const { params, routePath, querystring, state: { historyContext } } = context;
        const query = querystingToObject(querystring);

        let component, layout, error, preload, status;
        if (is404) {
            error = { message: "Page not found" };
            status = 404;
            [component, layout] = await Promise.all([getError(), getLayout()]);
            preload = null;
        } else {
            error = false;
            status = 200;

            [component, layout] = await Promise.all([getComponent(), getLayout()]);
            if (component.preload) {
                assertIsFunction(component.preload, "Exported 'preload' must be a function");
                preload = await component.preload({ historyContext, params, query });
                assertIsObject(preload, "Result from 'preload' must be an 'Object'");
            } else {
                preload = null;
            }
        }

        const props = {
            component: component.default,
            layout: layout.default,
            path: routePath,
            params: params,
            query: query,
            error: error,
            status: status,
            preload: preload,
        };

        if (rootComponent) {
            rootComponent.$set(props);
        } else {
            rootComponent = new root({ target, props, hydrate, intro });
        }
    }
}

export function navigate(to) {
    if (typeof to === "string") {
        page.show(to);
    } else if (isPlainObject(to)) {
        const { url, context } = to;
        page.show(url, { historyContext: context })
    }
}