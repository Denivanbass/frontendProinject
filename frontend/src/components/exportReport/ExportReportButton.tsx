'use client';

import style from './exportReport.module.css';

export default function ExportReportButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button onClick={handlePrint} className={style.btn_export} type="button">
      📄 Imprimir / Salvar PDF
    </button>
  );
}