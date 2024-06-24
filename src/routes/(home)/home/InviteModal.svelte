<script lang="ts">
    import { Button, Modal, Label, Input, Helper, Badge } from 'flowbite-svelte';
    

    import * as yup from 'yup'; 
    import { createForm } from 'felte';
    import { PlusOutline, CloseOutline } from 'flowbite-svelte-icons'


    export let openModal = false;
    let new_mail:string = "";
    let mails:string[] = [];
    let link:string = "";
    // TODO: improve validations

    const addMail = (e:Event) => {
      e.preventDefault()
      e.stopPropagation()
      mails = [...mails, new_mail];
      new_mail = ""
      console.log(mails)
    }

    const removeMail = (e:MouseEvent, index:number) =>{
      e.preventDefault()
      e.stopPropagation()
      console.log(index)  
      mails = [...mails.slice(0, index), ...mails.slice(index + 1)];
    }

    const schema = yup.object({
      name: yup.string().required('Name is required'),
      email: yup.string().email().required('Email is required'),
      
    });

    const { form, errors, isValid, touched, createSubmitHandler } = createForm({
      debounced: {
        timeout: 450, 
        validate: async (values) => {
          try {
            await schema.validate(values, { abortEarly: false });
          } catch (err: any) {
            const errors = err.inner.reduce(
              (res: any, value: any) => ({
                [value.path]: value.message,
                ...res
              }),
              {}
            );
            return errors;
          }
        }
      }
    });
</script>

<Modal  bind:open={openModal} autoclose>
    
    <form>
        <div class="lg:max-w-2xl w-full m-auto">
            <Label for="name" class="text-base text-black {$errors.name ? "text-red-500" : ""}">Invite</Label>
            <Helper class="mt-2 text-gray-400">Invite teammates to Socialcap</Helper>
            <div class="flex">
                <Input class="mt-2 text-sm text-black {$errors.name ? "text-red-500" : ""}" 
                  on:keydown={(e)=>{
                    if (e.key === "Enter") {
                      addMail(e)
                    }
                  }} 
                  type="text" id="name" name="name" placeholder="Pablo Doe" required bind:value={new_mail} />
                <Button class="bg-primary-500" on:click={(e) => addMail(e)}><PlusOutline/></Button>
            </div>
            {#if $errors.name && $touched.name}
            <span class="mt-2 text-sm text-red-500">{$errors.name}</span>
            {/if}
            <div class="flex flex-wrap gap-3 mt-4">
            {#each mails as mail, index (index)}
              <Badge dismissable rounded color="dark" class="bg-gray-400 py-1 px-2.5 text-xs font-semibold text-white">
                {mail}
                <button slot="close-button" on:click={(e)=>removeMail(e,index)} type="button" class="inline-flex ml-2 items-center text-white" aria-label="Remove">
                  <CloseOutline color="white" class="font-semibold h-4 w-4" />
                </button>
              </Badge>
            {/each}
            </div>
        </div>
    </form>
        
    <svelte:fragment slot="footer">
      <Button on:click={() => alert('Handle "success"')}>I accept</Button>
      <Button color="alternative">Decline</Button>
    </svelte:fragment>
  </Modal>