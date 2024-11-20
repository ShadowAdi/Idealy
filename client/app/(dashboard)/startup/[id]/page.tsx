// app/startup/[id]/page.tsx
import { GetStartup } from "@/actions/StartupActions";
import { GetUser } from "@/actions/AuthActions";
import { GetAllComments } from "@/actions/CommentAction";
import StartupPageClient from "@/components/shared/StartupPageClient";

export default async function StartupPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  try {
    const startupData = await GetStartup(id);

    // Fetch user data if startup exists
    const startupUser = startupData?.user_id
      ? await GetUser(startupData.user_id)
      : null;

    // Fetch comments
    const comments = await GetAllComments(id);
    if (startupData && startupUser && comments) {
      return (
        <StartupPageClient
          initialStartupData={startupData}
          initialStartupUser={startupUser}
          initialComments={comments}
          startupId={id}
        />
      );
    }
  } catch (error) {
    console.error("Error fetching startup data:", error);
    return <div>Error loading startup</div>;
  }
}
