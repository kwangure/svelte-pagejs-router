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
        const { params } = context;
        const query = parseQuery(location.search);
        let props = {
            component: component.default,
            path: route.path,
            params,
            query,
            error: false,
            status: 200,
        };

        if(component.preload) {
            if (typeof component.preload === "function") {
                let preload = await component.preload({ params, query });
                
                if(Object.prototype.toString.call(preload) !== "[object Object]") {
                    throw Error(`Result from "preload" function must of type Object -> "{}"`);
                }

                props = { ...props, preload }
            } else if (import.meta.env.DEV) {
                throw Error(`Exported "preload" must be a function`);
            }
        }

        if (rootComponent) {
            rootComponent.$set(props);
        } else {
            makeInitialRender(props);
        }
    }
}