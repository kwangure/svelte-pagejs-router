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
} = {}) {
    let rootComponent;

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
        let props = {
            component: (await route.component()).default,
            path: route.path,
            params: context.params,
            query: parseQuery(location.search),
            error: false,
            status: 200,
        };

        if (rootComponent) {
            rootComponent.$set(props);
        } else {
            makeInitialRender(props);
        }
    }
}