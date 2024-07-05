<script lang="ts">
    import { Button } from "flowbite-svelte"
    import type { Plan } from "$lib/types";
    import VotingStep  from "./VotingStep.svelte";
    import { StepState, type Step } from "./vote-flow";
    import { NONE, ACTIVE, VOTING, DONE, CLAIMED, TALLYING, ISSUING } from "$lib/types/states";



    export let plan: Plan | undefined = undefined;


    let state = DONE, currentStep:number|undefined;
    let tallyed = null;

        /*
    let steps = [
        { text: 'Claiming', icon: Icon, iconProps: {name: "envelope-plus-fill"} },
        { text: 'Assigning', icon: Icon, iconProps: {name: "people-fill"}},
        { text: 'Voting', icon: Icon, iconProps: {name: "envelope-paper-fill"}},
        { text: 'Tallying', icon: Icon, iconProps: {name: "box-seam-fill"} },
        { text: 'Issuing', icon: Icon, iconProps: {name: "person-circle"} }
    ]; */

    let steps:Step[] = [
        { action: "Claiming", description:"", buttonText: "Stop claiming"},
        { action: "Assigning", description:"", buttonText: ""},
        { action: "Voting", description:"", buttonText: "Stop Voting"},
        { action: "Tallying", description:"", buttonText: "Close Tally"},
        { action: "Issuing", description:"", buttonText: ""},
    ]

    $: {
      // state = plan?.state??NONE; // me parece que está al pedo
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

    function getStepState(action: string): StepState {
        const stepThresholds: { [key: string]: number } = {
            "Claiming": 0,
            "Assigning": 1,
            "Voting": 2,
            "Tallying": 3,
            "Issuing": 4
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
    /*
    function getStepState(action:string) {
        if (action == "Claiming"){
            if (!currentStep){
                return StepState.PENDING
            }
            if (currentStep == 0){
                return StepState.ONGOING
            }
            if (currentStep > 0){
                return StepState.COMPLETED
            }
        }
        if (action == "Assigning"){
            if (!currentStep || currentStep < 1){
                return StepState.PENDING
            }
            if (currentStep == 1){
                return StepState.ONGOING
            }
            if (currentStep > 1){
                return StepState.COMPLETED
            }
        }
        if (action == "Voting"){
            if (!currentStep || currentStep < 2){
                return StepState.PENDING
            }
            if (currentStep == 2){
                return StepState.ONGOING
            }
            if (currentStep > 2){
                return StepState.COMPLETED
            }
        }
        if (action == "Tallying"){
            if (!currentStep || currentStep < 3){
                return StepState.PENDING
            }
            if (currentStep == 3){
                return StepState.ONGOING
            }
            if (currentStep > 3){
                return StepState.COMPLETED
            }
        }
         if (action == "Issuing"){
            if (!currentStep || currentStep < 4){
                return StepState.PENDING
            }
            if (currentStep == 4){
                return StepState.ONGOING
            }
            if (currentStep > 4){
                return StepState.COMPLETED
            }
        }
        
    } */
    

</script>
<div>
    {#each steps as step,index (step.action)}
        <VotingStep action={step.action} description={step.description} stepState={getStepState(step.action)} buttonText={step.buttonText}  isLast={index === steps.length - 1}>
            <Button class="mt-6 bg-primary-500" slot="button">{step.buttonText}</Button>
        </VotingStep>
    {/each}
    <!--
        <VotingStep state={VoteState.COMPLETED} action="Claiming" description="Tirant lo Blanc is a chivalry novel written by Joanot Martorell and published in 1490.">
            <Button class="mt-6 bg-primary-500" slot="button">Stop Claiming</Button>
        </VotingStep>
        <VotingStep state={VoteState.ONGOING} action="Assigning">
            <Button class="mt-6 bg-primary-500" slot="button">Change Assigning</Button>
        </VotingStep>
        <VotingStep state={VoteState.PENDING} action="Issuing">
            <Button class="mt-6 bg-primary-500" slot="button">Stop Claiming</Button>
        </VotingStep>
        <VotingStep state={VoteState.PENDING} action="Tailing">
            <Button class="mt-6 bg-primary-500" slot="button">Stop Claiming</Button>
        </VotingStep>
        <VotingStep state={VoteState.PENDING} action="Voting">
            <Button class="mt-6 bg-primary-500" slot="button">Stop Claiming</Button>
        </VotingStep>
        -->
</div>
