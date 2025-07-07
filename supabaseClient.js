// supabaseClient.js
const SUPABASE_URL = "https://qxjmgudtjybuobdqghak.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4am1ndWR0anlidW9iZHFnaGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzcxMDEsImV4cCI6MjA2NjcxMzEwMX0.MToln-C58t1rMjAXb5ovu_GEaspGlfmMM0DrAXu0JRQ";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
