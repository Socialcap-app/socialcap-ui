<script lang="ts">
    import { Button } from "flowbite-svelte"
    import type { Plan } from "$lib/types";
    import VotingStep  from "./VotingStep.svelte";
    import { StepState, type Step, 
            NONE, ACTIVE, VOTING,
            DONE, CLAIMED, TALLYING, ISSUING,
            CLAIMING_TEXT, ASSIGNING_TEXT,
            ISSUING_TEXT, TALLYING_TEXT,
            VOTING_TEXT } from "$lib/types/states";
	import { useStopClaimings, useEnableVoting, useCloseVoting, useReopenVoting, useStartTally, useCloseTally, useIssueCredentials } from '$lib/hooks/votes';
    
    
    export let plan: Plan | undefined = undefined;
    
    let state:number,  currentStep:number|undefined;
    
    const stopClaimings = useStopClaimings()
    const enableVoting = useEnableVoting()
    const closeVoting = useCloseVoting()
    const startTally = useStartTally()
    const closeTally = useCloseTally() 
    const issueCredentials = useIssueCredentials()

    // use it for updating button text when submitting
    //$: working = $updatePlan.isPending || $createPlan.isPending ? 'Saving' : undefined; // TODO: add working button logic

    let steps:Step[] = [
        { action: CLAIMING_TEXT, description:"", buttonText: "Stop claiming", handler: claimingHandler},
        { action: ASSIGNING_TEXT, description:"Assigning the electors ... This will take some time", buttonText: "Assign electors", handler: assingingHandler},
        { action: VOTING_TEXT, description:"Closing voting. Please wait ...", buttonText: "Stop Voting", handler: votingHandler },
        { action: TALLYING_TEXT, description:"Starting counting votes. Please wait ...", buttonText: "Close Tally", handler: tallyHandler},
        { action: ISSUING_TEXT, description:"Issuing credentials ... this will take some time !", buttonText: "", handler: issuingHandler},
    ]

    $: {
      state = plan?.state??NONE; 
      currentStep = getCurrentStep(state);
    }
	
    function getCurrentStep(state:number|undefined) {
      if (!state)
        return 0;

      if (state === ACTIVE)
        return 0; // still Claiming ...

      if (state === CLAIMED)
        return 1; // can Assign judges now

      if (state === VOTING)
        return 2; // Voting

      if (state === TALLYING)
        return 3; // Cab count votes

      if (state === ISSUING) {
        return 4;
      }

      if (state === DONE)
        return 5; // issue credentials
    }

    function getStepState(action: string,currentStep:number|undefined): StepState {
        const stepThresholds: { [key: string]: number } = {
            [CLAIMING_TEXT]: 0,
            [ASSIGNING_TEXT]: 1,
            [VOTING_TEXT]: 2,
            [TALLYING_TEXT]: 3,
            [ISSUING_TEXT]: 4
        };

        const threshold = stepThresholds[action];
        if (threshold === undefined) return StepState.PENDING; 
        if (currentStep === undefined) return StepState.PENDING; 

        if (currentStep < threshold) {
            return StepState.PENDING;
        }
        if (currentStep === threshold) {
            return StepState.ONGOING;
        }
        return StepState.COMPLETED;
    }

    async function claimingHandler() {
       await $stopClaimings.mutateAsync(plan?.uid!)
    }

    function assingingHandler() {
       $enableVoting.mutateAsync(plan?.uid!)
    }

    async function votingHandler() {
        await $closeVoting.mutateAsync(plan?.uid!)
        $startTally.mutateAsync(plan?.uid!) // TODO: this is a quick fix found thers an extra step.. one for start another to close the tally
    }

    function tallyHandler() {
        $closeTally.mutateAsync(plan?.uid!)
    }

    function issuingHandler() {
        $issueCredentials.mutateAsync(plan?.uid!) 
    }
    
    
</script>
<div>
    {#each steps as step,index (step.action)}
        <VotingStep action={step.action} description={step.description}  handler={step.handler} stepState={ getStepState(step.action,currentStep)}   isFirst={index === 0}>
            <Button class="mt-6 bg-primary-500" slot="button" on:click={step.handler}>{step.buttonText}</Button>
        </VotingStep>
    {/each}
</div>
