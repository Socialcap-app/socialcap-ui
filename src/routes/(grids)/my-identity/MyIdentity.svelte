<script lang="ts">
	import { ErrorOnFetch } from '$lib/components';
	import { Badge } from 'flowbite-svelte';
	import Time from 'svelte-time';
	import { SubmitButton } from '$lib/components';
	import ProfileForm from './IdentityForm.svelte';
	import GradientAvatar from '$lib/components/common/GradientAvatar.svelte';
	import { getInitials, buildGradient } from '$lib/components/common/gradient-svg';
	import { CheckCircleOutline } from 'flowbite-svelte-icons';
	import { useGetProfile } from '$lib/hooks/persons';
	import NoData from '$lib/components/common/NoData.svelte';
	import { capitalizeFirstLetter } from '$lib/helpers/helpers';
	import type { Person } from '$lib/types/person';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import IdentityForm from './IdentityForm.svelte';

	// TODO: add share button and his functionality
	// TODO: load image and add edit functionality

	const profile = useGetProfile();

	$: person = {
		uid: $profile.data?.uid,
		fullName: $profile.data?.fullName,
		identityHash: $profile.data?.identityHash
	} as Person;

	$: identity = {
		label: '',
		pin: ''
	};

	$: initials = getInitials($profile.data?.fullName ?? '');

	$: {
		console.log('person ', person);
	}

	let editing = false;

</script>

<div class="">
	<div class="">
		{#if $profile.isLoading}
			<LoadingSpinner />
		{:else if $profile.isError}
			<ErrorOnFetch description="Upps..." error={$profile.error} />
		{:else if !$profile.data}
			<NoData text="Do You exist?" />
		{:else}
			<div class="relative flex flex-col items-center pb-72 lg:items-start">
				<div class="mt-14 text-3xl text-black lg:ml-11 lg:mt-20 lg:pl-4">
					Identity registration
					{#if $profile.data.identityHash}
						<Badge
							class="ml-3 bg-[#F9FBFC] px-2.5 py-0.5 text-xs font-semibold max-lg:hidden"
							rounded
							color="dark"
						>
							<CheckCircleOutline class="me-1.5 w-4" />Identity already created
						</Badge>
					{/if}
				</div>

				<div class="lg:w-full lg:pl-[60px]">
					<IdentityForm
						{identity}
						on:save={() => {
							editing = false;
						}}
					/>
				</div>
			</div>
		{/if}
	</div>
</div>
