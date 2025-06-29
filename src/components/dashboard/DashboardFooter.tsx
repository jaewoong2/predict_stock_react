"use client";
const DashboardFooter = () => {
  return (
    <footer className="border-t bg-muted/50 mt-10 py-6 text-sm leading-relaxed">
      <div className="container mx-auto max-w-5xl space-y-2">
        <h2 className="font-semibold">투자정보 제공 서비스 관련 고지</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            본 서비스는 교육·정보 제공 목적으로 종목 관련 데이터를 분석하여
            시각화하거나 지표를 설명합니다. 특정 종목의 매수·매도 권유 또는
            투자자문을 제공하지 않습니다.
          </li>
          <li>
            한국 자본시장법 및 투자자문업 등록 요건에 따라, 본 서비스는
            투자자문업자로 등록되지 않았으며, 투자 결정은 전적으로 사용자
            책임입니다.
          </li>
          <li>
            2024~2025년 자본시장법 개정으로 온라인 유사투자자문(리딩방 등)
            규제가 강화되었습니다(예: 2025년 7월 14일부터 시행). 본 서비스는
            해당 규정을 준수하며, 불법적인 종목 추천·권유 행위를 일체 하지
            않습니다.
          </li>
          <li>
            보다 상세한 사항은 당사의{" "}
            <a href="/terms" className="underline">
              이용약관
            </a>{" "}
            및
            <a href="/privacy" className="underline">
              개인정보처리방침
            </a>
            을 참조해 주시기 바랍니다.
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default DashboardFooter;
