<script lang="ts">
	import { onMount } from 'svelte';
    import { Button, Modal, Label, Input, Helper, Badge } from 'flowbite-svelte';
	import { SubmitButton } from '$lib/components';
    
    import * as yup from 'yup'; 
    import { createForm } from 'felte';
    import { PlusOutline, CloseOutline, LinkOutline, XSolid} from 'flowbite-svelte-icons'
	import { Icon } from "$lib/components";

    export let openModal = false;
    let link = ""
    const text = "Check out this amazing community!";
    const hashtags = "socialcap,community,share";
    
    onMount(() => {
       link = window.location.href; 
	})
    
    const copyToClipboard = async (e:MouseEvent) => {
      try {
        e.preventDefault()
        e.stopPropagation()
        await navigator.clipboard.writeText(link);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    };

    function shareOnTwitter(text, url, hashtags) {
        const shareUrl = new URL('https://twitter.com/intent/tweet');
        shareUrl.searchParams.set('text', text);
        shareUrl.searchParams.set('url', url);
        if (hashtags) {
        shareUrl.searchParams.set('hashtags', hashtags);
        }

        window.open(shareUrl.toString(), '_blank');
    }


    function handleShare() {
        shareOnTwitter(text,link, hashtags);
    }
   
</script>

<Modal class="mt-20 lg:mt-[calc(50%-100px)] max-w-md" bind:open={openModal} placement="top-center">
    <div>
        <div class="lg:max-w-2xl w-full m-auto">
            <Label for="email" class="text-base text-black">Share Community</Label>
            <Helper class="mt-2 text-gray-400">Anyone who has this link will be able to view this profile</Helper>
            <div class="flex items-center mt-1">
                <Input class="my-1 ml-2 text-sm leading-none text-gray-400 leading-none" 
                    type="text" id="name" name="name" placeholder="Pablo Doe" required value={link} readonly  />
                <Button class="w-12 my-2 ml-2 px-1 bg-primary-500" size="sm" on:click={(e) => copyToClipboard(e)}>
                    <Icon size=5 name="Copy"></Icon>
                </Button>
            </div>
        </div>
        <hr class="mt-4">
        <SubmitButton class="mt-4 w-full"
          size="md"  
          on:click={(e)=>{
            e.preventDefault()
            e.stopPropagation()
            handleShare()}
          }>Share on <XSolid class="ml-1" size="sm"/></SubmitButton>
    <div>
</Modal>