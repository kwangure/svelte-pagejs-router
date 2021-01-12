import { assertIsFunction, assertIsObject, isPlainObject } from "./util.js";
import page from "page";

export function parseQuery(querystring) {
    const query = Object.create(null);
    if (querystring.length > 0) {
        querystring.slice(1).split("&").forEach(searchParam => {
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
    page("*", function render404(context) {
        const { params, pathname, querystring } = context;
        const query = parseQuery(querystring);
        const props = {
            params,
            pathname,
            query,
            error: { message: "Page not found" },
            status: 404,
        };
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
        rootComponent.$on("navigate", handleOnNavigate);
    }

    async function navigate(route, context) {
        const component = await route.component();
        const { params, pathname, querystring, state: { historyContext } } = context;

        const query = parseQuery(querystring);
        let props = {
            component: component.default,
            pathname,
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