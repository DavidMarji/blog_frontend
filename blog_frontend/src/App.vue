<script setup>
import Editor from '@tinymce/tinymce-vue';

const apiKey = import.meta.env.VITE_TINY_MCE_API_KEY;
</script>

<template>
  <router-view></router-view>
  <!-- <Editor v-if="$route.path.match(/^.*\/blogs\/\d+\/\d+$/)"
      :api-key="apiKey"
      :init="{
          height: '83vh',
          width: '38vw',
          menubar: false,
          toolbar_mode: 'sliding',
          plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate tableofcontents footnotes mergetags autocorrect typography inlinecss',
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
      }"
      id="pageContent"
  /> -->
</template>

<style scoped>
</style>
