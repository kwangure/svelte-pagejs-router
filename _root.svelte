<script context="module">
    import { getContext } from "svelte";

    const key = {};

    export function stores() {
        return getContext(key);
    }
</script>

<script>
    import { setContext } from "svelte";
    import { writable } from "svelte/store";

    export let component;
    export let layout;

    export let error = false;
    export let status = 200;

    export let path;
    export let params;
    export let query;
    export let preload = null;

    const pathStore = writable(path);
    const paramsStore = writable(params);
    const queryStore = writable(query);

    $: $pathStore = path;
    $: $paramsStore = params;
    $: $queryStore = query;

    setContext(key, {
        path: pathStore,
        params: paramsStore,
        query: queryStore,
    });
</script>

<svelte:component this={layout} on:navigate>
    {#if error}
        <svelte:component this={component} {error} {status}/>
	{:else}
		<svelte:component this={component} {...preload}/>
	{/if}
</svelte:component>