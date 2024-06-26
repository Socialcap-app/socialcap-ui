<script lang="ts">
    import { Dropdown, DropdownItem } from 'flowbite-svelte';
    import {  DotsVerticalOutline } from 'flowbite-svelte-icons';
	import { useUpdateMemberRole, useAddMemberToAdmins, useRemoveMemberFromAdmins } from '$lib/hooks/members';
	import { ACTIONS_MENU, UNSET_ADMIN_ROLE_MENU, SET_ADMIN_ROLE_MENU, type ActionMenu } from '$lib/types/member';
  
    export let 
        personUid: string = "",
        communityUid: string = "",
        isAdmin: boolean = false,
        role: string = "",
        open = false;
  
    let items: ActionMenu[] = [];   
    
	const updateMemberMutation = useUpdateMemberRole(communityUid);
	const updateAddMemberToAdminMutation = useAddMemberToAdmins(communityUid);
	const updateRemoveMemberFromAdminMutation = useRemoveMemberFromAdmins(communityUid);
    
  
    $: items = buildItems(isAdmin, role);
   
    function buildItems(isAdmin:boolean, currentRole:string):ActionMenu[]{
        items = [... ACTIONS_MENU[currentRole]];
       
        if (isAdmin) {
            items.unshift(UNSET_ADMIN_ROLE_MENU)
        } else {
            items.unshift(SET_ADMIN_ROLE_MENU)
        }

        return items;
    }
  
    function updateRole(ev: any, action: string, role?: number) {
        ev.preventDefault();
        open = false;
        if  (action === UNSET_ADMIN_ROLE_MENU.action) {
            $updateRemoveMemberFromAdminMutation.mutateAsync({
				communityUid,
				personUid
			});
            return
        }
        if  (action === SET_ADMIN_ROLE_MENU.action) {
            $updateAddMemberToAdminMutation.mutateAsync({
				communityUid,
				personUid
			});
            return
        }
        if (role){
            $updateMemberMutation.mutateAsync({
                communityUid,
				personUid,
				role,
			});
        }
        
    }
  </script>
  
<button 
    on:click|preventDefault|stopPropagation={() => open = !open} 
    class="w-5 justify-self-end">
    <DotsVerticalOutline class="dark:text-white" />
</button>
<Dropdown   bind:open={open}  placement="bottom" class="shadow-lg rounded-lg border-2 border-gray-100 text-black py-1">
{#each items as item (item.action)}
    <DropdownItem on:click={(ev) => updateRole(ev,item.action, item.role)}>
    {item.name}
    </DropdownItem>
{/each}
</Dropdown>
  