import { Suspense } from "react";
import { getMenuData } from "../drinksData";
import ScreenCarousel from "../../components/ScreenCarousel";

// TV/kiosk route: 100dvh, no scrolling, one screen visible at a time, auto-cycling. Debug with
// ?screen=<index> or ?paused=1 (see ScreenCarousel). Suspense is required here because
// ScreenCarousel reads useSearchParams(), which Next.js requires to be wrapped. Background
// renders inside ScreenCarousel itself now (it needs to follow the active screen's template).
export default async function TvPage() {
    const { items, messages, screens, categoryPricing, priceList } = await getMenuData();

    return (
        <Suspense fallback={null}>
            <ScreenCarousel
                screens={screens}
                items={items}
                messages={messages}
                categoryPricing={categoryPricing}
                priceList={priceList}
            />
        </Suspense>
    );
}
