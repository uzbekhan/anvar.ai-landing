import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  id?: string;
  className?: string;
}

const SectionWrapper = ({ children, id, className = "" }: Props) => {
  return (
    <section id={id} className={`py-10 md:py-14 ${className}`}>
      <div className="container mx-auto px-6">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
