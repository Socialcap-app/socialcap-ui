<script lang="ts">
  /**
   * Credits:
   * - Based on: https://github.com/coffee-cup/gradient-avatars
   * - Some ideas: https://github.com/brandonsueur/react-gradient-avatar
  */

  export let initials = "";
  export let gradient = ""; 
  export let fontClasses = "leading-10 text-base"
  
</script>

<span class="relative inline-block">
  <div class="relative">
    {@html gradient}
  </div>
  <!-- <div class="absolute w-full font-semibold inline-block text-center text-white {fontClasses} top-0"> -->
  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-semibold {fontClasses}">
    {initials}
  </div>
</span>
