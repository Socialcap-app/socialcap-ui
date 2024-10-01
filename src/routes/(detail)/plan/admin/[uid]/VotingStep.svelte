<script lang="ts">
    import { StepState, CLAIMING_TEXT, ASSIGNING_TEXT, ISSUING_TEXT, TALLYING_TEXT, VOTING_TEXT } from "$lib/types/states"
    import { CheckOutline } from "flowbite-svelte-icons";
    import  Claiming  from "$lib/components/icons/claiming.svelte"
    import  Assigning  from "$lib/components/icons/assigning.svelte"
    import  Issuing  from "$lib/components/icons/issuing.svelte"
    import  Tallying  from "$lib/components/icons/tallying.svelte"
    import  Voting  from "$lib/components/icons/voting.svelte"


    export let action = ""
    export let description = ""
    export let handler
    export let isFirst = false;
    export let stepState;

    let iconOptions = [
        { step: CLAIMING_TEXT, component: Claiming },
        { step: ASSIGNING_TEXT, component: Assigning },
        { step: ISSUING_TEXT, component: Issuing },
        { step: TALLYING_TEXT, component: Tallying },
        { step: VOTING_TEXT, component: Voting },
    ];

    let iconCompoent = iconOptions.find(option => option.step == action)?.component;

    let connectorColor = stepState == StepState.COMPLETED ? "bg-[#15803D]" : stepState == StepState.ONGOING ? "bg-primary-500" : "bg-gray-200"  

</script>
<div>
    {#if isFirst == false}
        <div class={connectorColor + " ml-[22px] mt-6 h-6 w-0.5"}></div>
    {/if}
    <div class="flex items-center gap-4 mt-6">
        {#if stepState === StepState.COMPLETED}
        <div class="flex items-center justify-center bg-[#15803D] border-[3px] border-[#86EFAC] rounded-full h-[46px] w-[46px]">
            <CheckOutline color="white" strokeWidth="3"/> 
        </div>
        <span class="font-semibold text-base text-[#15803D]">
            {action}
        </span>
        {:else if stepState === StepState.ONGOING}
        <div class="flex items-center justify-center bg-primary-500 rounded-full h-[46px] w-[46px]">
            <svelte:component this={iconCompoent} color="white"/>
        </div>
        <span class="font-semibold text-2xl text-primary-500">
            {action}
        </span>
        {:else } 
        <div class="flex items-center justify-center bg-gray-200 rounded-full h-[46px] w-[46px]">
            <svelte:component this={iconCompoent} color="gray"/>
        </div>
        <span class="font-semibold text-base text-gray-300">
            {action}
        </span>
        {/if}
    </div>
    {#if stepState === StepState.ONGOING && handler}
        <div class={connectorColor + " ml-[22px] mt-6 h-6 w-0.5"}></div>
        <p class={description?"text-gray-500 mt-6 text-sm":"hidden "}} >{description}</p>
        <slot name="button">

        </slot>
    {/if}
</div>