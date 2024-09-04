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
	import { loginFormShow } from '$lib/store/navigation';
	import { useGetPublicCommunities } from '$lib/hooks/communities';
	import ForYou from '../../(home)/home/ForYou.svelte';
	import { useGetPublicClaims } from '$lib/hooks/plans';
	import InvitationCard from '../../(home)/home/InvitationCard.svelte';
	import InviteModal from '../../(home)/home/InviteModal.svelte';

	let session: Session | null = null;
	let email: string = '';
	let alert: 'NO_EMAIL' | 'NO_OTP' | 'DONE' | null = null;
	let working = '';
	let status = 'WAIT';
	let loginFormShowing = false;
	let inviteCardIsShowing = true;
	let pubCommunities = useGetPublicCommunities();
	let pubClaimables = useGetPublicClaims();

	const STATUS_COLORS: any = {
		NO_EMAIL: 'WARNING',
		NO_OTP: 'WARNING',
		DONE: 'SUCCESS'
	};
  	let openModal = false;

	$: status = alert ? STATUS_COLORS[alert] : 'WAIT';

	onMount(async () => {
		session = removeActiveSession();
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

	loginFormShow.subscribe((e) => {
		loginFormShowing = e;
	});

	$: {
		if(!loginFormShowing){
			inviteCardIsShowing = true;
			openModal=false
		};
	}
</script>

<MetaTag path="/login" title="Socialcap" subtitle="Sign in" description="Input your email" />

{#if loginFormShowing}
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
{:else}
	{#if inviteCardIsShowing}
		<div class="headings m-auto py-10 my-10 w-screen text-center">
			<!-- <h1 class="text-2xl font-semibold">Create your community</h1>
			<p class="mb-10 text-base font-normal">Invite teammates and create better communities</p>
			<Button color={'blue'}>Create your community</Button> -->
			<div class="relative max-w-xl m-auto mt-5 z-50">
				<InvitationCard bind:open={inviteCardIsShowing} on:close={()=>inviteCardIsShowing = false}
					on:invite={()=>{
					openModal = false
					openModal=true}}
				/>
				<InviteModal {openModal}/>
			</div>
			{#if window.innerWidth > 750}
				<div class="square one"></div>
				<div class="square two"></div>
		{#if window.innerWidth > 1000}
			<div class="square three"></div>
			<div class="square four"></div>
		{/if}
			{/if}
		</div>
	{/if}
	<div class="m-auto max-w-2xl p-5 text-left">
		<ForYou claimables={pubClaimables} communities={pubCommunities} />
	</div>
{/if}

<style>
	.headings {
		color: #102353;
    position: relative;
		background: rgb(255, 255, 255);
		background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(245, 248, 255, 1) 100%);
		overflow: hidden;
	}
	.square {
		position: absolute;
		width: 200px;
		height: 200px;
		background: rgb(214, 230, 255);
		background: linear-gradient(45deg, rgba(214, 230, 255, 1) 0%, rgba(242, 247, 255, 1) 100%);
		border-radius: 15%;
		z-index: 0;
	}
	.one {
		top: 10%;
		right: 0%;
		transform: rotateZ(45deg);
	}
	.two {
		width: 100px;
		height: 100px;
		top: 10%;
		left: 5%;
		transform: rotateZ(155deg);
	}
	.three {
		right: 20%;
		top: 50%;
		transform: rotateZ(-10deg) scale(0.8);
	}
	.four {
		left: 10%;
		top: 50%;
		transform: rotateZ(35deg) scale(0.7);
	}
</style>
