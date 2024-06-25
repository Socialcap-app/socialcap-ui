import { createQuery, useQueryClient, createMutation } from '@tanstack/svelte-query'
import { getMembers, updateMemberRole, addMemberToAdmins, removeMemberFromAdmins } from '$lib/api/queries';
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

export function useAddMemberToAdmins(communityUid: string) {
  const client = useQueryClient();
  return createMutation({
    mutationFn: addMemberToAdmins,
    // Always refetch after error or success:
    onSettled: () => {
      client.invalidateQueries({ queryKey: ['get_members', communityUid] })
    },
  })
}

export function useRemoveMemberFromAdmins(communityUid: string) {
  const client = useQueryClient();
  return createMutation({
    mutationFn: removeMemberFromAdmins,
    // Always refetch after error or success:
    onSettled: () => {
      client.invalidateQueries({ queryKey: ['get_members', communityUid] })
    },
  })
}
