<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
	import type { Session, User } from "$lib/types";
  import { getCurrentSession, getDefaultSession } from "$lib/store";
  import { saveActiveSession, saveActiveUser } from "$lib/store";
  import { redirectUrl } from "$lib/store/navigation"
  import { get } from 'svelte/store';
  import { API } from "$lib/api";
  import { login } from "$lib/api/mutations";
  import { Button, Label, Input  } from "flowbite-svelte";
	import { MetaTag, SubmitButton } from '$lib/components';
  import Onboarding from "../Onboarding.svelte";
  
  export let data: any;
 
  let otp: string = "";
  let session: Session | null = null;
  let working = "";
  let alert: 'DONE' | 'NO_OTP' | null = null;
  let status = "WAIT";

  const STATUS_COLORS: any = {
    'NO_OTP': 'WARNING',
    'DONE': 'SUCCESS'
  }

  $: status = alert ? STATUS_COLORS[alert] : 'WAIT';

  onMount(async () => {
    session = getCurrentSession();
  })

  async function loginNow() {
    working = "Go ...";
    let rsp = await login({ 
      session_key: data.sessionKey, 
      otp: otp 
    });
    working = "";

    if (rsp.error) {
      alert = 'NO_OTP'; 
      return;
    }

    // save state in currentSession
    session = getDefaultSession();
    session.authorization = rsp.data.authorization;
    saveActiveSession(session);
    API.init(session);  

    // set the active user and save it
    let user: User = rsp.data.profile as User;
    saveActiveUser(user);

    // success
    // alert = 'DONE';
    setTimeout(() => { 
      const redirectTo = get(redirectUrl) || '/home';
      redirectUrl.set('');
      goto(redirectTo); 
    }, 1000)
  } 

  function validateOtp(e: any) {
    const value = e.target.value;
    const input = e.data;
    const isValid = "0123456789".includes(input) 
                    || e.inputType == "deleteContentBackward";
    console.log("before: ", e.key, input, isValid, value, otp);
    otp = isValid ? value : otp;                  
    console.log("after: ", value, otp);
    e.target.value = otp;
  }

  $: noSignin = ((otp || '').length < 6);
</script>

<MetaTag 
  path="/login" 
  title="Socialcap" 
  subtitle="OTP" 
  description="Input your OTP code here" 
/>

<Onboarding
  title="Check your email" 
  subtitle="We sent you the verification code"
  alert={alert}
  status={status}
  >
  <svelte:fragment slot="alert">
    {#if alert === 'NO_OTP'}
      The OTP code seems invalid, please try again !
    {/if}
    {#if alert === 'DONE'}
      <!-- Done ! Going to Home ... -->
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="inputs">
    <Label class="space-y-2 mt-6">
      <span class="text-sm font-semibold ps-1">Enter 6 digit code</span>
      <div class="flex items-center justify-between space-x-1">
        <!-- on:input={(e) => validateOtp(e)} -->
        <Input 
          bind:value={otp}
          class="tracking-[1.4rem] text-2xl w-full ps-4 pe-0 overscroll-none"
          maxlength="6"
          name="otp" 
          placeholder="------" 
          required 
          autofocus
        />
      </div>
    </Label>
  </svelte:fragment>

  <svelte:fragment slot="buttons">
    <Button 
      class="w-full order-2 md:order-1 md:w-auto md:mb-0"
      color="light" 
      href="/login">
      <span  class="text-blue-600">
        Other email ?
      </span>
    </Button>
    
    <SubmitButton
      on:click={() => loginNow()} 
      {working}
      disabled={noSignin}
      class="w-full mb-2 order-1 md:order-2 md:w-auto md:mb-0 md:ms-2"
      size="lg">
      Sign in
    </SubmitButton>
  </svelte:fragment>
</Onboarding>

