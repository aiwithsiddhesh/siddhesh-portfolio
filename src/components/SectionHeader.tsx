interface Props {
  tag: string;
  title: string;
  dark?: boolean;
}

export default function SectionHeader({ tag, title, dark }: Props) {
  return (
    <div className="mb-14">
      <span
        className="inline-block text-xs font-bold uppercase tracking-[3px] px-3 py-1 rounded mb-3"
        style={{
          background: dark ? "var(--lime)" : "var(--navy)",
          color: dark ? "var(--navy)" : "var(--lime)",
        }}
      >
        {tag}
      </span>
      <h2
        className="text-4xl md:text-5xl font-black uppercase leading-none"
        style={{ color: dark ? "#fff" : "var(--navy)" }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </div>
  );
}
