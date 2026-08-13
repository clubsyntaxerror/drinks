import { getMenuData } from "./drinksData";
import MenuScreen from "../components/MenuScreen";
import Scrollbox from "../components/Scrollbox";
import Background from "../components/Background";

// Mobile/generic route: every screen stacked in order, page scrolls normally. See /tv for the
// no-scroll, auto-cycling kiosk version — both share MenuScreen/MenuGrid/PotionCard.
export default async function HomePage() {
    const { items, messages, screens } = await getMenuData();

    return (
        <>
            <Background />
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
                <Scrollbox messages={messages.map((message) => message.text)} />
            </main>
        </>
    );
}
