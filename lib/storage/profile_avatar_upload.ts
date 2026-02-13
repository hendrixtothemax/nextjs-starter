import { createSupabaseClient } from "@/lib/supabase/client"

export async function uploadProfileAvatar(
  file: File | null | undefined,
  userId: string
): Promise<string | null> {
    // Guard clause: if no file, exit early without error
    if (!file) {
        return null
    }

    const supabase = createSupabaseClient()
    
    // Standardized naming convention for one-to-one mapping
    const filePath = `${userId}.jpg` 

    const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
        upsert: true,
        contentType: "image/jpeg",
        })

    if (error) {
        throw error
    }

    return filePath
}