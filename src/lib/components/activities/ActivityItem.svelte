<script lang="ts">
  import { Heading, P, Badge } from "flowbite-svelte";
  import Time from "svelte-time";
	import { type Activity, toState, ActivityType} from "$lib/types";
  import { WAITING, DONE, UNPAID } from "$lib/types/states";
	import { Icon, StateBadge } from "$lib/components";

  // let activities: APIResponse | null = null;
  export let activity: Activity;

  $: statusColor = statusStyle(activity.state)?.color;
  $: statusLabel = statusStyle(activity.state)?.label;
  $: typeIcon = typeStyle(activity.type)?.name;

  function activityLink(activity: Activity) {
    switch (activity.type) {
      case ActivityType.transaction: {
        const txn = JSON.parse(activity.metadata);
        return `https://minascan.io/${txn.net}/tx/${txn.hash}?type=${txn.type}`
      } break;

      case ActivityType.request: {
        return "#";
      } break;

      case ActivityType.message: {
        return null;
      } break;
    }
  }

  function statusStyle(status: number) {
    switch (status) {
      case WAITING: return { label: "Pending", color: "yellow" }; break;
      case DONE: return { label: "Done", color: "green" }; break;
      case UNPAID: return { label: "Unpaid", color: "red" }; break;
      default: return { label: "", color: "transparent" }; break;
    }
  }

  function typeStyle(type: ActivityType) {
    switch (type) {
      case ActivityType.transaction: return { name: "Transaction", color: "red" }; break;
      case ActivityType.message: return { name: "Message", color: "info" }; break;
      case ActivityType.request: return { name: "Request", color: "red" }; break;
      default: return { name: "Info", color: "blue" }; break;
    }
  }
</script>

<div class="mb-5 pb-5 leading-snug border-b">
  <a 
    class=" flex items-start justify-between" 
    href={activityLink(activity)} 
    target="_blank">
    <p class="pt-2 w-2">
      <Icon size="6" name={typeIcon} />
    </p>
    <div class="w-full ms-7 me-1">
      <p class="text-sm text-dark">
        {@html activity.memo}
      </p>
      <p class="text-xs text-gray-600">
        <Time relative timestamp={activity.createdUTC} /> #{activity.sequence}
      </p>
    </div>
    <div class="w-24 no-border text-end">
      {#if statusLabel}
        <Badge rounded color={statusColor} class="py-1">
          {statusLabel}
        </Badge>
      {/if}
    </div>
  </a>
</div>
