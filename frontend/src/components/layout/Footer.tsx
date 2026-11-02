import { Link } from "react-router-dom";

const links = [
  { heading: "Company", items: [["About Us", "/about"], ["Become a Worker", "/become-worker"], ["Services", "/services"]] },
  { heading: "Support", items: [["Help Center", "/about"], ["Contact", "/about"], ["Privacy Policy", "/about"]] },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary-600 text-white font-bold">K</div>
            <span className="text-lg font-bold text-slate-900">
              Kaam<span className="text-primary-600">Connect</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-slate-500">
            India's trusted home services platform. Verified electricians, plumbers, carpenters and more — booked in minutes, at your doorstep.
          </p>
        </div>
        {links.map((col) => (
          <div key={col.heading}>
            <h4 className="text-sm font-semibold text-slate-900">{col.heading}</h4>
            <ul className="mt-3 space-y-2">
              {col.items.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-slate-500 hover:text-primary-600">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} KaamConnect. All rights reserved.
      </div>
    </footer>
  );
}
