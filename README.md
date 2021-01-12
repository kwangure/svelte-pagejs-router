# Svelte page.js router
## Installing

```bash
npm i @kwangure/svelte-pagejs-router
```

## Usage
```javascript
/**--- routes.js ---**/
import root from "./root.svelte"; // the root of your app
import router from "@kwangure/svelte-pagejs-router";

const routes = [
    {
        path: "/user/:id",
        component: () => import("./user.svelte"),
    },
];

router(root, routes)
```

```svelte
<!-- root.svelte -->
<script>
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import Layout from "./_layout.svelte";

    export let component;

    export let error = false;
    export let status = 200;

    export let pathname;
    export let params;
    export let query;
    export let preload = null;

    const pathnameStore = writable(pathname);
    const paramsStore = writable(params);
    const queryStore = writable(query);

    $: $pathnameStore = pathname;
    $: $paramsStore = params;
    $: $queryStore = query;

    setContext("__stores__", {
        path: pathnameStore,
        params: paramsStore,
        query: queryStore,
    });
</script>

<Layout on:navigate>
    {#if error}
        {#await import("./_error.svelte") then errorPage}
            <svelte:component this={errorPage.default} {error} {status}/>
        {:catch fetchError}
            <h1>Error displaying {status}</h1>
        {/await}
	{:else}
		<svelte:component this={component} {...preload}/>
	{/if}
</Layout>
```

## API

### router(root, routes, options?)
Returns `undefined`.

#### root
A `SvelteCompnent` with the following props:
- `error: boolean` - Whether to render the error page
- `status: number` - What the request status was
- `path: string` - The path provided in the router
- `params : Object` - The dynamic parts of `path`
- `query: Object` - The search string parsed into an Object
- `component: SvelteCompnent` - The route to render if there's no error

#### routes
An array of `{ path: string, component: () => Promise<typeof import("*.svelte")>}` where `path` is a valid [page.js](https://github.com/visionmedia/page.js) path.

#### options
An `Object` with the following properties:
- Passed to `root: SvelteComponent`
    - `target? HTMLElement` - Where to render the app. Defaults to `document.body`.
    - `hydrate?: boolean` - Whether to hydrate SSRed component. Defaults to `false`.
    - `intro?: boolean` - Whether to animate on initial render. Defaults to `false`
- Passed to page.js
    - `hashbang?: boolean`  (e.g /!#/user/:id) - Useful for routing in Electron. Defaults to `false`.


### `navigate` Event
You can change routes by emitting a `navigate` event. Note that you'll need to [forward DOM events](https://svelte.dev/docs#Component_directives) to the root component since Svelte events don't bubble.

```svelte
<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    dispatch("navigate", "/onion/rainbow");
    // or
    dispatch("navigate", {
        url: "/onion/rainbow/yes",
    });
</script>
```

