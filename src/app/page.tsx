import { getMenuData } from "./drinksData";
import MenuScreen from "../components/MenuScreen";
import Scrollbox from "../components/Scrollbox";

// Mobile/generic route: every screen stacked in order, page scrolls normally. See /tv for the
// no-scroll, auto-cycling kiosk version — both share MenuScreen, but each picks its own
// grid/card/background via its `template` field (see components/templates.ts), so each screen
// section carries its own background rather than sharing one page-level layer.
export default async function HomePage() {
    const { items, messages, screens } = await getMenuData();

    return (
        <main className="mobile-menu">
            <div className="mobile-hero">
                <h1 className="mobile-title">Menu</h1>
            </div>
            {screens.map((screen) => (
                <MenuScreen
                    key={screen.key}
                    screen={screen}
                    items={items.filter((item) => item.category.toLowerCase() === screen.key.toLowerCase())}
                />
            ))}
            <Scrollbox messages={messages} />
        </main>
    );
}
