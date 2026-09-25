import { ImageReveal } from "@/components/animations/image-reveal";
import { cn } from "@/lib/utils";

type TeamMemberCardProps = {
  name: string;
  role: string;
  image: string;
  alt: string;
  className?: string;
  imageClassName?: string;
};

export function TeamMemberCard({
  name,
  role,
  image,
  alt,
  className,
  imageClassName,
}: TeamMemberCardProps) {
  return (
    <article className={cn("group flex flex-col gap-5", className)}>
      <div className="relative overflow-hidden rounded-badge transition-all duration-500 group-hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)]">
        <ImageReveal
          src={image}
          alt={alt}
          sizes="(min-width: 64rem) 22.5rem, 50vw"
          className={cn("w-full transition-transform duration-700 ease-out group-hover:scale-105", imageClassName)}
          imageClassName="transition-all duration-500 group-hover:brightness-110 group-hover:contrast-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-10" />
      </div>
      <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-start max-md:gap-1">
        <h3 className="text-h3 tracking-[-0.05rem] text-white transition-colors duration-300 group-hover:text-accent max-md:text-h4">{name}</h3>
        <p className="text-body shrink-0 opacity-82 max-md:text-body-sm">{role}</p>
      </div>
    </article>
  );
}
