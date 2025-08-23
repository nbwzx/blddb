import React from "react";

const PageSection = ({
  children,
  title,
  widthClass = "lg:w-10/12",
}: {
  children: React.ReactNode;
  title: string;
  widthClass?: string;
}) => (
  <section className="pt-[100px] pb-[120px]">
    <div className="container">
      <div className="-mx-4 flex flex-wrap justify-center">
        <div className={`w-full px-4 ${widthClass}`}>
          <h2 className="mb-8 text-center text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight dark:text-white">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  </section>
);

export default PageSection;
