<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Dropdown, DropdownItem } from 'flowbite-svelte';
    import {  DotsVerticalOutline } from 'flowbite-svelte-icons';
  
    export let 
      isAdmin: boolean = false,
      role: string = "",
      open = false;
  
    let items: any[] = [];   
  
    const dispatcher = createEventDispatcher();  
  
    $: items = buildItems(isAdmin, role);
   
    /*
        TODO: ask about if some one not admin can see this view or event change some role
        Set as Admin
        Unset as Admin
        Set as Validator
        Set as Judge
        Set as Member (if user state is Pending)

        --- 
        "0": 'INITIAL',
        "1": 'PLAIN',
        "2": 'VALIDATOR',
        "3": 'AUDITOR'
    */

    function buildItems(isAdmin:boolean,role:string){
        items = [];
        if (isAdmin === true) {
            items.push({ name: 'Unset as Admin', action: 'unset_admin'});
        } else {
            items.push({ name: 'Set as Admin', action: 'set_admin'});
        }
        if (role == '0') {
            items.push({ name: 'Set as Member', action: 'set_member'});
        }
        if (role == '1') {
            items.push({ name: 'Set as Validator', action: 'set_validator'});
            items.push({ name: 'Set as Auditor', action: 'set_auditor'});
        }
        if (role == '2') {
            items.push({ name: 'Set as Member', action: 'set_member'});
            items.push({ name: 'Set as Auditor', action: 'set_auditor'});
        }
        if (role == '3') {
            items.push({ name: 'Set as Member', action: 'set_member'});
            items.push({ name: 'Set as Validator', action: 'set_validator'});
        }
        return items
    }
  
    function dispatch(ev: any, action: string) {
      ev.preventDefault();//.stopPropagation();
      dispatcher(action);
      open = false;
    }
  </script>
  
<button 
    on:click|preventDefault|stopPropagation={() => open = !open} 
    class="w-5 justify-self-end">
    <DotsVerticalOutline class="dark:text-white" />
</button>
<Dropdown   bind:open={open}  placement="bottom" class="shadow-lg rounded-lg border-2 border-gray-100 text-black py-1">
{#each items as item}
    <DropdownItem on:click={(ev) => dispatch(ev,item.action)}>
    {item.name}
    </DropdownItem>
{/each}
</Dropdown>
  