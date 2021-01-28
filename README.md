# Svelte page.js router

This is a light wrapper around [page.js](https://github.com/visionmedia/page.js/) for easier use in Svelte projects.

## Installing

```bash
npm i @kwangure/svelte-pagejs-router
```

## Usage
```javascript
/**--- routes.js (your app's entry point) ---**/
import router from "@kwangure/svelte-pagejs-router";

// routes the router should handle
const routes = [
    {
        path: "/user/:id",
        component: () => import("./user.svelte"),
    },
];

const error = () => import("./_error.svelte");
const layout = () => import("./_layout.svelte");

router(routes, { error, layout });
```

```html
<!-- user.svelte -->
<script>
    import { stores } from "@kwangure/svelte-pagejs-router";

    const { path, params, query } = stores();
</script>
<!--
    Assume the url is `example.com/user/john?like=food`.
    Based on the router setup above(routes.js), expected output is:
    Your name is john. You like food. You're at "/user/john".
-->
<h1>Your name is {$params.id}. You like {$query.like}. You're at "{$path}".</h1>
```

## API

### router(routes, options?)
Returns `undefined`.

#### routes
An array of `{ path: string, component: () => Promise<typeof import("*.svelte")>}` where `path` is a valid [page.js](https://github.com/visionmedia/page.js) path.

#### options
An `Object` with the following properties:
- `layout: () => Promise<typeof import("*.svelte")` - A wrapper component for all routes.
- `error: () => Promise<typeof import("*.svelte")` - The component to render in a 404.
- Passed to Svelte
    - `target?: HTMLElement` - Where to render the app. Defaults to `document.body`.
    - `hydrate?: boolean` - Whether to hydrate SSRed component. Defaults to `false`.
    - `intro?: boolean` - Whether to animate on initial render. Defaults to `false`
- Passed to page.js
    - `hashbang?: boolean`  (e.g /!#/user/:id) - Useful for routing in Electron. Defaults to `false`.


### `navigate` Event
If you need to, you can change routes imperatively by calling `navigate`.

```html
<script>
    import { navigate } from "@kwangure/svelte-pagejs-router";

    navigate("/onion/rainbow");
    // or
    navigate({
        url: "/onion/rainbow",
    });
</script>
```
