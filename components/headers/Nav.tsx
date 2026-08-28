import Link from "next/link";
import { notionWorxMainMenuItems } from "@/data/notionworxNav";

export default function Nav({
  variant2: _variant2 = false,
  variant3: _variant3 = false,
}: {
  variant2?: boolean;
  variant3?: boolean;
}) {
  return (
    <>
      {notionWorxMainMenuItems.map((item) => {
        const hasChildren = Boolean(item.children?.length);

        if (!hasChildren && item.href) {
          return (
            <li key={item.label} className="menu-item">
              <Link
                href={item.href}
                className="item-link"
                target={item.newTab ? "_blank" : undefined}
                rel={item.newTab ? "noreferrer" : undefined}
              >
                <span className="text cus-text"> {item.label} </span>
              </Link>
            </li>
          );
        }

        return (
          <li key={item.label} className="menu-item position-relative">
            <a href={item.href ?? "#"} className="item-link">
              <span className="text cus-text"> {item.label} </span>
              <i className="icon icon-CaretDown" aria-hidden />
            </a>
            <div className="sub-menu mega-menu-item">
              <ul className="sub-menu_list">
                {item.children?.map((child) => (
                  <li key={`${item.label}-${child.label}`}>
                    <Link href={child.href ?? "#"} className="sub-menu_link has-text">
                      <span className="cus-text"> {child.label} </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </>
  );
}
