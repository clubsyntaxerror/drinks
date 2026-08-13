import ScreenHeader from "./ScreenHeader";
import Background from "./Background";
import { getTemplate } from "./templates";
import type { Item, Screen } from "../app/drinksData";

// Shared by both routes: the mobile page stacks several of these and lets the page scroll;
// the TV route renders one at a time inside ScreenCarousel with fitToViewport enabled. Which
// grid/card layout renders is resolved from the screen's own `template` field, not hardcoded —
// see components/templates.ts.
export default function MenuScreen({
    screen,
    items,
    fitToViewport = false,
}: {
    screen: Screen;
    items: Item[];
    fitToViewport?: boolean;
}) {
    const template = getTemplate(screen.template);

    return (
        <section className="menu-screen">
            {/* Only rendered on the mobile route (fitToViewport is TV-only): every screen there
                stacks on one continuously scrolling page, so each section carries its own
                scoped background instead of relying on a single page-level layer. The TV route
                renders its background itself (ScreenCarousel) so it's full-bleed against the
                viewport, not inset by this section's own padding. */}
            {!fitToViewport && <Background image={template.backgroundImage} theme={template.backgroundTheme} scoped />}
            <ScreenHeader title={screen.title} subtitle={screen.subtitle} />
            <template.Grid items={items} fitToViewport={fitToViewport} />
        </section>
    );
}
