import { assertIsFunction, assertIsObject, isPlainObject } from "./util.js";
import page from "page";

export function parseQuery(search) {
    const query = Object.create(null);
    if (search.length > 0) {
        search.slice(1).split("&").forEach(searchParam => {
            let [, key, value = ""] = /([^=]*)(?:=(.*))?/.exec(decodeURIComponent(searchParam.replace(/\+/g, " ")));
            if (typeof query[key] === "string") query[key] = [query[key]];
            if (typeof query[key] === "object") (query[key] ).push(value);
            else query[key] = value;
        });
    }
    return query;
}

export default function sveltePageJsRouter(App, routes, {
    target = document.body,
    hydrate = false,
    hashbang = false,
    intro = false,
    base = "",
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
    page("*", function render404() {
        const props = { error: { message: "Page not found" }, status: 404 };
        if (rootComponent) {
            rootComponent.$set(props);
        } else {
            makeInitialRender(props);
        }
    });

    page({ hashbang });

    function makeInitialRender(props) {
        rootComponent = new App({
            target,
            props,
            hydrate,
            intro,
        });
    }

    async function navigate(route, context) {
        const component = await route.component();
        const { params, state: { historyContext } } = context;

        const query = parseQuery(location.search);
        let props = {
            component: component.default,
            path: route.path,
            params,
            query,
            error: false,
            status: 200,
        };

        if (component.preload) {
            assertIsFunction(component.preload, "Exported 'preload' must be a function");

            const preload = await component.preload({ historyContext, params, query });

            assertIsObject(preload, "Result from 'preload' must an 'Object'");

            props = { ...props, preload };
        }

        if (rootComponent) {
            rootComponent.$set(props);
        } else {
            makeInitialRender(props);
        }

        rootComponent.$on("navigate", (e) => {
            const eventValue = e.detail;

            if (typeof eventValue === "string") {
                page.show(eventValue);
            } else if (isPlainObject(eventValue)) {
                const { url, context } = eventValue;
                page.show(url, { historyContext: context })
            }
        });
    }
}