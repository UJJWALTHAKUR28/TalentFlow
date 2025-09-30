import { Link, useLocation } from "react-router-dom";
import { 
  Briefcase, 
  Users, 
  ClipboardList, 
  MessageSquare, 
  FilePlus, 
  Eye,
  Menu,
  X,
  Home, 
  UserPlus
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/addcandidates", label: "Add Candidate", icon: UserPlus },
  { to: "/assessments/create", label: "Create Assessment", icon: FilePlus },
  { to: "/job-assessments", label: "Assessments", icon: MessageSquare },
  { to: "/jobassesmentselect", label: "Job-Assessment Select", icon: ClipboardList },
  { to: "/responses", label: "Assessment Responses", icon: Eye },
];

export default function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>

      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-md shadow-lg"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

   
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-[#00241B] bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}


      <aside
        className={`
          lg:w-64 lg:flex-shrink-0 lg:relative
          fixed inset-y-0 left-0 z-40 w-64
          bg-[#00241B]   
          text-white shadow-2xl border-r border-[#001A16]
          transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:transform-none transition-transform duration-300 ease-in-out
          flex flex-col
        `}
      >

        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">
            TalentFlow
          </h2>
          <p className="text-slate-400 text-sm mt-1">Recruitment Management</p>
        </div>


        <nav className="flex-1 p-4 space-y-2 ">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  group flex items-center gap-3 rounded-lg px-4 py-3 
                  transition-all duration-200 ease-in-out
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[#82D173] to-[#ABFAA9] text-[#00241B]  shadow-md border-l-4 border-green-500"
                      : "text-[#B5FFE1] hover:bg-[#93E5AB]/5 hover:text-[#93E5AB]"
                  }
                `}
              >
                <div className={`
                  p-1 rounded-md transition-colors duration-200
                  ${isActive ? "bg-gradient-to-r from-[#82D173] to-[#ABFAA9] text-[#00241B]" : "text-[#93E5AB] hover:bg-[#93E5AB]/10 hover:text-white hover:transform hover:scale-105"}
                `}>
                  <Icon size={18} />
                </div>
                <span className="font-medium">{label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

      </aside>


    </>
  );
}