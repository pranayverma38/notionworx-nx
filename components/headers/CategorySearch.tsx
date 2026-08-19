"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function CategorySearch({
  parentClass = "form_search-product",
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("All Categories");
  const [query, setQuery] = useState("");

  const categories = [
    { value: "all", label: "All Categories", href: "/collection" },
    { value: "skincare", label: "Skincare", href: "/shop-default" },
    { value: "makeup", label: "Makeup", href: "/shop-default" },
    { value: "haircare", label: "Haircare", href: "/shop-default" },
    { value: "body-care", label: "Body care", href: "/shop-default" },
    { value: "fragrances", label: "Fragrances", href: "/shop-default" },
    { value: "lip-care", label: "Lip care", href: "/shop-default" },
    { value: "nail-care", label: "Nail care", href: "/shop-default" },
    {
      value: "beauty-tools-accessories",
      label: "Beauty tools & accessories",
      href: "/shop-default",
    },
    { value: "natural-beauty", label: "Natural beauty", href: "/shop-default" },
    {
      value: "baby-kids-care",
      label: "Baby & Kids Care",
      href: "/shop-default",
    },
    { value: "eye-care", label: "Eye care", href: "/shop-default" },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        router.push(
          q
            ? `/search-result?query=${encodeURIComponent(q)}`
            : "/search-result",
        );
      }}
      className={parentClass}
    >
      <div className="select-category">
        <select
          name="product_cate"
          id="product_cate"
          className="dropdown_product_cate hide-select"
          defaultValue="all"
        >
          {categories.map((cat) => (
            <option key={cat.value} className="level-0" value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <div
          className={`tf-select-custom ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected}
        </div>
        <ul
          className="select-options"
          style={{ display: isOpen ? "block" : "none" }}
        >
          <div className="header-select-option">
            <span>Select Categories</span>
            <span className="close-option" onClick={() => setIsOpen(false)}>
              <i className="icon-X2" />
            </span>
          </div>
          {categories.map((cat) => (
            <li
              key={cat.value}
              data-value={cat.value}
              onClick={() => {
                setSelected(cat.label);
                setIsOpen(false);
              }}
            >
              <Link href={cat.href}>{cat.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <span className="br-line type-vertical" />
      <fieldset className="fieldset-search">
        <input
          className="ipt"
          type="text"
          placeholder="Search Products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit" className="btn-action">
          <i className="icon icon-MagnifyingGlass" />
        </button>
      </fieldset>
    </form>
  );
}
