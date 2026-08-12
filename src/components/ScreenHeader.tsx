export default function ScreenHeader({
    eyebrow = "Syntax Error",
    title,
    subtitle,
    price,
}: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    price?: string;
}) {
    return (
        <header className="screen-header">
            <p className="screen-eyebrow">{eyebrow}</p>
            <h2 className="screen-title">{title}</h2>
            {subtitle && (
                <p className="screen-subtitle">
                    <span aria-hidden="true">◆</span> {subtitle} <span aria-hidden="true">◆</span>
                </p>
            )}
            {price && <p className="screen-price">{price} each</p>}
        </header>
    );
}
