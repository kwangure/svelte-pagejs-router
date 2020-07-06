# Svelte page.js router
### Installing

```bash
npm i @deimimi/svelte-pagejs-router
```

### Usage
```javascript
/**--- main.js ---**/
import App from "./App.svelte"; // the root of your component
import router from "@deimimi/svelte-pagejs-router";

const hashbang = false;  // (e.g /!#/user/:id) - Useful for routing in Electron.
const routes = [
    {
        path: "/user/:id",
        component: () => import("./user.svelte"),
    },
];

router(App, routes, hashbang)
```

```html
<!-- App.svelte -->
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