import { createSupabaseClient } from "@/lib/supabase/client"

export async function uploadProfileAvatar(
  file: File,
  userId: string
): Promise<string> {
  const supabase = createSupabaseClient()
  
  // Do not include 'avatars/' prefix here because it is defined in .from()
  const filePath = `${userId}.jpg` 

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: 'image/jpeg'
    })

  if (error) throw error

  return filePath
}