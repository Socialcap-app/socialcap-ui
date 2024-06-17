import { createQuery, useQueryClient, createMutation } from '@tanstack/svelte-query'
import { getMembers, updateMemberRole } from '$lib/api/queries';
import type { Member } from '$lib/types/member';


export function useGetMembers(communityUid: string, options?: {
  roles?: string[],
  states?: string[]
}) {
    return createQuery<Member[], Error>({
        queryKey: ['get_members', communityUid],
        queryFn: () => getMembers(communityUid, {}),
      })
}

export function useUpdateMemberRole(communityUid: string) {
  const client = useQueryClient();
  return createMutation({
    mutationFn: updateMemberRole,
    // Always refetch after error or success:
    onSettled: () => {
      client.invalidateQueries({ queryKey: ['get_members', communityUid] })
    },
  })
}
