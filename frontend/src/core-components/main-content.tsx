import type React from "react";

type MainContentProps = React.ComponentProps<"main">;

export default function MainContent({
  children,
  className,
  ...props
}: MainContentProps) {
  return (
    <main className={className} {...props}>
      {children}
    </main>
  );
}
