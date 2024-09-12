<script setup>
// Importing child components
import UploadFile from './components/UploadFile.vue'
import FileDisplay from './components/FileDisplay.vue'
</script>

<template>
  <header>
    <img alt="Logo" class="logo" src="./assets/file.png" width="125" height="125" />

    <!-- Wrapper for the UploadFile component -->
    <div class="wrapper">
       <!-- Passing the 'msg' prop to the UploadFile component -->
      <UploadFile msg="File Management App" />
    </div>
  </header>

  <main>
    <!-- Display area for the uploaded files -->
    <FileDisplay />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
