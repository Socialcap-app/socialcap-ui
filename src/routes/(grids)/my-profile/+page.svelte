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
  
  <main class="py-4">
    <!-- only on mobile -->
    <Breadcrumb class="mb-5 lg:hidden">
      <BreadcrumbItem>My Profile</BreadcrumbItem>
    </Breadcrumb>
    <MyProfile />
  </main>
  