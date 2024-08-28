<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getCurrentSession, removeActiveSession, saveActiveSession, type Session } from "$lib/store/sessions";
  import { requestOTP, signUp } from "$lib/api/mutations";
  import { Button, Label, Input, A, Tabs, TabItem  } from "flowbite-svelte";
  import { SubmitButton } from "$lib/components";
  import { MetaTag } from "$lib/components";
  import Onboarding from "../Onboarding.svelte";
	import { isOnPhone, loginFormShow } from "$lib/store/navigation";
	import H1 from "$lib/components/common/H1.svelte";
	import CredentialsList from "$lib/components/credentials/CredentialsList.svelte";
	import CommunitiesList from "$lib/components/communities/CommunitiesList.svelte";
	import { useGetPublicCommunities } from "$lib/hooks/communities";
	import ForYou from "../../(home)/home/ForYou.svelte";
	import { useGetPublicClaims } from "$lib/hooks/plans";

  let session: Session | null = null ;
  let email: string = '';
  let alert: 'NO_EMAIL' | 'NO_OTP' | 'DONE' | null = null;
  let working = "";
  let status = "WAIT";
  let loginFormShowing = false;
  let pubCommunities = useGetPublicCommunities();
  let pubClaimables = useGetPublicClaims();

  const STATUS_COLORS: any = {
    'NO_EMAIL': 'WARNING',
    'NO_OTP': 'WARNING',
    'DONE': 'SUCCESS'
  }

  $: status = alert ? STATUS_COLORS[alert] : 'WAIT';

  onMount(async () => {
    session = removeActiveSession();
  })

  async function getOTP() {
    working = "Sending ...   ";
    let rsp = await requestOTP({ 
      email: email 
    });
    working = "";

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
    }, 500)
  } 

  function isValidEmail(email: string) {
    return (email.length > 0 && email.includes('@'));
  }

  loginFormShow.subscribe((e)=>{
    loginFormShowing = e
  })
</script>

<MetaTag 
  path="/login" 
  title="Socialcap" 
  subtitle="Sign in" 
  description="Input your email" 
/>

{#if loginFormShowing}
  <Onboarding
    title="Sign in" 
    subtitle="Enter your email. We will send you a code."
    alert={alert}
    status={status}
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
      <Label class="space-y-2 mt-6">
        <span class="text-sm font-semibold ps-1">Email</span>
        <Input 
          bind:value={email} 
          type="email" size="lg" name="email" placeholder="" 
          required 
        />
      </Label>
    </svelte:fragment>

    <svelte:fragment slot="buttons">  
      <Button 
        class="w-full order-2 md:order-1 md:w-auto md:mb-0"
        color="light" 
        href="/signup" 
        size="lg"
        > 
        No account ? &nbsp; 
        <span class="text-blue-700">
          Sign up !
        </span>
      </Button>

      <SubmitButton
        on:click={() => getOTP()} 
        {working}
        disabled={!isValidEmail(email)}
        class="w-full mb-2 order-1 md:order-2 md:w-auto md:mb-0 md:ms-2"
        size="lg"
        > 
        Send me the code
      </SubmitButton>
    </svelte:fragment>
  </Onboarding>
{:else}
  <div class="m-5">
    <ForYou isLogged={false} claimables={pubClaimables} communities={pubCommunities} />
  </div>
{/if}

<style>
  .square {
        position: absolute;
        width: 200px;
        height: 200px;
        background: rgb(217, 232, 255);
        background: linear-gradient(
            0deg,
            rgba(217, 232, 255, 1) 0%,
            rgba(242, 247, 255, 0.5) 100%
        );
        border-radius: 15%;
        z-index: 0;
    }
  .one {
      right: 60%;
      transform: rotateZ(45deg);
  }
  .two {
      width: 100px;
      height: 100px;
      right: 85%;
      top: 70%;
      transform: rotateZ(65deg);
  }
  .three {
      right: 55%;
      top: 80%;
      transform: rotateZ(35deg);
  }
</style>
