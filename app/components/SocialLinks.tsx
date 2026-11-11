import Image from "next/image";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/fitcheck.startup/", icon: "instagram", size: 27 },
  { label: "Threads", href: "https://www.threads.com/@fitcheck.startup", icon: "threads", size: 27 },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61596346923689", icon: "facebook", size: 32 },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/145435214/", icon: "linkedin", size: 27 },
] as const;

export function SocialLinks() {
  return (
    <nav aria-label="FitCheck social media" className="flex flex-wrap gap-4">
      {socials.map(({ label, href, icon, size }) => (
        <a key={label} aria-label={label} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 min-w-12 items-center justify-center p-2.5 text-white transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          <Image src={`/social-icons/${icon}.svg`} width={size} height={size} alt="" />
        </a>
      ))}
    </nav>
  );
}
