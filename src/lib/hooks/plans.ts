
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
import { getPlan, getAdminedPlans, getAllClaimables, updatePlan } from '$lib/api/queries';
import type { Plan } from '$lib/types/plan';

export function useGetPlan(uid: string) {
    return createQuery<Plan, Error>({
        queryKey: ['get_plan', uid],
        queryFn: () => getPlan({uid}),
        enabled: uid !== undefined && uid !== "new"
      })
}

export function useGetAdminedPlans() {
  return createQuery<Plan[], Error>({
      queryKey: ['get_admined_plans'],
      queryFn: () => getAdminedPlans(),
    })
}

export function useGetAllClaimables(params: { 
  joined?: boolean
}) {
  return createQuery<Plan[], Error>({
      queryKey: ['get_my_claimables'],
      queryFn: () => getAllClaimables(params),
    })
}

export function useUpdatePlan(uid: string | undefined) {
  const client = useQueryClient();
  return createMutation({
    mutationFn: updatePlan,
    // Always refetch after error or success:
    onSettled: () => {
      client.invalidateQueries({ queryKey: ['get_plan', uid] })
    },
  })
}