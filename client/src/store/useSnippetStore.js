import { create } from "zustand";
import axios from "../utils/axiosInstance";

const useSnippetStore = create((set, get) => ({
  snippets: [],
  filteredSnippets: [],
  selectedSnippet: null,
  loading: false,
  error: null,

  setSnippets: (data) => set({ snippets: data }),
  selectSnippet: (snippet) => set({ selectedSnippet: snippet }),
  setFilteredSnippets: (filtered) => set({ filteredSnippets: filtered }),

  // Fetch all snippets
  fetchSnippets: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("/snippets/all");
      set({ snippets: res.data.snippets, loading: false , });
    } catch (err) {
      set({
        error: err.response?.data?.msg || "Error fetching snippets",
        loading: false,
      });
    }
  },

  // Create a new snippet
  createSnippet: async (snippetData) => {
    try {
      const res = await axios.post("/snippets/create", snippetData);
      set((state) => ({
        snippets: [res.data.snippet, ...state.snippets],
      }));
    } catch (err) {
      console.error("Create Snippet Error:", err);
      set({
        error: err.response?.data?.msg || "Error creating snippet",
      });
    }
  },

  //  Update a snippet
  updateSnippet: async (id, updatedData) => {
    try {
      const res= await axios.patch(`/snippets/${id}`, updatedData);

      set((state) => ({
        snippets: state.snippets.map((s) =>
          s._id === id ? updatedData : s
        ),
        selectedSnippet: updatedData, // Update selected snippet
      }));
      return { success: true, msg: res.data.msg }; // Indicate success
    } catch (err) {
      console.error("Update Snippet Error:", err);
      set({
        error: err.response?.data?.msg || "Error creating snippet",
      });
      return { success: false, error: err.response?.data?.msg }; // Indicate failure
    }
  },

  // Delete a snippet
  deleteSnippet: async (id) => {
    try {
      const res= await axios.delete(`/snippets/${id}`);
      set((state) => ({
        snippets: state.snippets.filter((s) => s._id !== id),
        selectedSnippet: null, // Clear selected snippet after deletion
        error: null, // Clear any previous error
      }));
      return { success: true , msg: res.data.msg}; // Indicate success
    } catch (err) {
      console.error("Delete Snippet Error:", err.response?.data?.msg);
      set((state) => ({                      
        error: err.response?.data?.msg || "Failed to delete snippet",
      }));
      return { success: false , msg: err.response?.data?.msg};     // Indicate failure
    }
  },
}));

export default useSnippetStore;
