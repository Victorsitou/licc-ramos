import TalleresPage from "./TalleresPage";
import { getResourceServer } from "@/app/services/resources-server";

export default async function Page() {
  const data = await getResourceServer({
    type: "WORKSHOP",
  });

  return <TalleresPage initialData={data.reverse()} />;
}
