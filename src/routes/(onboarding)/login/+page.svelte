<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		getCurrentSession,
		removeActiveSession,
		saveActiveSession,
		type Session
	} from '$lib/store/sessions';
	import { requestOTP, signUp } from '$lib/api/mutations';
	import { Button, Label, Input, A } from 'flowbite-svelte';
	import { SubmitButton } from '$lib/components';
	import { MetaTag } from '$lib/components';
	import Onboarding from '../Onboarding.svelte';
	import { userLoggedIn } from '$lib/store/navigation';

	let session: Session | null = null;
	let email: string = '';
	let alert: 'NO_EMAIL' | 'NO_OTP' | 'DONE' | null = null;
	let working = '';
	let status = 'WAIT';

	const STATUS_COLORS: any = {
		NO_EMAIL: 'WARNING',
		NO_OTP: 'WARNING',
		DONE: 'SUCCESS'
	};

	$: status = alert ? STATUS_COLORS[alert] : 'WAIT';

	onMount(async () => {
		session = removeActiveSession();
		$userLoggedIn = false;
	});

	async function getOTP() {
		working = 'Sending ...   ';
		let rsp = await requestOTP({
			email: email
		});
		working = '';

		if (rsp.error?.code === 404) {
			// No valid email, go to signup
			alert = 'NO_EMAIL';
			return;
		}

		if (rsp.error) {
			alert = 'NO_OTP';
			return;
		}

		// success, ask for /otp
		alert = 'DONE'; // "Done ! Going to Home ..."
		/* $userLoggedIn = true; */
		setTimeout(() => {
			session = session as Session;
			session.key = rsp.data?.session_key;
			saveActiveSession(session);
			goto(`/otp?sk=${rsp.data?.session_key}`);
		}, 500);
	}

	function isValidEmail(email: string) {
		return email.length > 0 && email.includes('@');
	}
</script>

<MetaTag path="/login" title="Socialcap" subtitle="Sign in" description="Input your email" />

<Onboarding
		title="Sign in"
		subtitle="Enter your email. We will send you a code."
		{alert}
		{status}
	>
		<svelte:fragment slot="alert">
			{#if alert === 'NO_OTP'}
				Problem sending OTP request, please try again
			{/if}
			{#if alert === 'NO_EMAIL'}
				Could not find your email. Correct it or
				<A class="" href="/signup">sign up !</A>
			{/if}
			{#if alert === 'DONE'}
				Done ! Input the OTP we send you
			{/if}
		</svelte:fragment>

		<svelte:fragment slot="inputs">
			<Label class="mt-6 space-y-2">
				<span class="ps-1 text-sm font-semibold">Email</span>
				<Input bind:value={email} type="email" size="lg" name="email" placeholder="" required />
			</Label>
		</svelte:fragment>

		<svelte:fragment slot="buttons">
			<Button
				class="order-2 w-full md:order-1 md:mb-0 md:w-auto"
				color="light"
				href="/signup"
				size="lg"
			>
				No account ? &nbsp;
				<span class="text-blue-700"> Sign up ! </span>
			</Button>

			<SubmitButton
				on:click={() => getOTP()}
				{working}
				disabled={!isValidEmail(email)}
				class="order-1 mb-2 w-full md:order-2 md:mb-0 md:ms-2 md:w-auto"
				size="lg"
			>
				Send me the code
			</SubmitButton>
		</svelte:fragment>
</Onboarding>