<script>
    import { Badge } from "flowbite-svelte";
    import {States, toState} from "$lib/types/states";
    let clazz = "";
    export { clazz as class };
    export let data; // State number

    /* console.log("clazz", clazz) */
    let state = toState(data)

    $:{
        state = toState(data);
    }
</script>


{#if state.badgeType === "info"}
<Badge rounded color="yellow" class={`py-1 px-3 lg:py-2 lg:px-4 text-yellow-800 ${clazz || ''}`}>
   <p class="text-xs"> {state.name}</p>
</Badge>
{/if}

{#if state.badgeType === "danger"}
<Badge rounded color="red" class={`py-1 px-3 lg:py-2 lg:px-4 text-red-800 ${clazz || ''}`}>
    <p class="text-xs"> {state.name}</p>
</Badge>
{/if}

{#if state.badgeType === "success"}
<Badge rounded color="green" class={`py-1 px-3 lg:py-2 lg:px-4 text-green-800 ${clazz || ''}`}>
    <p class="text-xs"> {state.name}</p>
</Badge>
{/if}

{#if state.badgeType === "warning"}
<Badge rounded color="yellow" class={`py-1 px-3 lg:py-2 lg:px-4 text-gray-800 ${clazz || ''}`}>
    <p class="text-xs"> {state.name}</p>
</Badge>
{/if}