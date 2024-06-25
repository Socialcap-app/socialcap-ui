<script lang="ts">
	  import { onMount } from 'svelte';
    import { Button, Modal, Label, Input, Helper, Badge } from 'flowbite-svelte';
	  import { SubmitButton } from '$lib/components';
    
    import * as yup from 'yup'; 
    import { createForm } from 'felte';
    import { PlusOutline, CloseOutline } from 'flowbite-svelte-icons'
	  import { Icon } from "$lib/components";
    // import { sendInvites } from '$lib/api/emails-api';

    export let openModal = false;
    let new_mail:string = "";
    let mails:string[] = [];
    let link = ""

    onMount(() => {
      // const LINK = "my-socialcap-dev.vercel.app/signup/";
      link = window.location.origin+"/signup/"; 
	  })


    const addMail = async (e:Event) => {
      e.preventDefault()
      e.stopPropagation()
      try {

        await emailSchema.validate(new_mail);
        // if (new_mail !== "") {
          mails = [...mails, new_mail];
          new_mail = ""
          //}
          $touched.email = false
          $errors.email = null
          console.log(mails)
      } catch (error){
        $errors.email = error.message
        $touched.email = true
      }
    }

    const removeMail = (e:MouseEvent, index:number) =>{

      e.preventDefault()
      e.stopPropagation()
      console.log(index)  
      mails = [...mails.slice(0, index), ...mails.slice(index + 1)];
    }

    const copyToClipboard = async (e:MouseEvent) => {
      try {
        e.preventDefault()
        e.stopPropagation()
        await navigator.clipboard.writeText(link);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    };

    const emailSchema = yup.string().email('Invalid email').required('Invalid email');

    const { form, errors, touched, createSubmitHandler } = createForm({});

    
    const submit = createSubmitHandler({
      onSubmit: async (values, context) => {
        console.log("send mails")
        /*
        async function invite() {
          // const recipients = ['leomanzanal+test1@gmail.com', 'leomanzanal+test2@gmail.com'];
          await sendInvites({recipients : mails.join(",")});
        } */
      },
      onSuccess: (response, context) => {
        console.log("mails sended")
      }
    });
</script>

<Modal class="mt-20 lg:mt-[40%] max-w-md" bind:open={openModal} placement="top-center">
    
    <form use:form on:submit|stopPropagation|preventDefault>
        <div class="lg:max-w-2xl w-full m-auto">
            <Label for="email" class="text-base text-black">Invite</Label>
            <Helper class="mt-2 text-gray-400">Invite teammates to Socialcap</Helper>
            <div class="flex mt-1">
                <Input class="my-0.5 text-sm text-black leading-none {$errors.email ? "text-red-500" : ""}" 
                  on:keydown={(e)=>{
                    if (e.key === "Enter") {
                      addMail(e)
                    }
                  }} 
                  type="text" id="email" name="email" placeholder="Email" required bind:value={new_mail} />
                <Button class="w-10 my-1 ml-2 bg-primary-500" size="sm" on:click={(e) => addMail(e)}><PlusOutline/></Button>
            </div>
            {#if $errors.email && $touched.email}
            <span class="mt-2 text-sm text-red-500">{$errors.email}</span>
            {/if}
            {#if mails.length > 0}
            <div class="flex flex-wrap gap-2 mt-4">
            {#each mails as mail, index (index)}
              <Badge dismissable rounded color="dark" class="bg-gray-400 py-1 px-2.5 text-xs font-semibold text-white">
                {mail}
                <button slot="close-button" on:click={(e)=>removeMail(e,index)} type="button" class="inline-flex ml-2 items-center text-white" aria-label="Remove">
                  <CloseOutline color="white" class="font-semibold h-4 w-4" />
                </button>
              </Badge>
            {/each}
            </div>
            {/if}
        </div>
        <hr class="mt-4">
        <div class="lg:max-w-2xl w-full m-auto">
          <p class="text-gray-400 text-center text-sm mt-4">Or copy invite link</p>
          <div class="flex items-center mt-1">
            <Icon size="6" name={"Link"} />
            <Input class="my-1 ml-2 text-sm leading-none text-gray-400 leading-none" 
              type="text" id="name" name="name" placeholder="Pablo Doe" required value={link} readonly  />
            <Button class="w-12 my-2 ml-2 px-1 bg-primary-500" size="sm" on:click={(e) => copyToClipboard(e)}><Icon size=5 name="Copy"></Icon>
          </Button>
        </div>
        </div>
        <hr class="mt-4">
        <SubmitButton class="mt-4 w-full"
          size="md"  
          on:click={(e)=>{
            e.preventDefault()
            e.stopPropagation()
            submit()}
          } disabled={mails.length===0 ? true : undefined}>Send Invite</SubmitButton>
    </form>
  </Modal>