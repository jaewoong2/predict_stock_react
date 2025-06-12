import { SignalData } from "../../types/signal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SignalDetailViewProps {
  data: SignalData | null;
}

const formatDate = (
  dateString: string | null | undefined,
  includeTime = false
) => {
  if (!dateString) return "N/A";
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    if (includeTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
      options.second = "2-digit";
    }
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  } catch (error) {
    console.error("Invalid date format:", dateString, error);
    return dateString;
  }
};

const formatCurrency = (amount: number | undefined | null) => {
  // null 처리 추가
  if (amount == null) return "N/A"; // undefined와 null 모두 체크
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // 필요시 변경
  }).format(amount);
};

export const SignalDetailView: React.FC<SignalDetailViewProps> = ({ data }) => {
  if (!data) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>시그널 상세 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <p>테이블에서 시그널을 선택하여 상세 정보를 확인하세요.</p>
        </CardContent>
      </Card>
    );
  }

  const { signal, ticker, result } = data;

  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">
              시그널 상세: {signal.ticker} ({signal.strategy ?? "N/A"})
            </CardTitle>
            <CardDescription>
              발생 시간: {formatDate(signal.timestamp, true)}
            </CardDescription>
          </div>
          {signal.action && (
            <Badge
              variant={
                signal.action.toLowerCase() === "buy"
                  ? "default"
                  : signal.action.toLowerCase() === "sell"
                  ? "destructive"
                  : "secondary"
              }
              className="text-sm px-3 py-1"
            >
              {signal.action.toUpperCase()}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 시그널 정보 */}
        <section>
          <h3 className="text-lg font-semibold mb-2 border-b pb-1">
            시그널 정보
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>전략:</strong> {signal.strategy ?? "N/A"}
            </div>
            <div>
              <strong>AI 모델:</strong> {signal.ai_model ?? "N/A"}
            </div>
            <div>
              <strong>확률:</strong>{" "}
              {signal.probability ? (
                <Badge
                  variant={
                    signal.probability.toLowerCase() === "high"
                      ? "default"
                      : signal.probability.toLowerCase() === "medium"
                      ? "secondary"
                      : signal.probability.toLowerCase() === "low"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {signal.probability}
                </Badge>
              ) : (
                "N/A"
              )}
            </div>
            <div>
              <strong>진입 가격:</strong> {formatCurrency(signal.entry_price)}
            </div>
            <div>
              <strong>손절 가격:</strong> {formatCurrency(signal.stop_loss)}
            </div>
            <div>
              <strong>익절 가격:</strong> {formatCurrency(signal.take_profit)}
            </div>
            {signal.senario && (
              <div>
                <strong>시나리오:</strong> {signal.senario}
              </div>
            )}
            {signal.good_things && (
              <div>
                <strong>긍정적 요인:</strong> {signal.good_things}
              </div>
            )}
            {signal.bad_things && (
              <div>
                <strong>부정적 요인:</strong> {signal.bad_things}
              </div>
            )}
          </div>
          {signal.report_summary && (
            <div className="mt-2">
              <strong>리포트 요약:</strong>{" "}
              <p className="text-sm text-muted-foreground">
                {signal.report_summary}
              </p>
            </div>
          )}
          {signal.result_description && (
            <div className="mt-2">
              <strong>결과 설명:</strong>{" "}
              <p className="text-sm text-muted-foreground">
                {signal.result_description}
              </p>
            </div>
          )}
        </section>

        {/* 티커 정보 */}
        {ticker && (
          <section>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              티커 정보 ({ticker.name ?? "N/A"}) -{" "}
              {formatDate(ticker.ticker_date)}
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>항목</TableHead>
                  <TableHead>가격</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>현재가 (시그널 시점)</TableCell>
                  <TableCell>{formatCurrency(ticker.price)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>시가</TableCell>
                  <TableCell>{formatCurrency(ticker.open_price)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>고가</TableCell>
                  <TableCell>{formatCurrency(ticker.high_price)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>저가</TableCell>
                  <TableCell>{formatCurrency(ticker.low_price)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>종가</TableCell>
                  <TableCell>{formatCurrency(ticker.close_price)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>거래량</TableCell>
                  <TableCell>
                    {ticker.volume?.toLocaleString() ?? "N/A"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground mt-1">
              티커 데이터 생성: {formatDate(ticker.created_at, true)}
            </p>
          </section>
        )}
        {!ticker && (
          <section>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              티커 정보
            </h3>
            <p className="text-muted-foreground">
              연결된 티커 정보가 없습니다.
            </p>
          </section>
        )}

        {/* 결과 정보 */}
        {result && (
          <section>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              실제 결과
            </h3>
            <div className="flex items-center space-x-4">
              <div>
                <Badge>{result.action.toUpperCase()}</Badge>
              </div>
              <div>
                {result.is_correct ? (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">
                    성공
                  </Badge>
                ) : (
                  <Badge variant="destructive">실패</Badge>
                )}
              </div>
              <div>
                <strong>가격 변화:</strong>{" "}
                {ticker?.close_price &&
                  ticker?.open_price &&
                  formatCurrency(ticker.close_price - ticker.open_price)}
              </div>
            </div>
          </section>
        )}
        {!result && (
          <section>
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              시그널 결과
            </h3>
            <p className="text-muted-foreground">
              시그널 결과 정보가 없습니다.
            </p>
          </section>
        )}
      </CardContent>
    </Card>
  );
};
