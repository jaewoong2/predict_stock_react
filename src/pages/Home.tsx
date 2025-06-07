// filepath: src/pages/Home.tsx
import { useState } from "react";
import {
  useTickers,
  useTickerBySymbol,
  useTickerByDate,
} from "../hooks/useTicker";
import { Ticker } from "../types/ticker";

function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // 모든 티커 조회
  const { data: tickers, isLoading, error } = useTickers();

  // 선택된 심볼의 티커 조회
  const { data: tickerDetails, isLoading: isLoadingDetail } =
    useTickerBySymbol(selectedSymbol);

  // 특정 날짜의 티커 조회
  const { data: dateTickerData, isLoading: isLoadingDateData } =
    useTickerByDate(selectedSymbol, selectedDate);

  if (isLoading) return <div>티커 목록을 로딩 중입니다...</div>;
  if (error) return <div>에러 발생: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">주식 티커 정보</h1>

      {/* 티커 목록 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">티커 목록</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tickers?.map((ticker: Ticker) => (
            <div
              key={ticker.id}
              className="border p-4 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedSymbol(ticker.symbol)}
            >
              <h3 className="font-bold">{ticker.symbol}</h3>
              <p>{ticker.name}</p>
              <p className="font-semibold">${ticker.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 선택된 티커 상세 정보 */}
      {selectedSymbol && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">티커 상세 정보</h2>
          {isLoadingDetail ? (
            <div>상세 정보 로딩 중...</div>
          ) : tickerDetails ? (
            <div className="border p-4 rounded">
              {tickerDetails.map((tickerDetail) => (
                <>
                  <h3 className="text-lg font-bold" key={tickerDetail.id}>
                    {tickerDetail.symbol} - {tickerDetail.name}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <div>
                      <span className="font-semibold">현재가:</span> $
                      {tickerDetail.price.toFixed(2)}
                    </div>
                    {tickerDetail.open_price && (
                      <div>
                        <span className="font-semibold">시가:</span> $
                        {tickerDetail.open_price.toFixed(2)}
                      </div>
                    )}
                    {tickerDetail.high_price && (
                      <div>
                        <span className="font-semibold">고가:</span> $
                        {tickerDetail.high_price.toFixed(2)}
                      </div>
                    )}
                    {tickerDetail.low_price && (
                      <div>
                        <span className="font-semibold">저가:</span> $
                        {tickerDetail.low_price.toFixed(2)}
                      </div>
                    )}
                    {tickerDetail.close_price && (
                      <div>
                        <span className="font-semibold">종가:</span> $
                        {tickerDetail.close_price.toFixed(2)}
                      </div>
                    )}
                    {tickerDetail.volume && (
                      <div>
                        <span className="font-semibold">거래량:</span>{" "}
                        {tickerDetail.volume.toLocaleString()}
                      </div>
                    )}
                  </div>
                </>
              ))}

              {/* 날짜 선택 */}
              <div className="mt-4">
                <label className="block mb-2">특정 날짜 데이터 조회:</label>
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div>티커 정보를 찾을 수 없습니다.</div>
          )}
        </div>
      )}

      {/* 특정 날짜 티커 데이터 */}
      {selectedSymbol && selectedDate && (
        <div>
          <h2 className="text-xl font-semibold mb-2">날짜별 티커 정보</h2>
          {isLoadingDateData ? (
            <div>날짜 데이터 로딩 중...</div>
          ) : dateTickerData ? (
            <div className="border p-4 rounded">
              <h3 className="font-bold">
                {dateTickerData.symbol} - {selectedDate}
              </h3>
              <p className="font-semibold mt-2">
                가격: ${dateTickerData.price.toFixed(2)}
              </p>
              {/* 추가 데이터 표시 */}
            </div>
          ) : (
            <div>해당 날짜의 티커 정보를 찾을 수 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
