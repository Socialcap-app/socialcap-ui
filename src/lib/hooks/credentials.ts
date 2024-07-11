
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
import { getMyCredentials, getCommunityCredentials, getCredential, getCredentialOnchainData, getClaim } from '$lib/api/queries';
import { type CredentialMint, type Credential, type OnchainCredentialData } from '$lib/types/credential';
import { getCredentialMints, registerCredentialMint } from '$lib/api/credentials-api';

export function useGetMyCredentials() {
  return createQuery<Credential[], Error>({
    queryKey: ['get_my_credentials'],
    queryFn: () => getMyCredentials({}),
  })
}

export function useGetCommunityCredentials(communityUid: string) {
  return createQuery<Credential[], Error>({
    queryKey: ['get_community_credentials', communityUid],
    queryFn: () => getCommunityCredentials(communityUid),
  })
}

export function useGetCredential(uid: string) {
  return createQuery<Credential, Error>({
    queryKey: ['get_credential', uid],
    queryFn: () => getCredential(uid),
  })
}

export function useGetCredentialOnchainData(claimUid: string) {
  return createQuery<OnchainCredentialData, Error>({
    queryKey: ['get_credential_onchain_data', claimUid],
    queryFn: () => getCredentialOnchainData({ claimUid: claimUid }),
  })
}

export function useGetCredentialMints(claimUid: string) {
  return createQuery<CredentialMint[], Error>({
    queryKey: ['get_credential_mints', claimUid],
    queryFn: () => getCredentialMints({ claimUid: claimUid }),
  })
}

export function useRegisterCredentialMint(
  claimUid: string) {
  const client = useQueryClient();
  return createMutation({
    mutationFn: registerCredentialMint, onSettled: () => {
      client.invalidateQueries({ queryKey: ['get_credential_mints', claimUid] })
    }
  })
}
