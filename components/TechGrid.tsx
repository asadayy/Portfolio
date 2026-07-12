import Image from "next/image";

import type { TechByCategory } from "@/lib/data";
import "@/styles/tech-grid.css";

export default function TechGrid({ groups }: { groups: TechByCategory }) {
  return (
    <div className="row g-4 g-lg-5 tech-grid">
      {groups.map((group) => (
        <div className="col-12 col-sm-6 col-lg-4" key={group.category}>
          <section className="tech-group">
            <h3 className="tech-group-title">
              {group.category}
              <span className="tech-count">{group.items.length}</span>
            </h3>
            <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0">
              {group.items.map((item) => (
                <li key={item._id}>
                  <span className="tech-badge">
                    {item.iconUrl && (
                      <Image
                        src={item.iconUrl}
                        alt=""
                        width={14}
                        height={14}
                        className="tech-badge-icon"
                      />
                    )}
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ))}
    </div>
  );
}
