<script lang="ts">
    import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
    import { MetaTag } from "$lib/components";
    import MyProfile from "./MyProfile.svelte";
  
    const path: string = '/';
    const description: string = '';
    const title: string = 'Socialcap';
    const subtitle: string = 'My Profile';
  </script>
  
  <MetaTag {path} {description} {title} {subtitle} />
  
  <main class="lg:pt-24 lg:p-8">
    <MyProfile />
  </main>
  