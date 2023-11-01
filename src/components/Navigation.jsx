import React from "react";

const Navigation = ({ account }) => {
  const linkCategories = [
    "Music",
    "Sport",
    "Arts, Theatre & Comedy",
    "Family & Attractions",
  ];

  const Link = ({ cat }) => {
    return (
      <li className="py-1 px-0 hover:opacity-50">
        <a href="/">{cat}</a>
      </li>
    );
  };

  return (
    <nav className="nav py-2">
      <div className="container justify-between flex items-center">
        <a href="/">
          <h1 className="italic">Ticketsmarter</h1>
        </a>
        <ul className="flex gap-4">
          {linkCategories.map((cat, index) => {
            return <Link key={index} cat={cat} />;
          })}
        </ul>
        <div className=" py-1 px-0">
          {account ? (
            <button type="button" className="btn btn-white">
              {account.slice(0, 6) + "..." + account.slice(38, 42)}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-white"
              //onClick={requestAccount}
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
