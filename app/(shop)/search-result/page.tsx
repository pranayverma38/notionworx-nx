import PageTitle from "@/components/shop/search-result/PageTitle";
import Search from "@/components/shop/search-result/Search";
import Recent from "@/components/shop/search-result/Recent";
import { shopRouteMetadata } from "@/lib/metadata/shop";

export const metadata = shopRouteMetadata(
  "Search results",
  "Find products and refine your search.",
);

const SearchResultPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const { query = "" } = await searchParams;

  return (
    <>
      <PageTitle />
      <Search initialQuery={query} />
      <Recent query={query} />
    </>
  );
};

export default SearchResultPage;
