export default function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <header className="screen-header">
            <h2 className="screen-title">{title}</h2>
            {subtitle && (
                <p className="screen-subtitle">
                    <span className="screen-subtitle-diamond" aria-hidden="true">
                        ◆
                    </span>{" "}
                    {subtitle}{" "}
                    <span className="screen-subtitle-diamond" aria-hidden="true">
                        ◆
                    </span>
                </p>
            )}
        </header>
    );
}
