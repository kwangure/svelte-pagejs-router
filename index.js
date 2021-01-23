import { assertIsFunction, assertIsObject, isPlainObject } from "./util.js";
import page from "page";
import root, { stores } from "./_root.svelte";

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
    error = () => import("./_error.svelte"),
    layout = () => import("./_layout.svelte"),
} = {}) {
    let rootComponent;
    if (base) {
        page.base(base);
    }
    // Render component if route matches
    routes.forEach(route => {
        page(route.path, ctx => navigate(route, ctx));
    });

    // Error home on 404
    page("*", async function render404(context) {
        const { params, routePath, querystring } = context;
        const [component, Layout] = await Promise.all([error(), layout()]);
        const query = querystingToObject(querystring);
        const props = {
            component: component.default,
            path: routePath,
            params,
            query,
            error: { message: "Page not found" },
            status: 404,
            layout: Layout.default,
        };
        if (rootComponent) {
            rootComponent.$set(props);
        } else {
            makeInitialRender(props);
        }
    });

    page({ hashbang });

    function makeInitialRender(props) {
        rootComponent = new root({
            target,
            props,
            hydrate,
            intro,
        });
        rootComponent.$on("navigate", handleOnNavigate);
    }

    async function navigate(route, context) {
        const [component, Layout] = await Promise.all([route.component(), layout()]);
        const { params, routePath, querystring, state: { historyContext } } = context;

        const query = querystingToObject(querystring);
        let props = {
            component: component.default,
            path: routePath,
            params,
            query,
            error: false,
            status: 200,
            layout: Layout.default,
        };

        if (component.preload) {
            assertIsFunction(component.preload, "Exported 'preload' must be a function");

            const preload = await component.preload({ historyContext, params, query });

            assertIsObject(preload, "Result from 'preload' must an 'Object'");

            props.preload = preload;
        } else {
            // reset existing rootComponent preload
            props.preload = null;
        }

        if (rootComponent) {
            rootComponent.$set(props);
        } else {
            makeInitialRender(props);
        }
    }

    function handleOnNavigate(e) {
        const eventValue = e.detail;

        if (typeof eventValue === "string") {
            page.show(eventValue);
        } else if (isPlainObject(eventValue)) {
            const { url, context } = eventValue;
            page.show(url, { historyContext: context })
        }
    }
}