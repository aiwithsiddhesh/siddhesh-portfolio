import SectionHeader from "@/components/SectionHeader";

export default function CertificationsLoading() {
  return (
    <div className="pt-20">
      <section className="py-24" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionHeader tag="Certifications" title="Always<br/>Learning." />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl flex gap-4 items-start h-full animate-pulse"
                style={{ background: "#fff", boxShadow: "0 10px 40px rgba(22,26,40,0.08)" }}
              >
                <div className="w-10 h-10 rounded-full shrink-0" style={{ background: "#e8e8d8" }} />
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded" style={{ background: "#e8e8d8", width: "80%" }} />
                  <div className="h-3 rounded" style={{ background: "#e8e8d8", width: "50%" }} />
                  <div className="h-5 w-16 rounded" style={{ background: "#e8e8d8" }} />
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-12 p-8 rounded-2xl text-center border-t-4 animate-pulse"
            style={{ background: "var(--navy)", borderColor: "var(--lime)" }}
          >
            <div className="h-8 w-32 rounded mx-auto mb-2" style={{ background: "rgba(255,255,255,0.1)" }} />
            <div className="h-4 w-64 rounded mx-auto" style={{ background: "rgba(255,255,255,0.1)" }} />
          </div>
        </div>
      </section>
    </div>
  );
}
