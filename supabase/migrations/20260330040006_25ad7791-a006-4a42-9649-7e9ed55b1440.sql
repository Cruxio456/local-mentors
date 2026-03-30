
-- Allow users to delete their own conversations
CREATE POLICY "Users can delete their own conversations"
ON public.conversations
FOR DELETE
TO authenticated
USING (is_conversation_participant(id));

-- Allow users to delete messages in their conversations
CREATE POLICY "Users can delete messages in their conversations"
ON public.messages
FOR DELETE
TO authenticated
USING (is_conversation_participant(conversation_id));
