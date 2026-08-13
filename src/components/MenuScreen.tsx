import MenuGrid from "./MenuGrid";
import ScreenHeader from "./ScreenHeader";
import type { Item, Screen } from "../app/drinksData";

// Shared by both routes: the mobile page stacks several of these and lets the page scroll;
// the TV route renders one at a time inside ScreenCarousel with fitToViewport enabled.
export default function MenuScreen({
    screen,
    items,
    fitToViewport = false,
}: {
    screen: Screen;
    items: Item[];
    fitToViewport?: boolean;
}) {
    return (
        <section className="menu-screen">
            <ScreenHeader title={screen.title} subtitle={screen.subtitle} />
            <MenuGrid items={items} fitToViewport={fitToViewport} />
        </section>
    );
}
