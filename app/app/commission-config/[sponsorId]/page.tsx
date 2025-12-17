import AffiliatesTable from "./affiliates-table";

interface Props {
  params: Promise<{
    sponsorId: string;
  }>;
}

export default async function SponsorAffiliates({ params }: Props) {
  const { sponsorId } = await params;

  return (
    <div>
      <AffiliatesTable sponsorId={parseInt(sponsorId, 10)} />
    </div>
  );
}
