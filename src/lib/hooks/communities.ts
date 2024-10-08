import { createQuery, useQueryClient, createMutation } from '@tanstack/svelte-query';
import {
	getMyCommunities,
	getAllCommunities,
	getCommunity,
	getAdminCommunity
} from '$lib/api/queries';
import type { Community, NewCommunity } from '$lib/types/community';
import {
	createCommunity,
	getPublicCommunities,
	joinCommunity,
	updateCommunity
} from '$lib/api/communities-api';

export function useGetCommunity(uid?: string, getExtraData?: boolean) {
	return createQuery<Community | null, Error>({
		queryKey: ['get_community', uid],
		queryFn: () => getCommunity({ uid: uid!, extras: getExtraData }),
		enabled: !!uid
	});
}

export function useGetAdminCommunity(uid?: string) {
	return createQuery<Community | null, Error>({
		queryKey: ['get_admin_community', uid],
		queryFn: () => getAdminCommunity({ uid: uid! }),
		enabled: !!uid
	});
}

export function useGetMyCommunities() {
	return createQuery<Community[], Error>({
		queryKey: ['get_my_communities'],
		queryFn: () => getMyCommunities({})
	});
}

export function useGetMyAdminedCommunities() {
	return createQuery<Community[], Error>({
		queryKey: ['get_my_admined_communities'],
		queryFn: () => getMyCommunities({ admined: true })
	});
}

export function useGetAllCommunities(params: { notJoined?: boolean; states?: string[] }) {
	return createQuery<Community[], Error>({
		queryKey: ['get_all_communities'],
		queryFn: () =>
			getAllCommunities({
				notJoined: params?.notJoined || true,
				states: params?.states
			})
	});
}

export function useCreateCommunity() {
	const client = useQueryClient();
	return createMutation({
		mutationFn: createCommunity,
		// Always refetch after error or success:
		onSettled: () => {
			client.invalidateQueries({ queryKey: ['get_my_communities'] });
			client.invalidateQueries({ queryKey: ['get_all_communities'] });
			client.invalidateQueries({ queryKey: ['get_my_admined_communities'] });
		}
	});
}

export function useJoinCommunity() {
	const client = useQueryClient();
	return createMutation({
		mutationFn: joinCommunity,
		// Always refetch after error or success:
		onSettled: () => {
			client.invalidateQueries({ queryKey: ['get_my_communities'] });
			client.invalidateQueries({ queryKey: ['get_all_communities'] });
			client.invalidateQueries({ queryKey: ['get_my_admined_communities'] });
			client.invalidateQueries({ queryKey: ['get_community'] });
		}
	});
}

export function useUpdateCommunity(uid: string) {
	const client = useQueryClient();
	return createMutation({
		mutationFn: updateCommunity,
		// Always refetch after error or success:
		onSettled: () => {
			client.invalidateQueries({ queryKey: ['get_admin_community', uid] });
		}
	});
}

export function useGetPublicCommunities() {
	return createQuery<Community[], Error>({
		queryKey: ['get_public_communities'],
		queryFn: () => getPublicCommunities({})
	});
}
