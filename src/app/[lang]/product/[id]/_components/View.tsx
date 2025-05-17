import Alert from "@/components/Alert";
import { Button } from "@/components/Button";
import Loading from "@/components/Loading";
import { formatDateForDisplay } from "@/lib/date";
import { useTranslation as t } from "@/lib/translations";
import type { Lang, LotteryEntry, LotteryEvent, Product } from "@/types";

export const View = ({
  product,
  lang,
  lotteryEvents,
  lotteryEntries,
  isLogin,
  loadingEventId,
  successEventId,
  error,
  handleLotteryEntry,
}: {
  product: Product | null;
  lang: Lang;
  lotteryEvents: LotteryEvent[];
  lotteryEntries: LotteryEntry[];
  isLogin: boolean;
  loadingEventId: number | null;
  successEventId: number | null;
  error: string | null;
  handleLotteryEntry: (eventId: number) => Promise<void>;
}) => {
  if (!product) return <Alert text={t(lang).product.no_products} type="error" />;

  const hasEnteredLottery = (eventId: number) => {
    return lotteryEntries?.some((entry) => entry.lottery_event_id === eventId);
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <figure className="overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover aspect-square transform hover:scale-105 transition-transform duration-500"
            loading="eager"
          />
        </figure>

        <div className="flex flex-col space-y-8">
          <header className="flex flex-col space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">{product.name}</h1>
          </header>

          {error && <Alert text={error} type="error" />}

          {lotteryEvents && lotteryEvents.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">参加可能な抽選イベント</h2>

              <div className="space-y-4">
                {lotteryEvents.map((event) => {
                  const alreadyEntered = hasEnteredLottery(event.id);

                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                    >
                      <div className="flex flex-col space-y-3">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-xl font-medium text-gray-800 break-words">{event.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600 font-medium">
                              {formatDateForDisplay(event.start_at)}
                            </span>
                            <span className="inline-block px-2 py-1 text-sm text-gray-500 font-medium">~</span>
                            <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600 font-medium">
                              {formatDateForDisplay(event.end_at)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end space-x-2 text-gray-500">
                          <span>価格: </span>
                          <span className="font-semibold text-gray-800">{product.price.toLocaleString()} 円</span>
                        </div>

                        <div className="pt-3">
                          {successEventId === event.id ? (
                            <div className="flex items-center justify-center py-2 px-4 bg-green-50 text-green-700 rounded-lg">
                              抽選に参加しました
                            </div>
                          ) : alreadyEntered ? (
                            <div className="flex items-center justify-center py-2 px-4 bg-blue-50 text-blue-700 rounded-lg">
                              抽選参加済み
                            </div>
                          ) : loadingEventId === event.id ? (
                            <Loading />
                          ) : !isLogin ? (
                            <div className="flex items-center justify-center py-2 px-4 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                              抽選に参加するにはログインしてください
                            </div>
                          ) : (
                            <Button
                              type="button"
                              label="抽選に参加する"
                              onClick={() => handleLotteryEntry(event.id)}
                              width="w-full"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default View;
