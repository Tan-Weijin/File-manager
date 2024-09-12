<script setup>
</script>

<template>
  <div>
    <!-- Header for the existing files section -->
    <h1 class = "header">Exisitng Files</h1>
  </div>
  <!-- Container for displaying file cards -->
  <div class="card-container">
    <!-- Loop through items and display each file in a card format -->
    <div v-for="item in items" :key="item.id" class="card">
      <h2 class="card-title">{{ item.originalName }}</h2>
      <p class="card-description">{{ "File type: "+ item.mimeType }}</p>
      <!-- Buttons to update and delete the file -->
      <div class = "card-button">
        <b-button variant = "success" @click="openUpdateModal(item.fileID)" class="update">Update!</b-button>
        <b-button variant="danger" @click="confirmDelete(item.originalName, item.fileID)" >Delete</b-button>
      </div>
      <!-- Button to download the file -->
      <b-button class ="download" variant="dark" @click="downloadFile(item.fileID, item.originalName)">Download</b-button>
    </div>
  </div>

  <!-- Hidden modal, visible when showUpdateModal is true -->
  <div v-if="showUpdateModal" class="modal-overlay" @click="closeUpdateModal">
    <div class="modal-content" @click.stop>
      <h2>Update File</h2><br>
      <form @submit.prevent="updateFile">
        <div>
          <h5>
            Change file content:
          </h5>
          <!-- Button to trigger file input for updating file content -->
          <b-button variant="warning" @click="triggerFileInput">Upload new file</b-button>
          
          <!-- Hidden file input triggered by the above button -->
          <input
            ref="fileInput"
            type="file"
            @change="onFileChanged"
            style="display: none;"
          />
        </div><br>
        <!-- Input field to update file name -->
        <div class="form-group">
          <h5>
            Change file name:
          </h5>
          <input v-model="newName" 
          @keyup.enter="handleEnter"
          placeholder="edit me"/>
        </div>
        <!-- Button to close the modal -->
        <div class="modal-actions">
          <b-button variant ="danger"@click="closeUpdateModal">Cancel</b-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      items: [], // Array to hold the data from the API
      showUpdateModal: false, // This controls the visibility of the modal
      currentFileID: null, // Stores the file ID being accessed
      newName: null // Stores the new file name entered in the modal
    };
  },
  // Fetch data when the component is mounted
  mounted() {
    this.fetchData(); 
  },
  methods: {
    // Method that triggeres a click on file input reference
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    // Method that gets the existing files on the server and stores that in an array
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/file-operations');
        // Assign the response data to the array
        this.items = response.data; 
      } catch (error) {
        // Displays an error if it fails to fetch data
        console.error('Error fetching data:', error);
      }
    },
    // Method to confirm file deletion
    confirmDelete(fileName, fileID) {
      // Displays a window when the user clicks to delete the file
      if (window.confirm(`Are you sure you want to delete the file "${fileName}"?`)) {
        // If the user clicks yes, call method to delete the file
        this.deleteFile(fileID);
      }
    },
    // Method to delete the file based on it's ID
    async deleteFile(fileID) {
      // Use the DELETE request to remove the file
      try {
        await axios.delete(`http://localhost:3000/file-operations/${fileID}`);
        // Refresh the file list after deletion
        this.fetchData();
        // Displays an error if it fails to delete
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    },
    // Method to Display the hidden modal
    openUpdateModal(fileID){
      console.log("open")
      this.currentFileID = fileID;
      // Update trigger to display modal
      this.showUpdateModal = true;
    },
    // Method to hide the hidden modal
    closeUpdateModal() {
      this.currentFileID = null;
      console.log("close")
      // Update trigger to hide modal
      this.showUpdateModal = false;
    },
    // Method that handles file selection to update the file's content 
    async onFileChanged(event) {
      // Handle file selection
      const file = event.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('fileId', this.currentFileID)
          // Send a POST request to update the file content
          const response = await axios.post('http://localhost:3000/file-operations/update', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log("Upload Successfull")
          // Refresh the file list after content update
          this.fetchData();
          // Hide the Modal
          this.showUpdateModal = false;
          // Displays an error if file fails to update
        } catch (error){
          console.log("Upload failed due to:", error)
        }
      }
    },
    // Method to handle the "Enter" key when the user is updating the file name
    handleEnter() {
      this.submitForm();
    },
    // Method to submit the new file name to the server
    async submitForm() {
      try{
        const body = {
              filename: this.newName,
              fileId: this.currentFileID
        }
        // Send a POST request to update the file's name
        const response = await axios.post('http://localhost:3000/file-operations/update', body, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Submitted message:', this.newName);
        // Refresh the file list after name update
        this.fetchData();
        // Hide the Modal
        this.showUpdateModal = false;
        // Displays an error if file fails to update
      } catch (error){
          console.log("Upload failed due to:", error)
      }
    },
    // Method that handles file downloads
    async downloadFile(fileID, fileName){
      console.log("downloading file")
      // Define the response to access it later
      let response
      // Send a GET request to get the file's content
      try{
        response = await axios.get(`http://localhost:3000/file-operations/${fileID}`, {
          responseType: 'blob', // Set response type to blob
        });
        // Validate that the response is a blob (file data)
        if (!(response.data instanceof Blob)) {
          throw new Error('Response is not a Blob');
        }
      
      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Create a link element
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);

      // Set the download attribute with the filename
      link.download = fileName;

      // Append the link to the body
      document.body.appendChild(link);

      // Trigger a click on the link to start the download
      link.click();
      
      // Remove the link
      document.body.removeChild(link);
      // Revoke the URL object
      URL.revokeObjectURL(link.href);
      // Refresh the file list after downloading the file
      this.fetchData();
      // Displays an error if file fails to download
      } catch (error){
          console.log("Upload failed due to:", error)
      }
    }
  },
};
</script>

<style scoped>
.header {
  position: auto;
  top: 100px;
  padding: 16px;
  z-index: 10;
  font-weight: 500;
  font-size: 2.6rem;
  color: #093145;

}
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: left;
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 200px;
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.card-description {
  font-size: 1rem;
  margin-bottom: 16px;
}

.card-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 8px;
}

.card-footer {
  font-size: 0.875rem;
  color: #666;
}

.card-button{
  align-self: auto;
}

.update{
  margin: 5px;
}

.download{
  margin-left: 5px;
  margin-right: 5px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.modal-content h2 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.save-button {
  background-color: #4caf50;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>