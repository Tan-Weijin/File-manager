<script setup>
// Define the props that are passed into this component
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <!-- Display the 'msg' prop in an h1 element -->
    <h1 class="green">{{ msg }}</h1>
    <!-- Description for the user regarding file management features -->
    <h3>
      Manage, Store, Update and delete your files all in one place. Upload you file below to begin!
    </h3>
  </div>
  <div>
    <!-- Button that will trigger a file input -->
    <b-button variant="warning" @click="triggerFileInput">Upload!</b-button>
    
    <!-- Hidden file input element, triggered by the button above-->
    <input
      ref="fileInput"
      type="file"
      @change="onFileChanged"
      style="display: none;"
    />
  </div>
</template>

<script>
import axios from 'axios';
export default {
  methods: {
    // Method to trigger the hidden file input field
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    // Method to handle the file input change event
    async onFileChanged(event) {
      // Get the first file from the file input field
      const file = event.target.files[0];
      if (file) {
        try {
          // Create a FormData object to hold the selected file
          const formData = new FormData();
          formData.append('file', file);
          
          // Send a POST request to upload the file to the server
          const response = await axios.post('http://localhost:3000/file-operations/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log("Upload Successfull")
          // Reload the page to refresh the file list
          window.location.reload();
        } catch (error){
          // Handle any errors during the file upload process
          console.log("Upload failed due to:", error)
        }
      }
    },
  }
};
</script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

button{
  margin-top: 20%;
  font-size: 1.3rem;
}
</style>
