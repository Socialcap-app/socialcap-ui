import { useQueryClient, createMutation } from '@tanstack/svelte-query'
import { stopClaimings, enableVoting, closeVoting, reopenVoting, startTally, closeTally, issueCredentials } from "$lib/api/queries";


export function useStopClaimings() {
    const client = useQueryClient();
    return createMutation({
        mutationFn: stopClaimings,
        onSettled: () => {
            client.invalidateQueries({ queryKey: ['get_plan'] })
        },
    })
}

export function useEnableVoting(){
    const client = useQueryClient();
    return createMutation({
        mutationFn: enableVoting,
        onSettled: () => {
            client.invalidateQueries({ queryKey: ['get_plan'] })
        },
    })
}

export function useCloseVoting(){
    const client = useQueryClient();
    return createMutation({
        mutationFn: closeVoting,
        onSettled: () => {
            client.invalidateQueries({ queryKey: ['get_plan'] })
        },
    })
}

export function useReopenVoting(){
    const client = useQueryClient();
    return createMutation({
        mutationFn: reopenVoting,
        onSettled: () => {
            client.invalidateQueries({ queryKey: ['get_plan'] })
        },
    })
}

export function useStartTally(){
    const client = useQueryClient();
    return createMutation({
        mutationFn: startTally,
        onSettled: () => {
            client.invalidateQueries({ queryKey: ['get_plan'] })
        },
    })
}

export function useCloseTally(){
    const client = useQueryClient();
    return createMutation({
        mutationFn: closeTally,
        onSettled: () => {
            client.invalidateQueries({ queryKey: ['get_plan'] })
        },
    })
}

export function useIssueCredentials(){
    const client = useQueryClient();
    return createMutation({
        mutationFn: issueCredentials,
        onSettled: () => {
            client.invalidateQueries({ queryKey: ['get_plan'] })
        },
    })
}