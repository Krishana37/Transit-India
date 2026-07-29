import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function NostalgicIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(onDone, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 2 ? 0 : 1, filter: phase === 2 ? "blur(12px)" : "blur(0px)" }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#dfe8f0] text-[11px] leading-tight text-[#000080]"
      style={{ fontFamily: "Verdana, Geneva, Tahoma, sans-serif" }}
    >
      <div className="mx-auto max-w-4xl px-3 pt-2">
        <div className="flex items-center justify-between border-b border-[#a0a0a0] pb-1">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#f0a020] text-[10px] font-bold text-white shadow-inner">IR</div>
            <div>
              <div className="text-[13px] font-bold text-[#c00000]">Indian Railways Catering & Tourism Corp. Ltd.</div>
              <div className="text-[10px] text-[#404040]">A Govt. of India Enterprise · Booking Portal v2.1</div>
            </div>
          </div>
          <div className="text-right text-[10px] text-[#404040]">
            Server Time: 10:24:07 IST<br />Session: guest_9821
          </div>
        </div>

        <div className="mt-1 flex gap-3 bg-[#000080] px-2 py-1 text-white">
          {["Home", "Plan My Travel", "Book Ticket", "TATKAL", "PNR Enq.", "Cancel", "Contact Us"].map((t) => (
            <span key={t} className="cursor-pointer text-[11px] underline underline-offset-2 hover:text-yellow-300">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-[220px_1fr] gap-3">
          <div className="border border-[#8080a0] bg-white p-2">
            <div className="border-b border-dashed border-[#8080a0] pb-1 text-[12px] font-bold text-[#c00000]">Book Ticket</div>
            <div className="mt-1 space-y-1">
              <label className="block">From <input className="w-full border border-[#8080a0] px-1 py-0.5 text-[11px]" defaultValue="NDLS" /></label>
              <label className="block">To <input className="w-full border border-[#8080a0] px-1 py-0.5 text-[11px]" defaultValue="JP" /></label>
              <label className="block">Date <input className="w-full border border-[#8080a0] px-1 py-0.5 text-[11px]" defaultValue="29-Jul-2026" /></label>
              <label className="block">Class
                <select className="w-full border border-[#8080a0] px-1 py-0.5 text-[11px]"><option>ALL</option></select>
              </label>
              <label className="block">Quota
                <select className="w-full border border-[#8080a0] px-1 py-0.5 text-[11px]"><option>GENERAL</option></select>
              </label>
              <div className="mt-2 flex items-center gap-1">
                <div className="border border-[#404040] bg-[#e0e0e0] px-2 py-1 font-mono tracking-widest text-[13px] italic line-through">7fZq2A</div>
                <input className="w-20 border border-[#8080a0] px-1 py-0.5" placeholder="captcha" />
              </div>
              <button className="mt-2 w-full border border-[#404040] bg-[#c0c0c0] py-0.5 text-[11px] font-bold text-black active:bg-[#a0a0a0]">
                Submit
              </button>
            </div>
          </div>

          <div>
            <div className="border border-[#8080a0] bg-white">
              <div className="flex items-center justify-between border-b border-[#8080a0] bg-[#e0e8f0] px-2 py-0.5 text-[11px] font-bold">
                <span>Trains between Stations (NDLS → JP · 29-Jul-2026)</span>
                <span className="text-[10px] font-normal text-[#404040]">Loading{phase >= 1 ? "..." : "."}</span>
              </div>
              <table className="w-full border-collapse text-[10px]">
                <thead className="bg-[#f0f0f0] text-[#000080]">
                  <tr>
                    {["Train #", "Name", "Dep", "Arr", "Dur", "SL", "3A", "2A", "1A", ""].map((h) => (
                      <th key={h} className="border border-[#c0c0c0] px-1 py-0.5 text-left font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["22439", "VANDE BHARAT EXP", "06:10", "10:35", "4h25", "-", "-", "-", "-"],
                    ["12015", "AJMER SHATABDI", "06:05", "10:40", "4h35", "-", "-", "-", "-"],
                    ["12985", "DEE JP DD EXP", "05:40", "10:20", "4h40", "-", "AVL", "-", "-"],
                    ["12916", "ASHRAM EXP", "15:20", "20:55", "5h35", "RAC12", "GNWL2", "WL8", "-"],
                    ["19715", "GARIB NAWAZ EXP", "17:35", "23:05", "5h30", "WL41", "WL9", "WL5", "-"],
                    ["12413", "POORNA EXP", "23:50", "05:05", "5h15", "AVL", "AVL", "RAC3", "-"],
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 ? "bg-[#f7f7f7]" : ""}>
                      {row.map((c, j) => (
                        <td key={j} className={`border border-[#e0e0e0] px-1 py-0.5 ${j === 1 ? "text-[#000080] underline" : ""}`}>{c}</td>
                      ))}
                      <td className="border border-[#e0e0e0] px-1 py-0.5">
                        <a className="text-[#c00000] underline">Book</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-dashed border-[#8080a0] bg-[#fffbe0] px-2 py-1 text-[10px] text-[#606000]">
                <span className="font-bold text-[#c00000]">Notice:</span> Session will expire in <span className="blink font-bold">04:59</span> min. Do not press Back button. For queries dial 139.
              </div>
            </div>
            <div className="mt-2 text-[10px] text-[#404040]">
              Best viewed in Internet Explorer 6.0 · Resolution 1024×768 · © 2004-2011 IRCTC
            </div>
          </div>
        </div>
      </div>

      {phase >= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute inset-x-0 bottom-10 mx-auto w-fit rounded-full bg-black/80 px-4 py-2 text-[12px] font-medium text-white shadow-xl backdrop-blur"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Loading the new Transit India experience…
        </motion.div>
      )}
    </motion.div>
  );
}
