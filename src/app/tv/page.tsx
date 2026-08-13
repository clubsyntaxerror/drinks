import { Suspense } from "react";
import { getMenuData } from "../drinksData";
import ScreenCarousel from "../../components/ScreenCarousel";
import Background from "../../components/Background";

// TV/kiosk route: 100dvh, no scrolling, one screen visible at a time, auto-cycling. Debug with
// ?screen=<index> or ?paused=1 (see ScreenCarousel). Suspense is required here because
// ScreenCarousel reads useSearchParams(), which Next.js requires to be wrapped.
export default async function TvPage() {
    const { items, messages, screens } = await getMenuData();

    return (
        <>
            <Background image="/assets/background.jpg" />
            <Suspense fallback={null}>
                <ScreenCarousel screens={screens} items={items} messages={messages} />
            </Suspense>
        </>
    );
}
