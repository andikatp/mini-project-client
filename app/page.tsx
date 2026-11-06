import { Navbar } from "@/components/common/navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        {/* Placeholder Body yang siap diisi */}
        <div className="max-w-xl rounded-2xl border border-dashed border-slate-300 bg-white p-12 shadow-xs">
          <h1 className="text-2xl font-bold text-slate-800">Homepage Body</h1>
          <p className="mt-2 text-sm text-slate-500">
            Navbar sudah terpasang. Siap untuk ditambahkan komponen hero, daftar event, dsb.
          </p>
        </div>
      </main>
    </div>
  );
}
