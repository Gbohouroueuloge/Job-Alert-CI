import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-0 md:gap-2">
      <div className="flex flex-col items-center">
        <div className="h-7 md:h-9 sm:w-auto">
          <img
            src="/logo2.svg"
            alt="JobAlert CI Logo"
            className="h-full object-contain"
            loading="eager"
            fetchpriority="high"
          />
        </div>

        <span class="font-black text-sm text-primary sm:hidden">
          JobAlert CI
        </span>
      </div>

      <div className="flex flex-col items-center-safe">
        <span class="font-black text-2xl text-primary hidden sm:block">
          JobAlert CI
        </span>
        <small className="font-medium text-[8px] -mt-1.5 text-primary  hidden sm:block">
          Trouvez votre prochain emploi
        </small>
      </div>
    </Link>
  )
}