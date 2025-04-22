import { APP_NAME } from "@/lib/constants";
import { Link } from "react-router-dom";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex justify-between items-center py-4 px-6">
        <Link to="/" className="flex items-center">
          <img
            src="./public/logo.svg"
            alt={`${APP_NAME} logo`}
            height={48}
            width={48}
          />
          <span className="hidden lg:block font-bold text-2xl ml-3">
            {APP_NAME}
          </span>
        </Link>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
