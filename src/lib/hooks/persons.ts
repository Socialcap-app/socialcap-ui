import { createQuery, useQueryClient, createMutation } from '@tanstack/svelte-query'
import { getProfile, updateProfile } from '$lib/api/queries';
import type { Person } from '$lib/types/person';


export function useGetProfile() {
    return createQuery<Person, Error>({
        queryKey: ['get_profile'],
        queryFn: () => getProfile(),
      })
}

export function useUpdateProfile() {
  const client = useQueryClient();
  return createMutation({
    mutationFn: updateProfile,
    // Always refetch after error or success:
    onSettled: () => {
      client.invalidateQueries({ queryKey: ['get_profile'] })
    },
  })
}
