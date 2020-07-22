# Svelte page.js router
## Installing

```bash
npm i @deimimi/svelte-pagejs-router
```

## Usage
```javascript
/**--- main.js ---**/
import root from "./root.svelte"; // the root of your component
import router from "@deimimi/svelte-pagejs-router";

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
    export let error = false;
    export let status = 200;

    // you can pass these to `component` using `setContext` or props
    export let path;
    export let params;
    export let query;

    export let component;
</script>

{#if error}
    <!-- Display error (e.g status=404)-->
    {#await import("./_error.svelte") then errorPage}
        <svelte:component this={errorPage.default} {error} {status}/>
    {/await}
{:else}
    <!--Display route component given by router-->
    <svelte:component this={component}/>
{/if}
```

## API

### router(root, routes, options?)
Returns `undefined`.

#### route
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


