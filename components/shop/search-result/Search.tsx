"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";

function Search({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  return (
    <>
      <div className="flat-spacing page-search-inner">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 mx-auto">
              <PreventDefaultForm
                className="form-search-nav style-2 mb-10"
                onSubmit={() => {
                  const q = query.trim();
                  router.push(
                    q
                      ? `/search-result?query=${encodeURIComponent(q)}`
                      : "/search-result",
                  );
                }}
              >
                <fieldset>
                  <input
                    type="text"
                    placeholder="Searching..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </fieldset>
                <button type="submit" className="btn-action">
                  <i className="icon icon-MagnifyingGlass" />
                </button>
              </PreventDefaultForm>
              <div className="tf-col-quicklink">
                <span className="title fw-semibold">Quick link:</span>
                &nbsp;
                <Link className="cl-text-2 link" href={`/shop-default`}>
                  Fashion
                </Link>
                ,
                <Link className="cl-text-2 link" href={`/shop-default`}>
                  Men
                </Link>
                ,
                <Link className="cl-text-2 link" href={`/shop-default`}>
                  Women
                </Link>
                ,
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
