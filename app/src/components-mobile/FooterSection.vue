<script setup lang="ts">
import DeepHeaderText from "@/components/mobile/DeepHeaderText.vue";
import { ref } from "vue";
import { exerciseRepository } from "@/main.ts";
import { useAllExercisesStore } from "@/stores/exercise.store";
const showSearch = ref(false);
const searchTerm = ref("");
const isLoading = ref(false);
const searchError = ref("");
const exerciseStore = useAllExercisesStore();

// Toggle search visibility
const toggleSearch = () => {
  // showSearch.value = !showSearch.value;
  // if (!showSearch.value) {
  //   searchTerm.value = "";
  //   searchError.value = "";
  // }
};

// Handle search function
const handleSearch = async () => {
  const term = searchTerm.value.trim();
  if (term) {
    try {
      isLoading.value = true;
      searchError.value = "";
      const results = await exerciseRepository.search(term);

      if (results && results.length > 0) {
        // Set search results in the store
        exerciseStore.setSearchResults(results);
        // Don't close the search panel - let the ExerciseSelector component handle the display
      } else {
        searchError.value = "No exercises found. Try a different search term.";
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
// msg="Not sure what exercise to select? Click here to search!"
</script>

<template>
  <section class="footersectionabsolute section" :class="{ 'expanded': showSearch }">
    <!-- Default state - click to search -->
    <div v-if="!showSearch" @click="toggleSearch" class="search-prompt">
      <DeepHeaderText
        msg="Search currently omitted... [MOBILE]"
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
  position: fixed;
  left: 0;
  right: 0;
  bottom: 28px;
  display: flex;
  width: 100%;
  min-height: 5vh;
  padding: 20px 0;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.search-prompt {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
  padding: 10px 20px;
  flex-wrap: wrap;
}

.search-input {
  width: 35%;
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
