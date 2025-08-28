'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { /*useDispatch,*/ useSelector } from "react-redux";
import type { RootState } from "../lib/store";
//import { logout } from "../lib/features/auth/AuthSlice";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const pathname = usePathname();
  const router = useRouter();
//  const dispatch = useDispatch();

  // helper to check active route and return classes
  function linkClass(href: string) {
    const base = "cursor-pointer transition text-xl lg:text-[22px]";
    const active = "text-[#4cdcae]";
    const inactive = "text-white hover:text-[#4cdcae]";
    return pathname === href ? `${base} ${active}` : `${base} ${inactive}`;
  }

// ------  This part is for the navbar of authenticated users -------

  const tasks = useMemo(() => [  // this will be some latest task data that we will fetch in starting not much just the latest ones..
    {
      id: '1',
      title: 'Read PCA',
      description: 'Read pca and apply it in the project working on'
    },
    {
      id: '2',
      title: 'Practice Guitar',
      description: 'Need to practise guitar for college performance'
    },
    {
      id: '3',
      title: 'Buy Vegetables',
      description: 'buy potatoes and tomatoes for dinner today!!'
    },
  ], []);

  const searchResult = [  // and these will be the tasks which we will get (if any) from backend in response to search query..
    {
      id: '4',
      title: 'Dummy task',
      description: 'Discription of the dummy task'
    },
    {
      id: '5',
      title: 'Dummy task',
      description: 'Discription of the dummy task'
    },
    {
      id: '6',
      title: 'Dummy task',
      description: 'Discription of the dummy task'
    },
  ]

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<typeof tasks>([]);
  const [searchedTasks, setSearchedTasks] = useState<typeof tasks>([])
  const overlayRef = useRef<HTMLDivElement>(null);

  // Update filtered tasks as user types
  useEffect(() => {
    if (searchValue) {
      const filtered = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks([]);
    }
  }, [searchValue, tasks]);

  // Close overlay when clicking outside 
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setIsOverlayOpen(false);
        setSearchValue("");
      }
    };
    if (isOverlayOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOverlayOpen]);

  const handleSuggestionClick = (id:string) => {
    router.push(`/user/tasks/${id}`)
    // Optionally, fetch all matching tasks to show as cards
    // setFilteredTasks(tasks.filter(task => task.title.includes(title)));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Task to search: ', searchValue)
    setSearchedTasks(searchResult) // for now we are using same data for every search
    setSearchValue('')
  }
 

  return (
    <div>
    { !isAuthenticated ? 
     <>
      {/* Navbar Container */}
      <div className="mx-auto backdrop-blur-[5px] backdrop-filter px-3 py-2 flex justify-between items-center bg-[rgba(254,254,254,0.1)] h-18 w-[95vw] rounded-[20px] ">
        {/* Logo and Title */}
        <div className="flex gap-2 items-center">
          <Image priority src="/TaskMaa_logo.png" alt="TaskMaa_Logo" width={40} height={40} />
          <h1 className="bg-gradient-to-r from-[#92f9e5] to-[#ffffff] bg-clip-text text-transparent text-2xl font-semibold">TaskMaa</h1>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3.5 lg:gap-6">
          <Link href="/" className={linkClass("/")}>Home</Link>
          <Link href="/about" className={linkClass("/about")}>About Maa</Link>
          <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
        </div>

        {/* Desktop Login/Signup or Authenticated Links */}
        <div className="hidden md:flex gap-4 items-center">
          <Link
            href="/auth/login"
            className="bg-[#2FAC81] rounded-2xl px-4 py-2 text-white cursor-pointer hover:bg-[#27a26b] transition"
          >
            Login
          </Link>
          <Link href="/auth/signup" className="text-white cursor-pointer px-2 hover:text-[#4cdcae] transition">
            SignUp
          </Link>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md focus:outline-none text-white"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 backdrop-blur-[5px] backdrop-filter bg-[rgba(37,36,36,0.54)] transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full w-[95vw] p-6">
          {/* Top bar with logo and close button */}
          <div className="flex justify-between w-full items-center mb-8">
            <div className="flex gap-2 items-center">
              <Image priority src="/TaskMaa_logo.png" alt="TaskMaa_Logo" width={40} height={40} />
              <h1 className="text-[#4cdcaec4] text-2xl font-semibold">TaskMaa</h1>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white hover:text-[#4cdcae] focus:outline-none"
              aria-label="Close menu"
            >
              <X size={32} />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-3.5 text-white text-[22px] flex-grow">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={pathname === "/" ? "text-[#4cdcae] cursor-pointer transition" : "cursor-pointer hover:text-[#4cdcae] transition"}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className={pathname === "/about" ? "text-[#4cdcae] cursor-pointer transition" : "cursor-pointer hover:text-[#4cdcae] transition"}
            >
              About Maa
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className={pathname === "/contact" ? "text-[#4cdcae] cursor-pointer transition" : "cursor-pointer hover:text-[#4cdcae] transition"}
            >
              Contact
            </Link>
          </nav>

          {/* Bottom Login/Signup or Auth Links horizontally */}
          <div className="flex gap-4 justify-center items-center mt-auto">
            <Link
              href="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="bg-[#2FAC81] rounded-2xl px-6 py-2 text-white cursor-pointer hover:bg-[#27a26b] transition text-center flex-1"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setMenuOpen(false)}
              className="text-white cursor-pointer hover:text-[#4cdcae] transition text-center flex-1"
            >
              SignUp
            </Link>
          </div>
        </div>
      </div>
     </>
    :
    <>
    {/* Navbar */}
      <div className="mx-auto relative backdrop-blur-[5px] backdrop-filter px-3 py-2 flex justify-between items-center bg-[rgba(254,254,254,0.1)] h-16 w-[95vw] rounded-[20px]">
        <div className="absolute -top-10 -left-10 w-[150px] h-[150px] -z-20 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-[#0cae90] to-[#038cbe]" />
        
        {/* Logo & Title */}
        <div className="flex gap-2 items-center">
          <Image priority src="/TaskMaa_logo.png" alt="TaskMaa_Logo" width={40} height={40} />
          <h1 className="bg-gradient-to-r from-[#92f9e5] to-[#ffffff] bg-clip-text text-transparent text-2xl font-semibold">
            TaskMaa
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Icon / Input Trigger */}
          <button
            className="md:hidden text-white text-xl"
            onClick={() => setIsOverlayOpen(true)}
          >
            🔍
          </button>

          {/* Desktop Input */}
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search your Tasks..."
              onFocus={() => setIsOverlayOpen(true)}
              className="rounded-2xl px-3 py-2 border border-white focus:outline-[#4cdcae] bg-gradient-to-r from-[#47ebe690] to-[#00000072] backdrop-blur-2xl placeholder:text-gray-200 text-white max-w-[300px]"
            />
          </div>

          {/* Profile Pic */}
          <Link href="/user/profile" className="w-[50px] h-[40px] relative">
            <Image fill src="/profile/default_profile_pic.png" alt="profile" className="rounded-full object-cover" />
          </Link>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isOverlayOpen && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] backdrop-blur-lg flex flex-col items-center p-4">
          <div ref={overlayRef} className="w-full max-w-2xl">
            <form onSubmit={handleSearch}>
              <input
              type="text"
              placeholder="Search Tasks..."
              name="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full rounded-3xl px-4 py-3 bg-[rgba(255,255,255,0.1)] backdrop-blur-md text-white placeholder:text-gray-300 text-lg outline-none focus:ring-2 focus:ring-[#4cdcae]"
              autoFocus
            />
            </form>

            {/* Suggestions */}
            {filteredTasks.length > 0 ? (
              <ul className="mt-4 max-h-80 overflow-auto bg-[rgba(255,255,255,0.1)] rounded-lg backdrop-blur-md shadow-lg">
                {filteredTasks.map((task, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-3 hover:bg-[rgba(76,220,174,0.3)] cursor-pointer text-white"
                    onClick={() => handleSuggestionClick(task.id)}
                  >
                    {task.title}
                  </li>
                ))}
              </ul>
            ) : (searchValue ? <p className="text-gray-200 text-center my-3 w-full">No matching tasks...</p> : '')}

            {searchedTasks.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {searchedTasks.map((task, idx) => (
                  <Link href={`/user/tasks/${task.id}`} key={idx} className="bg-[rgba(0,0,0,0.3)] p-4 rounded-xl text-white">
                    <h2 className="font-semibold">{task.title}</h2>
                    <p className="text-sm mt-1">{task.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
    }
    </div>
  );
}
