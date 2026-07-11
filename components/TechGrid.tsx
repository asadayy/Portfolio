import Image from "next/image";

import type { TechByCategory } from "@/lib/data";
import "@/styles/tech-grid.css";

export default function TechGrid({ groups }: { groups: TechByCategory }) {
  return (
    <div className="row g-4 tech-grid">
      {groups.map((group) => (
        <div className="col-12 col-sm-6 col-lg-4" key={group.category}>
          <section className="card h-100 tech-group">
            <div className="card-body">
              <h3 className="h6 tech-group-title">{group.category}</h3>
              <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0">
                {group.items.map((item) => (
                  <li key={item._id}>
                    <span className="badge badge-tech tech-badge">
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
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}
