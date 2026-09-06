"use client";

export default function ExportReportButton() {
  function handlePrint() {
    window.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="
        inline-flex
        
        items-center
        justify-center
        gap-2
        rounded-lg
        border
        bg-slate-200
        px-4
        py-2.5
        text-sm
        font-semibold
        text-black-design
        shadow-sm
        transition-all
        duration-200
        hover:bg-slate-300
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-primary-design/40
        active:scale-[0.98]
        print:hidden
      "
    >
      <span aria-hidden="true">📄</span>
      <span>Imprimir / Salvar PDF</span>
    </button>
  );
}
