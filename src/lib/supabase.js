import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helpers
export const db = {
  // Get todos for current user
  getTodos: async (userId) => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Create new todo
  createTodo: async (todo, userId) => {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ ...todo, user_id: userId }])
      .select()
    return { data, error }
  },

  // Update todo
  updateTodo: async (id, updates, userId) => {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
    return { data, error }
  },

  // Delete todo
  deleteTodo: async (id, userId) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    return { error }
  },

  // Batch update todos (for reordering)
  batchUpdateTodos: async (updates, userId) => {
    const promises = updates.map(({ id, ...update }) =>
      supabase
        .from('todos')
        .update(update)
        .eq('id', id)
        .eq('user_id', userId)
    )
    const results = await Promise.all(promises)
    return results
  }
}