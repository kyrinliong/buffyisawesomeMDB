import { useRef, useState, useEffect } from 'react';

export default function ScrollableRow({ children, title, subtitle, seeAllLink, className = '' }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [children]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.6;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className={`py-6 ${className}`}>
      <div className="px-4 md:px-8 mb-4 flex items-end justify-between">
        <div>
          {title && <h2 className="section-heading">{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="btn-icon hidden md:flex"
              aria-label="Scroll left"
            >
              ‹
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="btn-icon hidden md:flex"
              aria-label="Scroll right"
            >
              ›
            </button>
          )}
          {seeAllLink && (
            <a href={seeAllLink} className="btn-ghost text-sm">
              See all ›
            </a>
          )}
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 px-4 md:px-8 overflow-x-auto scroll-smooth scrollbar-none pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {children}
      </div>
    </section>
  );
}
