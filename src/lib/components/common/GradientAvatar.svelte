<script lang="ts">
  /**
   * Credits:
   * - Based on: https://github.com/coffee-cup/gradient-avatars
   * - Some ideas: https://github.com/brandonsueur/react-gradient-avatar
  */

  export let initials = "";
  export let gradient = ""; 
  export let sizeClasses = "w-10 h-10" // lg the avatar default size
  export let fontClasses = "leading-10 text-base"
  export let positionClass = ""
  
  const sizeMap: any = {
    'sm': "w-4 h-4",  // 16
    'md': "w-6 h-6",  // 24,
    'xl': "w-16 h-16"  // 64,
  };
  
  const fontMap: any = {
    'sm': "leading-4 text-[8px]",  // 16
    'md': "leading-6 text-[10px]",  // 24,
    'lg': "", // 40, 
    'xl': "leading-16 text-lg"  // 64,`text-[${(size + 40)}px]`

  }



</script>

<span class="relative {sizeClasses} inline-block">
  <div class="relative {sizeClasses}">
    {@html gradient}
  </div>
  <div class="absolute {sizeClasses} font-semibold inline-block text-center text-white {fontClasses} top-0">
    {initials}
  </div>
</span>
