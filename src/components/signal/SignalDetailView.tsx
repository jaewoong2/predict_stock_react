import { SignalData } from "../../types/signal";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { format } from "date-fns";
import { useMarketNewsSummary } from "@/hooks/useMarketNews";
import { MarketNewsCarousel } from "../news/MarketNewsCarousel";

interface SignalDetailViewProps {
  data: SignalData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date?: string;
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

export const SignalDetailView: React.FC<SignalDetailViewProps> = ({
  data,
  open,
  onOpenChange,
  date,
}) => {
  const { data: marketNews } = useMarketNewsSummary({
    news_type: "ticker",
    ticker: data?.signal.ticker,
    news_date: date,
  });

  console.log("hello world");

  if (!data) {
    return null;
  }

  console.log(marketNews);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="w-full max-w-4xl mx-auto pb-10 !select-text max-h-[80vh] max-sm:w-[calc(100%-14px)]"
        data-vaul-drawer-direction={"center"}
      >
        <div className="mx-auto w-full max-w-4xl h-full overflow-y-scroll px-6 max-sm:px-1">
          <DrawerHeader>
            <DrawerClose asChild>
              <button className="text-3xl text-white absolute -right-0 -top-10 cursor-pointer">
                &times;
              </button>
            </DrawerClose>
            {marketNews?.result && (
              <div className="px-6">
                <MarketNewsCarousel items={marketNews?.result} />
              </div>
            )}
            <div className="flex justify-between items-center">
              <div>
                <DrawerTitle className="text-2xl p-0 m-0 text-left">
                  {data.signal.ticker}
                </DrawerTitle>
                <span className="text-muted-foreground text-sm font-light">
                  {data.signal.timestamp &&
                    format(data.signal.timestamp, "yyyy년 MM월 dd일")}
                </span>
              </div>
              {data.signal.action && (
                <Badge
                  variant={
                    data.signal.action.toLowerCase() === "buy"
                      ? "default"
                      : data.signal.action.toLowerCase() === "sell"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-sm px-3 py-1"
                >
                  {data.signal.action.toUpperCase()}
                </Badge>
              )}
            </div>
          </DrawerHeader>

          <div className="px-4 space-y-6">
            {/* 시그널 정보 */}
            <section>
              <h3 className="text-lg font-semibold mb-2 border-b pb-1">
                예측 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>전략:</strong> {data.signal.strategy ?? "N/A"}
                </div>
                <div>
                  <strong>AI 모델:</strong> {data.signal.ai_model ?? "N/A"}
                </div>
                <div>
                  <strong>확률:</strong>{" "}
                  {data.signal.probability ? (
                    <Badge
                      variant={
                        data.signal.probability.toLowerCase() === "high"
                          ? "default"
                          : data.signal.probability.toLowerCase() === "medium"
                          ? "secondary"
                          : data.signal.probability.toLowerCase() === "low"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {data.signal.probability}
                    </Badge>
                  ) : (
                    "N/A"
                  )}
                </div>
                <div>
                  <strong>진입 가격:</strong>{" "}
                  {formatCurrency(data.signal.entry_price)}
                </div>
                <div>
                  <strong>손절 가격:</strong>{" "}
                  {formatCurrency(data.signal.stop_loss)}
                </div>
                <div>
                  <strong>익절 가격:</strong>{" "}
                  {formatCurrency(data.signal.take_profit)}
                </div>
                {data.signal.senario && (
                  <div className="md:col-span-2">
                    <strong>시나리오:</strong> {data.signal.senario}
                  </div>
                )}
                {data.signal.good_things && (
                  <div className="md:col-span-2">
                    <strong>긍정적 요인:</strong> {data.signal.good_things}
                  </div>
                )}
                {data.signal.bad_things && (
                  <div className="md:col-span-2">
                    <strong>부정적 요인:</strong> {data.signal.bad_things}
                  </div>
                )}
              </div>
              {data.signal.report_summary && (
                <div className="mt-2">
                  <strong>리포트 요약:</strong>{" "}
                  <p className="text-sm text-muted-foreground">
                    {data.signal.report_summary}
                  </p>
                </div>
              )}
              {data.signal.result_description && (
                <div className="mt-2">
                  <strong>결과 설명:</strong>{" "}
                  <p className="text-sm text-muted-foreground">
                    {data.signal.result_description}
                  </p>
                </div>
              )}
            </section>

            {/* 티커 정보 */}
            {data.ticker?.name && (
              <section>
                <div className="flex flex-col border-b pb-1 mb-2">
                  <h3 className="text-lg font-semibold">
                    {data.ticker.name ?? "N/A"}
                  </h3>
                  <span className="text-sm text-muted-foreground font-light">
                    Close Price [{formatDate(data.ticker.ticker_date)}]
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>항목</TableHead>
                        <TableHead>가격</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>현재가</TableCell>
                        <TableCell>
                          {formatCurrency(data.ticker.price)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>시가</TableCell>
                        <TableCell>
                          {formatCurrency(data.ticker.open_price)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>고가</TableCell>
                        <TableCell>
                          {formatCurrency(data.ticker.high_price)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>저가</TableCell>
                        <TableCell>
                          {formatCurrency(data.ticker.low_price)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>종가</TableCell>
                        <TableCell>
                          {formatCurrency(data.ticker.close_price)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>거래량</TableCell>
                        <TableCell>
                          {data.ticker.volume?.toLocaleString() ?? "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </section>
            )}

            {/* 결과 정보 */}
            {data.result && (
              <section>
                <h3 className="text-lg font-semibold mb-2 border-b pb-1">
                  실제 결과
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <Badge>{data.result.action.toUpperCase()}</Badge>
                  </div>
                  <div>
                    {data.result.is_correct ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        성공
                      </Badge>
                    ) : (
                      <Badge variant="destructive">실패</Badge>
                    )}
                  </div>
                  <div>
                    <strong>가격 변화:</strong>{" "}
                    {data.ticker?.close_price &&
                      data.ticker?.open_price &&
                      formatCurrency(
                        data.ticker.close_price - data.ticker.open_price
                      )}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
