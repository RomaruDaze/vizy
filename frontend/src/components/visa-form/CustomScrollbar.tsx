import React, { useState, useEffect, useRef } from "react";
import "./custom-scrollbar.styles.css";

interface CustomScrollbarProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  children,
  className = "",
  style = {},
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScrollInfo = () => {
      setScrollTop(container.scrollTop);
      setScrollHeight(container.scrollHeight);
      setClientHeight(container.clientHeight);
    };

    updateScrollInfo();
    container.addEventListener("scroll", updateScrollInfo);
    window.addEventListener("resize", updateScrollInfo);

    return () => {
      container.removeEventListener("scroll", updateScrollInfo);
      window.removeEventListener("resize", updateScrollInfo);
    };
  }, []);

  const handleScrollbarMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = scrollTop;
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const deltaY = e.clientY - startY.current;
    const scrollRatio = deltaY / (clientHeight - 50); // 50 is approximate scrollbar height
    const newScrollTop =
      startScrollTop.current + scrollRatio * (scrollHeight - clientHeight);

    containerRef.current.scrollTop = Math.max(
      0,
      Math.min(newScrollTop, scrollHeight - clientHeight)
    );
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [scrollTop, scrollHeight, clientHeight]);

  const scrollbarHeight = Math.max(
    50,
    (clientHeight / scrollHeight) * clientHeight
  );
  const scrollbarTop =
    scrollHeight > clientHeight
      ? (scrollTop / (scrollHeight - clientHeight)) *
        (clientHeight - scrollbarHeight)
      : 0;

  return (
    <div className={`custom-scrollbar-container ${className}`} style={style}>
      <div
        ref={containerRef}
        className="custom-scrollbar-content"
        style={{ height: "100%", overflow: "auto" }}
      >
        {children}
      </div>

      {scrollHeight > clientHeight && (
        <div className="custom-scrollbar-track">
          <div
            ref={scrollbarRef}
            className="custom-scrollbar-thumb"
            style={{
              height: `${scrollbarHeight}px`,
              top: `${scrollbarTop}px`,
            }}
            onMouseDown={handleScrollbarMouseDown}
          />
        </div>
      )}
    </div>
  );
};

export default CustomScrollbar;
