
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
import { getMyClaims, getClaim } from '$lib/api/queries';
import type { Claim } from '$lib/types/claim';
import type { Plan } from "$lib/types/plan";
import { saveDratClaim, updateClaim } from '$lib/api/claims-api';

export function useGetMyClaims() {
  return createQuery<Claim[], Error>({
    queryKey: ['get_my_claims'],
    queryFn: () => getMyClaims({}),
  })
}

export function useGetClaim(
  uid: string,
  plan?: Plan
) {
  return createQuery<Claim, Error>({
      queryKey: ['get_claim'],
      queryFn: () => getClaim({ uid: uid, plan: plan }),
      enabled: !!plan
    })
}

export function useSaveDratClaim() {
    const client = useQueryClient();
    return createMutation({
      mutationFn: saveDratClaim,
      // Always refetch after error or success:
      onSettled: () => {
        client.invalidateQueries({ queryKey: ['get_claim'] })
        client.invalidateQueries({ queryKey: ['get_my_claims'] })
      },
    })
  }

  export function useUpdateClaim() {
    const client = useQueryClient();
    return createMutation({
      mutationFn: updateClaim,
      // Always refetch after error or success:
      onSettled: () => {
        client.invalidateQueries({ queryKey: ['get_my_claims'] });
        client.invalidateQueries({ queryKey: ['get_claim'] })
      },
    })
  }