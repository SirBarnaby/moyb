<script setup lang="ts">
import DeepHeaderText from "@/components/DeepHeaderText.vue";
import { ref } from "vue";
import { exerciseRepository } from "@/main.ts";
import { useAllExercisesStore } from "@/dal/Exercise.ts";
import { useMuscleStore } from "@/dal/Muscle.ts";

const showSearch = ref(false);
const searchTerm = ref("");
const isLoading = ref(false);
const searchError = ref("");
const exerciseStore = useAllExercisesStore();
const muscleStore = useMuscleStore();

// Toggle search visibility
const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) {
    searchTerm.value = "";
    searchError.value = "";
  }
};

// Handle search function
const handleSearch = async () => {
  if (searchTerm.value.trim()) {
    try {
      isLoading.value = true;
      searchError.value = "";
      const results = await exerciseRepository.search(searchTerm.value);
      exerciseStore.setSearchResults(results);
      
      // Close the search panel if results were found
      if (results && results.length > 0) {
        toggleSearch();
      }
    } catch (error) {
      console.error("Search error:", error);
      searchError.value = "Failed to fetch results. Please try again.";
    } finally {
      isLoading.value = false;
    }
  }
};

// Handle key press - execute search on Enter
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    handleSearch();
  }
};
</script>

<template>
  <section class="footersectionabsolute section" :class="{ 'expanded': showSearch }">
    <!-- Default state - click to search -->
    <div v-if="!showSearch" @click="toggleSearch" class="search-prompt">
      <DeepHeaderText 
        msg="Not sure what exercise to select? Click here to search!"
        img_url="/dot.png">
      </DeepHeaderText>
    </div>
    
    <!-- Search state - with input field and button -->
    <div v-else class="search-container">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Search exercises..."
        @keyup="handleKeyPress"
        class="search-input"
        autofocus
      />
      <button @click="handleSearch" class="search-button" :disabled="isLoading">
        <span v-if="isLoading">Searching...</span>
        <span v-else>Search</span>
      </button>
      <button @click="toggleSearch" class="close-button" :disabled="isLoading">Close</button>
      <div v-if="searchError" class="search-error">{{ searchError }}</div>
    </div>
  </section>
</template>

<style scoped>
.footersectionabsolute {
  position: static;
  left: 0%;
  top: auto;
  right: 0%;
  bottom: 0%;
  display: flex;
  width: 100%;
  height: 5vh;
  margin-bottom: 28px;
  justify-content: center;
  align-items: center;
  align-self: center;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  transition: height 0.3s ease;
}

.expanded {
  height: 15vh;
}

.search-prompt {
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
  padding: 0 20px;
  flex-wrap: wrap;
}

.search-input {
  width: 60%;
  height: 40px;
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid #dfe6e9;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #00b894;
  box-shadow: 0 0 8px rgba(0, 184, 148, 0.2);
}

.search-button, .close-button {
  height: 40px;
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-button {
  background-color: #00b894;
  color: white;
  min-width: 100px;
}

.search-button:hover:not(:disabled) {
  background-color: #00a085;
  transform: translateY(-2px);
}

.search-button:disabled, .close-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.close-button {
  background-color: #dfe6e9;
  color: #636e72;
}

.close-button:hover:not(:disabled) {
  background-color: #b2bec3;
}

.search-error {
  width: 100%;
  text-align: center;
  color: #d63031;
  margin-top: 8px;
  font-size: 14px;
}
</style>
