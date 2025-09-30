// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-slate-200 py-8 border-t border-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold text-white mb-1">Talent Dashboard</h3>
            <p className="text-xs text-slate-400">Empowering workforce excellence</p>
          </div>

          {/* Center Section */}
          <div className="flex flex-col items-center">
            <p className="text-sm text-slate-300">
              © {new Date().getFullYear()} Talent Dashboard. All rights reserved.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Designed for modern talent management
            </p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-slate-400">System Active</span>
            </div>
          </div>
        </div>

        {/* Bottom Divider with Accent */}
        <div className="mt-6 pt-4 border-t border-slate-600/50">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
            <span className="text-xs text-slate-500 font-medium">PROFESSIONAL EDITION</span>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}